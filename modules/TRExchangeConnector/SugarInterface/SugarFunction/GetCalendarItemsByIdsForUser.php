<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class GetCalendarItemsByIdsForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'getBeansByIdBeanPairForUser';
    protected $modelClass = 'TRBusinessConnector\Model\ExchangeCalendarItem';
    protected $user;
    
    protected function createParameters($callParameters) {
        
        $afterRetrieve = array (
            'Call' => array(
                $this->getCallMeetingCorrectDateEndCallback()
            ),
            'Meeting' => array(
                $this->getCallMeetingCorrectDateEndCallback()
            )
        );
        
        list($idBeanPairsToRetrieve, $this->user) = $callParameters;
        $parameters = array(
            'idBeanPairsToRetrieve' => $idBeanPairsToRetrieve,
            'user' => $this->user,
            'afterRetrieve' => $afterRetrieve,
        );
        return $parameters;
    }
    
    protected function retrieveErrors($result) {

        return array();
    }
    
    protected function retrieveResults($result) {
        
        $resultList = array();
        
        $this->impersonate($this->user);
        
        foreach($result as $sugarId => $sugarResult) {
            $responseClass = $sugarResult['exists'] && $sugarResult['accessAllowed'] ? 'Success' : 'Failure';
            $responseCode = $responseClass === 'Success' ? 'Success' :
                    ($sugarResult['exists'] ? ($sugarResult['accessAllowed'] ? 'Undefined' : 'Access not allowed') : 'Not found');
            $model = $responseClass === 'Success' ? $this->createModelFromInterfaceData($sugarResult['bean'], $this->modelClass) : null;
            if($model) {
                $model->setSugarType($sugarResult['bean']->module_dir);
            }
            $itemResponse = array (
                'responseClass' => $responseClass,
                'responseCode' => $responseCode,
                'model' => $model,
            );
            $resultList[] = $itemResponse;
        }
        
        $this->cancelImpersonation();
        
        return $resultList;
    }
    
    protected function createModelFromInterfaceData($interfaceModel, $modelClass) {

        $model = new $modelClass();
        $modelVardefs = $model->getVardefs();
        $interfaceModelClass = get_class($interfaceModel);
        $mappingsArray = $this->getModelMappings();
        $mappings = $mappingsArray[$modelClass];
        $interfaceDataMap = $mappings[$interfaceModelClass];
        foreach($interfaceDataMap as $interfaceField => $mapping) {
            $setter = "set" . ucfirst($mapping);
            $model->{$setter}($this->convertValueFromInterface($interfaceModel->$interfaceField, $modelVardefs[$mapping]['type']));
        }
        return $model;
        
    }    
    
    public function getModelMappings() {
        return array (
            'TRBusinessConnector\Model\ExchangeCalendarItem' => array (
                'Call' => $this->getCallRetrieveMapping(),
                'Meeting' => $this->getMeetingRetrieveMapping(),
                )
        );
    }    
}
