<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class FindItems extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'FindItem';
    protected $modelClass;
    protected $mappingRetrieveFunctionName;
    protected $exchangeResponseProperty;
    protected $distinguishedFolderName;
            
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox, $offset) = $callParameters;
        if(null === $offset) {
            $offset = 0;
        }
        $useImpersonation = true;
        
        $findItemRequest = new \EWSType_FindItemType();
        $findItemRequest->Traversal = \EWSType_ItemQueryTraversalType::SHALLOW;
        
        $responseShape = new \EWSType_ItemResponseShapeType();        
        $responseShape->BaseShape = \EWSType_DefaultShapeNamesType::ID_ONLY;
        
        $findItemRequest->ItemShape = $responseShape;
        
        $folder = new \EWSType_DistinguishedFolderIdType();
        $folder->Id = $this->distinguishedFolderName;                
        $findItemRequest->ParentFolderIds->DistinguishedFolderId = $folder;
        
        $indexedPageItemView = new \EWSType_IndexedPageViewType();
        $indexedPageItemView->BasePoint = 'Beginning';
        $indexedPageItemView->Offset = $offset;
        $indexedPageItemView->MaxEntriesReturned = 50;
        $findItemRequest->IndexedPageItemView = $indexedPageItemView;
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $findItemRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        $findItemResults = array();
        
        $rootFolder = $result->ResponseMessages->FindItemResponseMessage->RootFolder;
        if(isset($rootFolder->Items->{$this->exchangeResponseProperty})) {
            $responseItems = $rootFolder->Items->{$this->exchangeResponseProperty};            
        } else {
            $responseItems = array();
        }
        foreach($responseItems as $responseItem) {
            $responseModel = $this->createModelFromInterfaceData($responseItem, $this->modelClass);
            $findItemResults[] = $responseModel;
        }
        return array (
            'indexedPagingOffset' => $rootFolder->IndexedPagingOffset,
            'includesLastItemInRange' => $rootFolder->IncludesLastItemInRange,
            'totalItemsInView' => $rootFolder->TotalItemsInView,
            'items' => $findItemResults,
        );
    }
    
    public function getModelMappings() {
        
        return array(
            $this->modelClass => $this->{$this->mappingRetrieveFunctionName}(),
        );
    }    
}
