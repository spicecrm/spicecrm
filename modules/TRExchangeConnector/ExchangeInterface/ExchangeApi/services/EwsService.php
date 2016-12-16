<?php

require_once 'modules/TRSync/libs/php-ews/ExchangeWebServices.php';
require_once 'modules/TRSync/libs/php-ews/EWS_Exception.php';

if (function_exists('__autoload')) {
    spl_autoload_register('__autoload');
}

$ewsAutoload = function($className) {
    $basePath = 'modules/TRSync/libs/php-ews';
    $includeFile = $basePath . '/' . str_replace('_', '/', $className) . '.php';
    return (file_exists($includeFile) ? require_once $includeFile : false);
};

spl_autoload_register($ewsAutoload);

class EwsService {

    private static $instance;
    private $ews;
//    protected $contactsDefs = array(
//        'firstName' => array(
//            'type' => string,
//            'length' => 256
//        ),
//        'lastName' => array(
//            'type' => string,
//            'length' => 256
//        ),
//        'businessAddressStreet' => array(
//            'type' => string,
//            'length' => 256
//        ),
//    );
    protected $ewsBusinessObjectsMapping = array(
        'contact' => array(
            'ewsType' => 'EWSType_ContactItemType',
            'itemType' => 'Contact',
            'itemChangeDescriptionType' => 'Contact',
            'folderId' => EWSType_DistinguishedFolderIdNameType::CONTACTS,
            'dictionaries' => array(
                'PhysicalAddresses' => 'EWSType_PhysicalAddressDictionaryType',
                'PhoneNumbers' => 'EWSType_PhoneNumberDictionaryType'
            ),
            'fields' => array(
                'firstname' => array(
                    'elementName' => 'GivenName',
                    'type' => 'string',
                    'changeDescriptionType' => 'EWS_FieldURI',
                    'EWS_FieldURI' => 'contacts:GivenName',
                ),
                'lastname' => array(
                    'elementName' => 'Surname',
                    'type' => 'string',
                    'changeDescriptionType' => 'EWS_FieldURI',
                    'EWS_FieldURI' => 'contacts:Surname',
                ),
                'primary_address_street' => array(
                    'dictionary' => 'PhysicalAddresses',
                    'dictionaryEntryType' => 'EWSType_PhysicalAddressDictionaryEntryType',
                    'dictionaryKey' => EWSType_PhysicalAddressKeyType::BUSINESS,
                    'elementName' => 'Street',
                    'type' => 'string',
                    'changeDescriptionType' => 'EWSType_IndexedFieldURI',
                    'EWSType_IndexedFieldURI' => array(
                        'fieldURI' => 'contacts:PhysicalAddress:Street', 
                        'fieldIndex' => EWSType_PhysicalAddressKeyType::BUSINESS
                    )
                ),
                'primary_address_city' => array(
                    'dictionary' => 'PhysicalAddresses',
                    'dictionaryEntryType' => 'EWSType_PhysicalAddressDictionaryEntryType',
                    'dictionaryKey' => EWSType_PhysicalAddressKeyType::BUSINESS,
                    'elementName' => 'City',
                    'type' => 'string',
                    'changeDescriptionType' => 'EWSType_IndexedFieldURI',
                    'EWSType_IndexedFieldURI' => array(
                        'fieldURI' => 'contacts:PhysicalAddress:City', 
                        'fieldIndex' => EWSType_PhysicalAddressKeyType::BUSINESS
                    )
                ),
                'phone_mobile' => array(
                    'dictionary' => 'PhoneNumbers',
                    'dictionaryEntryType' => 'EWSType_PhoneNumberDictionaryEntryType',
                    'dictionaryKey' => EWSType_PhoneNumberKeyType::MOBILE_PHONE,
                    'elementName' => '_',
                    'type' => 'string',
                    'changeDescriptionType' => 'EWSType_IndexedFieldURI',
                    'EWSType_IndexedFieldURI' => array(
                        'fieldURI' => 'contacts:PhoneNumber', 
                        'fieldIndex' => EWSType_PhoneNumberKeyType::MOBILE_PHONE
                    )
                )
            )
        )
    );

