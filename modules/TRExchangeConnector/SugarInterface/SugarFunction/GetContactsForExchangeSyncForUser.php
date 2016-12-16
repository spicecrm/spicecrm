<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class GetContactsForExchangeSyncForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'getContactsToSyncForUser';
    protected $bean = 'Contact';    
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
        $fieldList = array_keys($modelMappings['TRBusinessConnector\Model\ExchangeContact']);
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
        
        $preparedResult = $this->retrieveBeanResult($result);
        return array(
            'includesLastItemInRange' => $preparedResult['includesLastItemInRange'],
            'sugarLastSyncDate' => $preparedResult['sugarLastSyncDate'],
            'nextOffset' => $preparedResult['nextOffset'],
            'list' => $preparedResult['list'],
        );
    }
    
    protected function retrieveBeanResult($result) {
        
        global $timedate;
        
        $sugarItems = $result['list'];
        $items = array();
        $modifiedDates = array();
        $includesLastItemInRange = $result['next_offset'] >= $result['row_count'];
        
        $this->impersonate($this->user);        
        
        foreach($sugarItems as $sugarItem) {
            $item = $this->createModelFromInterfaceData(get_object_vars($sugarItem), 'TRBusinessConnector\\Model\\ExchangeContact');
            $items[] = $item;
            $modifiedDates[] = $timedate->fromUser($sugarItem->date_modified);
        }
        
        $this->cancelImpersonation();
        
        return array(
            'includesLastItemInRange' => $includesLastItemInRange,
//            'sugarLastSyncDate' => $sugarItems ? max($modifiedDates) : $this->syncStart,
            'sugarLastSyncDate' => $this->syncStart,
            'nextOffset' => $result['next_offset'],
            'list' => $items,
        );        
    }    
    
    public function getModelMappings() {
        return array(
            'TRBusinessConnector\Model\ExchangeContact' => $this->getContactRetrieveMapping()
        );
    }
}
