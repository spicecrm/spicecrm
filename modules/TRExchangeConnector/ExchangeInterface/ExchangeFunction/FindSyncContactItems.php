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

class FindSyncContactItems extends ExchangeContactsBaseFunction {
    
    protected $exchangeFunctionName = 'FindItem';
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        
        $findItemRequest = new \EWSType_FindItemType();
        $findItemRequest->ItemShape = $this->createResponseShape();
        $findItemRequest->Restriction = $this->createSugarSyncSearchRestriction();

        $findItemRequest->ParentFolderIds = new \EWSType_NonEmptyArrayOfBaseFolderIdsType();
        $findItemRequest->ParentFolderIds->DistinguishedFolderId = new \EWSType_DistinguishedFolderIdType();
        $findItemRequest->ParentFolderIds->DistinguishedFolderId->Id = $callParameters[1];
        
        $findItemRequest->IndexedPageItemView = new \EWSType_IndexedPageViewType();
        $findItemRequest->IndexedPageItemView->BasePoint = 'Beginning';
        $findItemRequest->IndexedPageItemView->Offset = 0;
        $findItemRequest->IndexedPageItemView->MaxEntriesReturned = 2;

        $findItemRequest->Traversal = \EWSType_ItemQueryTraversalType::SHALLOW;
        
        $parameters['impersonatedUser'] = $callParameters[0];
        $parameters['request'] = $findItemRequest;
        return $parameters;        
    }
    
    protected function createResponseShape() {
        
        return $this->createDefaultResponseShape();
    }

    protected function retrieveResults($result) {
        
        $items = array();
        $exchangeItems = $result->ResponseMessages->FindItemResponseMessage->RootFolder->Items->Contact;
        
        $interface = $this;
        $createFunction = function($exchangeObject) use ($interface) {
            return $interface->createModelFromInterfaceData($exchangeObject, 'TRBusinessConnector\Model\ExchangeContact');
        };        
        $contacts = array_map($createFunction, $exchangeItems);        
        
        return $contacts;
        
        if (!is_array($exchangeItems))
            $exchangeItems = array($exchangeItems);
        if (is_array($exchangeItems)) {
            foreach ($exchangeItems as $exchangeItem) {
                $items[$exchangeItem->ExtendedProperty->Value] = $exchangeItem;
            }
        }
        return $items;        
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
    
    protected function createSugarSyncSearchRestriction() {
        
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
        );
        $interface = $this;
        
        $createPathToExtendedField = function($extendedFieldDescription) use ($interface) {
            return $interface->createPathToExtendedField(
                    $extendedFieldDescription['DistinguishedPropertySetId'],
                    $extendedFieldDescription['PropertyName'],
                    $extendedFieldDescription['PropertyType']
                );
        };
        
        $createRestriction = function($pathToExtendedField) {
            $sugarSyncSearchRestriction = new \EWSType_ExistsType();
            $sugarSyncSearchRestriction->ExtendedFieldURI = $pathToExtendedField;
            return $sugarSyncSearchRestriction;
        };

        $pathToExtendedFieldArray = array_map($createPathToExtendedField, $extendedFieldDescriptions);
        $sugarSyncSearchElements = array_map($createRestriction, $pathToExtendedFieldArray);
        $sugarSyncSearchRestriction = new \EWSType_RestrictionType();
        $sugarSyncAndExpression = new \EWSType_AndType();
        $sugarSyncAndExpression->Exists = $sugarSyncSearchElements;
        $sugarSyncSearchRestriction->And = $sugarSyncAndExpression;
        
        return $sugarSyncSearchRestriction;
    }
    
}
