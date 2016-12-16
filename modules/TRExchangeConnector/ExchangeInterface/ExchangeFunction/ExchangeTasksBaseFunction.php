<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class ExchangeTasksBaseFunction extends ExchangeBaseFunction {
    
    protected $api;
    protected $logger;
    protected $exchangeFunctionName = '';
    protected $uriPathSeparator = ':';
        
//    protected function createItemChangeObjectFromModel($model) {
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
//                $task = new \EWSType_TaskType();
//                $task->$interfaceField = $syncValue;
//
//                $setItemField->Task = $task;
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
//            $task = new \EWSType_TaskType();
//            $task->$interfaceField = $body;
//
//            $setItemField->Task = $task;
//            
//            $setItemFields[] = $setItemField;            
//        }
//        
//        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyMapping) {
//            
//            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
//            $mapping = $indexedPropertyMapping['ModelProperty'];
//            $getter = "get" . ucfirst($mapping);
//            $taskField = $indexedPropertyDefinition['IndexedProperty'];
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
//                $task = new \EWSType_TaskType();
//                $entry = new \stdClass();
//                $entry->Key = $indexedPropertyDefinition['Key'];
//                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
//                $task->$taskField->Entry = $entry;
//
//                $setItemField->Task = $task;
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
//            $task = new \EWSType_ItemType;
//            $task->ExtendedProperty = $extendedPropery;
//            
//            $setItemField->Task = $task;
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
//        return $this->createGenericItemFromModel($this->modelClass, $model);
//        
//        $item = new \EWSType_TaskType();
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
//        $body = new \EWSType_BodyType();
//        $body->_ = $model->getDescription();
//        $body->BodyType = \EWSType_BodyTypeType::TEXT;
//        $item->Body = $body;
//        return $item;                
//    }    
}