    private function __construct($server, $user, $password) {

        $this->ews = new ExchangeWebServices($server, $user, $password);
    }

    public static function initialize($server, $user, $password) {

        if (!isset(self::$instance)) {
            $className = __CLASS__;
            self::$instance = new $className($server, $user, $password);
        }
        return self::$instance;
    }

    public function getEws() {

        return $this->ews;
    }

    protected function setImpersonation($principalName) {

        if (!isset($this->ews))
            return false;

        $ei = new EWSType_ExchangeImpersonationType();
        $sid = new EWSType_ConnectingSIDType();
        $sid->PrincipalName = $principalName;
        $ei->ConnectingSID = $sid;
        $this->ews->setImpersonation($ei);
    }

    public function syncItems($itemDescription, $lastSyncState) {

        $remoteFunction = $itemDescription->createRequest($lastSyncState);
        $result = $this->rpc($remoteFunction);
        return $result;
    }

    public function createOrUpdate($itemDescription, $items) {
        
        if(!array_key_exists($itemDescription->objectName, $this->ewsBusinessObjectsMapping)) {
            return false;
        }
        
        $businessObjectMapping = $this->ewsBusinessObjectsMapping[$itemDescription->objectName];
        $this->setImpersonation($itemDescription->principalName);
        
        $itemType = $businessObjectMapping['itemType'];        
        $exchangeItems = $this->getItemsWithSugarGUID($itemType, $businessObjectMapping['folderId']);

        $itemsFolder = new EWSType_TargetFolderIdType();
        $itemsFolder->DistinguishedFolderId = new EWSType_DistinguishedFolderIdType();
        $itemsFolder->DistinguishedFolderId->Id = $businessObjectMapping['folderId'];

        $updateItems = new EWSType_NonEmptyArrayOfItemChangesType();
        $createItems = new EWSType_NonEmptyArrayOfAllItemsType();
                
        foreach ($items as $businessObject) {

            $businessObjectFields = array_keys($businessObject->getVardefs());                    
            
            if (!array_key_exists($businessObject->id, $exchangeItems)) {
                $ewsItem = new $businessObjectMapping['ewsType'];
                $sugarGuidProperty = new EWSType_ExtendedPropertyType();
                $sugarGuidProperty->ExtendedFieldURI = new EWSType_PathToExtendedFieldType();
                $sugarGuidProperty->ExtendedFieldURI->DistinguishedPropertySetId = EWSType_DistinguishedPropertySetIdType::PUBLIC_STRINGS;
                $sugarGuidProperty->ExtendedFieldURI->PropertyName = "SugarGUID";
                $sugarGuidProperty->ExtendedFieldURI->PropertyType = EWSType_MapiPropertyTypeType::STRING;
                $sugarGuidProperty->Value = $businessObject->id;
                $ewsItem->FileAsMapping = EWSType_FileAsMappingType::FIRST_SPACE_LAST;                
                $ewsItem->ExtendedProperty = $sugarGuidProperty;
                foreach($businessObjectFields as $businessObjectField) {
                    if(array_key_exists($businessObjectField, $businessObjectMapping['fields'])) {
                        $ewsFieldDef = $businessObjectMapping['fields'][$businessObjectField];
                        if(!array_key_exists('dictionary', $ewsFieldDef)) {
                            $ewsFieldName = $ewsFieldDef['elementName'];
                            $ewsItem->$ewsFieldName = $businessObject->$businessObjectField;
                        } else {
                            if(empty($ewsItem->$ewsFieldDef['dictionary'])) {
                                $dictionary = new $businessObjectMapping['dictionaries'][$ewsFieldDef['dictionary']];
                                $ewsItem->$ewsFieldDef['dictionary'] = $dictionary;
                            } else {
                                $dictionary = $ewsItem->$ewsFieldDef['dictionary'];
                            }
                            $entryExists = false;
                            foreach($dictionary->Entry as $existingDictionaryEntry) {
                                if($existingDictionaryEntry->Key === $ewsFieldDef['dictionaryKey']) {
                                    $entryExists = true;
                                    $dictionaryEntry = $existingDictionaryEntry;
                                    break;
                                }
                            }
                            if(!$entryExists) {
                                $dictionaryEntry = new $ewsFieldDef['dictionaryEntryType'];
                                $dictionaryEntry->Key = $ewsFieldDef['dictionaryKey'];
                                $ewsItem->{$ewsFieldDef['dictionary']}->Entry[] = $dictionaryEntry;                                
                            }
                            $dictionaryEntry->$ewsFieldDef['elementName'] = $businessObject->$businessObjectField;
                        }
                    }
                }
                $createItems->{$itemType}[] = $ewsItem;
            } else {
                $changeItem = new EWSType_ItemChangeType();
                $changeItem->ItemId = new EWSType_ItemIdType();
                $changeItem->ItemId = $exchangeItems[$businessObject->id];
                $changeItem->Updates = new EWSType_NonEmptyArrayOfItemChangeDescriptionsType();
                foreach($businessObjectFields as $businessObjectField) {
                    if(array_key_exists($businessObjectField, $businessObjectMapping['fields'])) {
                        $ewsFieldDef = $businessObjectMapping['fields'][$businessObjectField];
                        
                        if(!array_key_exists('dictionary', $ewsFieldDef)) {
                            if(!empty($businessObject->$businessObjectField)) {
                                $changeItem->Updates->SetItemField[] = $this->createItemChangeDescription($businessObject->$businessObjectField, $ewsFieldDef['EWS_FieldURI']);                                
                            } else {
                                $changeItem->Updates->DeleteItemField[] = $this->createDeleteItemField($ewsFieldDef['EWS_FieldURI']);                                                                
                            }
                        } else {
                            if(!empty($businessObject->$businessObjectField)) {
                                $changeItem->Updates->SetItemField[] = $this->createIndexedItemChangeDescription($businessObjectMapping['itemType'], 
                                        $businessObjectMapping['ewsType'], $ewsFieldDef['dictionary'], 
                                        $businessObjectMapping['dictionaries'][$ewsFieldDef['dictionary']], $ewsFieldDef['dictionaryEntryType'], 
                                        $ewsFieldDef['dictionaryKey'],
                                        $businessObject->$businessObjectField, $ewsFieldDef['EWSType_IndexedFieldURI']['fieldURI'], $ewsFieldDef['EWSType_IndexedFieldURI']['fieldIndex']);
                            } else {
                                $changeItem->Updates->DeleteItemField[] = $this->createDeleteIndexedItemField($ewsFieldDef['EWSType_IndexedFieldURI']['fieldURI'], $ewsFieldDef['EWSType_IndexedFieldURI']['fieldIndex']); 
                            }
                            
                        }
                    }
                }
                $updateItems->ItemChange[] = $changeItem;                
            }
        }

        if ($createItems->$itemType) {
            $createRequest = new EWSType_CreateItemType();
            $createRequest->SavedItemFolderId = clone $itemsFolder;
            $createRequest->Items = $createItems;
            try {
                $response = $this->getEws()->CreateItem($createRequest);
                print "<pre>" . print_r($response, true) . "</pre><br>";
            } catch (EWS_Exception $e) {
                print($e->getMessage() . "<br>");
            }
        }

        if ($updateItems->ItemChange) {
            $updateRequest = new EWSType_UpdateItemType();
            $updateRequest->ConflictResolution = "AlwaysOverwrite";
            $updateRequest->SavedItemFolderId = clone $itemsFolder;
            $updateRequest->ItemChanges = $updateItems;
            try {
                $response = $this->getEws()->UpdateItem($updateRequest);
                print "<pre>" . print_r($response, true) . "</pre><br>";
            } catch (Exception $e) {
                print($e->getMessage() . "<br>");
            }
        }
    }
    
