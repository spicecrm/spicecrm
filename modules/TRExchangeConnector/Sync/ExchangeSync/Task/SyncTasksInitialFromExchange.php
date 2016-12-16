<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;

class SyncTasksInitialFromExchange extends SyncItemsInitialFromExchange {
    
    public function __construct() {
        $functionNames = array (
            'syncExchangeFolderItemsFunctionName' => 'syncTasksFolderItems',
            'getExchangeItemsFunctionName' => 'getTasks',
            'getSugarItemsFunctionName' => 'getTasksByIdsForUser',
            'createExchangeItemsFunctionName' => 'createTasks',
            'updateExchangeItemsFunctionName' => 'updateTasks',
            'createSugarItemsFunctionName' => 'saveOrUpdateTasksFromExchangeSyncForUser',
            'updateSugarItemsFunctionName' => 'saveOrUpdateTasksFromExchangeSyncForUser',       
        );
        parent::__construct($functionNames);
    }
}
