<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use DirectoryIterator;
use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class ConfigTransferController
{

    #  installation-specific tables are blacklisted:
    static private $blacklistedTablesRegex = [
        'sysftslog', 'syslogs', 'sysapilog', 'syskrestlog', # log tables (syskrestlog is not longer used, but in case it still exists, the definition has to remain here to prevent transfer)
        'sysmodulelists', # personal/global lists defined by the users
        'systrashcan', # trash can
        'sysuiuserroles', # assignments of users to roles
        '.*?_audit', # audit tables
        'systemdeployment.*', # system deployment tables
        'systemdeploypack.*', # mhm
        'systags', # tags
        'sysnumberranges', # number ranges
        'syslogusers', # log configuration for specific users
        'sysuicustomcalendaritems',
        'sysapilogconfig'
    ];

    static private $dataFormat = 2;

    static private $allTablenamesOfDB = null;
    static private $blacklistedTables = [];
    static private $selectableTables = [];

    static private $backupFolder = 'backups/configtransfer/';
    static private $backupPrefix = 'configtransfer-backup-';
    static private $daysToKeepBackups = 7;

    /*
     * fetchAllTablenamesOfDB()
     * Fetch the (ordered) list of all table names of the database (when not fetched yet).
     */
    static function fetchAllTablenamesOfDB()
    {
        $db = DBManagerFactory::getInstance();
        if (self::$allTablenamesOfDB !== null) return;
        if ($db->dbType == 'oci8') {
            $result = $db->query('SELECT table_name FROM user_tables ORDER BY TABLE_NAME');
            while ($row = $db->fetchByAssoc($result)) self::$allTablenamesOfDB[] = strtolower($row['table_name']);
        } else {
            $result = $db->query(sprintf('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "%s" ORDER BY TABLE_NAME', SpiceConfig::getInstance()->config['dbconfig']['db_name']));
            while ($row = $db->fetchByAssoc($result)) self::$allTablenamesOfDB[] = $row['TABLE_NAME'];
        }
        foreach (self::$blacklistedTablesRegex as $k => $v) self::$blacklistedTablesRegex[$k] = '/^' . $v . '$/';
        foreach (self::$allTablenamesOfDB as $v) if (strpos($v, 'sys') === 0) {
            if (preg_filter(self::$blacklistedTablesRegex, '$0', $v)) self::$blacklistedTables[] = $v;
            else self::$selectableTables[] = $v;
        }
    }

    /*
     * getSelectableTablenames()
     */
    static function getSelectableTablenames( Request $req, Response $res, $args ): Response
    {
        self::fetchAllTablenamesOfDB();
        return $res->withJson( [ 'selectableTables' => self::$selectableTables, 'blacklistedTables' => self::$blacklistedTables ] );
    }

    /*
     * getRowsFromTable()
     * Get an array with all rows with all fields of a table.
     */
    static function getRowsFromTable( $tablename )
    {
        $db = DBManagerFactory::getInstance();
        $rows = [];
        $result = $db->query( sprintf( 'SELECT * FROM %s', $db->quote( $tablename )), false, '', true );
        while ( $row = $db->fetchByAssoc( $result ) ) $rows[] = $row;
        return $rows;
    }

    public function exportFromTables(Request $req, Response $res, array $args): Response {
        $postBody = $req->getParsedBody();

        if (!AuthenticationController::getInstance()->getCurrentUser()->is_admin) {
            throw new ForbiddenException('Forbidden to transfer configuration data for non-admins.');
        }

        # Parameter "selectedTables" should be an array of strings.
        if (is_array($selectedTables = $postBody['selectedTables'])) {
            foreach ($selectedTables as $k => $v) {
                $selectedTables[$k] = trim($v);
                if (strlen($v) == 0) {
                    unset($selectedTables[$k]);
                }
            }
        } else {
            $selectedTables = [];
        }

        # The admin not only selects tables (by checkboxes),
        # he can also add additional tables by typing in their table names.
        # Parameter "additionalTables" should be a comma-separated string, like "accounts, contacts".
        $additionalTables = trim($postBody['additionalTables']);
        if (isset( $additionalTables[0])) {
            $additionalTables = explode(',', $additionalTables);
            foreach ($additionalTables as $k => $v) {
                $additionalTables[$k] = trim($v);
                if (strlen($v) == 0) {
                    unset($additionalTables[$k]);
                }
            }
        } else {
            $additionalTables = [];
        }

        $allTablesToExport = array_merge($selectedTables, $additionalTables);
        $allTablesToExport = array_unique($allTablesToExport );

        self::fetchAllTablenamesOfDB();
        $unknownTables = [];
        foreach ($allTablesToExport as $tablename) {
            if (!in_array($tablename, self::$allTablenamesOfDB)) {
                $unknownTables[] = $tablename;
            }
        }
        if (count($unknownTables )) {
            throw (new BadRequestException('Unknown table(s) "' . implode('", "', $unknownTables) . '".' ))
                ->setErrorCode( 'unknownTables' );
        }

        $outputRows = [];
        foreach ($allTablesToExport as $tablename) {
            $outputRows[$tablename] = self::getRowsFromTable($tablename);
        }

        $content = [
            'format' => self::$dataFormat,
            'data'   => [
                'rows'   => $outputRows,
                'tables' => $allTablesToExport,
            ],
        ];
        $gzippedContent = gzencode(json_encode($content));
        //file_put_contents('testestest.gz', $gzippedContent);
        $res->getBody()->write($gzippedContent);

        return $res->withHeader( 'Content-type', 'application/gzip')
            ->withHeader( 'Content-Disposition', 'attachment; filename=' . 'spicecrm-cfg-' . date( 'Ymd-Hi' ) . '.gz');
    }

    static function writeBackupFile( $content ) {
        self::cleanOutOldBackupFiles();
        if ( !is_dir( self::$backupFolder )) mkdir( self::$backupFolder, 0700, true  );
        $i = 0;
        do {
            while ( true ) { # Try to build a file name that does not already exist.
                $filepath = self::$backupFolder . self::$backupPrefix . date( 'Ymd-His' ) . ( $i ? "-($i)" : '' ) . '.sql';
                if ( !file_exists( $filepath )) break;
                $i++;
            }
            $fh = fopen( $filepath, 'w' );
        } while ( !flock( $fh, LOCK_EX )); # If another process (running at the same time) built the same file name ... flock() helps.
        fwrite( $fh, $content );
        fclose( $fh );
    }

    static function cleanOutOldBackupFiles()
    {
        if ( !is_dir( self::$backupFolder )) return;
        $t = time() - self::$daysToKeepBackups * 24*60*60;
        foreach ( new DirectoryIterator( self::$backupFolder ) as $file ) {
            if ( $file->isFile() and $file->getMTime() < $t and preg_match('/^'.preg_quote( self::$backupPrefix ).'/', $file->getFilename() )) unlink( $file->getPathname() );
        }
    }

    static function importToTables( Request $req, Response $res, $args ): Response
    {
        $db = DBManagerFactory::getInstance();

        if ( !AuthenticationController::getInstance()->getCurrentUser()->is_admin ) throw new ForbiddenException('Forbidden to transfer configuration data for non-admins.');

        $params = $req->getParsedBody();

        if ( empty( $params['file'] ) ) throw new Exception( 'Expected a newfile' );

        $importfile = $params['file'];
        $filecontent = json_decode( gzdecode ( base64_decode( $importfile )));

        if ( $filecontent->format != self::$dataFormat ) throw ( new BadRequestException('Wrong file format.'))->setErrorCode('wrongFileFormat');

        self::fetchAllTablenamesOfDB();

        $unknownTables = [];
        $affectedTables = [];

        $backup = '';
        foreach ( $filecontent->data->tables as $tablename ) {
            if ( in_array( $tablename, self::$allTablenamesOfDB )) {
                foreach (self::getRowsFromTable($tablename) as $row) $backup .= self::buildLineSQL($tablename, $row) . ";\n";
                $affectedTables[$tablename] = true;
            }
            else $unknownTables[$tablename] = true;
        }

        self::writeBackupFile( $backup );

        $numberLinesInserted = 0;
        foreach ( $filecontent->data->rows as $tablename => $rows ) {
            if ( in_array( $tablename, self::$allTablenamesOfDB )) {
                // If there are already unknown tables a rollback will be performed later, so this makes no sense
                if ( !$unknownTables or ( isset( $params['ignoreUnknownTables'] ) and $params['ignoreUnknownTables'] === true )) {
                    $affectedTables[$tablename] = true;
                    $db->deleteAll($tablename);
                    foreach ( $rows as $k2 => $v2 ) {
                        $vals = (array)$v2;
                        $db->upsertQuery($tablename, ["id" => $vals["id"]], $vals);
                        $numberLinesInserted++;
                    }
                }
            } else $unknownTables[$tablename] = true;
        }
        if ( count( $unknownTables ) and ( !isset( $params['ignoreUnknownTables'] ) or $params['ignoreUnknownTables'] === false )) {
            throw ( new BadRequestException( 'Unknown table(s) "' . implode('", "', array_keys( $unknownTables )) . '".' ) )->setErrorCode( 'unknownTables' );
        }

        return $res->withJson([
            'numberLinesInserted' => $numberLinesInserted,
            'numberAffectedTables' => count( $affectedTables ),
            'backupLocation' => self::$backupFolder,
            'backupPeriod' => self::$daysToKeepBackups,
            'unknownTables' => array_keys( $unknownTables )
        ]);
    }

    /* deprecated
    static function buildLineReplace( $tablename, $record ) {
        return self::buildLineSQL( 'r', $tablename, $record );
    }

    static function buildLineInsert( $tablename, $record ) {
        return self::buildLineSQL( 'i', $tablename, $record );
    }
    */

    /**
     * builds a sql line for backup purposes
     * @param $tablename
     * @param $record
     * @return string
     */
    static function buildLineSQL($tablename, $record)
    {
        $db = DBManagerFactory::getInstance();
        $sql = sprintf('INSERT INTO %s (', $db->quote($tablename));
        $fieldnames = array_keys((array)$record);
        foreach ($fieldnames as $k => $v) $fieldnames[$k] = $db->quote($v);
        $sql .= implode(',', $fieldnames);
        $sql .= ') VALUES (';
        $fieldvalues = array_values((array)$record);
        $vals = [];
        foreach ($fieldvalues as $k => $v) {
            if ($v === null) $vals[] = 'null';
            else $vals[] = '"' . $db->quote($v) . '"';
        }
        $sql .= implode(',', $vals) . ')';
        return $sql;
    }

}
