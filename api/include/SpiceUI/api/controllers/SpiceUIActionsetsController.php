<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHelper;
use stdClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class SpiceUIActionsetsController
{

    static function getActionSets()
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $actionsets = $db->query("SELECT sysuiactionsets.id acid, sysuiactionsetitems.*, sysuiactionsets.module, sysuiactionsets.name, sysuiactionsets.grouped  FROM sysuiactionsets LEFT JOIN sysuiactionsetitems ON sysuiactionsets.id = sysuiactionsetitems.actionset_id ORDER BY actionset_id, sequence");
        while ($actionset = $db->fetchByAssoc($actionsets)) {

            if (!isset($retArray[$actionset['acid']])) {
                $retArray[$actionset['acid']] = [
                    'id' => $actionset['acid'],
                    'name' => $actionset['name'],
                    'grouped' => $actionset['grouped'],
                    'module' => $actionset['module'],
                    'package' => $actionset['package'],
                    'version' => $actionset['version'],
                    'type' => 'global',
                    'actions' => []
                ];
            }

            if(isset($actionset['id'])){
                $retArray[$actionset['acid']]['actions'][] = [
                    'id' => $actionset['id'],
                    'action' => $actionset['action'],
                    'component' => $actionset['component'],
                    'package' => $actionset['package'],
                    'version' => $actionset['version'],
                    'sequence' => (int)$actionset['sequence'],
                    'singlebutton' => (int)$actionset['singlebutton'],
                    'actionconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($actionset['actionconfig'])), true) ?: new stdClass()
                ];
            }
        }

        $actionsets = $db->query("SELECT sysuicustomactionsets.id acid, sysuicustomactionsetitems.*, sysuicustomactionsets.module, sysuicustomactionsets.name, sysuicustomactionsets.grouped  FROM sysuicustomactionsets LEFT JOIN sysuicustomactionsetitems ON sysuicustomactionsets.id = sysuicustomactionsetitems.actionset_id ORDER BY actionset_id, sequence");
        while ($actionset = $db->fetchByAssoc($actionsets)) {

            if (!isset($retArray[$actionset['acid']])) {
                $retArray[$actionset['acid']] = [
                    'id' => $actionset['acid'],
                    'name' => $actionset['name'],
                    'grouped' => $actionset['grouped'],
                    'module' => $actionset['module'],
                    'package' => $actionset['package'],
                    'version' => $actionset['version'],
                    'type' => 'custom',
                    'actions' => []
                ];
            }

            if(isset($actionset['id'])) {
                $retArray[$actionset['acid']]['actions'][] = [
                    'id' => $actionset['id'],
                    'action' => $actionset['action'],
                    'component' => $actionset['component'],
                    'package' => $actionset['package'],
                    'version' => $actionset['version'],
                    'sequence' => (int)$actionset['sequence'],
                    'singlebutton' => (int)$actionset['singlebutton'],
                    'actionconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($actionset['actionconfig'])), true) ?: new stdClass()
                ];
            }
        }

        return $retArray;
    }

    /**
     * set actionset data
     * @throws ForbiddenException | Exception
     */
    function setActionSets(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();

        $data = $req->getParsedBody();

        // check if we are an admin user
        SpiceUIRESTHelper::checkAdmin();

        // insert actionsets
        foreach ($data['add'] as $actionsetId => $actionsetData) {

            self::insertActionset($actionsetId, $actionsetData);

            $actionsetItemTable = "sysui" . ($actionsetData['type'] == 'custom' ? 'custom' : '') . "actionsetitems";

            // insert the actionset items
            foreach ($actionsetData['actions'] as $actionsetItem) {

                self::insertActionsetItem($actionsetItem, $actionsetId, $actionsetData, $actionsetItemTable);
            }
        }

        // handle the update
        foreach ($data['update'] as $actionsetId => $actionsetData) {

            $tableName = 'sysui' . ($actionsetData['type'] == 'custom' ? 'custom' : '') . 'actionsets';

            // get the record and check for change
            $existingActionset = $db->fetchByAssoc($db->query("SELECT * FROM $tableName WHERE id='$actionsetId'"));

            // handle actionset
            if ($existingActionset && SystemDeploymentCR::hasChanged($existingActionset, $actionsetData, ['name', 'grouped', 'version', 'package'])) {

                $dbData = [
                    'name' => $actionsetData['name'],
                    'package' => $actionsetData['package'],
                    'version' => $_SESSION['confversion']
                ];

                $name = $actionsetData['module'] . "/" . $actionsetData['name'];

                SystemDeploymentCR::writeDBEntry($tableName, $actionsetId, $dbData, $name, SystemDeploymentCR::ACTION_UPDATE);


            } else if (!$existingActionset) {

                self::insertActionset($actionsetId, $actionsetData);

            }

            self::setActionSetItems($actionsetData);
        }

        return $res->withJson(true);
    }

    /**
     * set actionset items
     * @param array $actionsetData
     * @return void
     * @throws Exception
     */
    private static function setActionSetItems(array $actionsetData)
    {
        $db = DBManagerFactory::getInstance();

        $actionsetId = $actionsetData['id'];

        $name = $actionsetData['module'] . "/" . $actionsetData['name'] . '/';

        $actionsetItemTable = "sysui" . ($actionsetData['type'] == 'custom' ? 'custom' : '') . "actionsetitems";

        // get all actionset items
        $query = $db->query("SELECT * FROM $actionsetItemTable WHERE actionset_id = '$actionsetId'");

        while ($existingItem = $db->fetchByAssoc($query)) {

            $actionsetItem = null;

            // check if the existing item exists in the update array
            $existingItemInPostData = false;

            foreach ($actionsetData['actions'] as $index => $actionsetItem) {

                if ($actionsetItem['id'] == $existingItem['id']) {

                    $actionsetItem = $actionsetData['actions'][$index];
                    // remove the item from items array
                    unset($actionsetData['actions'][$index]);
                    $existingItemInPostData = true;
                    break;
                }
            }

            // prepare for check
            $existingItem['actionconfig'] = json_decode($existingItem['actionconfig']);

            // if we have the item and it has changed
            if ($existingItemInPostData && SystemDeploymentCR::hasChanged($existingItem, $actionsetItem, ['sequence', 'package', 'version', 'action', 'component', 'singlebutton', 'actionconfig'])) {

                $dbData = [
                    'action' => $actionsetItem['action'],
                    'component' => $actionsetItem['component'],
                    'singlebutton' => $actionsetItem['singlebutton'] ? '1' : '0',
                    'sequence' => $actionsetItem['sequence'],
                    'actionconfig' => json_encode($actionsetItem['actionconfig']),
                    'requiredmodelstate' => $actionsetItem['requiredmodelstate'],
                    'package' => $actionsetItem['package'],
                    'version' => $_SESSION['confversion'],
                ];

                $name = $name . $actionsetItem['action'];

                SystemDeploymentCR::writeDBEntry($actionsetItemTable, $actionsetItem['id'], $dbData, $name, SystemDeploymentCR::ACTION_UPDATE);

            } else if (!$existingItemInPostData) {

                $name = $name . $existingItem['action'];

                SystemDeploymentCR::deleteDBEntry($actionsetItemTable, $existingItem['id'], $name);
            }
        }

        // add new actions
        foreach ($actionsetData['actions'] as $actionsetItem) {

            self::insertActionsetItem($actionsetItem, $actionsetId, $actionsetData, $actionsetItemTable);
        }
    }

    /**
     * insert actionset item
     * @param array $actionsetItem
     * @param string $actionsetId
     * @param array $actionsetData
     * @param string $actionsetItemTable
     * @throws Exception
     */
    private static function insertActionsetItem(array $actionsetItem, string $actionsetId, array $actionsetData, string $actionsetItemTable)
    {
        $dbData = [
            'id' => $actionsetItem['id'],
            'actionset_id' => $actionsetId,
            'sequence' => $actionsetItem['sequence'],
            'action' => $actionsetItem['action'],
            'component' => $actionsetItem['component'],
            'actionconfig' => json_encode($actionsetItem['actionconfig']),
            'requiredmodelstate' => $actionsetItem['requiredmodelstate'],
            'singlebutton' => $actionsetItem['singlebutton'] ? '1' : '0',
            'package' => $actionsetItem['package'],
            'version' => $_SESSION['confversion']
        ];

        $name = $actionsetData['module'] . "/" . $actionsetData['name'] . '/' . $actionsetItem['action'];

        SystemDeploymentCR::writeDBEntry($actionsetItemTable, $actionsetItem['id'], $dbData, $name, SystemDeploymentCR::ACTION_INSERT);
    }

    /**
     * insert actionset
     * @param string $actionsetId
     * @param array $actionsetData
     * @return void
     * @throws Exception
     */
    private static function insertActionset(string $actionsetId, array $actionsetData)
    {
        $tableName = 'sysui' . ($actionsetData['type'] == 'custom' ? 'custom' : '') . 'actionsets';

        $dbData = [
            'id' => $actionsetId,
            'module' => $actionsetData['module'],
            'name' => $actionsetData['name'],
            'grouped' => $actionsetData['grouped'],
            'package' => $actionsetData['package'],
            'version' => $_SESSION['confversion'],
        ];

        $name = $actionsetData['module'] . "/" . $actionsetData['name'];

        SystemDeploymentCR::writeDBEntry($tableName, $actionsetId, $dbData, $name, SystemDeploymentCR::ACTION_INSERT);
    }
}
