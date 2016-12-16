<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class GetTasksForExchangeSyncForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'getTasksToSyncForUser';
    protected $bean = 'Task';    
    protected $user;
    /**
     *
     * @var \SugarDateTime
     */
    protected $syncStart;

    
    protected function createParameters($callParameters) {
        
        list($this->user, $lastSyncDate, $startafter, $offset) = $callParameters;
        $this->syncStart = new \SugarDateTime();
        $modelMappings = $this->getModelMappings();
        $fieldList = array_keys($modelMappings['TRBusinessConnector\Model\ExchangeTask']);
        $parameters = array(
            'user' => $this->user,
            'lastSyncDate' => $lastSyncDate,
            'offset' => $offset,
            'pageSize' => 50,
            'fieldList' => $fieldList,
        );
        return $parameters;
    }
    
    protected function retrieveErrors($result) {

        return array();
    }
    
    protected function retrieveResults($result) {
        
        global $timedate; 
        
        $sugarTasks = $result['list'];
        $tasks = array();
        $modifiedDates = array();
        $includesLastItemInRange = $result['next_offset'] >= $result['row_count'];
        
        $this->impersonate($this->user);
        
        foreach($sugarTasks as $sugarTask) {
            $tasks[] = $this->createModelFromInterfaceData(get_object_vars($sugarTask), 'TRBusinessConnector\\Model\\ExchangeTask');
            $modifiedDates[] = $timedate->fromUser($sugarTask->date_modified);
        }
        
        $this->cancelImpersonation();
        
        return array(
            'includesLastItemInRange' => $includesLastItemInRange,
//            'sugarLastSyncDate' => $modifiedDates ? max($modifiedDates) : $this->syncStart,
            'sugarLastSyncDate' => $this->syncStart,
            'nextOffset' => $result['next_offset'],
            'list' => $tasks,
        );
    }
    
    public function getModelMappings() {
        return array(
            'TRBusinessConnector\Model\ExchangeTask' => $this->getTaskRetrieveMapping()
        );
    }
}
