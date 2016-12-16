<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class DeleteItems extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'DeleteItem';
    protected $itemsToDelete = array();
    protected $modelClass;
    protected $mappingRetrieveFunctionName;
    protected $exchangeResponseProperty;
    protected $deleteRequestAdditionalProperties;
    protected $exchangeItemClass;
    protected $distinguishedFolderName;
    protected $exchangeItemCreatedCallback;
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox, $itemsToDelete) = $callParameters;
        $this->itemsToDelete = $itemsToDelete;        
        $useImpersonation = true;
        
        $deleteItemRequest = new \EWSType_DeleteItemType();
        $deleteItemRequest->DeleteType = \EWSType_DisposalType::SOFT_DELETE;
        $deleteItemRequest->ItemIds->ItemId = array_values(array_map(array($this,'createItemIdFromModel'), $this->itemsToDelete));
        
        if(is_array($this->deleteRequestAdditionalProperties)) {
            foreach($this->deleteRequestAdditionalProperties as $property => $value) {
                $deleteItemRequest->{$property} = $value;
            }
        }
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $deleteItemRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        $deleteResults = array();
        
        $deleteItemResponseMessages = $result->ResponseMessages->DeleteItemResponseMessage;
        if($deleteItemResponseMessages && !is_array($deleteItemResponseMessages)) {
            $deleteItemResponseMessages = array($deleteItemResponseMessages);
        }
       
        $itemReturnCompounds = array_map(null, $this->itemsToDelete, $deleteItemResponseMessages);
        
        foreach($itemReturnCompounds as $itemReturnCompound) {
            
            list($item, $responseMessage) = $itemReturnCompound;
            $itemToReturn = clone $item;
            
            $deleteResult = array (
                'responseClass' => $responseMessage->ResponseClass,
                'responseCode' => $responseMessage->ResponseCode,
                'model' => $itemToReturn,
            );
            $deleteResults[] = $deleteResult;
        }
        return $deleteResults;        
    }
    
}
