<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class SyncFolderItems extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'SyncFolderItems';
    protected $modelClass;
    protected $mappingRetrieveFunctionName;
    protected $exchangeResponseProperty;
    protected $distinguishedFolderName;
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox) = $callParameters;
        $useImpersonation = true;
        $responseShape = $this->createResponseShape();
        $syncFolderId = $this->createFolderId($targetMailbox, $useImpersonation);
        $syncFolderItemsRequest = $this->createSyncFolderItemsRequest($syncFolderId, $responseShape, $callParameters[1]);
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $syncFolderItemsRequest;
        return $parameters;
    }
    
    protected function createResponseShape() {
        
        return $this->createSyncFolderResponseShape();
    }

    protected function createFolderId($targetMailbox, $useImpersonation) {
        
        $syncFolderId = new \EWSType_TargetFolderIdType();
        $distinguishedFolderId = new \EWSType_DistinguishedFolderIdType();
        $distinguishedFolderId->Id = $this->distinguishedFolderName;
        $syncFolderId->DistinguishedFolderId = $distinguishedFolderId;
        return $syncFolderId;
    }
    
    protected function createSyncFolderItemsRequest($syncFolderId, $responseShape, $syncState = null) {
        
        $syncFolderItemsRequest = new \EWSType_SyncFolderItemsType();        
        $syncFolderItemsRequest->SyncFolderId = $syncFolderId;
        $syncFolderItemsRequest->ItemShape = $responseShape;
        $syncFolderItemsRequest->MaxChangesReturned = 50;
        
        if(!empty($syncState)) {
            $syncFolderItemsRequest->SyncState = $syncState;
        }
        return $syncFolderItemsRequest;
    }
    
    protected function retrieveResults($result) {
        
        $model = array();        
        $changes = $result->ResponseMessages->SyncFolderItemsResponseMessage->Changes;
        $syncState = $result->ResponseMessages->SyncFolderItemsResponseMessage->SyncState;
        $includesLastItemInRange = $result->ResponseMessages->SyncFolderItemsResponseMessage->IncludesLastItemInRange;
        
        $createEntries = isset($changes->Create) ? $changes->Create : array();
        if (!is_array($createEntries)) {
            $createEntries = array($createEntries);
        }
        $exchangeResponseProperty = $this->exchangeResponseProperty;
        $getItem = function($entry) use ($exchangeResponseProperty) { 
            return $entry->{$exchangeResponseProperty};
        };
        $createData = array_map($getItem, $createEntries);
        $updateEntries = isset($changes->Update) ? $changes->Update : array();
        if (!is_array($updateEntries)) {
            $updateEntries = array($updateEntries);
        }
        $updateData = array_map($getItem, $updateEntries);

        $deleteEntries = isset($changes->Delete) ? $changes->Delete : array();
        if (!is_array($deleteEntries)) {
            $deleteEntries = array($deleteEntries);
        }
        $getItemId = function($entry) {
            return $entry->ItemId;
        };
        $deleteData = array_map($getItemId, $deleteEntries);
        
        $interface = $this;
        $modelClass = $this->modelClass;
        $createModel = function($exchangeObject) use ($interface, $modelClass) {
            return $interface->createModelFromInterfaceData($exchangeObject, $modelClass);
        };
        $createModelFromItemId = function($itemId) use ($interface, $modelClass) {
            return $interface->createModelFromItemId($itemId, $modelClass);
        };
        $model['create'] = array_map($createModel, $createData);        
        $model['update'] = array_map($createModel, $updateData);
        $model['delete'] = array_map($createModelFromItemId, $deleteData);
        
        $syncFolderResult = array (
            'includesLastItemInRange' => $includesLastItemInRange,
            'syncState' => $syncState,
            'model' => $model
        );
        
        return $syncFolderResult;
    }
    
    public function getModelMappings() {
        
        return array(
            $this->modelClass => $this->{$this->mappingRetrieveFunctionName}(),
        );
    }
}
