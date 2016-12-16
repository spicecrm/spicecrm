<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

/**
 * Description of Creditor
 *
 * @author thomaskerle
 */
namespace TRBusinessConnector\Model;

// tel number handling for accounts
require_once('custom/include/SugarFields/Fields/Kfaxphone/KfaxphoneFunctions.php');

class Creditor extends AbstractModel {
    
    protected $vardefs = array(
        'lifnr' => array(
            'type' => 'String'
        ),
        'customerId' => array(
            'type' => 'String',
        ),
        'sugarId' => array(
            'type' => 'String',
        ),
        'name1' => array(
            'type' => 'String'
        ),
        'name2' => array(
            'type' => 'String'
        ),
        'name3' => array(
            'type' => 'String'
        ),
        'name4' => array(
            'type' => 'String'
        ),
        'ktoGrp' => array(
            'type' => 'String'
        ),
        'title' => array(
            'type' => 'String'
        ),
        'street' => array(
            'type' => 'String'
        ),
        'street2' => array(
            'type' => 'String'
        ),
        'hsnm' => array(
            'type' => 'String'
        ),
        'state' => array(
            'type' => 'String'
        ),
        'zipCode' => array(
            'type' => 'String'
        ),        
        'city' => array(
            'type' => 'String'
        ),
        'city2' => array(
            'type' => 'String'
        ),        
        'country' => array(
            'type' => 'String'
        ),
        'po_box' => array(
            'type' => 'String'
        ),
        'zip_po_box' => array(
            'type' => 'String'
        ),
        'addressNumber' => array(
            'type' => 'String'
        ),
        'dateModified' => array(
            'type' => 'DateTime'
        ),
        'sicCode' => array(
            'type' => 'String'
        ),
        'language' => array(
            'type' => 'String'
        ),
        'uid' => array(
            'type' => 'String'
        ),
        'dunsNumber' => array(
            'type' => 'String'
        ),
        'telOfficeLong' => array(
            'type' => 'String'
        ),
        'telOfficeCountry' => array(
            'type' => 'String'
        ),
        'telOfficeNumber' => array(
            'type' => 'String'
        ),
        'telOfficeExtension' => array(
            'type' => 'String'
        ),        
        'telMobileLong' => array(
            'type' => 'String'
        ),
        'telMobileCountry' => array(
            'type' => 'String'
        ),
        'telMobileNumber' => array(
            'type' => 'String'
        ),
        'faxLong' => array(
            'type' => 'String'
        ),
        'faxCountry' => array(
            'type' => 'String'
        ),
        'faxNumber' => array(
            'type' => 'String'
        ),
        'faxExtension' => array(
            'type' => 'String'
        ),        
        'email' => array(
            'type' => 'String'
        ),
        'website' => array(
            'type' => 'String'
        ),
        'deleted' => array(
            'type' => 'Numeric'
        )
    );
    
    protected $bankAccounts = array();
    protected $ekorgViews = array();
    protected $materialGroupRelations = array();
    
    public function addBankAccount($bankAccount) {
        $this->bankAccounts[] = $bankAccount;
    }
    
    public function getBankAccounts() {
        return $this->bankAccounts;        
    }
    
    public function addEkorgView($ekorgView) {
        $this->ekorgViews[] = $ekorgView;
    }
    
    public function getEkorgViews() {
        return $this->ekorgViews;
    }
    
    public function addMaterialGroupRelation($materialGroupRelation) {
        $this->materialGroupRelations[] = $materialGroupRelation;
    }
    
    public function getMaterialGroupRelations() {
        return $this->materialGroupRelations;        
    }
    
    public function getTelOfficeLong() {
        return getFullNumber($this->telOfficeLong);
    }
    
    public function getTelOfficeCountry() {
        return getTelCountrycode($this->telOfficeLong);
    }
    
    public function getTelOfficeNumber() {
        return getTelNumber($this->telOfficeLong);
    }
    
    public function getTelOfficeExtension() {
        return getTelExtension($this->telOfficeLong);
    }
    
    public function getTelMobileLong() {
        return getFullNumber($this->telMobileLong);
    }

    public function getTelMobileCountry() {
        return getTelCountrycode($this->telMobileLong);
    }
    
    public function getTelMobileNumber() {
        return getTelNumber($this->telMobileLong);
    }
    
    public function getFaxLong() {
        return getFullNumber($this->faxLong);
    }
    
    public function getFaxCountry() {
        return getTelCountrycode($this->faxLong);
    }
    
    public function getFaxNumber() {
        return getTelNumber($this->faxLong);
    }
    
    public function getFaxExtension() {
        return getTelExtension($this->faxLong);
    }
    
}
