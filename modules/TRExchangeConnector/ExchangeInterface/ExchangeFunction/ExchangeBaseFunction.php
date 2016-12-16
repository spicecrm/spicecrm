<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class ExchangeBaseFunction extends \TRBusinessConnector\InterfaceFunction\BaseFunction {
    
    protected $api;
    protected $logger;
    protected $exchangeFunctionName = '';
    protected $uriPathSeparator = ':';
    
    public function __construct($api, $formatConverter = null, $logger = null, $injectedProperties = array()) {
        parent::__construct($formatConverter);
        $this->api = $api;
        $this->logger = $logger;
        $this->injectProperties($injectedProperties);
    }
    
    protected function injectProperties($injectedProperties) {
        
        if(!is_array($injectedProperties)) return;
        
        $classVars = get_class_vars(get_class($this));
        foreach($injectedProperties as $property => $value) {
            if(array_key_exists($property, $classVars)) {
                $this->$property = $value;
            }
        }
    }
    
    public function call($callParameters) {
        
        $parameters = $this->createParameters($callParameters);
        if(!empty($parameters['impersonatedUser'])) {
            $this->api->setImpersonation($parameters['impersonatedUser']);
        }
        $this->logger->debug('Calling Exchange funtion ' . $this->exchangeFunctionName . 'with parameters:', get_object_vars($parameters['request']));
        $result = $this->api->callFunction($this->exchangeFunctionName, $parameters['request']);
        $this->logger->debug('Call of Exchange funtion ' . $this->exchangeFunctionName . 'returned following result:', get_object_vars($result));
        $errors = $this->retrieveErrors($result);
        if(!empty($errors)) {
            throw new \TRBusinessConnector\Exception\SapException("Error in " . $this->sapFunctionName, $errors);
        } else {
            return $this->retrieveResults($result);
        }
    }
    
    protected function createParameters($callParameters) {
        return null;
    }
    
    protected function retrieveErrors($result) {
        return null;
    }
    
    protected function retrieveResults($result) {
        return null;
    }
    
    public function createGenericItemFromModel($itemClass, $model, $exchangeItemCreatedCallback = null) {
        
        $item = new $itemClass();
        
        $modelVardefs = $model->getVardefs();
        $mappings = $this->getModelMappings();
        $modelClass = get_class($model);
        $interfaceDataMap = $mappings[$modelClass];
        
        foreach($interfaceDataMap['Properties'] as $interfaceUri => $mapping) {

            $uriArray = explode(":", $interfaceUri);
            $interfaceField = array_pop($uriArray);
            $getter = "get" . ucfirst($mapping);
            $item->$interfaceField = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
        }

        foreach($interfaceDataMap['BodyProperties'] as $interfaceUri => $mapping) {
            
            $uriArray = explode(":", $interfaceUri);
            $interfaceField = array_pop($uriArray);
            $getter = "get" . ucfirst($mapping);            
            
            $body = new \EWSType_BodyType();
            $body->_ = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
            $body->BodyType = \EWSType_BodyTypeType::TEXT;
            
            $item->$interfaceField = $body;
        }
        
        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyMapping) {
            
            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $indexedPropertyMapping['ModelProperty'];
            $getter = "get" . ucfirst($mapping);
            $itemField = $indexedPropertyDefinition['IndexedProperty'];
            $valueKey = $indexedPropertyDefinition['ValueKey'];
                        
            $valueToSync = $model->$getter();
            
            if(!empty($valueToSync)) {
                
                $entry = new \stdClass();
                $entry->Key = $indexedPropertyDefinition['Key'];
                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
                $item->$itemField->Entry[] = $entry;                
            }
        }        
        
        foreach($interfaceDataMap['AddressProperties'] as $addressPropertyMapping) {
            
            $addressPropertyDefinition = $addressPropertyMapping['ExchangePropertyDescription'];
            
            $itemField = $addressPropertyDefinition['IndexedProperty'];
            
            $entry = new \stdClass();
            $entry->Key = $addressPropertyDefinition['Key'];
            
            foreach($addressPropertyMapping['ValueKeyMapping'] as $valueKey => $modelProperty) {
                
                $getter = "get" . ucfirst($modelProperty);                    
                $valueToSync = $model->$getter();
                
                if(!empty($valueToSync)) {
                    $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$modelProperty]['type']);
                }
            }
            
            $item->$itemField->Entry[] = $entry;
        }        
        
        foreach($interfaceDataMap['EmailProperties'] as $indexedPropertyMapping) {
            
            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $indexedPropertyMapping['ModelProperty'];
            $getter = "get" . ucfirst($mapping);
            $itemField = $indexedPropertyDefinition['IndexedProperty'];
            $valueKey = $indexedPropertyDefinition['ValueKey'];
                        
            $valueToSync = $model->$getter();
            
            if(!empty($valueToSync)) {
                
                $entry = new \stdClass();
                $entry->Key = $indexedPropertyDefinition['Key'];
                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
                $item->$itemField->Entry = $entry;
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
        $item->ExtendedProperty = $extendedProperties;
        
        if(is_callable($exchangeItemCreatedCallback)) {
            $exchangeItemCreatedCallback($item);
        }
        
        return $item;
    }
    
    protected function createItemIdFromModel($model) {
        
        $itemId = new \EWSType_ItemIdType();
        $itemId->Id = $model->getExchangeId();
        $itemId->ChangeKey = $model->getChangeKey();
        return $itemId;
    }
    
    protected function createGenericItemChangeObjectFromModel($itemClass, $itemExchangeProperty, $model) {
        
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
            
            $getter = "get" . ucfirst($mapping);
            $syncValue = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
            
            $uriArray = explode(":", $interfaceUri);
            $interfaceField = array_pop($uriArray);
            
            $fieldUri = new \EWSType_PathToUnindexedFieldType();
            $fieldUri->FieldURI = $interfaceUri;            
            
            if($syncValue) {
            
                $setItemField = new \EWSType_SetItemFieldType();
                $setItemField->FieldURI = $fieldUri;

                $item = new $itemClass();
                $item->$interfaceField = $syncValue;

                $setItemField->$itemExchangeProperty = $item;

                $setItemFields[] = $setItemField;
            } else {
                
                $deleteItemField = new \stdClass();
                $deleteItemField->FieldURI = $fieldUri;

                $deleteItemFields[] = $deleteItemField;
            }
            
        }
        
        foreach($interfaceDataMap['BodyProperties'] as $interfaceUri => $mapping) {
            
            $uriArray = explode(":", $interfaceUri);
            $interfaceField = array_pop($uriArray);
            
            $setItemField = new \EWSType_SetItemFieldType();
            $fieldUri = new \EWSType_PathToIndexedFieldType();
            $fieldUri->FieldURI = $interfaceUri;
            $setItemField->FieldURI = $fieldUri;

            $getter = "get" . ucfirst($mapping);            
            
            $body = new \EWSType_BodyType();
            $body->_ = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
            $body->BodyType = \EWSType_BodyTypeType::TEXT;
            
            $item = new $itemClass();
            $item->$interfaceField = $body;

            $setItemField->$itemExchangeProperty = $item;
            
            $setItemFields[] = $setItemField;            
        }
        
        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyMapping) {
            
            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $indexedPropertyMapping['ModelProperty'];
            $getter = "get" . ucfirst($mapping);
            $itemField = $indexedPropertyDefinition['IndexedProperty'];
            $valueKey = $indexedPropertyDefinition['ValueKey'];
                        
            $valueToSync = $model->$getter();
            
            if(!empty($valueToSync)) {
                
                $setItemField = new \EWSType_SetItemFieldType();
                $fieldUri = new \EWSType_PathToIndexedFieldType();
                $fieldUri->FieldURI = $indexedPropertyDefinition['IndexedFieldUri'];
                $fieldUri->FieldIndex = $indexedPropertyDefinition['Key'];
                $setItemField->IndexedFieldURI = $fieldUri;

                $item = new $itemClass();
                $entry = new \stdClass();
                $entry->Key = $indexedPropertyDefinition['Key'];
                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
                $item->$itemField->Entry = $entry;

                $setItemField->$itemExchangeProperty = $item;

                $setItemFields[] = $setItemField;
            } else {
                
                $deleteItemField = new \EWSType_DeleteItemType();
                $fieldUri = new \EWSType_PathToIndexedFieldType();
                $fieldUri->FieldURI = $indexedPropertyDefinition['IndexedFieldUri'];
                $fieldUri->FieldIndex = $indexedPropertyDefinition['Key'];
                $deleteItemField->IndexedFieldURI = $fieldUri;

                $deleteItemFields[] = $deleteItemField;
            }
            
        }        
        
        foreach($interfaceDataMap['AddressProperties'] as $addressPropertyMapping) {
            
            $addressPropertyDefinition = $addressPropertyMapping['ExchangePropertyDescription'];
            $itemField = $addressPropertyDefinition['IndexedProperty'];
            
            foreach($addressPropertyMapping['ValueKeyMapping'] as $valueKey => $modelProperty) {
                
                $getter = "get" . ucfirst($modelProperty);
                $valueToSync = $model->$getter();
                
                if(!empty($valueToSync)) {                
                
                    $setItemField = new \EWSType_SetItemFieldType();
                    $fieldUri = new \EWSType_PathToIndexedFieldType();
                    $fieldUri->FieldURI = $addressPropertyDefinition['IndexedFieldUri'] . ':' . $valueKey;
                    $fieldUri->FieldIndex = $addressPropertyDefinition['Key'];
                    $setItemField->IndexedFieldURI = $fieldUri;

                    $item = new $itemClass();
                    $entry = new \stdClass();
                    $entry->Key = $addressPropertyDefinition['Key'];
                    $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$modelProperty]['type']);
                    $item->$itemField->Entry = $entry;

                    $setItemField->$itemExchangeProperty = $item;

                    $setItemFields[] = $setItemField;
                    
                } else {
                    
                    $deleteItemField = new \EWSType_DeleteItemType();
                    $fieldUri = new \EWSType_PathToIndexedFieldType();
                    $fieldUri->FieldURI = $addressPropertyDefinition['IndexedFieldUri'] . ':' . $valueKey;
                    $fieldUri->FieldIndex = $addressPropertyDefinition['Key'];
                    $deleteItemField->IndexedFieldURI = $fieldUri;

                    $deleteItemFields[] = $deleteItemField;                    
                }
            }
        }        
        
        foreach($interfaceDataMap['EmailProperties'] as $indexedPropertyMapping) {
            
            $indexedPropertyDefinition = $indexedPropertyMapping['ExchangePropertyDescription'];
            $mapping = $indexedPropertyMapping['ModelProperty'];
            $nameMapping = $mapping . 'DisplayName';
            $getter = "get" . ucfirst($mapping);
            $nameGetter = "get" . ucfirst($nameMapping);
            $itemField = $indexedPropertyDefinition['IndexedProperty'];
            $valueKey = $indexedPropertyDefinition['ValueKey'];
                        
            $valueToSync = $model->$getter();
            $displayNameToSync = $model->$nameGetter();
            
            if(!empty($valueToSync)) {
                
                $setItemField = new \EWSType_SetItemFieldType();
                $fieldUri = new \EWSType_PathToIndexedFieldType();
                $fieldUri->FieldURI = $indexedPropertyDefinition['IndexedFieldUri'];
                $fieldUri->FieldIndex = $indexedPropertyDefinition['Key'];
                $setItemField->IndexedFieldURI = $fieldUri;

                $item = new $itemClass();
                $entry = new \stdClass();
                $entry->Key = $indexedPropertyDefinition['Key'];
                $entry->$valueKey = $this->convertValueToInterface($valueToSync, $modelVardefs[$mapping]['type']);
                if(!empty($displayNameToSync)) {
                    $entry->Name = $this->convertValueToInterface($displayNameToSync, $modelVardefs[$nameMapping]['type']);                    
                }
                $item->$itemField->Entry = $entry;

                $setItemField->$itemExchangeProperty = $item;

                $setItemFields[] = $setItemField;
            } else {
                
                $deleteItemFields = array_merge($deleteItemFields, $this->createEmailDeleteItems($indexedPropertyDefinition['Key']));
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
            
            $item = new \EWSType_ItemType;
            $item->ExtendedProperty = $extendedPropery;
            
            $setItemField->$itemExchangeProperty = $item;
            
            $setItemFields[] = $setItemField;            
        }        
        
        $itemChange->Updates->SetItemField = $setItemFields;
        $itemChange->Updates->DeleteItemField = $deleteItemFields;
                
        return $itemChange;
    }    
    
    
    /**
     * 
     * @param \EWSType_ItemIdType $itemId
     * @params sting $modelClass
     */
    public function createModelFromItemId($itemId, $modelClass) {
        
        /* @var $model \TRBusinessConnector\Model\ExchangeBaseModel */
        $model = new $modelClass();
        $model->setExchangeId($itemId->Id);
        $model->setChangeKey($itemId->ChangeKey);
        return $model;
    }
    
    protected function getPropertyValueByUri($exchangeObject, $uri) {
        
        $path = explode($this->uriPathSeparator, $uri);
        if(count($path) === 0) {
            return null;
        }
        $field = array_shift($path);
        if(!isset($exchangeObject->$field)) {
            return NULL;
        }        
        if(count($path) === 0) {
            return $exchangeObject->$field;
        } else {
            return $this->{__FUNCTION__}($exchangeObject->$field, implode($this->uriPathSeparator,$path));
        }        
    }
    
    protected function getIndexedPropertyValueByUri($exchangeObject, $indexedPropertyDefinition) {
        
        $field = $indexedPropertyDefinition['IndexedProperty'];
        $indexedPropertyEntries = $exchangeObject->$field->Entry;
        if(!$indexedPropertyEntries) {
            $indexedPropertyEntries = array();
        } elseif(!is_array($indexedPropertyEntries)) {
            $indexedPropertyEntries = array($indexedPropertyEntries);
        }
        foreach($indexedPropertyEntries as $entry) {
            if($entry->Key === $indexedPropertyDefinition['Key']) {
                $valueProperty = $indexedPropertyDefinition['ValueKey'];
                if(isset($entry->$valueProperty)) {
                    return $entry->$valueProperty;
                } else {
                    return NULL;
                }
            }
        }
        return NULL;
    } 
    
    protected function getExtendedPropertyValue($exchangeObject, $uri) {
        
        if(!isset($exchangeObject->ExtendedProperty)) {
            return NULL;
        }
        
        list($distinguishedPropertySetId, $propertyName) = explode($this->uriPathSeparator, $uri);
        
        if(empty($distinguishedPropertySetId) || empty($propertyName)) {
            return NULL;
        }
        
        $findProperty = function($property) use($distinguishedPropertySetId, $propertyName) {
            return $property->ExtendedFieldURI->DistinguishedPropertySetId === $distinguishedPropertySetId &&  $property->ExtendedFieldURI->PropertyName === $propertyName;
        };
        
        if(!is_array($exchangeObject->ExtendedProperty)) {
            $extendendProperties = array($exchangeObject->ExtendedProperty);
        } else {
            $extendendProperties = $exchangeObject->ExtendedProperty;
        }
        
        $matchedProperties = array_filter($extendendProperties, $findProperty);
        if($matchedProperties) {
            $matchedProperty = reset($matchedProperties);
            return $matchedProperty->Value;
        } else {
            return NULL;
        }
    }    
    
    
    
    public function createModelFromInterfaceData($interfaceData, $modelClass) {

        $model = new $modelClass();
        $modelVardefs = $model->getVardefs();
        $mappings = $this->getModelMappings();
        $interfaceDataMap = $mappings[$modelClass];
        
        $model->setExchangeId($interfaceData->ItemId->Id);
        $model->setChangeKey($interfaceData->ItemId->ChangeKey);
        
        foreach($interfaceDataMap['Properties'] as $interfaceField => $mapping) {
            $setter = "set" . ucfirst($mapping);
            $model->{$setter}($this->convertValueFromInterface($this->getPropertyValueByUri($interfaceData, $interfaceField), $modelVardefs[$mapping]['type']));
        }
        foreach($interfaceDataMap['IndexedProperties'] as $indexedPropertyDefinition/*$interfaceField => $mapping*/) {
            $mapping = $indexedPropertyDefinition['ModelProperty'];            
            $setter = "set" . ucfirst($mapping);
            $exchangePropertyDescription = $indexedPropertyDefinition['ExchangePropertyDescription'];
            $model->{$setter}($this->convertValueFromInterface($this->getIndexedPropertyValueByUri($interfaceData, $exchangePropertyDescription), $modelVardefs[$mapping]['type']));
        }        
        foreach($interfaceDataMap['ExtendedProperties'] as $interfaceField => $mapping) {
            $setter = "set" . ucfirst($mapping);
            $model->{$setter}($this->convertValueFromInterface($this->getExtendedPropertyValue($interfaceData, $interfaceField), $modelVardefs[$mapping]['type']));
        }
        
        return $model;        
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
        );

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
    
    protected function createSyncFolderResponseShape() {
        
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
        
        
        $responseShape = new \EWSType_ItemResponseShapeType();
        
        $responseShape->BaseShape = \EWSType_DefaultShapeNamesType::ID_ONLY;
        
        $interface = $this;
        $createPathToExtendedField = function($extendedFieldDescription) use ($interface) {
            return $interface->createPathToExtendedField(
                    $extendedFieldDescription['DistinguishedPropertySetId'],
                    $extendedFieldDescription['PropertyName'],
                    $extendedFieldDescription['PropertyType']
                );
        };
        
        $responseShape->AdditionalProperties->ExtendedFieldURI = array_map($createPathToExtendedField, $extendedFieldDescriptions);
        return $responseShape;
    }
    
    public function createPathToExtendedField($distinguishedPropertySetId, $propertyName, $propertyType) {

        $pathToExtendedField = new \EWSType_PathToExtendedFieldType();
        $pathToExtendedField->DistinguishedPropertySetId = $distinguishedPropertySetId;
        $pathToExtendedField->PropertyName = $propertyName;
        $pathToExtendedField->PropertyType = $propertyType;
        return $pathToExtendedField;
        
    }

    
    protected function createExtendedProperty($propertyDescription, $value) {
        
        $extendedProperty = new \EWSType_ExtendedPropertyType();
        $extendedProperty->ExtendedFieldURI = $this->createExtendedFieldUri($propertyDescription);
        $extendedProperty->Value = (null === $value ? '' : $value);
        return $extendedProperty;
    }

    
    protected function createExtendedFieldUri($propertyDescription) {
        
        $pathToExtendedField = new \EWSType_PathToExtendedFieldType();
        foreach($propertyDescription as $propertyField => $propertyFieldValue) {
            $pathToExtendedField->$propertyField = $propertyFieldValue;
        }
        return $pathToExtendedField;
    }
    
    
    protected function createEmailDeleteItems($key) {
        
        $emailPropertyDescriptions = array (
            'EmailAddress1' => array (
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8080,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8082,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8083,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8084,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::BINARY,                
                    'PropertyId' => 0x8085,
                ),
            ),
            'EmailAddress2' => array (
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8090,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8092,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8093,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x8094,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::BINARY,                
                    'PropertyId' => 0x8095,
                ),
            ),
            'EmailAddress3' => array (
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x80A0,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x80A2,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x80A3,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,                
                    'PropertyId' => 0x80A4,
                ),
                array (
                    'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::ADDRESS,
                    'PropertyType' => \EWSType_MapiPropertyTypeType::BINARY,                
                    'PropertyId' => 0x80A5,
                ),
            ),
        );
        
        $propertyDescriptions = $emailPropertyDescriptions[$key];
        if($propertyDescriptions) {
            $deleteItems = array();
            foreach($propertyDescriptions as $description) {
                
                $deleteItem = new \EWSType_DeleteItemType();
                $extendedFieldUri = $this->createExtendedFieldUri($description);
                $deleteItem->ExtendedFieldURI = $extendedFieldUri;
                $deleteItems[] = $deleteItem;
            }
            return $deleteItems;
        } else {
            return array();
        }
    }
    
    protected function mergeMappings($first, $second) {
        
        $allKeys = array_merge(array_keys($first), array_keys($second));
        $mergedMapping = array();
        foreach($allKeys as $key) {
            $firstKeyDefs = $first[$key] ? $first[$key] : array();
            $secondKeyDefs = $second[$key] ? $second[$key] : array();
            $mergedMapping[$key] = array_merge($firstKeyDefs, $secondKeyDefs);
        }
        return $mergedMapping;
    }
    
    protected function getTaskUpdateModelMapping() {
        
        $specificMapping = array();
        $fullMapping = $this->mergeMappings($this->getTaskBaseToExchangeMapping(), $specificMapping);
        return $fullMapping;
    }
    
    protected function getTaskCreateModelMapping() {
        
        $specificMapping = array(
            'ExtendedProperties' => array (
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
//                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
//                        'PropertyName' => 'SugarGUID',
//                    ),
//                    'ModelProperty' => 'sugarId'
//                ),
            )
        );
        $fullMapping = $this->mergeMappings($this->getTaskBaseToExchangeMapping(), $specificMapping);
        return $fullMapping;
    }
    
    protected function getTaskBaseToExchangeMapping() {

        $mapping = array(
            'Properties' => array (
                // Exchange Path => Property
                'item:Subject' => 'name',
                'task:StartDate' => 'dateStart',
                'task:DueDate' => 'dateDue',
                'item:Importance' => 'importance',
                'task:Status' => 'exchangeStatus',
            ),
            'BodyProperties' => array (
                // Exchange Path => Property
                'item:Body' => 'description',
            ),
            'IndexedProperties' => array (
            ),
            'ExtendedProperties' => array (
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarGUID',
                    ),
                    'ModelProperty' => 'sugarId'
                ),
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
            )
        );
        return $mapping;
        
        
    }
    
    protected function getTaskRetrieveMapping() {

        $mapping = array(
            'Properties' => array (
                // Exchange Path => Property
                'Subject' => 'name',
                'Body:_' => 'description',
                'StartDate' => 'dateStart',
                'DueDate' => 'dateDue',
                'Importance' => 'importance',
                'Status' => 'exchangeStatus',
                'LastModifiedTime' => 'dateModified'
            ),
            'IndexedProperties' => array (
            ),
            'ExtendedProperties' => array (
                // Exchange Path => Property
                'PublicStrings:SugarGUID' => 'sugarId',
                'PublicStrings:SugarSYNC' => 'sugarSync',
                'PublicStrings:SugarStartTime' => 'sugarDateStart',
                'PublicStrings:SugarDueTime' => 'sugarDateDue',
//                'PublicStrings:SugarAccountID' => 'accountId',
//                'PublicStrings:SugarAccountName' => 'accountName',
//                'PublicStrings:SugarOwnerID' => 'assignedUserId',
//                'PublicStrings:SugarOwnerName' => 'assignedUserName',
            )            
        );
        return $mapping;
    }
    
    protected function getContactUpdateModelMapping() {
        
        $specificMapping = array();
        $fullMapping = $this->mergeMappings($this->getContactBaseToExchangeMapping(), $specificMapping);
        return $fullMapping;
    }
    
    protected function getContactCreateModelMapping() {
        
        $specificMapping = array(
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
        );
        $fullMapping = $this->mergeMappings($this->getContactBaseToExchangeMapping(), $specificMapping);
        return $fullMapping;
    }
    
    protected function getContactBaseToExchangeMapping() {

        $mapping = array(
            'Properties' => array (
                // Exchange Path => Property
                'contacts:GivenName' => 'firstName',
                'contacts:Surname' => 'lastName', 
                'contacts:CompanyName' => 'accountName',
                
            ),
            'BodyProperties' => array (
                // Exchange Path => Property
                'item:Body' => 'description',
            ),
            'IndexedProperties' => array (
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::BUSINESS_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneWork'                    
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::MOBILE_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneMobile'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::HOME_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneHome'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::OTHER_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneOther'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::BUSINESS_FAX,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneFax'  
                ),
            ),
            'AddressProperties' => array (
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::BUSINESS,
                        'IndexedProperty' => 'PhysicalAddresses',

                    ),
                    'ValueKeyMapping' => array(
                        'Street' => 'primaryAddressStreet',
                        'City' => 'primaryAddressCity',
                        'State' => 'primaryAddressState',
                        'CountryOrRegion' => 'primaryAddressCountry',
                        'PostalCode' => 'primaryAddressPostalcode'
                    )
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::HOME,
                        'IndexedProperty' => 'PhysicalAddresses',

                    ),
                    'ValueKeyMapping' => array(
                        'Street' => 'altAddressStreet',
                        'City' => 'altAddressCity',
                        'State' => 'altAddressState',
                        'CountryOrRegion' => 'altAddressCountry',
                        'PostalCode' => 'altAddressPostalcode'
                    )
                ),
            ),
            'EmailProperties' => array (
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:EmailAddress",
                        'Key' => \EWSType_EmailAddressKeyType::EMAIL_ADDRESS_1,
                        'IndexedProperty' => 'EmailAddresses',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'email'                    
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:EmailAddress",
                        'Key' => \EWSType_EmailAddressKeyType::EMAIL_ADDRESS_2,
                        'IndexedProperty' => 'EmailAddresses',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'email2'                    
                ),
            ),
            'ExtendedProperties' => array (
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarGUID',
                    ),
                    'ModelProperty' => 'sugarId'
                ),                