    protected function rpc($functionObject) {

        try {
            $result = $functionObject->call();
        } catch (Exception $e) {
            $result = NULL;
        }
        return $result;
    }

    protected function createSyncRequest($itemDescription, $lastSyncState) {

        switch (strtolower($itemDescription->objectName)) {
            case 'contacts':
                return $this->createContactsSyncRequest($itemDescription, $lastSyncState);
                break;
            default;
                return NULL;
        }
    }

    protected function getItemsWithSugarGUID($itemType,$baseFolderId) {

        $request = new EWSType_FindItemType();

        $request->ItemShape = new EWSType_ItemResponseShapeType();
        $request->ItemShape->BaseShape = EWSType_DefaultShapeNamesType::ID_ONLY;

        $extendedDistinguishedPropertySetField = new EWSType_PathToExtendedFieldType();
        $extendedDistinguishedPropertySetField->DistinguishedPropertySetId = "PublicStrings";
        $extendedDistinguishedPropertySetField->PropertyName = "SugarGUID";
        $extendedDistinguishedPropertySetField->PropertyType = "String";
        $request->ItemShape->AdditionalProperties->ExtendedFieldURI = array($extendedDistinguishedPropertySetField);

        $request->Restriction = new EWSType_RestrictionType();
        $request->Restriction->Exists = new EWSType_ExistsType();
        $request->Restriction->Exists->ExtendedFieldURI = clone $extendedDistinguishedPropertySetField;

        $request->ParentFolderIds = new EWSType_NonEmptyArrayOfBaseFolderIdsType();
        $request->ParentFolderIds->DistinguishedFolderId = new EWSType_DistinguishedFolderIdType();
        $request->ParentFolderIds->DistinguishedFolderId->Id = $baseFolderId;

        $request->Traversal = EWSType_ItemQueryTraversalType::SHALLOW;

        try {
            $response = $this->ews->FindItem($request);
            $items = array();
            $exchangeItems = $response->ResponseMessages->FindItemResponseMessage->RootFolder->Items->$itemType;
            if (!is_array($exchangeItems))
                $exchangeItems = array($exchangeItems);
            if (is_array($exchangeItems)) {
                foreach ($exchangeItems as $exchangeItem) {
                    $items[$exchangeItem->ExtendedProperty->Value] = $exchangeItem->ItemId;
                }
            }
            return $items;
        } catch (EWS_Exception $e) {
            print($e->getMessage() . "<br>");
        }
    }

