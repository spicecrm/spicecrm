<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;

class SyncTasks extends SyncItems {
    
    public function __construct() {
        $functionNames = array (
            'syncExchangeFolderItemsFunctionName' => 'syncTasksFolderItems',
            'getExchangeItemsFunctionName' => 'getTasks',
            'syncSugarItemsFunctionName' => 'getTasksForExchangeSyncForUser',
            'getSugarItemsFunctionName' => 'getTasksByIdsForUser',
            'createExchangeItemsFunctionName' => 'createTasks',
            'updateExchangeItemsFunctionName' => 'updateTasks',
            'deleteExchangeItemsFunctionName' => 'deleteTasks',
            'createSugarItemsFunctionName' => 'saveOrUpdateTasksFromExchangeSyncForUser',
            'updateSugarItemsFunctionName' => 'saveOrUpdateTasksFromExchangeSyncForUser',   
            'deleteSugarItemsFunctionName' => null,
        );
        parent::__construct($functionNames);
    }
}
