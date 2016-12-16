<?php

class SyncSugarContacts {
	
	private $service;
	private $sugarUser;
	
	private $fields = array(
			'id',
			'first_name',
			'last_name',
			'primary_address_city',
			'primary_address_state',
			'primary_address_postalcode',
			'primary_address_country',
	);
	
	public function __construct($objectName, $sugarUser) {
		
		$this->sugarUser = $sugarUser;
		return array(
				'subscriptionId' => 'AAA',
				'changeKey' => time(),
		);
		
	}
	
	public function sync($subscription, $syncState) {
		
		if(!isset($syncState)) $syncState = "0";
		return $this->getChangedContacts($syncState);
		
	}
	
	private function getChangedContacts($timestamp) {
		
		global $db;
		
		$lastDateModified = new SugarDateTime();
		$lastDateModified->setTimestamp($timestamp); 
		$fieldList = implode(",", array_map(function($value) {return "c.".$value; }, $this->fields));		
		$query = "SELECT {$fieldList} FROM contacts c "
									."JOIN contacts_users cu ON cu.deleted = 0 AND cu.contact_id = c.id "
									."WHERE cu.user_id = '{$this->sugarUser->id}' AND c.date_modified > '{$lastDateModified->asDb(false)}'";
		$result = $db->query($query);
		$contacts = array();
		while($row = $db->fetchByAssoc($result)) {
			$contacts[] = $row;
		}
		print "<pre>" . print_r($contacts, true) . "</pre>";
	}
	
	
	
}