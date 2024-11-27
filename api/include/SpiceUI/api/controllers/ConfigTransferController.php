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
use SpiceCRM\includes\RESTManager;
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

        if ($postBody['contentAsJson']) {
            return $res->withJson($content);
        } else {
            $gzippedContent = gzencode(json_encode($content));
            //file_put_contents('testestest.gz', $gzippedContent);
            $res->getBody()->write($gzippedContent);

            return $res->withHeader('Content-type', 'application/gzip')
                ->withHeader('Content-Disposition', 'attachment; filename=' . 'spicecrm-cfg-' . date('Ymd-Hi') . '.gz');
        }
    }


    /**
     * @throws DatabaseException
     * @throws BadRequestException
     * @throws Exception
     * @throws ForbiddenException
     * @throws \Exception
     */
    public function generateSystemPackage(Request $req, Response $res, array $args): Response
    {

        $responseTables = $this->getSelectableTablenames($req, $res, $args);
        $responseTablesBody = (string)$responseTables->getBody();
        $tables = json_decode($responseTablesBody, true)['selectableTables'];

        $body = [
            'contentAsJson' => true,
            'packages' => 'system',
            'additionalTables' => 'spiceaclstandardactions',
            'selectedTables' => array_filter($tables, fn($t) => !str_contains($t, 'custom'))
        ];

        $req = $req->withParsedBody($body);

        # Remove previous response data
        $responseTables->getBody()->rewind();

        $responsePackageContent = $this->exportFromTables($req, $res, $args);
        $responsePackageContentBody = (string)$responsePackageContent->getBody();
        $packageContent = json_decode($responsePackageContentBody, true);

        # extract the template names
        $db = DBManagerFactory::getInstance();
        $domainTemplateIds = [];
        $domainTemplateIdsQuery = "SELECT DISTINCT sysdictionary_ref_id FROM sysdictionaryitems WHERE sysdictionary_ref_id IS NOT NULL AND sysdictionary_ref_id !=''";
        $domainTemplateId = $db->query($domainTemplateIdsQuery);

        $errors = [];

        while ($row = $db->fetchRow($domainTemplateId)) {
            $domainTemplateIds[] = $row['sysdictionary_ref_id'];
        }

        foreach ($packageContent['data']['rows']['sysdictionaryindexes'] as $item) {
            $result = $this->validateIndexesAndItems($item, $domainTemplateIds);

            if (!empty($result)) {
                $errors[] = $result;
            }
        }

        foreach ($packageContent['data']['rows']['sysdictionaryitems'] as $item) {
            $result = $this->validateDictionaryItems($item['id'], $domainTemplateIds);

            if (!empty($result)) {
                $errors[] = $result;
            }
        }

        foreach ($packageContent['data']['rows']['sysdictionaryrelationships'] as $item) {
            $result = $this->validateRelationshipDictionaryItems($item, $domainTemplateIds);

            if (!empty($result)) {
                $errors[] = $result;
            }
        }

        $gzippedContent = gzencode(json_encode($packageContent));
        $res = RESTManager::getInstance()->app->getResponseFactory()->createResponse();
        $res->getBody()->write($gzippedContent);

        if(count($errors)) {
            throw new Exception(implode("\n", $errors));
        }

        return $res->withHeader('Content-type', 'application/gzip')
            ->withHeader('Content-Disposition', 'attachment; filename=' . 'spicecrm-cfg-' . date('Ymd-Hi') . '.gz');
    }

    /**
     * validates the dictionary items and it's corresponding domain definitions
     * @param string $itemId
     * @param array $domainTemplatesIds
     * @param string $definition
     * @param string $definitionId
     * @return void|string
     * @throws Exception|\Exception
     */
    public function validateDictionaryItems(string $itemId, array $domainTemplatesIds, string $definition = "", string $definitionId = "")
    {
        $db = DBManagerFactory::getInstance();

        $dictionaryItemQuery = "SELECT * FROM sysdictionaryitems WHERE id = '$itemId'";
        $dictionaryItem = $db->fetchOne($dictionaryItemQuery);

        $dictionaryItemsErrors = [];

        # check if the item exist
        if (!$dictionaryItem) {
            $dictionaryItemsErrors[] = "No valid dictionary item found in the $definition definition id: '$definitionId', current dictionary item id: '$itemId'";
        }

        # check if the item belongs to the same package as the definition
        if ('system' !== $dictionaryItem['package']) {
            $dictionaryItemsErrors[] = "Dictionary item package ist not system for the $definition definition id: '$definitionId' and dictionary item id: '$itemId'";
        }

        # search the domain definition only for names that are not template names
        if (!empty($dictionaryItem['sysdomaindefinition_id'])) {

            $domainDefinition = $db->getOne("SELECT id FROM sysdomaindefinitions WHERE id = '{$dictionaryItem['sysdomaindefinition_id']}'");

            if (!$domainDefinition) {
                $dictionaryItemsErrors[] = "No valid domain for the dictionary item with id: '$itemId', current domain id: '{$dictionaryItem['sysdomaindefinition_id']}'";
            }

        } else if (empty($dictionaryItem['sysdictionary_ref_id'])) {
            $dictionaryItemsErrors[] = "Dictionary item misconfiguration empty sysdictionary_ref_id, sysdomaindefinition_id for item '$itemId'";

            # if the name is not a template name and no dictionary item is defined, throw error
        } else if (!in_array($dictionaryItem['sysdictionary_ref_id'], $domainTemplatesIds)) {
            $dictionaryItemsErrors[] = "Referenced dictionary template item does not exist in package system item id: '$itemId'";
        }

        if (!empty($dictionaryItemsErrors)) return implode($dictionaryItemsErrors);
    }

    /**
     * validates the indexes, and it's corresponding items. Also validates
     * the dictionary and domain definitions for the index items
     * @param array $index
     * @param array $domainTemplateIds
     * @return void|string
     * @throws Exception
     */
    public function validateIndexesAndItems(array $index, array $domainTemplateIds)
    {
        $db = DBManagerFactory::getInstance();

        $indexItems = $db->fetchAll("SELECT sysdictionaryitem_id, id, package FROM sysdictionaryindexitems WHERE sysdictionaryindex_id = '{$index['id']}'");

        $indexItemsErrors = [];

        if(!$indexItems) {
            $indexItemsErrors[] = "No index items defined for the index with id: '{$index['id']}'";
        }

        foreach ($indexItems as $indexItem) {
            if(!$indexItem['sysdictionaryitem_id']) {
                $indexItemsErrors[] = "No dictionary item defined for the index item with id: '{$indexItem['id']}'";
            }

            # check the package entries
            if ('system' !== $indexItem['package']) {
                $indexItemsErrors[] = "Index item package is not system. index id: '{$index['id']}' and index item id: '{$indexItem['id']}'";
            }

            $this->validateDictionaryItems($indexItem['sysdictionaryitem_id'], $domainTemplateIds, 'index', $index['id']);
        }

        if (!empty($indexItemsErrors)) return implode($indexItemsErrors);
    }

    /**
     * validates the relationships and its items
     * @param array $item
     * @param array $domainTemplateIds
     * @return void|string
     * @throws Exception
     */
    public function validateRelationshipDictionaryItems(array $item, array $domainTemplateIds)
    {
        $relationshipItemsErrors = [];

        # check if the dictionary items for the relationship are defined
        if (!$item['rhs_sysdictionaryitem_id'] || !$item['lhs_sysdictionaryitem_id']) {
            $missingSide = !$item['rhs_sysdictionaryitem_id'] ? 'rhs' : 'lhs';
            $relationshipItemsErrors[] = "No {$missingSide} dictionary item definition for the relationship with id: '{$item['id']}'";
        }

        if (!empty($item['lhs_sysdictionaryitem_id'])) {
            $this->validateDictionaryItems($item['lhs_sysdictionaryitem_id'], $domainTemplateIds, 'relationship', $item['id']);
        }

        if (!empty($item['rhs_sysdictionaryitem_id'])) {
            $this->validateDictionaryItems($item['rhs_sysdictionaryitem_id'], $domainTemplateIds, 'relationship', $item['id']);
        }

        if (!empty($item['join_lhs_sysdictionaryitem_id'])) {
            $this->validateDictionaryItems($item['join_lhs_sysdictionaryitem_id'], $domainTemplateIds, 'relationship', $item['id']);
        }

        if (!empty($item['join_rhs_sysdictionaryitem_id'])) {
            $this->validateDictionaryItems($item['join_rhs_sysdictionaryitem_id'], $domainTemplateIds, 'relationship', $item['id']);
        }

        if (!empty($relationshipItemsErrors)) return implode($relationshipItemsErrors);
    }

    /**
     * @throws BadRequestException
     * @throws Exception
     * @throws ForbiddenException
     * @throws \Exception
     */
    static function importToTables(Request $req, Response $res, $args): Response
    {
        set_time_limit(500);

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
