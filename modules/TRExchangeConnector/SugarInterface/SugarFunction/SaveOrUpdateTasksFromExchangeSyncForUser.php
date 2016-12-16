<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class saveOrUpdateTasksFromExchangeSyncForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'saveBeanListForUser';
    protected $bean = 'Task';
    protected $itemsToSave = array();
    
    protected function createParameters($callParameters) {
        
        $this->itemsToSave = $callParameters[0];
        $userId = $callParameters[1];
        
        $user = new \User();
        $user->retrieve($userId);
        $taskList = array_map(array($this, 'createPropertyValueListFromModel'), $this->itemsToSave);

        $parameters = array(
            'user' => $user,
            'bean' => $this->bean,
            'list' => $taskList
        );
        return $parameters;
    }
    
    protected function retrieveErrors($result) {

        return array();
    }
    
    protected function retrieveResults($result) {
        
        $resultsWithModels = array_map(null, $this->itemsToSave, $result);
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
            'TRBusinessConnector\Model\ExchangeTask' => $this->getTaskUpdateMapping()
        );
    }
}
