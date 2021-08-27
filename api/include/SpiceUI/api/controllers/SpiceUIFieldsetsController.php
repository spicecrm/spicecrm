<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHelper;
use stdClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceUIFieldsetsController
{

    static function getFieldSets()
    {
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

        return $retArray;
    }

    static function setFieldSets(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();

        $data = $req->getParsedBody();

        // check if we are an admin user
        SpiceUIRESTHelper::checkAdmin();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);


        // add items
        foreach ($data['add'] as $fieldsetid => $fieldsetdata) {
            $db->query("INSERT INTO sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsets (id, module, name, package, version) VALUES('$fieldsetid', '" . $fieldsetdata['module'] . "', '" . $fieldsetdata['name'] . "', '" . $fieldsetdata['package'] . "', '{$_SESSION['confversion']}')");

            // add to the CR
            if ($cr) $cr->addDBEntry("sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsets", $fieldsetid, 'I', $fieldsetdata['module'] . "/" . $fieldsetdata['name']);

            foreach ($fieldsetdata['items'] as $fieldsetitem) {
                $db->query("INSERT INTO sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems (id, fieldset_id, field, fieldset, sequence, fieldconfig, package, version) VALUES('" . $fieldsetitem['id'] . "','$fieldsetid','" . $fieldsetitem['field'] . "','" . $fieldsetitem['fieldset'] . "','" . $fieldsetitem['sequence'] . "','" . json_encode($fieldsetitem['fieldconfig']) . "','" . $fieldsetitem['package'] . "', '{$_SESSION['confversion']}')");

                // add to the CR
                if ($cr) $cr->addDBEntry("sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems", $fieldsetitem['id'], 'I', $fieldsetdata['module'] . "/" . $fieldsetdata['name'] . '/' . $fieldsetitem['field']);
            }
        }

        // handle the update
        foreach ($data['update'] as $fieldsetid => $fieldsetdata) {

            // get the record and check for change
            $record = $db->fetchByAssoc($db->query("SELECT * FROM sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsets WHERE id='$fieldsetid'"));
            if ($record['name'] != $fieldsetdata['name'] || $record['package'] != $fieldsetdata['package']) {
                // update the record
                $db->query("UPDATE sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsets SET name='" . $fieldsetdata['name'] . "', package='" . $fieldsetdata['package'] . "', version='{$_SESSION['confversion']}' WHERE id='$fieldsetid'");

                // add to the CR
                if ($cr) $cr->addDBEntry("sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsets", $fieldsetid, 'U', $fieldsetdata['module'] . "/" . $fieldsetdata['name']);
            }

            // get all fieldset items
            $items = $db->query("SELECT * FROM sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems WHERE fieldset_id = '$fieldsetid'");
            while ($item = $db->fetchByAssoc($items)) {
                $i = 0;
                $itemIndex = false;
                foreach ($fieldsetdata['items'] as $index => $fieldsetitem) {
                    if ($fieldsetitem['id'] == $item['id']) {
                        unset($fieldsetdata['items'][$index]);
                        $itemIndex = true;
                        break;
                    }
                }

                // if we have the entry
                if ($itemIndex !== false) {
                    if ($item['sequence'] != $fieldsetitem['sequence'] ||
                        $item['package'] != $fieldsetitem['package'] ||
                        $item['field'] != $fieldsetitem['field'] ||
                        $item['fieldset'] != $fieldsetitem['fieldset'] ||
                        md5($item['fieldconfig']) != md5(json_encode($fieldsetitem['fieldconfig']))) {
                        $db->query("UPDATE sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems  SET package = '" . $fieldsetitem['package'] . "', field = '" . $fieldsetitem['field'] . "', fieldset = '" . $fieldsetitem['fieldset'] . "', sequence = '" . $fieldsetitem['sequence'] . "', fieldconfig = '" . json_encode($fieldsetitem['fieldconfig']) . "', version = '{$_SESSION['confversion']}' WHERE id='{$item['id']}'");

                        // add to the CR
                        if ($cr) $cr->addDBEntry("sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems", $fieldsetitem['id'], 'U', $fieldsetdata['module'] . "/" . $fieldsetdata['name'] . '/' . $fieldsetitem['field']);
                    }

                } else {
                    // remove it
                    $db->query("DELETE FROM sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems WHERE id='{$item['id']}'");
                    // add to the CR
                    if ($cr) $cr->addDBEntry("sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems", $fieldsetitem['id'], 'D', $fieldsetdata['module'] . "/" . $fieldsetdata['name'] . '/' . $fieldsetitem['field']);

                }
            }

            // add all items we did not find
            foreach ($fieldsetdata['items'] as $fieldsetitem) {
                $db->query("INSERT INTO sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems (id, fieldset_id, package, field, fieldset, sequence, fieldconfig, version) VALUES('" . $fieldsetitem['id'] . "','$fieldsetid','" . $fieldsetitem['package'] . "','" . $fieldsetitem['field'] . "','" . $fieldsetitem['fieldset'] . "','" . $fieldsetitem['sequence'] . "','" . json_encode($fieldsetitem['fieldconfig']) . "', '{$_SESSION['confversion']}')");

                // add to the CR
                if ($cr) $cr->addDBEntry("sysui" . ($fieldsetdata['type'] == 'custom' ? 'custom' : '') . "fieldsetsitems", $fieldsetitem['id'], 'I', $fieldsetdata['module'] . "/" . $fieldsetdata['name'] . '/' . $fieldsetitem['field']);

            }
        }

        return $res->withJson(true);

    }
}
