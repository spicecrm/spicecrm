<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class UpdateItems extends ExchangeCalendarItemBaseFunction {
    
    protected $exchangeFunctionName = 'UpdateItem';
    protected $itemsForUpdate = array();
    protected $modelClass = 'TRBusinessConnector\Model\ExchangeCalendarItem';
    protected $mappingRetrieveFunctionName = 'getCalendarItemUpdateModelMapping';
    protected $exchangeResponseProperty = 'CalendarItem';
    protected $changeRequestAdditionalProperties;
    protected $exchangeItemClass;
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        $targetMailbox = $callParameters[0];
        $this->itemsForUpdate = array_values($callParameters[1]);
        $useImpersonation = true;
        
        $itemChangeRequest = new \EWSType_UpdateItemType();
        $itemChanges = new \EWSType_NonEmptyArrayOfItemChangesType();
        $itemChanges->ItemChange = array_map(array($this,'createItemChangeObjectFromModel'), $this->itemsForUpdate);        
        $itemChangeRequest->ItemChanges = $itemChanges;
        
        $itemChangeRequest->ConflictResolution = 'AlwaysOverwrite';
        
        if(is_array($this->changeRequestAdditionalProperties)) {
            foreach($this->changeRequestAdditionalProperties as $property => $value) {
                $itemChangeRequest->{$property} = $value;
            }
        }
//        $itemChangeRequest->SendMeetingInvitationsOrCancellations = \EWSType_CalendarItemUpdateOperationType::SEND_TO_NONE;
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $callParameters[0];
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $itemChangeRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        $updateResults = array();
        
        $updateItemResponseMessages = $result->ResponseMessages->UpdateItemResponseMessage;
        if($updateItemResponseMessages && !is_array($updateItemResponseMessages)) {
            $updateItemResponseMessages = array($updateItemResponseMessages);
        }
        
        for($position=0; $position < count($this->itemsForUpdate);$position++) {
            
            $itemForUpdate = clone $this->itemsForUpdate[$position];
            
            $responseMessage = $updateItemResponseMessages[$position];
            
            if($responseMessage->ResponseClass === 'Success') {            
                $responseItem = $responseMessage->Items->{$this->exchangeResponseProperty};
                $itemForUpdate->setExchangeId($responseItem->ItemId->Id);
                $itemForUpdate->setChangeKey($responseItem->ItemId->ChangeKey);
            }
            
            $updateResult = array (
                'responseClass' => $responseMessage->ResponseClass,
                'responseCode' => $responseMessage->ResponseCode,
                'model' => $itemForUpdate,
            );
            $updateResults[] = $updateResult;
        }
        
        return $updateResults;
    }
    
    public function getModelMappings() {
        
        return array(
            $this->modelClass => $this->{$this->mappingRetrieveFunctionName}(),
        );
    }
    
    public function createItemChangeObjectFromModel($model) {
        
        return $this->createGenericItemChangeObjectFromModel($this->exchangeItemClass, $this->exchangeResponseProperty, $model);
    }
        
}
