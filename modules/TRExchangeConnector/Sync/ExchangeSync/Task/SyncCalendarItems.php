<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;

class SyncCalendarItems extends SyncItems {
    
    protected $createExchangeItemsFunctionName = 'createTasks';

    public function __construct() {
        $functionNames = array (
            'syncExchangeFolderItemsFunctionName' => 'syncCalendarItemsFolderItems',
            'getExchangeItemsFunctionName' => 'getCalendarItems',
            'syncSugarItemsFunctionName' => 'getCalendarItemsForExchangeSyncForUser',
            'getSugarItemsFunctionName' => 'getCalendarItemsByIdsForUser',
            'createExchangeItemsFunctionName' => 'createCalendarItems',
            'updateExchangeItemsFunctionName' => 'updateCalendarItems',
            'deleteExchangeItemsFunctionName' => 'deleteCalendarItems',
            'createSugarItemsFunctionName' => 'saveOrUpdateCalendarItemsFromExchangeSyncForUser',
            'updateSugarItemsFunctionName' => 'saveOrUpdateCalendarItemsFromExchangeSyncForUser',       
            'deleteSugarItemsFunctionName' => 'deleteCalenderItemsFromExchangeSyncForUser',
        );
        parent::__construct($functionNames);
    }
}
