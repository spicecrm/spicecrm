<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class ExchangeContactsBaseFunction extends ExchangeBaseFunction {
    
    protected $api;
    protected $logger;
    protected $exchangeFunctionName = '';
    protected $uriPathSeparator = ':';
        
    protected function createItemChangeObjectFromModel($model, $oldModel = NULL) {
        
        $itemChange = new \EWSType_ItemChangeType();
        
        $modelVardefs = $model->getVardefs();
        $mappings = $this->getModelMappings();
        $modelClass = get_class($model);
        $interfaceDataMap = $mappings[$modelClass];        
        
        $itemId = new \EWSType_ItemIdType();
        $itemId->Id = $model->getExchangeId();
        $itemId->ChangeKey = $model->getChangeKey();

        $itemChange->ItemId = $itemId;
        
        $setItemFields = array();
        $deleteItemFields = array();
        
        
        foreach($interfaceDataMap['Properties'] as $interfaceUri => $mapping) {
            
            $uriArray = explode(":", $interfaceUri);
            $interfaceField = array_pop($uriArray);
            
            $setItemField = new \EWSType_SetItemFieldType();
            $fieldUri = new \EWSType_PathToIndexedFieldType();
            $fieldUri->FieldURI = $interfaceUri;
            $setItemField->FieldURI = $fieldUri;

            $getter = "get" . ucfirst($mapping);            
            
            $contact = new \EWSType_ContactItemType();
            $contact->$interfaceField = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);

            $setItemField->Contact = $contact;
            
            $setItemFields[] = $setItemField;
            
        }
        
        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyMapping) {
            
            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $indexedPropertyMapping['ModelProperty'];
            $getter = "get" . ucfirst($mapping);
            $contactField = $indexedPropertyDefinition['IndexedProperty'];
            $valueKey = $indexedPropertyDefinition['ValueKey'];
                        
            $valueToSync = $model->$getter();
            
            if(!empty($valueToSync)) {
                
                $setItemField = new \EWSType_SetItemFieldType();
                $fieldUri = new \EWSType_PathToIndexedFieldType();
                $fieldUri->FieldURI = $indexedPropertyDefinition['IndexedFieldUri'];
                $fieldUri->FieldIndex = $indexedPropertyDefinition['Key'];
                $setItemField->IndexedFieldURI = $fieldUri;

                $contact = new \EWSType_ContactItemType();
                $entry = new \stdClass();
                $entry->Key = $indexedPropertyDefinition['Key'];
                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
                $contact->$contactField->Entry = $entry;

                $setItemField->Contact = $contact;

                $setItemFields[] = $setItemField;
            } else {
                
                if($mapping === 'email' || $mapping === 'email2') {
                    
                    $deleteItemFields = array_merge($deleteItemFields, $this->createEmailDeleteItems($indexedPropertyDefinition['Key']));
                } else {
                    $deleteItemField = new \EWSType_DeleteItemType();
                    $fieldUri = new \EWSType_PathToIndexedFieldType();
                    $fieldUri->FieldURI = $indexedPropertyDefinition['IndexedFieldUri'];
                    $fieldUri->FieldIndex = $indexedPropertyDefinition['Key'];
                    $deleteItemField->IndexedFieldURI = $fieldUri;

                    $deleteItemFields[] = $deleteItemField;
                    
                }
                
            }
            
        }        
        
        foreach($interfaceDataMap['ExtendedProperties'] as $extendedPropertyMapping) {
                        
            $extendedPropertyDefinition = $extendedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $extendedPropertyMapping['ModelProperty'];
            $getter = "get" . ucfirst($mapping);
            
            $extendedPropery = $this->createExtendedProperty($extendedPropertyDefinition, $model->$getter());
            $extendedFieldUri = clone $extendedPropery->ExtendedFieldURI;
            
            $setItemField = new \EWSType_SetItemFieldType();
            $setItemField->ExtendedFieldURI = $extendedFieldUri;
            
            $contact = new \EWSType_ItemType;
            $contact->ExtendedProperty = $extendedPropery;
            
            $setItemField->Contact = $contact;
            
            $setItemFields[] = $setItemField;            
        }        
        
        $itemChange->Updates->SetItemField = $setItemFields;
        $itemChange->Updates->DeleteItemField = $deleteItemFields;
                
        return $itemChange;
    }    
    
    protected function createItemFromModel($model) {
        
        $contact = new \EWSType_ContactItemType();
        
        $modelVardefs = $model->getVardefs();
        $mappings = $this->getModelMappings();
        $modelClass = get_class($model);
        $interfaceDataMap = $mappings[$modelClass];
        
        foreach($interfaceDataMap['Properties'] as $interfaceUri => $mapping) {

            $uriArray = explode(":", $interfaceUri);
            $interfaceField = array_pop($uriArray);
            $getter = "get" . ucfirst($mapping);
            $contact->$interfaceField = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
        }
        $contact->FileAsMapping = \EWSType_FileAsMappingType::LAST_COMMA_FIRST;
        
        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyMapping) {
            
            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $indexedPropertyMapping['ModelProperty'];
            $getter = "get" . ucfirst($mapping);
            $contactField = $indexedPropertyDefinition['IndexedProperty'];
            $valueKey = $indexedPropertyDefinition['ValueKey'];
                        
            $valueToSync = $model->$getter();
            
            if(!empty($valueToSync)) {
                
                $entry = new \stdClass();
                $entry->Key = $indexedPropertyDefinition['Key'];
                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
                $contact->$contactField->Entry = $entry;
            }
        }        
        
        $extendedProperties = array();
        foreach($interfaceDataMap['ExtendedProperties'] as $extendedPropertyMapping) {
            $extendedPropertyDefinition = $extendedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $extendedPropertyMapping['ModelProperty'];
            $getter = "get" . ucfirst($mapping);
            $extendedProperties[] = $this->createExtendedProperty($extendedPropertyDefinition, $model->$getter());
        }
        $sugarSyncPropertyDescription = array(
                'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                'PropertyType' => \EWSType_MapiPropertyTypeType::BOOLEAN,
                'PropertyName' => 'SugarSYNC',
        );
        $extendedProperties[] = $this->createExtendedProperty($sugarSyncPropertyDescription, true);
        $contact->ExtendedProperty = $extendedProperties;
        
        return $contact;                
    }
    
    
