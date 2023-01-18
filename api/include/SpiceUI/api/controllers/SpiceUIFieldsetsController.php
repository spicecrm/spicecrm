<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHelper;
use stdClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceUIFieldsetsController
{

    static function getFieldSets()
    {
        // check if cached
        $cached = SpiceCache::get('spiceFieldSets');
        if($cached) return $cached;

        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $fieldsets = $db->query("SELECT sysuifieldsetsitems.*, sysuifieldsets.id fid, sysuifieldsets.module, sysuifieldsets.name, sysuifieldsets.package fieldsetpackage FROM sysuifieldsets LEFT JOIN sysuifieldsetsitems ON sysuifieldsetsitems.fieldset_id = sysuifieldsets.id ORDER BY fieldset_id, sequence");
        while ($fieldset = $db->fetchByAssoc($fieldsets)) {

            if (!isset($retArray[$fieldset['fid']])) {
                $retArray[$fieldset['fid']] = [
                    'fid' => $fieldset['fid'],
                    'name' => $fieldset['name'],
                    'package' => $fieldset['fieldsetpackage'],
                    'module' => $fieldset['module'] ?: '*',
                    'type' => 'global',
                    'items' => []
                ];
            }

            if (!empty($fieldset['field']))
                $retArray[$fieldset['fid']]['items'][] = [
                    'id' => $fieldset['id'],
                    'package' => $fieldset['package'],
                    'field' => $fieldset['field'],
                    'fieldconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($fieldset['fieldconfig'])), true) ?: new stdClass(),
                    'sequence' => $fieldset['sequence']
                ];
            elseif (!empty($fieldset['fieldset']))
                $retArray[$fieldset['fid']]['items'][] = [
                    'id' => $fieldset['id'],
                    'package' => $fieldset['package'],
                    'fieldset' => $fieldset['fieldset'],
                    'fieldconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($fieldset['fieldconfig'])), true) ?: new stdClass(),
                    'sequence' => $fieldset['sequence']
                ];
        }

        $fieldsets = $db->query("SELECT sysuicustomfieldsetsitems.*, sysuicustomfieldsets.id fid, sysuicustomfieldsets.module, sysuicustomfieldsets.name, sysuicustomfieldsets.package fieldsetpackage FROM sysuicustomfieldsets LEFT JOIN sysuicustomfieldsetsitems ON sysuicustomfieldsetsitems.fieldset_id = sysuicustomfieldsets.id ORDER BY fieldset_id, sequence");
        while ($fieldset = $db->fetchByAssoc($fieldsets)) {

            if (!isset($retArray[$fieldset['fid']])) {
                $retArray[$fieldset['fid']] = [
                    'name' => $fieldset['name'],
                    'package' => $fieldset['fieldsetpackage'],
                    'module' => $fieldset['module'] ?: '*',
                    'type' => 'custom',
                    'items' => []
                ];
            }

            if (!empty($fieldset['field']))
                $retArray[$fieldset['fid']]['items'][] = [
                    'id' => $fieldset['id'],
                    'package' => $fieldset['package'],
                    'field' => $fieldset['field'],
                    'fieldconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($fieldset['fieldconfig'])), true) ?: new stdClass(),
                    'sequence' => $fieldset['sequence']
                ];
            elseif (!empty($fieldset['fieldset']))
                $retArray[$fieldset['fid']]['items'][] = [
                    'id' => $fieldset['id'],
                    'package' => $fieldset['package'],
                    'fieldset' => $fieldset['fieldset'],
                    'fieldconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($fieldset['fieldconfig'])), true) ?: new stdClass(),
                    'sequence' => $fieldset['sequence']
                ];
        }

        // set the Cache
        SpiceCache::set('spiceFieldSets', $retArray);

        return $retArray;
    }

    /**
     * @throws ForbiddenException
     * @throws Exception
     */
    static function setFieldSets(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();

        $data = $req->getParsedBody();

        // check if we are an admin user
        SpiceUIRESTHelper::checkAdmin();

        // add items
        foreach ($data['add'] as $fieldsetId => $fieldsetData) {

            self::insertFieldset($fieldsetId, $fieldsetData);

            $fieldsetItemTable = "sysui" . ($fieldsetData['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems";

            foreach ($fieldsetData['items'] as $fieldsetItem) {

                self::insertFieldsetItem($fieldsetItem, $fieldsetId, $fieldsetData, $fieldsetItemTable);
            }
        }

        // handle the update
        foreach ($data['update'] as $fieldsetId => $fieldsetData) {

            $fieldsetTable = "sysui" . ($fieldsetData['type'] == 'custom' ? 'custom' : '') . "fieldsets";

            $existingFieldset = $db->fetchByAssoc($db->query("SELECT * FROM $fieldsetTable WHERE id='$fieldsetId'"));

            // handle fieldset
            if ($existingFieldset && SystemDeploymentCR::hasChanged($existingFieldset, $fieldsetData, ['name', 'version', 'package'])) {

                $dbData = [
                    'name' => $fieldsetData['name'],
                    'package' => $fieldsetData['package'],
                    'version' => $_SESSION['confversion']
                ];

                $name = $fieldsetData['module'] . "/" . $fieldsetData['name'];

                SystemDeploymentCR::writeDBEntry($fieldsetTable, $fieldsetId, $dbData, $name, SystemDeploymentCR::ACTION_UPDATE);

            } else if (!$existingFieldset) {

                self::insertFieldset($fieldsetId, $fieldsetData);
            }

            self::handleFieldsetItems($fieldsetId, $fieldsetData);
        }

        // clear the Cache
        SpiceCache::clear('spiceFieldSets');

        return $res->withJson(true);
    }

    /**
     * @throws Exception
     */
    private static function handleFieldsetItems($fieldsetId, $fieldsetData)
    {
        $db = DBManagerFactory::getInstance();

        $fieldsetItemTable = "sysui" . ($fieldsetData['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems";
        $name = $fieldsetData['module'] . "/" . $fieldsetData['name'] . '/';

        $query = $db->query("SELECT * FROM $fieldsetItemTable WHERE fieldset_id = '$fieldsetId'");

        // manage existing items
        while ($existingItem = $db->fetchByAssoc($query)) {

            $fieldsetItem = null;

            // check if the existing item exists in the update array
            $existingItemInPostData = false;
            foreach ($fieldsetData['items'] as $index => $fieldsetItem) {

                if ($fieldsetItem['id'] == $existingItem['id']) {

                    $fieldsetItem = $fieldsetData['items'][$index];
                    // remove the item from items array
                    unset($fieldsetData['items'][$index]);
                    $existingItemInPostData = true;
                    break;
                }
            }

            // prepare for check
            $existingItem['fieldconfig'] = json_decode($existingItem['fieldconfig']);

            // if we have the item and it has changed
            if ($existingItemInPostData && SystemDeploymentCR::hasChanged($existingItem, $fieldsetItem, ['sequence', 'package', 'field', 'fieldset', 'fieldconfig'])) {

                $dbData = [
                    'field' => $fieldsetItem['field'],
                    'fieldset' => $fieldsetItem['fieldset'],
                    'sequence' => $fieldsetItem['sequence'],
                    'fieldconfig' => json_encode($fieldsetItem['fieldconfig']),
                    'package' => $fieldsetItem['package'],
                    'version' => $_SESSION['confversion'],
                ];

                $name = $name . $fieldsetItem['field'];

                SystemDeploymentCR::writeDBEntry($fieldsetItemTable, $fieldsetItem['id'], $dbData, $name, SystemDeploymentCR::ACTION_UPDATE);

            } else if (!$existingItemInPostData) {

                $name = $name . $existingItem['field'];
                SystemDeploymentCR::deleteDBEntry($fieldsetItemTable, $existingItem['id'], $name);
            }
        }

        // add all new items
        foreach ($fieldsetData['items'] as $fieldsetItem) {

            self::insertFieldsetItem($fieldsetItem, $fieldsetId, $fieldsetData, $fieldsetItemTable);
        }

        // clear the Cache
        SpiceCache::clear('spiceFieldSets');
    }

    /**
     * insert fieldset items
     * @param array $fieldsetItem
     * @param string $fieldsetId
     * @param array $fieldsetData
     * @param string $fieldsetItemTable
     * @throws Exception
     */
    private static function insertFieldsetItem(array $fieldsetItem, string $fieldsetId, array $fieldsetData, string $fieldsetItemTable)
    {
        $dbData = [
            'id' => $fieldsetItem['id'],
            'fieldset_id' => $fieldsetId,
            'field' => $fieldsetItem['field'],
            'fieldset' => $fieldsetItem['fieldset'],
            'sequence' => $fieldsetItem['sequence'],
            'fieldconfig' => json_encode($fieldsetItem['fieldconfig']),
            'package' => $fieldsetItem['package'],
            'version' => $_SESSION['confversion'],
        ];

        $itemName = $fieldsetItem['field'];

        if (empty($fieldsetItem['field']) && !empty($fieldsetItem['fieldset'])) {
            $db = DBManagerFactory::getInstance();
            $itemName = $db->getOne("SELECT name FROM sysuifieldsets WHERE id='{$fieldsetItem['fieldset']}' UNION SELECT name FROM sysuicustomfieldsets WHERE id='{$fieldsetItem['fieldset']}' ");
        }

        $name = $fieldsetData['module'] . "/" . $fieldsetData['name'] . '/' . $itemName;

        SystemDeploymentCR::writeDBEntry($fieldsetItemTable, $fieldsetItem['id'], $dbData, $name, SystemDeploymentCR::ACTION_INSERT);
    }

    /**
     * insert fieldset
     * @param string $fieldsetId
     * @param array $fieldsetData
     * @return void
     * @throws Exception
     */
    private static function insertFieldset(string $fieldsetId, array $fieldsetData)
    {
        $fieldsetTable = "sysui" . ($fieldsetData['type'] == 'custom' ? 'custom' : '') . "fieldsets";

        $dbData = [
            'id' => $fieldsetId,
            'module' => $fieldsetData['module'],
            'name' => $fieldsetData['name'],
            'package' => $fieldsetData['package'],
            'version' => $_SESSION['confversion'],
        ];

        $name = $fieldsetData['module'] . "/" . $fieldsetData['name'];

        SystemDeploymentCR::writeDBEntry($fieldsetTable, $fieldsetId, $dbData, $name, SystemDeploymentCR::ACTION_INSERT);
    }
}