    protected function createItemChangeDescription($newValue, $fieldURI) {

        $changeDescription = new EWSType_SetItemFieldType();
        $changeDescription->FieldURI = new EWSType_PathToUnindexedFieldType();
        $changeDescription->FieldURI->FieldURI = $fieldURI;
        $changeDescription->Contact = new EWSType_ContactItemType();
        $uri = explode(":", $fieldURI);
        $changeDescription->Contact->{$uri[1]} = $newValue;
        return $changeDescription;
    }

    protected function createIndexedItemChangeDescription($itemType, $ewsType, $dictionary, $dictionaryType, $dictionaryEntryType, $dictionaryKey, $newValue, $fieldURI, $fieldIndex) {

        $changeDescription = new EWSType_SetItemFieldType();
        $changeDescription->IndexedFieldURI = new EWSType_PathToIndexedFieldType();
        $changeDescription->IndexedFieldURI->FieldURI = $fieldURI;
        $changeDescription->IndexedFieldURI->FieldIndex = $fieldIndex;
        $changeDescription->$itemType = new $ewsType;
        $uri = explode(":", $fieldURI);
        $changeDescription->$itemType->$dictionary = new $dictionaryType;
        $dictionaryEntry = new $dictionaryEntryType;
        $dictionaryEntry->Key = $dictionaryKey;
        if(sizeof($uri) === 3) {
            $dictionaryEntry->{$uri[2]} = $newValue;
        } else {
            $dictionaryEntry->_ = $newValue;
        }
        $changeDescription->$itemType->$dictionary->Entry = $dictionaryEntry;
        return $changeDescription;
    }
    
