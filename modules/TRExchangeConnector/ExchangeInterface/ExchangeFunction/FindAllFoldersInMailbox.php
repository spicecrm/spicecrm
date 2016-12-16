<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;
use TRBusinessConnector\Model\ExchangeContact;

class FindAllFoldersInMailbox extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'FindFolder';
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        $targetMailbox = $callParameters[0];
        $useImpersonation = false;
        $findFolderRequest = new \EWSType_FindFolderType();
        $rootFolder = new \EWSType_DistinguishedFolderIdType();
        $rootFolder->Id = \EWSType_DistinguishedFolderIdNameType::MESSAGE_FOLDER_ROOT;
        $mailBox = new \EWSType_EmailAddressType();
        $mailBox->EmailAddress = $targetMailbox;        
        $rootFolder->Mailbox = $mailBox;
        $findFolderRequest->ParentFolderIds->DistinguishedFolderId = $rootFolder;
        $folderShape = new \EWSType_FolderResponseShapeType();
        $folderShape->BaseShape = \EWSType_DefaultShapeNamesType::ALL_PROPERTIES;
        $findFolderRequest->FolderShape = $folderShape;
        $findFolderRequest->Traversal = \EWSType_FolderQueryTraversalType::SHALLOW;
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $findFolderRequest;
        return $parameters;
    }
    
    protected function createResponseShape() {
        
        return $this->createDefaultResponseShape();
    }

    protected function createFolderId($targetMailbox, $useImpersonation) {
        
        $syncFolderId = new \EWSType_TargetFolderIdType();
        $distinguishedFolderId = new \EWSType_DistinguishedFolderIdType();
        $distinguishedFolderId->Id = \EWSType_DistinguishedFolderIdNameType::CONTACTS;
        $syncFolderId->DistinguishedFolderId = $distinguishedFolderId;
        $syncFolderId->DistinguishedFolderId->Mailbox->EmailAddress = $targetMailbox;
        return $syncFolderId;
    }
    
    protected function createSyncFolderItemsRequest($syncFolderId, $responseShape, $syncState = null) {
        
        $syncFolderItemsRequest = new \EWSType_SyncFolderItemsType();        
        $syncFolderItemsRequest->SyncFolderId = $syncFolderId;
        $syncFolderItemsRequest->ItemShape = $responseShape;
        $syncFolderItemsRequest->MaxChangesReturned = 2;
        
        if(!empty($syncState)) {
            $syncFolderItemsRequest->SyncState = $syncState;
        }
        return $syncFolderItemsRequest;
    }
    
    protected function retrieveResults($result) {
        
        $folders = $result->ResponseMessages->FindFolderResponseMessage->RootFolder->Folders;
        return $folders;
    }
    
    public function getModelMappings() {
        
        return array(
            'TRBusinessConnector\Model\ExchangeContact' => $this->getContactModelMapping(),
        );
    }
    
    protected function getContactModelMapping() {
        
        $mapping = array(
            'Properties' => array (
                // Exchange Path => Property
                'CompleteName:FirstName' => 'firstName',
                'CompleteName:LastName' => 'lastName', 
            ),
            'IndexedProperties' => array (
                
            ),
            'ExtendedProperties' => array (
                // Exchange Path => Property
                'PublicStrings:SugarGUID' => 'sugarId'
            )
        );
        return $mapping;
    }
    
}
