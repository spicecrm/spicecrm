<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class EmptyFolder extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'EmptyFolder';
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox, $distinguishedFolderId) = $callParameters;

        $useImpersonation = true;
        
        $emtpyFolderRequest = new \stdClass();
        $emtpyFolderRequest->DeleteType = 'HardDelete';
        $emtpyFolderRequest->DeleteSubFolders = false;
        
        $folder = new \EWSType_DistinguishedFolderIdType();
        $folder->Id = $distinguishedFolderId;
        
        $emtpyFolderRequest->FolderIds->DistinguishedFolderId = $folder;
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $emtpyFolderRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        $folders = $result->ResponseMessages->FindFolderResponseMessage->RootFolder->Folders;
        return $folders;
    }
    
}
