<?php

namespace SpiceCRM\includes\SysModuleLists;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSingleton;

/**
 * handles the moduleLists
 */
class SysModuleListManager extends SpiceSingleton
{

    private $initialized = false;

    private $moduleLists = [];

    /**
     * initialize the instance
     *
     * @return void
     */
    private function initialize()
    {
        $db = DBManagerFactory::getInstance();

        $moduleLists = $db->query("SELECT * FROM sysmodulelists WHERE created_by_id = '1' OR global = 1");
        while($m = $db->fetchByAssoc($moduleLists)){
            $this->moduleLists[$m['module']][$m['id']] = $m;
        }

        $this->initialized = true;
    }

    /**
     * returns the module list settings for the module
     *
     * @param $module
     * @return array
     */
    public function getListsForModule($module)
    {
        if(!$this->initialized) $this->initialize();

        return isset($this->moduleLists[$module]) ? array_values($this->moduleLists[$module]) : [];

    }


}