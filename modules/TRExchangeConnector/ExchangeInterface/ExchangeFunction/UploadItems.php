<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class UploadItems extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'UploadItems';
    protected $itemsToUpload = array();
    protected $folderId;
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox, $this->folderId, $this->itemsToUpload) = $callParameters;
        $useImpersonation = true;
        
        $uploadItemRequest = new \stdClass();
        $uploadItemRequest->Items = array_map(array($this, 'createUploadItem'), $this->itemsToUpload);
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $uploadItemRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        return array_map(null, $this->itemsToUpload, $result->ResponseMessages->UploadItemsResponseMessage);
    }
    
    protected function createUploadItem($itemToUpload) {
        
        $uploadItem = new \stdClass();
        $uploadItem->CreateAction = 'CreateNew';
        $uploadItem->ParentFolderId;
        $uploadItem->ParentFolderId->Id = $this->folderId->Id;
        $uploadItem->ParentFolderId->ChangeKey = $this->folderId->ChangeKey;
        $uploadItem->Data = $itemToUpload->Data;
        return $uploadItem;
    }
    
}
