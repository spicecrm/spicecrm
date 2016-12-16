<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;

class SyncContactsInitialToExchange extends SyncItemsInitialToExchange {
    
    public function __construct() {
        $functionNames = array (
            'syncExchangeFolderItemsFunctionName' => 'syncContactsFolderItems',
            'getExchangeItemsFunctionName' => 'getContacts',
            'getSugarItemsFunctionName' => 'getContactsForExchangeSyncForUser',
            'createExchangeItemsFunctionName' => 'createContacts',
            'updateExchangeItemsFunctionName' => 'updateContacts',
            'createSugarItemsFunctionName' => 'saveOrUpdateContactsFromExchangeSyncForUser',
            'updateSugarItemsFunctionName' => 'saveOrUpdateContactsFromExchangeSyncForUser',       
        );
        parent::__construct($functionNames);
    }
}
