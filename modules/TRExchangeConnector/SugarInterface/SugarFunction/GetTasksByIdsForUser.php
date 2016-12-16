<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class GetTasksByIdsForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'getBeansByIdBeanPairForUser';
    protected $bean = 'Task';
    protected $modelClass = 'TRBusinessConnector\Model\ExchangeTask';
    protected $user;
    
    protected function createParameters($callParameters) {
        
        list($idBeanPairsToRetrieve, $this->user) = $callParameters;
        $parameters = array(
            'idBeanPairsToRetrieve' => $idBeanPairsToRetrieve,
            'user' => $this->user,
            'afterRetrieve' => null,
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
            $model = $responseClass === 'Success' ? $this->createModelFromInterfaceData(get_object_vars($sugarResult['bean']), $this->modelClass) : null;
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
    
    public function getModelMappings() {
        return array(
            'TRBusinessConnector\Model\ExchangeTask' => $this->getTaskRetrieveMapping()
        );
    }    
    
}