    protected function createPhysicalAddressChangeDescription($contact, $fieldURI, $fieldIndex) {
        
        $changeDescription = new EWSType_SetItemFieldType();
        $changeDescription->IndexedFieldURI = new EWSType_PathToIndexedFieldType();
        $changeDescription->IndexedFieldURI->FieldURI = $fieldURI;
        $changeDescription->IndexedFieldURI->FieldIndex = $fieldIndex;
        $changeDescription->Contact = new EWSType_ContactItemType();
        $uri = explode(":", $fieldURI);
        $physicalAddresses = new EWSType_PhysicalAddressDictionaryType();
        $businessAddress = new EWSType_PhysicalAddressDictionaryEntryType();
        $businessAddress->Key = $fieldIndex;
        $businessAddress->{$uri[2]} = $contact->PhysicalAddresses->Entry->{$uri[2]};
        $physicalAddresses->Entry = $businessAddress;
        $changeDescription->Contact->PhysicalAddresses = $physicalAddresses;
        return $changeDescription;        
    }

    protected function createEmailChangeDescription($fieldURI, $fieldIndex) {
        
        $changeDescription = new EWSType_SetItemFieldType();
        $changeDescription->IndexedFieldURI = new EWSType_PathToIndexedFieldType();
        $changeDescription->IndexedFieldURI->FieldURI = $fieldURI;
        $changeDescription->IndexedFieldURI->FieldIndex = $fieldIndex;
        $changeDescription->Contact = new EWSType_ContactItemType();
        $uri = explode(":", $fieldURI);
        $emailAddresses = new EWSType_EmailAddressDictionaryType();
        $emailAddress = new EWSType_EmailAddressDictionaryEntryType();
        $emailAddress->Key = $fieldIndex;
        $emailAddress->_ = "christian.knoll@twentyreasons.com"; //EmailAddressDictionaryEntryType
        $emailAddresses->Entry = $emailAddress;
        $changeDescription->Contact->EmailAddresses = $emailAddresses;
        return $changeDescription;        
    }
    
    protected function createPhoneNumberChangeDescription($fieldURI, $fieldIndex) {
        
        $changeDescription = new EWSType_SetItemFieldType();
        $changeDescription->IndexedFieldURI = new EWSType_PathToIndexedFieldType();
        $changeDescription->IndexedFieldURI->FieldURI = $fieldURI;
        $changeDescription->IndexedFieldURI->FieldIndex = $fieldIndex;
        $changeDescription->Contact = new EWSType_ContactItemType();
        $uri = explode(":", $fieldURI);
        $phoneNumbers = new EWSType_PhoneNumberDictionaryType();
        $phoneNumber = new EWSType_PhoneNumberDictionaryEntryType;
        $phoneNumber->Key = $fieldIndex;
        $phoneNumber->_ = "+43 676 0815";
        $phoneNumbers->Entry = $phoneNumber;
        $changeDescription->Contact->PhoneNumbers = $phoneNumbers;
        return $changeDescription;        
    }
    

    protected function createDeleteItemField($fieldURI) {

        $changeDescription->FieldURI->FieldURI = $fieldURI;
        return $changeDescription;
    }

    protected function createDeleteIndexedItemField($fieldURI, $fieldIndex) {

        $changeDescription->IndexedFieldURI->FieldURI = $fieldURI;
        $changeDescription->IndexedFieldURI->FieldIndex = $fieldIndex;
        return $changeDescription;
    }

}
