<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use DirectoryIterator;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use SpiceCRM\includes\SpiceUI\SpiceUIConfHandler;
use SpiceCRM\includes\TimeDate;

class ConfigTransferController
{

    /**
     * retrieves selectable table names
     * @throws \Exception
     */
    static function getSelectableTablenames(Request $req, Response $res, $args): Response
    {
        SpiceUIConfHandler::fetchAllTablenamesOfDB();
        $selectableTables = SpiceUIConfHandler::$selectableTables;
        $blacklistedTables = SpiceUIConfHandler::$blacklistedTables;
        return $res->withJson(['selectableTables' => $selectableTables, 'blacklistedTables' => $blacklistedTables]);
    }

    /**
     * create sql file from tables
     *
     * @throws BadRequestException
     * @throws DatabaseException
     * @throws ForbiddenException
     */
    public function exportFromTables(Request $req, Response $res, array $args): Response
    {
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
        if (isset($additionalTables[0])) {
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
        $allTablesToExport = array_unique($allTablesToExport);

        SpiceUIConfHandler::fetchAllTablenamesOfDB();
        $allTablenamesOfDB = SpiceUIConfHandler::$allTablenamesOfDB ?: [];

        $unknownTables = [];
        foreach ($allTablesToExport as $tablename) {
            if (!in_array($tablename, $allTablenamesOfDB)) {
                $unknownTables[] = $tablename;
            }
        }
        if (count($unknownTables)) {
            throw (new BadRequestException('Unknown table(s) "' . implode('", "', $unknownTables) . '".'))
                ->setErrorCode('unknownTables');
        }

        $outputRows = [];
        foreach ($allTablesToExport as $idx => $tablename) {
            $rows = SpiceUIConfHandler::getRowsFromTable($tablename, $postBody['packages']);
            if (empty($rows)) {
                unset($allTablesToExport[$idx]);
            } else {
                $outputRows[$tablename] = SpiceUIConfHandler::getRowsFromTable($tablename, $postBody['packages']);
            }
        }

        $content = [
            'format' => SpiceUIConfHandler::$dataFormat,
            'data' => [
                'rows' => $outputRows,
                'tables' => $allTablesToExport,
            ],
        ];
        $gzippedContent = gzencode(json_encode($content));
        //file_put_contents('testestest.gz', $gzippedContent);
        $res->getBody()->write($gzippedContent);

        return $res->withHeader('Content-type', 'application/gzip')
            ->withHeader('Content-Disposition', 'attachment; filename=' . 'spicecrm-cfg-' . date('Ymd-Hi') . '.gz');
    }

    /**
     * @throws BadRequestException
     * @throws Exception
     * @throws ForbiddenException
     * @throws \Exception
     */
    static function importToTables(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $nowDb = TimeDate::getInstance()->nowDb();

        if (!AuthenticationController::getInstance()->getCurrentUser()->is_admin) throw new ForbiddenException('Forbidden to transfer configuration data for non-admins.');

        $params = $req->getParsedBody();

        if (empty($params['file'])) throw new Exception('Expected a newfile');

        $importfile = $params['file'];
        $filecontent = json_decode(gzdecode(base64_decode($importfile)));

        if ($filecontent->format != SpiceUIConfHandler::$dataFormat) throw (new BadRequestException('Wrong file format.'))->setErrorCode('wrongFileFormat');

        SpiceUIConfHandler::fetchAllTablenamesOfDB();

        $unknownTables = [];
        $affectedTables = [];
        $allTablenamesOfDB = SpiceUIConfHandler::$allTablenamesOfDB;

        $backup = '';

        foreach ($filecontent->data->tables as $tablename) {
            if (in_array($tablename, $allTablenamesOfDB)) {
                foreach (SpiceUIConfHandler::getRowsFromTable($tablename) as $row) $backup .= SpiceUIConfHandler::buildLineSQL($tablename, $row) . ";\n";
                $affectedTables[$tablename] = true;
            } else $unknownTables[$tablename] = true;
        }

        SpiceUIConfHandler::writeBackupFile($backup);

        $numberLinesInserted = 0;
        foreach ($filecontent->data->rows as $tablename => $rows) {
            if (in_array($tablename, $allTablenamesOfDB)) {
                // If there are already unknown tables a rollback will be performed later, so this makes no sense
                if (!$unknownTables or (isset($params['ignoreUnknownTables']) and $params['ignoreUnknownTables'] === true)) {
                    $affectedTables[$tablename] = true;
                    $db->deleteAll($tablename);
                    foreach ($rows as $k2 => $v2) {
                        $vals = (array)$v2;
                        unset($vals['date_indexed']); // The new records are not yet fts indexed, so no time stamp should be entered.
                        if (empty($params['keepAssignedUser']) and array_key_exists('assigned_user_id', $vals)) $vals['assigned_user_id'] = $currentUser->id;
                        # If keepEnteredModifiedInfo is not explicitly set,
                        # set the timestamps date_entered and date_modified to now
                        # and set the user that entered and modified to the current user:
                        if (empty($params['keepEnteredModifiedInfo'])) {
                            if (array_key_exists('date_entered', $vals)) $vals['date_entered'] = $nowDb;
                            if (array_key_exists('date_modified', $vals)) $vals['date_modified'] = $nowDb;
                            if (array_key_exists('modified_user_id', $vals)) $vals['modified_user_id'] = $currentUser->id;
                            if (array_key_exists('created_by', $vals)) $vals['created_by'] = $currentUser->id;
                        }
                        $db->upsertQuery($tablename, ["id" => $vals["id"]], $vals);
                        $numberLinesInserted++;
                    }
                }
            } else $unknownTables[$tablename] = true;
        }
        if (count($unknownTables) and (!isset($params['ignoreUnknownTables']) or $params['ignoreUnknownTables'] === false)) {
            throw (new BadRequestException('Unknown table(s) "' . implode('", "', array_keys($unknownTables)) . '".'))->setErrorCode('unknownTables');
        }

        return $res->withJson([
            'numberLinesInserted' => $numberLinesInserted,
            'numberAffectedTables' => count($affectedTables),
            'backupLocation' => SpiceUIConfHandler::$backupFolder,
            'backupPeriod' => SpiceUIConfHandler::$daysToKeepBackups,
            'unknownTables' => array_keys($unknownTables)
        ]);
    }
}
