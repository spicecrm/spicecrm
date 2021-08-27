<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use stdClass;

class SpiceUIComponentsetsController
{

    
    
    static function getComponentSets()
    {
        $db = DBManagerFactory::getInstance();
        
        $retArray = [];
        $componentsets = $db->query("SELECT sysuicomponentsetscomponents.*, sysuicomponentsets.id cid, sysuicomponentsets.name, sysuicomponentsets.module, sysuicomponentsets.package componentsetpackage FROM sysuicomponentsets LEFT JOIN sysuicomponentsetscomponents ON sysuicomponentsetscomponents.componentset_id = sysuicomponentsets.id ORDER BY componentset_id, sequence");

        while ($componentset = $db->fetchByAssoc($componentsets)) {

            if (!isset($retArray[$componentset['cid']])) {
                $retArray[$componentset['cid']] = [
                    'id' => $componentset['cid'],
                    'name' => $componentset['name'],
                    'package' => $componentset['componentsetpackage'],
                    'module' => $componentset['module'] ?: '*',
                    'type' => 'global',
                    'items' => []
                ];
            }

            $retArray[$componentset['componentset_id']]['items'][] = [
                'id' => $componentset['id'],
                'sequence' => $componentset['sequence'],
                'component' => $componentset['component'],
                'package' => $componentset['package'],
                //'componentconfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($componentset['componentconfig'], ENT_QUOTES)), true) ?: new \stdClass()
                'componentconfig' => json_decode(str_replace(["\r", "\n", "&#039;", "'"], ['', '', '"', '"'], $componentset['componentconfig']), true) ?: new stdClass()
            ];
        }

        $componentsets = $db->query("SELECT sysuicustomcomponentsetscomponents.*, sysuicustomcomponentsets.id cid, sysuicustomcomponentsets.name, sysuicustomcomponentsets.module, sysuicustomcomponentsets.package componentsetpackage FROM sysuicustomcomponentsets LEFT JOIN sysuicustomcomponentsetscomponents ON sysuicustomcomponentsetscomponents.componentset_id = sysuicustomcomponentsets.id ORDER BY componentset_id, sequence");

        while ($componentset = $db->fetchByAssoc($componentsets)) {

            if (!isset($retArray[$componentset['cid']])) {
                $retArray[$componentset['cid']] = [
                    'id' => $componentset['cid'],
                    'name' => $componentset['name'],
                    'package' => $componentset['componentsetpackage'],
                    'module' => $componentset['module'] ?: '*',
                    'type' => 'custom',
                    'items' => []
                ];
            }

            $retArray[$componentset['cid']]['items'][] = [
                'id' => $componentset['id'],
                'sequence' => $componentset['sequence'],
                'component' => $componentset['component'],
                'package' => $componentset['package'],
                'componentconfig' => json_decode(str_replace(["\r", "\n", "&#039;", "'"], ['', '', '"', '"'], $componentset['componentconfig']), true) ?: new stdClass()
            ];
        }
        return $retArray;
    }
}