<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class CreateItems extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'CreateItem';
    protected $itemsToCreate = array();
    protected $modelClass;
    protected $mappingRetrieveFunctionName;
    protected $exchangeResponseProperty;
    protected $createRequestAdditionalProperties;
    protected $exchangeItemClass;
    protected $distinguishedFolderName;
    protected $exchangeItemCreatedCallback;
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox, $targetFolder, $itemsToCreate) = $callParameters;
        $this->itemsToCreate = $itemsToCreate;        
        $useImpersonation = true;
        
        $createItemRequest = new \EWSType_CreateItemType();
        $distinguishedFolder = new \EWSType_DistinguishedFolderIdType();
        $distinguishedFolder->Id = $this->distinguishedFolderName;
//        $mailbox = new \EWSType_MailboxData();
//        $mailbox->EmailAddress = $targetMailbox;
//        $distinguishedFolder->Mailbox = $mailbox;
        $targetFolderId = new \EWSType_TargetFolderIdType();
        $targetFolderId->DistinguishedFolderId = $distinguishedFolder;
        $createItemRequest->SavedItemFolderId = $targetFolderId;
        
        $items = new \EWSType_NonEmptyArrayOfAllItemsType();
        $items->{$this->exchangeResponseProperty} = array_values(array_map(array($this,'createItemFromModel'), $itemsToCreate));
        
//        $items->Task = array($task);
        
        $createItemRequest->Items = $items;
        
        if(is_array($this->createRequestAdditionalProperties)) {
            foreach($this->createRequestAdditionalProperties as $property => $value) {
                $createItemRequest->{$property} = $value;
            }
        }
        
//        $createItemRequest->SendMeetingInvitations = \EWSType_CalendarItemCreateOrDeleteOperationType::SEND_TO_NONE;
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $createItemRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        $createResults = array();
        
        $createItemResponseMessages = $result->ResponseMessages->CreateItemResponseMessage;
        if($createItemResponseMessages && !is_array($createItemResponseMessages)) {
            $createItemResponseMessages = array($createItemResponseMessages);
        }
       
        $itemReturnCompounds = array_map(null, $this->itemsToCreate, $createItemResponseMessages);
        
        foreach($itemReturnCompounds as $itemReturnCompound) {
            
            list($item, $responseMessage) = $itemReturnCompound;
            $itemToReturn = clone $item;
            $responseItem = $responseMessage->Items->{$this->exchangeResponseProperty};
            
            if($responseMessage->ResponseClass === 'Success') {
                $itemToReturn->setExchangeId($responseItem->ItemId->Id);
                $itemToReturn->setChangeKey($responseItem->ItemId->ChangeKey);
            }

            $createResult = array (
                'responseClass' => $responseMessage->ResponseClass,
                'responseCode' => $responseMessage->ResponseCode,
                'model' => $itemToReturn,
            );
            $createResults[] = $createResult;
        }
        return $createResults;        
    }
    
    public function getModelMappings() {
        
        return array(
            $this->modelClass => $this->{$this->mappingRetrieveFunctionName}(),
        );
    }
    
    protected function createItemFromModel($model) {
        
        return $this->createGenericItemFromModel($this->exchangeItemClass, $model, $this->exchangeItemCreatedCallback);
    }
    
    
}