//    protected function createEmailDeleteItems($key) {
//        
//        $emailPropertyDescriptions = array (
//            'EmailAddress1' => array (
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8080,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8082,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8083,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8084,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::BINARY,                
//                    'PropertyId' => 0x8085,
//                ),
//            ),
//            'EmailAddress2' => array (
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8090,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8092,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8093,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x8094,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::BINARY,                
//                    'PropertyId' => 0x8095,
//                ),
//            ),
//            'EmailAddress3' => array (
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x80A0,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x80A2,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x80A3,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
//                    'PropertyId' => 0x80A4,
//                ),
//                array (
//                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
//                    'PropertyType' => \EWSType_MapiPropertyTypeType::BINARY,                
//                    'PropertyId' => 0x80A5,
//                ),
//            ),
//        );
//        
//        $propertyDescriptions = $emailPropertyDescriptions[$key];
//        if($propertyDescriptions) {
//            $deleteItems = array();
//            foreach($propertyDescriptions as $description) {
//                
//                $deleteItem = new \EWSType_DeleteItemType();
//                $extendedFieldUri = $this->createExtendedFieldUri($description);
//                $deleteItem->ExtendedFieldURI = $extendedFieldUri;
//                $deleteItems[] = $deleteItem;
//            }
//            return $deleteItems;
//        } else {
//            return array();
//        }
//    }
//    
//    protected function getContactUpdateModelMapping() {
//        
//        $specificMapping = array();
//        $fullMapping = $this->mergeMappings($this->getContactBaseToExchangeMapping(), $specificMapping);
//        return $fullMapping;
//    }
//    
//    protected function getContactCreateModelMapping() {
//        
//        $specificMapping = array(
//            'ExtendedProperties' => array (
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarGUID',
//                    ),
//                    'ModelProperty' => 'sugarId'
//                ),
//            )
//        );
//        $fullMapping = $this->mergeMappings($this->getContactBaseToExchangeMapping(), $specificMapping);
//        return $fullMapping;
//    }
//    
//    protected function getContactBaseToExchangeMapping() {
//
//        $mapping = array(
//            'Properties' => array (
//                // Exchange Path => Property
//                'contacts:GivenName' => 'firstName',
//                'contacts:Surname' => 'lastName', 
//                'contacts:CompanyName' => 'accountName',
//                
//            ),
//            'IndexedProperties' => array (
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'IndexedFieldUri' =>  "contacts:EmailAddress",
//                        'Key' => \EWSType_EmailAddressKeyType::EMAIL_ADDRESS_1,
//                        'IndexedProperty' => 'EmailAddresses',
//                        'ValueKey' => '_'
//                    ),
//                    'ModelProperty' => 'email'                    
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'IndexedFieldUri' =>  "contacts:EmailAddress",
//                        'Key' => \EWSType_EmailAddressKeyType::EMAIL_ADDRESS_2,
//                        'IndexedProperty' => 'EmailAddresses',
//                        'ValueKey' => '_'
//                    ),
//                    'ModelProperty' => 'email2'                    
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
//                        'Key' => \EWSType_PhoneNumberKeyType::BUSINESS_PHONE,
//                        'IndexedProperty' => 'PhoneNumbers',
//                        'ValueKey' => '_'
//                    ),
//                    'ModelProperty' => 'phoneWork'                    
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
//                        'Key' => \EWSType_PhoneNumberKeyType::MOBILE_PHONE,
//                        'IndexedProperty' => 'PhoneNumbers',
//                        'ValueKey' => '_'
//                    ),
//                    'ModelProperty' => 'phoneMobile'  
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
//                        'Key' => \EWSType_PhoneNumberKeyType::HOME_PHONE,
//                        'IndexedProperty' => 'PhoneNumbers',
//                        'ValueKey' => '_'
//                    ),
//                    'ModelProperty' => 'phoneHome'  
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
//                        'Key' => \EWSType_PhoneNumberKeyType::OTHER_PHONE,
//                        'IndexedProperty' => 'PhoneNumbers',
//                        'ValueKey' => '_'
//                    ),
//                    'ModelProperty' => 'phoneOther'  
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
//                        'Key' => \EWSType_PhoneNumberKeyType::BUSINESS_FAX,
//                        'IndexedProperty' => 'PhoneNumbers',
//                        'ValueKey' => '_'
//                    ),
//                    'ModelProperty' => 'phoneFax'  
//                ),                
//            ),
//            'ExtendedProperties' => array (
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'PropertyTag' =>  "0x3A45",
//                        'PropertyType' => "String"                                                
//                    ),
//                    'ModelProperty' => 'title'
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarAccountName',
//                    ),
//                    'ModelProperty' => 'accountName'
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarAccountID',
//                    ),
//                    'ModelProperty' => 'accountId'
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarOwnerID',
//                    ),
//                    'ModelProperty' => 'assignedUserId'
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarOwnerName',
//                    ),
//                    'ModelProperty' => 'assignedUserName'
//                ),
//            )
//        );
//        return $mapping;
//        
//        
//    }
    
}
