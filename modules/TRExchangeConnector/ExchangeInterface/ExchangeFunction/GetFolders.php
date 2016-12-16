<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class GetFolders extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'GetFolder';
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox, $distinguishedFolderId) = $callParameters;
        $useImpersonation = true;
        
        $getFolderRequest = new \EWSType_GetFolderType();
        $getFolderRequest->FolderIds->DistinguishedFolderId->Id = $distinguishedFolderId;
        $getFolderRequest->FolderShape->BaseShape = 'Default';
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $getFolderRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        return $result->ResponseMessages->GetFolderResponseMessage->Folders;
    }
    
    public function getModelMappings() {
        
        return array(
            $this->modelClass => $this->{$this->mappingRetrieveFunctionName}(),
        );
    }
    
    protected function createGetItemResponseShape($modelClass) {
        
        switch($modelClass) {
            case 'TRBusinessConnector\Model\ExchangeCalendarItem':
                return $this->createCalendarItemResponseShape();
                break;
            default:
                return $this->createDefaultResponseShape();
        }
    }
    
    protected function createCalendarItemResponseShape() {
        
        $extendedFieldDescriptions = array(
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarGUID',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarSYNC',
                'PropertyType' => 'Boolean'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarParentType',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarParentID',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarAssignedUserID',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarAssignedUserName',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarType',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarStatus',
                'PropertyType' => 'String'
            ),
        );
        return $this->createResponseShape($extendedFieldDescriptions);        
    }
    
    protected function createDefaultResponseShape() {
        
        $extendedFieldDescriptions = array(
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarGUID',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarSYNC',
                'PropertyType' => 'Boolean'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarAccountName',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarAccountID',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarOwnerID',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarOwnerName',
                'PropertyType' => 'String'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarStartTime',
                'PropertyType' => 'SystemTime'
            ),
            array (
                'DistinguishedPropertySetId' => 'PublicStrings',
                'PropertyName' => 'SugarDueTime',
                'PropertyType' => 'SystemTime'
            ),            
        );
        return $this->createResponseShape($extendedFieldDescriptions);
    }
    
    
    protected function createResponseShape($extendedFieldDescriptions) {

        $responseShape = new \EWSType_ItemResponseShapeType();
        
        $responseShape->BaseShape = \EWSType_DefaultShapeNamesType::ALL_PROPERTIES;
        
        $interface = $this;
        $createPathToExtendedField = function($extendedFieldDescription) use ($interface) {
            return $interface->createPathToExtendedField(
                    $extendedFieldDescription['DistinguishedPropertySetId'],
                    $extendedFieldDescription['PropertyName'],
                    $extendedFieldDescription['PropertyType']
                );
        };
        
        $responseShape->AdditionalProperties->ExtendedFieldURI = array_map($createPathToExtendedField, $extendedFieldDescriptions);
                
        $modifiedDate = new \EWSType_PathToUnindexedFieldType();
        $modifiedDate->FieldURI = "item:LastModifiedTime";
        
        $modifiedUser = new \EWSType_PathToUnindexedFieldType();
        $modifiedUser->FieldURI = "item:LastModifiedName";
        
        $responseShape->AdditionalProperties->FieldURI = array(
            $modifiedDate,
            $modifiedUser
        );
        
        $responseShape->BodyType = \EWSType_BodyTypeType::TEXT;
        return $responseShape;
    }
    
    
}
