<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;

class SyncCalendarItemsInitialFromExchange extends SyncItemsInitialFromExchange {
    
    public function __construct() {
        $functionNames = array (
            'syncExchangeFolderItemsFunctionName' => 'syncCalendarItemsFolderItems',
            'getExchangeItemsFunctionName' => 'getCalendarItems',
            'getSugarItemsFunctionName' => 'getCalendarItemsByIdsForUser',
            'createExchangeItemsFunctionName' => 'createCalendarItems',
            'updateExchangeItemsFunctionName' => 'updateCalendarItems',
            'createSugarItemsFunctionName' => 'saveOrUpdateCalendarItemsFromExchangeSyncForUser',
            'updateSugarItemsFunctionName' => 'saveOrUpdateCalendarItemsFromExchangeSyncForUser',       
        );
        parent::__construct($functionNames);
    }    
}
