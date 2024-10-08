<?php

namespace SpiceCRM\includes\SpiceUI;

use DirectoryIterator;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceUIConfHandler
{

    #  installation-specific tables are blacklisted:
    static public array $blacklistedTablesRegex = [
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
        'sysapilogconfig',
        'sysobjectemailtokens', # unique SpiceMailToken per user & module
        'sysuiassets', # CI config
        'sysauthconfig', # auth client config
        'sysnumberranges',
        'sysnumberrangeallocation',
        'syssalesdocnumberranges',
        'sysdatastreams',
        'sysgdprretentions',
        'sysmsgraphusersubscriptions',
        'sysmsgraphuserconfig',
        'sysexchangeusersubscriptions',
        'sysexchangeuserconfig',
        'sysgsuiteusersubscriptions',
        'sysgsuiteuserconfig'
    ];

    static public $dataFormat = 2;
    static public $allTablenamesOfDB = null;
    static public $blacklistedTables = [];
    static public $selectableTables = [];
    static public $backupFolder = 'backups/configtransfer/';
    static public $backupPrefix = 'configtransfer-backup-';
    static public $daysToKeepBackups = 7;

    /**
     * creates the sql backup file
     * @return void
     * @throws Exception
     * @throws \Exception
     */
    public static function createBackupFile(): void
    {
        $unknownTables = [];
        $affectedTables = [];
        $backup = '';

        $fileContent = (new SpiceUIConfHandler)->writeFileContent();

        foreach ($fileContent['data']['tables'] as $tablename) {
            if (is_array(self::$allTablenamesOfDB) && in_array($tablename, self::$allTablenamesOfDB)) {
                foreach (self::getRowsFromTable($tablename) as $row) $backup .= self::buildLineSQL($tablename, $row) . ";\n";
                $affectedTables[$tablename] = true;
            } else $unknownTables[$tablename] = true;
        }

        self::writeBackupFile($backup, true);
    }

    /**
     * @param $content
     * @param bool $schedulerJobTask
     * @return void
     * @throws Exception
     */
    static function writeBackupFile($content, bool $schedulerJobTask = false): void
    {

        self::deleteOldBackupFiles($schedulerJobTask);

        if (!is_dir(self::$backupFolder)) mkdir(self::$backupFolder, 0700, true);
        if (!is_writable(self::$backupFolder)) throw new Exception('Cannot write to Backup Folder.');
        $i = 0;
        do {
            while (true) { # Try to build a file name that does not already exist.
                $filepath = self::$backupFolder . self::$backupPrefix . date('Ymd-His') . ($i ? "-($i)" : '') . '.sql';
                if (!file_exists($filepath)) break;
                $i++;
                if ($i > 1000) throw new Exception('Unable to create proper Backup File Name.');
            }
            $fh = fopen($filepath, 'w');
        } while (!flock($fh, LOCK_EX)); # If another process (running at the same time) built the same file name ... flock() helps.
        fwrite($fh, $content);
        fclose($fh);
    }

    /**
     * writes file content with table names and its data
     * @return array
     * @throws DatabaseException
     * @throws \Exception
     */
    public function writeFileContent(): array
    {
        self::fetchAllTablenamesOfDB();

        $outputRows = [];
        $allTablesToExport = [];

        foreach (self::$selectableTables as $idx => $tablename) {
            $rows = self::getRowsFromTable($tablename);
            if (empty($rows)) {
                unset($allTablesToExport[$idx]);
            } else {
                $outputRows[$tablename] = self::getRowsFromTable($tablename);
            }
        }

        $fileData = [
            'data' => [
                'rows' => $outputRows,
                'tables' => self::$selectableTables,
            ],
        ];

        return $fileData;
    }

    /**
     * gets rows from table
     * @param $tablename
     * @param string|null $packages
     * @return array
     * @throws DatabaseException
     * @throws \Exception
     */
    static function getRowsFromTable($tablename, ?string $packages = null): array
    {
        $db = DBManagerFactory::getInstance();
        $rows = [];

        $where = empty($packages) ? '' : "where package in ('" . implode("','", explode(',', $packages)) . "')";

        $result = $db->query(sprintf("SELECT * FROM %s $where", $db->quote($tablename)), false, '', true);
        while ($row = $db->fetchByAssoc($result)) $rows[] = $row;
        return $rows;
    }

    /**
     * retrieves tables from db
     * all tables are retrieved, not only system tables
     * @return void
     * @throws \Exception
     */
    static function fetchAllTablenamesOfDB(): void
    {
        if (self::$allTablenamesOfDB !== null) return;
        self::$allTablenamesOfDB = DBManagerFactory::getInstance()->getTablesArray();
        sort(self::$allTablenamesOfDB);
        foreach (self::$blacklistedTablesRegex as $k => $v) self::$blacklistedTablesRegex[$k] = '/^' . $v . '$/';
        foreach (self::$allTablenamesOfDB as $v) if (strpos($v, 'sys') === 0) {
            if (preg_filter(self::$blacklistedTablesRegex, '$0', $v)) self::$blacklistedTables[] = $v;
            else self::$selectableTables[] = $v;
        }
    }

    /**
     * builds a sql line for backup purposes
     * @param $tablename
     * @param $record
     * @return string
     * @throws \Exception
     */
    static function buildLineSQL($tablename, $record): string
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

    /**
     * deletes old backup files
     * @param bool $schedulerJobTask : whether the backup file was automatically created by SchedulerJobTask
     * @return void
     */
    public static function deleteOldBackupFiles(bool $schedulerJobTask = false): void
    {
        if (!is_dir(self::$backupFolder)) return;

        if (!$schedulerJobTask) {
            $t = time() - self::$daysToKeepBackups * 24 * 60 * 60;
            foreach (new DirectoryIterator(self::$backupFolder) as $file) {
                if ($file->isFile() and $file->getMTime() < $t and preg_match('/^' . preg_quote(self::$backupPrefix) . '/', $file->getFilename())) unlink($file->getPathname());
            }
        } else {
            $numbBackupsToKeep = SpiceConfig::getInstance()->get('system.config_backups') ?: 20;
            $files = [];
            $dir = new DirectoryIterator(self::$backupFolder);
            foreach ($dir as $fileinfo) {
                if ($fileinfo->isFile()) {
                    $files[$fileinfo->getMTime()][] = ['fileName' => $fileinfo->getFilename(), 'pathName' => $fileinfo->getPathname()];
                }
            }

            krsort($files);

            $count = count($files);
            foreach ($files as $file) {
                $index++;

                // remove the oldest config file
                if ($count >= $numbBackupsToKeep && $index == $count && preg_match('/^' . preg_quote(self::$backupPrefix) . '/', $file[0]['fileName'])) {
                    unlink($file[0]['pathName']);
                }
            }
        }
    }
}