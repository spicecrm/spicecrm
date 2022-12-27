<?php

namespace SpiceCRM\includes\SysCategoryTrees;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceModules;

class SysCategoryTree
{
    static function getTreeLinksByModule($module){
        // get the db
        $db = DBManagerFactory::getInstance();

        // getthe module id
        $moduleId = SpiceModules::getInstance()->getModuleId($module);

        // get the tree links
        $treelinks = $db->query("SELECT syscategorytree_id, module_field, module_field_c1, module_field_c2, module_field_c3, module_field_c4 FROM syscategorytreelinks WHERE syscategorytreelinks.module_id = '$moduleId'");

        // build the response
        $response = [];
        while ( $row = $db->fetchByAssoc($treelinks)) {
            $response[] = $row;
        }
        return $response;
    }
}