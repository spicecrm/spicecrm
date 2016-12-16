<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class saveOrUpdateContactsFromExchangeSyncForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'saveBeanListForUser';
    protected $bean = 'Contact';
    protected $contactsToSave = array();
    
    protected function createParameters($callParameters) {
        
        $this->contactsToSave = $callParameters[0];
        $userId = $callParameters[1];
        
        $user = new \User();
        $user->retrieve($userId);
//        $contactList = array_map(array($this, 'createPropertyValueListFromModel'), $this->contactsToSave);
        $contactList = array();

        $parameters = array(
            'user' => $user,
            'bean' => $this->bean,
            'list' => $contactList
        );
        return $parameters;
    }
    
    protected function retrieveErrors($result) {

        return array();
    }
    
    protected function retrieveResults($result) {
        
        $createDummyResults = function($contact) {
            $id = $contact->getSugarId() ? $contact->getSugarId() : create_guid();
            $result = array(
                'responseClass' => 'Success',
                'responseCode' => 'Bean saved',
                'id' => $id
            );
            return $result;
        };
        $dummyResult = array_map($createDummyResults, $this->contactsToSave);
        $resultsWithModels = array_map(null, $this->contactsToSave, $dummyResult);
        $mergeResultWithModel =  function($resultWithModel) {
            list($model, $result) = $resultWithModel;
            if(!$model->getSugarId()) {
                $model->setSugarId($result['id']);
            }
            $result['model'] = $model;
            return $result;
        };
        $mergedResults = array_map($mergeResultWithModel, $resultsWithModels);
        return $mergedResults;
        
    }
    
    public function getModelMappings() {
        return array(
            'TRBusinessConnector\Model\ExchangeContact' => $this->getContactUpdateMapping()
        );
    }
}
