<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;

class SyncContacts extends SyncItems {
    
    public function __construct() {
        $functionNames = array (
            'syncExchangeFolderItemsFunctionName' => 'syncContactsFolderItems',
            'getExchangeItemsFunctionName' => 'getContacts',
            'syncSugarItemsFunctionName' => 'getContactsForExchangeSyncForUser',
            'getSugarItemsFunctionName' => 'getContactsForExchangeSyncForUser',
            'createExchangeItemsFunctionName' => 'createContacts',
            'updateExchangeItemsFunctionName' => 'updateContacts',
            'deleteExchangeItemsFunctionName' => 'deleteContacts',
            'createSugarItemsFunctionName' => 'saveOrUpdateContactsFromExchangeSyncForUser',
            'updateSugarItemsFunctionName' => 'saveOrUpdateContactsFromExchangeSyncForUser',   
            'deleteSugarItemsFunctionName' => null,      
        );
        parent::__construct($functionNames);
    }
}
