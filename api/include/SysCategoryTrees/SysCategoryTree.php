<?php

namespace SpiceCRM\includes\SysCategoryTrees;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSingleton;
use SpiceCRM\includes\SugarObjects\SpiceModules;

class SysCategoryTree extends SpiceSingleton
{
    private $initialized = false;

    private $categoryTreeLinks;

    private function initialize(){
        $db = DBManagerFactory::getInstance();
        $treeLinks = $db->query("SELECT module_id, syscategorytree_id, module_field, module_field_c1, module_field_c2, module_field_c3, module_field_c4 FROM syscategorytreelinks");
        while($treeLink = $db->fetchByAssoc($treeLinks)){
            $this->categoryTreeLinks[$treeLink['module_id']][] = $treeLink;
        }
        $this->initialized = true;
    }

    public function getTreeLinksByModule($module){
        if(!$this->initialized) $this->initialize();

        // getthe module id
        $moduleId = SpiceModules::getInstance()->getModuleId($module);

        return isset($this->categoryTreeLinks[$moduleId]) ? array_values($this->categoryTreeLinks[$moduleId]) : [];

    }
}