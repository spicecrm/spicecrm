<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class ExchangeCalendarItemBaseFunction extends ExchangeBaseFunction {
    
    protected $api;
    protected $logger;
    protected $exchangeFunctionName = '';
    protected $uriPathSeparator = ':';
        
//    protected function createItemChangeObjectFromModel($model) {
//        
//        $itemClass = 'EWSType_CalendarItemType';
//        $itemExchangeProperty = 'CalendarItem';
//        
//        $itemChange = new \EWSType_ItemChangeType();
//        
//        $modelVardefs = $model->getVardefs();
//        $mappings = $this->getModelMappings();
//        $modelClass = get_class($model);
//        $interfaceDataMap = $mappings[$modelClass];        
//        
//        $itemId = new \EWSType_ItemIdType();
//        $itemId->Id = $model->getExchangeId();
//        $itemId->ChangeKey = $model->getChangeKey();
//
//        $itemChange->ItemId = $itemId;
//        
//        $setItemFields = array();
//        $deleteItemFields = array();
//        
//        
//        foreach($interfaceDataMap['Properties'] as $interfaceUri => $mapping) {
//            
//            $getter = "get" . ucfirst($mapping);
//            $syncValue = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
//            
//            $uriArray = explode(":", $interfaceUri);
//            $interfaceField = array_pop($uriArray);
//            
//            $fieldUri = new \EWSType_PathToUnindexedFieldType();
//            $fieldUri->FieldURI = $interfaceUri;            
//            
//            if($syncValue) {
//            
//                $setItemField = new \EWSType_SetItemFieldType();
//                $setItemField->FieldURI = $fieldUri;
//
//                $item = new $itemClass();
//                $item->$interfaceField = $syncValue;
//
//                $setItemField->$itemExchangeProperty = $item;
//
//                $setItemFields[] = $setItemField;
//            } else {
//                
//                $deleteItemField = new \stdClass();
//                $deleteItemField->FieldURI = $fieldUri;
//
//                $deleteItemFields[] = $deleteItemField;
//            }
//            
//        }
//        
//        foreach($interfaceDataMap['BodyProperties'] as $interfaceUri => $mapping) {
//            
//            $uriArray = explode(":", $interfaceUri);
//            $interfaceField = array_pop($uriArray);
//            
//            $setItemField = new \EWSType_SetItemFieldType();
//            $fieldUri = new \EWSType_PathToIndexedFieldType();
//            $fieldUri->FieldURI = $interfaceUri;
//            $setItemField->FieldURI = $fieldUri;
//
//            $getter = "get" . ucfirst($mapping);            
//            
//            $body = new \EWSType_BodyType();
//            $body->_ = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
//            $body->BodyType = \EWSType_BodyTypeType::TEXT;
//            
//            $item = new $itemClass();
//            $item->$interfaceField = $body;
//
//            $setItemField->$itemExchangeProperty = $item;
//            
//            $setItemFields[] = $setItemField;            
//        }
//        
//        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyMapping) {
//            
//            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
//            $mapping = $indexedPropertyMapping['ModelProperty'];
//            $getter = "get" . ucfirst($mapping);
//            $itemField = $indexedPropertyDefinition['IndexedProperty'];
//            $valueKey = $indexedPropertyDefinition['ValueKey'];
//                        
//            $valueToSync = $model->$getter();
//            
//            if(!empty($valueToSync)) {
//                
//                $setItemField = new \EWSType_SetItemFieldType();
//                $fieldUri = new \EWSType_PathToIndexedFieldType();
//                $fieldUri->FieldURI = $indexedPropertyDefinition['IndexedFieldUri'];
//                $fieldUri->FieldIndex = $indexedPropertyDefinition['Key'];
//                $setItemField->IndexedFieldURI = $fieldUri;
//
//                $item = new $itemClass();
//                $entry = new \stdClass();
//                $entry->Key = $indexedPropertyDefinition['Key'];
//                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
//                $item>$itemField->Entry = $entry;
//
//                $setItemField->$itemExchangeProperty = $item;
//
//                $setItemFields[] = $setItemField;
//            } else {
//                
//                $deleteItemField = new \EWSType_DeleteItemType();
//                $fieldUri = new \EWSType_PathToIndexedFieldType();
//                $fieldUri->FieldURI = $indexedPropertyDefinition['IndexedFieldUri'];
//                $fieldUri->FieldIndex = $indexedPropertyDefinition['Key'];
//                $deleteItemField->IndexedFieldURI = $fieldUri;
//
//                $deleteItemFields[] = $deleteItemField;
//            }
//            
//        }        
//        
//        foreach($interfaceDataMap['ExtendedProperties'] as $extendedPropertyMapping) {
//                        
//            $extendedPropertyDefinition = $extendedPropertyMapping['ExchangePropertyDescription'];
//            $mapping = $extendedPropertyMapping['ModelProperty'];
//            $getter = "get" . ucfirst($mapping);
//            
//            $extendedPropery = $this->createExtendedProperty($extendedPropertyDefinition, $model->$getter());
//            $extendedFieldUri = clone $extendedPropery->ExtendedFieldURI;
//            
//            $setItemField = new \EWSType_SetItemFieldType();
//            $setItemField->ExtendedFieldURI = $extendedFieldUri;
//            
//            $item = new \EWSType_ItemType;
//            $item->ExtendedProperty = $extendedPropery;
//            
//            $setItemField->$itemExchangeProperty = $item;
//            
//            $setItemFields[] = $setItemField;            
//        }        
//        
//        $itemChange->Updates->SetItemField = $setItemFields;
//        $itemChange->Updates->DeleteItemField = $deleteItemFields;
//                
//        return $itemChange;
//    }    
//    
//    public function createItemFromModel($model) {
//        
//        $item = new \EWSType_CalendarItemType();
//        
//        $modelVardefs = $model->getVardefs();
//        $mappings = $this->getModelMappings();
//        $modelClass = get_class($model);
//        $interfaceDataMap = $mappings[$modelClass];
//        
//        foreach($interfaceDataMap['Properties'] as $interfaceUri => $mapping) {
//
//            $uriArray = explode(":", $interfaceUri);
//            $interfaceField = array_pop($uriArray);
//            $getter = "get" . ucfirst($mapping);
//            $item->$interfaceField = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
//        }
//        
//        foreach($interfaceDataMap['BodyProperties'] as $interfaceUri => $mapping) {
//            
//            $uriArray = explode(":", $interfaceUri);
//            $interfaceField = array_pop($uriArray);
//            $getter = "get" . ucfirst($mapping);            
//            
//            $body = new \EWSType_BodyType();
//            $body->_ = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
//            $body->BodyType = \EWSType_BodyTypeType::TEXT;
//            
//            $item->$interfaceField = $body;
//        }
//        
//        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyMapping) {
//            
//            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
//            $mapping = $indexedPropertyMapping['ModelProperty'];
//            $getter = "get" . ucfirst($mapping);
//            $itemField = $indexedPropertyDefinition['IndexedProperty'];
//            $valueKey = $indexedPropertyDefinition['ValueKey'];
//                        
//            $valueToSync = $model->$getter();
//            
//            if(!empty($valueToSync)) {
//                
//                $entry = new \stdClass();
//                $entry->Key = $indexedPropertyDefinition['Key'];
//                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
//                $item->$itemField->Entry = $entry;
//            }
//        }        
//        
//        $extendedProperties = array();
//        foreach($interfaceDataMap['ExtendedProperties'] as $extendedPropertyMapping) {
//            $extendedPropertyDefinition = $extendedPropertyMapping['ExchangePropertyDescription'];
//            $mapping = $extendedPropertyMapping['ModelProperty'];
//            $getter = "get" . ucfirst($mapping);
//            $extendedProperties[] = $this->createExtendedProperty($extendedPropertyDefinition, $model->$getter());
//        }
//        $sugarSyncPropertyDescription = array(
//                'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                'PropertyType' => \EWSType_MapiPropertyTypeType::BOOLEAN,
//                'PropertyName' => 'SugarSYNC',
//        );
//        $extendedProperties[] = $this->createExtendedProperty($sugarSyncPropertyDescription, true);
//        $item->ExtendedProperty = $extendedProperties;
//        
//        return $item;                
//    }
//    
//    
//    protected function getCalendarItemUpdateModelMapping() {
//        
//        $specificMapping = array();
//        $fullMapping = $this->mergeMappings($this->getCalendarItemBaseToExchangeMapping(), $specificMapping);
//        return $fullMapping;
//    }
//    
//    protected function getCalendarItemCreateModelMapping() {
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
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarType',
//                    ),
//                    'ModelProperty' => 'sugarType'
//                ),
//            )
//        );
//        $fullMapping = $this->mergeMappings($this->getCalendarItemBaseToExchangeMapping(), $specificMapping);
//        return $fullMapping;
//    }
//    
//    protected function getCalendarItemBaseToExchangeMapping() {
//
//        $mapping = array(
//            'Properties' => array (
//                // Exchange Path => Property
//                'item:Subject' => 'name',
//                'calendar:Start' => 'dateStart',
//                'calendar:End' => 'dateEnd',
////                'item:Importance' => 'importance',
////                'task:Status' => 'exchangeStatus',
//            ),
//            'BodyProperties' => array (
//                // Exchange Path => Property
//                'item:Body' => 'description',
//            ),
//            'IndexedProperties' => array (
//            ),
//            'ExtendedProperties' => array (
////                array (
////                    'ExchangePropertyDescription' => array (
////                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
////                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
////                        'PropertyName' => 'SugarAccountName',
////                    ),
////                    'ModelProperty' => 'accountName'
////                ),
////                array (
////                    'ExchangePropertyDescription' => array (
////                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
////                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
////                        'PropertyName' => 'SugarAccountID',
////                    ),
////                    'ModelProperty' => 'accountId'
////                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarAssignedUserID',
//                    ),
//                    'ModelProperty' => 'assignedUserId'
//                ),
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarAssignedUserName',
//                    ),
//                    'ModelProperty' => 'assignedUserName'
//                ),
//            )
//        );
//        return $mapping;
//        
//        
//    }
//    
//    protected function getCalendarItemRetrieveMapping() {
//
//        $mapping = array(
//            'Properties' => array (
//                // Exchange Path => Property
//                'Subject' => 'name',
//                'Body:_' => 'description',
//                'Start' => 'dateStart',
//                'End' => 'dateEnd',
////                'Importance' => 'importance',
////                'Status' => 'exchangeStatus',
//            ),
//            'IndexedProperties' => array (
//            ),
//            'ExtendedProperties' => array (
//                // Exchange Path => Property
//                'PublicStrings:SugarGUID' => 'sugarId',
//                'PublicStrings:SugarSYNC' => 'sugarSync',
//                'PublicStrings:SugarParentID' => 'accountId',
//                'PublicStrings:SugarParentName' => 'accountName',
//                'PublicStrings:SugarAssignedUserID' => 'assignedUserId',
//                'PublicStrings:SugarAssignedUserName' => 'assignedUserName',
//                'PublicStrings:SugarType' => 'sugarType',
//            )            
//        );
//        return $mapping;
//    }
//    
//    protected function createDefaultResponseShape() {
//        
//        $extendedFieldDescriptions = array(
//            array (
//                'DistinguishedPropertySetId' => 'PublicStrings',
//                'PropertyName' => 'SugarGUID',
//                'PropertyType' => 'String'
//            ),
//            array (
//                'DistinguishedPropertySetId' => 'PublicStrings',
//                'PropertyName' => 'SugarSYNC',
//                'PropertyType' => 'Boolean'
//            ),
//            array (
//                'DistinguishedPropertySetId' => 'PublicStrings',
//                'PropertyName' => 'SugarParentName',
//                'PropertyType' => 'String'
//            ),
//            array (
//                'DistinguishedPropertySetId' => 'PublicStrings',
//                'PropertyName' => 'SugarParentID',
//                'PropertyType' => 'String'
//            ),
//            array (
//                'DistinguishedPropertySetId' => 'PublicStrings',
//                'PropertyName' => 'SugarAssignedUserID',
//                'PropertyType' => 'String'
//            ),
//            array (
//                'DistinguishedPropertySetId' => 'PublicStrings',
//                'PropertyName' => 'SugarAssignedUserName',
//                'PropertyType' => 'String'
//            ),
//            array (
//                'DistinguishedPropertySetId' => 'PublicStrings',
//                'PropertyName' => 'SugarType',
//                'PropertyType' => 'String'
//            ),
//        );
//
//        $responseShape = new \EWSType_ItemResponseShapeType();
//        
//        $responseShape->BaseShape = \EWSType_DefaultShapeNamesType::ALL_PROPERTIES;
//        
//        $interface = $this;
//        $createPathToExtendedField = function($extendedFieldDescription) use ($interface) {
//            return $interface->createPathToExtendedField(
//                    $extendedFieldDescription['DistinguishedPropertySetId'],
//                    $extendedFieldDescription['PropertyName'],
//                    $extendedFieldDescription['PropertyType']
//                );
//        };
//        
//        $responseShape->AdditionalProperties->ExtendedFieldURI = array_map($createPathToExtendedField, $extendedFieldDescriptions);
//                
//        $modifiedDate = new \EWSType_PathToUnindexedFieldType();
//        $modifiedDate->FieldURI = "item:LastModifiedTime";
//        
//        $modifiedUser = new \EWSType_PathToUnindexedFieldType();
//        $modifiedUser->FieldURI = "item:LastModifiedName";
//        
//        $responseShape->AdditionalProperties->FieldURI = array(
//            $modifiedDate,
//            $modifiedUser
//        );
//        
//        $responseShape->BodyType = \EWSType_BodyTypeType::TEXT;
//        return $responseShape;
//    }
    
}