//                array (
//                    'ExchangePropertyDescription' => array (
//                        'PropertyTag' =>  "0x3A45",
//                        'PropertyType' => "String"                                                
//                    ),
//                    'ModelProperty' => 'title'
//                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarAccountName',
                    ),
                    'ModelProperty' => 'accountName'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarAccountID',
                    ),
                    'ModelProperty' => 'accountId'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarOwnerID',
                    ),
                    'ModelProperty' => 'assignedUserId'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarOwnerName',
                    ),
                    'ModelProperty' => 'assignedUserName'
                ),
            )
        );
        return $mapping;
        
        
    }    
    
    protected function getContactRetrieveMapping() {

        $mapping = array(
            'Properties' => array (
                // Exchange Path => Property
                'CompleteName:FirstName' => 'firstName',
                'CompleteName:LastName' => 'lastName',
//                'CompleteName:Title' => 'title',
                'Body:_' => 'description',          
            ),
            'IndexedProperties' => array (
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:EmailAddress",
                        'Key' => \EWSType_EmailAddressKeyType::EMAIL_ADDRESS_1,
                        'IndexedProperty' => 'EmailAddresses',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'email'                    
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:EmailAddress",
                        'Key' => \EWSType_EmailAddressKeyType::EMAIL_ADDRESS_2,
                        'IndexedProperty' => 'EmailAddresses',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'email2'                    
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::BUSINESS_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneWork'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::MOBILE_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneMobile'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::HOME_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneHome'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::OTHER_PHONE,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneOther'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhoneNumber",
                        'Key' => \EWSType_PhoneNumberKeyType::BUSINESS_FAX,
                        'IndexedProperty' => 'PhoneNumbers',
                        'ValueKey' => '_'
                    ),
                    'ModelProperty' => 'phoneFax'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::BUSINESS,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'Street'
                    ),
                    'ModelProperty' => 'primaryAddressStreet'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::BUSINESS,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'City'
                    ),
                    'ModelProperty' => 'primaryAddressCity'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::BUSINESS,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'State'
                    ),
                    'ModelProperty' => 'primaryAddressState'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::BUSINESS,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'CountryOrRegion'
                    ),
                    'ModelProperty' => 'primaryAddressCountry'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::BUSINESS,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'PostalCode'
                    ),
                    'ModelProperty' => 'primaryAddressPostalcode'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::HOME,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'Street'
                    ),
                    'ModelProperty' => 'altAddressStreet'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::HOME,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'City'
                    ),
                    'ModelProperty' => 'altAddressCity'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::HOME,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'State'
                    ),
                    'ModelProperty' => 'altAddressState'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::HOME,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'CountryOrRegion'
                    ),
                    'ModelProperty' => 'altAddressCountry'  
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'IndexedFieldUri' =>  "contacts:PhysicalAddress",
                        'Key' => \EWSType_PhysicalAddressKeyType::HOME,
                        'IndexedProperty' => 'PhysicalAddresses',
                        'ValueKey' => 'PostalCode'
                    ),
                    'ModelProperty' => 'altAddressPostalcode'  
                ),
            ),
            'ExtendedProperties' => array (
                // Exchange Path => Property
                'PublicStrings:SugarGUID' => 'sugarId',
                'PublicStrings:SugarSYNC' => 'sugarSync',
                'PublicStrings:SugarAccountID' => 'accountId',
                'PublicStrings:SugarAccountName' => 'accountName',
                'PublicStrings:SugarOwnerID' => 'assignedUserId',
                'PublicStrings:SugarOwnerName' => 'assignedUserName',
            )
        );        
        return $mapping;
    }
    
    protected function getCalendarItemUpdateModelMapping() {
        
        $specificMapping = array();
        $fullMapping = $this->mergeMappings($this->getCalendarItemBaseToExchangeMapping(), $specificMapping);
        return $fullMapping;
    }
    
    protected function getCalendarItemCreateModelMapping() {
        
        $specificMapping = array(
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
        );
        $fullMapping = $this->mergeMappings($this->getCalendarItemBaseToExchangeMapping(), $specificMapping);
        return $fullMapping;
    }
    
    protected function getCalendarItemBaseToExchangeMapping() {

        $mapping = array(
            'Properties' => array (
                // Exchange Path => Property
                'item:Subject' => 'name',
                'calendar:Start' => 'dateStart',
                'calendar:End' => 'dateEnd',
//                'item:Categories' => 'categories',
                'calendar:Location' => 'location'
            ),
            'BodyProperties' => array (
                // Exchange Path => Property
                'item:Body' => 'description',
            ),
            'IndexedProperties' => array (
            ),
            'ExtendedProperties' => array (
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarGUID',
                    ),
                    'ModelProperty' => 'sugarId'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarType',
                    ),
                    'ModelProperty' => 'sugarType'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarParentID',
                    ),
                    'ModelProperty' => 'parentId'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarParentName',
                    ),
                    'ModelProperty' => 'parentName'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarParenType',
                    ),
                    'ModelProperty' => 'parentType'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarAssignedUserID',
                    ),
                    'ModelProperty' => 'assignedUserId'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarAssignedUserName',
                    ),
                    'ModelProperty' => 'assignedUserName'
                ),
                array (
                    'ExchangePropertyDescription' => array (
                        'DistinguishedPropertySetId' => \EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS,
                        'PropertyType' => \EWSType_MapiPropertyTypeType::STRING,
                        'PropertyName' => 'SugarStatus',
                    ),
                    'ModelProperty' => 'sugarStatus'
                ),
            )
        );
        return $mapping;
        
        
    }
    
    
    protected function getCalendarItemRetrieveMapping() {

        $mapping = array(
            'Properties' => array (
                // Exchange Path => Property
                'Subject' => 'name',
                'Body:_' => 'description',
                'Start' => 'dateStart',
                'End' => 'dateEnd',
                'Categories' => 'categories',
                'Location' => 'location'
//                'Importance' => 'importance',
//                'Status' => 'exchangeStatus',
            ),
            'IndexedProperties' => array (
            ),
            'ExtendedProperties' => array (
                // Exchange Path => Property
                'PublicStrings:SugarGUID' => 'sugarId',
                'PublicStrings:SugarSYNC' => 'sugarSync',
                'PublicStrings:SugarParentID' => 'parentId',
                'PublicStrings:SugarParentName' => 'parentName',
                'PublicStrings:SugarParentType' => 'parentType',
                'PublicStrings:SugarAssignedUserID' => 'assignedUserId',
                'PublicStrings:SugarAssignedUserName' => 'assignedUserName',
                'PublicStrings:SugarType' => 'sugarType',
                'PublicStrings:SugarStatus' => 'sugarStatus',
            )            
        );
        return $mapping;
    }
    
    
    
}
