<?php
require_once 'SyncContactItem.php';

class SugarService {
	
//	protected $SyncContactItemMapping = array(
//			'id' => 'id',
//			'first_name' => 'firstname',
//			'last_name' => 'lastname',
//			'primary_address_street' => 'primary_address_street',
//			'primary_address_city' => 'primary_address_city',
//                        'phone_mobile' => 'phone_mobile'
//	);
//        
        protected $sugarBusinessObjectsMapping = array(
            'contact' => array(
                'module' => 'Contacts',
                'businessObjectType' => 'SyncContactItem',
                'itemChangeDescriptionType' => 'Contact',
                'folderId' => EWSType_DistinguishedFolderIdNameType::CONTACTS,
                'dictionaries' => array(
                    'PhysicalAddresses' => 'EWSType_PhysicalAddressDictionaryType',
                    'PhoneNumbers' => 'EWSType_PhoneNumberDictionaryType'
                ),
                'fields' => array(
                    'firstname' => array(
                        'sugarField' => 'first_name',
                        'type' => 'string'
                    ),
                    'lastname' => array(
                        'sugarField' => 'last_name',
                        'type' => 'string'
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

        
//	public function syncItems($itemDescription, $lastSyncState) {
//	
//		$functionObject = $this->createSyncRequest($itemDescription, $lastSyncState);
//		$result = $this->rpc($functionObject);
//		return $result;
//	}
	
	protected function createSyncRequest($itemDescription, $lastSyncState) {
	
		switch(strtolower($itemDescription->objectName)) {
			case 'contact':
				return $this->createContactsSyncRequest($itemDescription, $lastSyncState);
				break;
			default;
			return NULL;
		}
	}
	
	protected function createContactsSyncRequest($itemDescription, $lastSyncState) {
		
		$functionObject = new stdClass();
		$fieldList = "c.id,c.first_name,c.last_name,c.primary_address_street,c.primary_address_city,c.primary_address_state,c.primary_address_postalcode,c.primary_address_country,c.phone_mobile";		
		$query = "SELECT {$fieldList} FROM contacts c "
				."JOIN contacts_users cu ON cu.contact_id=c.id AND cu.deleted=0 "
				."WHERE c.deleted = 0";
		$functionObject->query = $query;
		$functionObject->returnType = 'SyncContactItem'; 
		return $functionObject;
	}
	
	protected function rpc($functionObject) {
		
		global $db;

		$resultSet = array();
		try {
			$queryResult = $db->query($functionObject->query);
			while($dbRecord = $db->fetchByAssoc($queryResult)) {
				$resultSet[] = $this->createBusinessObject($functionObject->returnType, $dbRecord);
			}
		}
		catch (Exception $e) {
			throw new Exception($e->getMessage());
		}
		return $resultSet;
	}
	
	protected function createBusinessObject($type, $dataArray) {
		
		$vardef = array(
				'id' => '',
				'firstname' => '',
				'lastname' => '',
				'primary_address_street' => '',
				'primary_address_city' => '',
                                'phone_mobile' => '',
		);
		$businessObject = new $type($vardef);
		$mappingName = $type . "Mapping";
		if(isset($this->$mappingName)) {
			$mapping = $this->$mappingName;
			foreach($dataArray as $property => $value) {
				if(array_key_exists($property, $mapping))
					$businessObject->{$mapping[$property]} = $value;
			}
		}
		return $businessObject;
	} 
        
	protected function createBusinessObjects($itemDescriptions, $beans) {
		
		$vardef = array(
				'id' => '',
				'firstname' => '',
				'lastname' => '',
				'primary_address_street' => '',
				'primary_address_city' => '',
                                'phone_mobile' => '',
		);
		$businessObject = new $type($vardef);
		$mappingName = $type . "Mapping";
		if(isset($this->$mappingName)) {
			$mapping = $this->$mappingName;
			foreach($dataArray as $property => $value) {
				if(array_key_exists($property, $mapping))
					$businessObject->{$mapping[$property]} = $value;
			}
		}
		return $businessObject;
	} 
        
        
        public function getItemsForSync($itemDescription, $lastSyncState) {
            
            global $beanList;
            
            if (!is_array($this->sugarBusinessObjectsMapping[$itemDescription->objectName])) {
                return array();
            }
            
            $mapping = $this->sugarBusinessObjectsMapping[$itemDescription->objectName];
            
            $bean = BeanFactory::getBean($mapping['module']);
            $sugarBeans = $bean->get_full_list();
            
            return $this->createBusinessObjects($mapping, $beans);
            
        }            
                
}