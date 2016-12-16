<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\Model;


class ExchangeContact extends ExchangeBaseModel {
    
    protected $modelVardefs = array(
        'assignedUserId' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'assignedUserName' => array (
            'type' => 'String',
        ),
        'accountId' => array (
            'type' => 'String'
        ),
        'accountName' => array (
            'type' => 'String'
        ),        
        'firstName' => array(
            'type' => 'String',
            'useForHash' => true,
        ),
        'lastName' => array(
            'type' => 'String',
            'useForHash' => true,
        ),
//        'titleKey' => array(
//            'type' => 'String',
//            'useForHash' => true,
//        ),
//        'title' => array(
//            'type' => 'String'
//        ),
        'description' => array(
            'type' => 'String',
            'useForHash' => true
        ),
        'email' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'email2' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'emailDisplayName' => array (
            'type' => 'String',
            'useForHash' => false
        ),
        'email2DisplayName' => array (
            'type' => 'String',
            'useForHash' => false
        ),
        'phoneWork' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'phoneMobile' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'phoneHome' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'phoneOther' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'phoneFax' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'primaryAddressStreet' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'primaryAddressCity' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'primaryAddressState' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'primaryAddressPostalcode' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'primaryAddressCountry' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'primaryAddressCountryKey' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'altAddressStreet' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'altAddressCity' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'altAddressState' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'altAddressPostalcode' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'altAddressCountry' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'altAddressCountryKey' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
    );
    
    public function getTitle() {
        
        global $app_list_strings;
        
        $salutationKey = $this->getTitleKey();
        if(isset($app_list_strings['sap_salutations'][$salutationKey])) {
            return $app_list_strings['sap_salutations'][$salutationKey];
        } else {
            return '';
        }
    }
    
    public function setTitle($title) {
        
        global $app_list_strings;
        
        $titleKey = array_search($title, $app_list_strings['sap_salutations']);
        if(FALSE !== $titleKey) {
            $this->setTitleKey($titleKey);
        } else {
            $this->setTitleKey('');
        }
    }
    
    public function getEmailDisplayName() {
        
        if($this->getFirstName() || $this->getLastName() && $this->getEmail()) {
            return ($this->getFirstName() ? $this->getFirstName() . ' ' : '') . ($this->getLastName() ? $this->getLastName() . ' ' : '') . '(' . $this->getEmail() . ')';
        } else {
            return '';
        }
    }
    
    public function getEmail2DisplayName() {
        
        if($this->getFirstName() || $this->getLastName() && $this->getEmail2()) {
            return ($this->getFirstName() ? $this->getFirstName() . ' ' : '') . ($this->getLastName() ? $this->getLastName() . ' ' : '') . '(' . $this->getEmail2() . ')';
        } else {
            return '';
        }
    }
    
//    public function getPrimaryAddressCountry() {
//        
//        global $app_list_strings;
//        
//        $countryKey = $this->getPrimaryAddressCountryKey();
//        if(isset($app_list_strings['sap_country_list'][$countryKey])) {
//            return $app_list_strings['sap_country_list'][$countryKey];
//        } else {
//            return '';
//        }        
//    }
//    
//    public function setPrimaryAddressCountry($country) {
//        
//        global $app_list_strings;
//        
//        $countryKey = array_search($country, $app_list_strings['sap_country_list']);
//        if(FALSE !== $countryKey) {
//            $this->setPrimaryAddressCountryKey($countryKey);
//        } else {
//            $this->setPrimaryAddressCountryKey('');
//        }
//    }
    
    public function getSugarBeanType() {
        
        return 'Contact';
    }
    
}
