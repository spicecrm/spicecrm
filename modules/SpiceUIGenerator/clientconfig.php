<?php
/**
 * Config Settings for customer
 *
 */

require_once 'modules/SpiceUIGenerator/SpiceUIConfig.php';

class ClientConfig extends SpiceUIConfig{

    public $customModules = array();
    public $customViewModules = array();
    public $excludeFromListViewModules = array('KReports', 'Users');
    public $excludeFromViewModules = array('KReports', 'Users');
    public $excludeFromLayoutdefsModules = array();
    public $forceViewForModules = array(); //array('Accounts' => array('view' => 'detailviewdefs')); //example
    public $customerKey;
    public $skipModules = array("Administration", "Schedulers", "KReports");

    public function __construct($customerKey, $language){
       parent::__construct($customerKey, $language);
    }

    /**
     * for client customer: all modules in custom/modules starting with K or TR or customerKey
     */
    public function getCustomModules(){
        foreach (new DirectoryIterator('custom/modules') as $fileInfo) {
            if($fileInfo->isDot() || $fileInfo->isFile()) continue;
            if(!preg_match("/^K/", $fileInfo->getFilename()) &&
                !preg_match("/^TR/", $fileInfo->getFilename()) &&
                !preg_match("/^".$this->customerKey."/", $fileInfo->getFilename())) continue;
            $this->customModules[] = $fileInfo->getFilename();
        }
    }


}


$client = new ClientConfig('RAD', 'en_us');
$client->resetSysUITables();
$client->createUIconfig();

//$client->loadUIconfig();
//$client->createFTSconfig();
