<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use stdClass;

class SpiceUIComponentsetsController
{

    
    
    static function getComponentSets()
    {
        // check if cached
        $cached = SpiceCache::get('spiceComponentSets');
        if($cached) return $cached;

        $db = DBManagerFactory::getInstance();
        
        $retArray = [];
        $componentsets = $db->query("SELECT sysuicomponentsetscomponents.*, sysuicomponentsets.id cid, sysuicomponentsets.name, sysuicomponentsets.module, sysuicomponentsets.package componentsetpackage, sysuicomponentsets.version componentsetversion FROM sysuicomponentsets LEFT JOIN sysuicomponentsetscomponents ON sysuicomponentsetscomponents.componentset_id = sysuicomponentsets.id ORDER BY componentset_id, sequence");

        while ($componentset = $db->fetchByAssoc($componentsets)) {

            if (!isset($retArray[$componentset['cid']])) {
                $retArray[$componentset['cid']] = [
                    'id' => $componentset['cid'],
                    'name' => $componentset['name'],
                    'package' => $componentset['componentsetpackage'],
                    'version' => $componentset['componentsetversion'],
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
                'version' => $componentset['version'],
                //'componentconfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($componentset['componentconfig'], ENT_QUOTES)), true) ?: new \stdClass()
                'componentconfig' => json_decode(str_replace(["\r", "\n", "&#039;", "'"], ['', '', '"', '"'], $componentset['componentconfig']), true) ?: new stdClass()
            ];
        }

        $componentsets = $db->query("SELECT sysuicustomcomponentsetscomponents.*, sysuicustomcomponentsets.id cid, sysuicustomcomponentsets.name, sysuicustomcomponentsets.module, sysuicustomcomponentsets.package componentsetpackage, sysuicustomcomponentsets.version componentsetversion  FROM sysuicustomcomponentsets LEFT JOIN sysuicustomcomponentsetscomponents ON sysuicustomcomponentsetscomponents.componentset_id = sysuicustomcomponentsets.id ORDER BY componentset_id, sequence");

        while ($componentset = $db->fetchByAssoc($componentsets)) {

            if (!isset($retArray[$componentset['cid']])) {
                $retArray[$componentset['cid']] = [
                    'id' => $componentset['cid'],
                    'name' => $componentset['name'],
                    'package' => $componentset['componentsetpackage'],
                    'version' => $componentset['componentsetversion'],
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
                'version' => $componentset['version'],
                'componentconfig' => json_decode(str_replace(["\r", "\n", "&#039;", "'"], ['', '', '"', '"'], $componentset['componentconfig']), true) ?: new stdClass()
            ];
        }

        // set the Cache
        SpiceCache::set('spiceComponentSets', $retArray);

        return $retArray;
    }
}