<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class GetCalendarItemsForExchangeSyncForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'getCalendarItemsToSyncForUser';
    protected $user;
    /**
     *
     * @var \SugarDateTime
     */
    protected $syncStart;
    
    protected function createParameters($callParameters) {
        
        list($this->user, $lastSyncDate, $startAfter, $offset) = $callParameters;
        $this->syncStart = new \SugarDateTime();
        $modelMappings = $this->getModelMappings();
        $afterRetrieve = array(
            'Call' => array(
                $this->getCallMeetingCorrectDateEndCallback()
            ),
            'Meeting' => array(
                $this->getCallMeetingCorrectDateEndCallback()
            ),
        );
        $parameters = array(
            'user' => $this->user,
            'lastSyncDate' => $lastSyncDate,
            'startAfter' => $startAfter,
            'offset' => $offset,
            'pageSize' => 50,
            'mappings' => $modelMappings['TRBusinessConnector\Model\ExchangeCalendarItem'],
            'afterRetrieve' => $afterRetrieve,
        );
        return $parameters;
    }
    
    protected function retrieveErrors($result) {

        return array();
    }
    
    protected function retrieveResults($result) {
        
        $calls = $this->retrieveBeanResult($result['calls']);
        $meetings = $this->retrieveBeanResult($result['meetings']);
        
        $includesLastItemInRange = $calls['includesLastItemInRange'] && $meetings['includesLastItemInRange'];
        $sugarLastSyncDate = min($calls['sugarLastSyncDate'],$meetings['sugarLastSyncDate']);
        $nextOffset = min($calls['nextOffset'], $meetings['nextOffset']);
        $items = array_merge($calls['list'],$meetings['list']);
        
        return array(
            'includesLastItemInRange' => $includesLastItemInRange,
//            'sugarLastSyncDate' => $sugarLastSyncDate,
            'sugarLastSyncDate' => $this->syncStart,
            'nextOffset' => $nextOffset,
            'list' => $items,
        );
    }
    
    protected function retrieveBeanResult($result) {
        
        global $timedate, $beanList;
        
        $sugarItems = $result['list'];
        $items = array();
        $modifiedDates = array();
        $includesLastItemInRange = $result['next_offset'] >= $result['row_count'];
        
        $this->impersonate($this->user);
        
        foreach($sugarItems as $sugarItem) {
            $item = $this->createModelFromInterfaceData($sugarItem, 'TRBusinessConnector\\Model\\ExchangeCalendarItem');
            $item->setSugarType($sugarItem->module_dir);
            $items[] = $item;
            $modifiedDates[] = $timedate->fromUser($sugarItem->date_modified);
        }
        
        $this->cancelImpersonation();
        
        return array(
            'includesLastItemInRange' => $includesLastItemInRange,
            'sugarLastSyncDate' => $sugarItems ? max($modifiedDates) : $this->syncStart,
            'nextOffset' => $result['next_offset'],
            'list' => $items,
        );        
    }
    
    protected function createModelFromInterfaceData($interfaceModel, $modelClass) {

        $model = new $modelClass();
        $modelVardefs = $model->getVardefs();
        $interfaceModelClass = get_class($interfaceModel);
        $mappingsArray = $this->getModelMappings();
        $mappings = $mappingsArray[$modelClass];
        $interfaceDataMap = $mappings[$interfaceModelClass];
        foreach($interfaceDataMap as $interfaceField => $mapping) {
            $setter = "set" . ucfirst($mapping);
            $model->{$setter}($this->convertValueFromInterface($interfaceModel->$interfaceField, $modelVardefs[$mapping]['type']));
        }
        return $model;
        
    }    
    
    public function getModelMappings() {
        return array (
            'TRBusinessConnector\Model\ExchangeCalendarItem' => array (
                'Call' => $this->getCallRetrieveMapping(),
                'Meeting' => $this->getMeetingRetrieveMapping(),
                )
        );
    }
}
