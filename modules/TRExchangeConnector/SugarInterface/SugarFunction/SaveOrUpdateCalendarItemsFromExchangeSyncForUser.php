<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;


class saveOrUpdateCalendarItemsFromExchangeSyncForUser extends BaseExchangeSyncFunction {
    
    protected $sugarMethod = 'saveBeanBeanClassPairListForUser';
    protected $modelClass = 'TRBusinessConnector\Model\ExchangeCalendarItem';
    protected $itemsToSave = array();
    
    protected function createParameters($callParameters) {
        
        global $beanList;
        
        $this->itemsToSave = $callParameters[0];
        $userId = $callParameters[1];
        
        $user = new \User();
        $user->retrieve($userId);
        $beanClassList = array_map(function($item) use ($beanList) {return $beanList[$item->getSugarType()];}, $this->itemsToSave);
        $modelClass = $this->modelClass;
        $interface = $this;
        $getMappingForBeanClass = function($beanClass) use ($modelClass, $interface) {
            $mappings = $interface->getModelMappings(); 
            return $mappings[$modelClass][$beanClass];         
        };
        $mappingList = array_map($getMappingForBeanClass, $beanClassList);
        $modelMappingList = array_map(null, $this->itemsToSave, $mappingList);
        $propertyValueLists = array_map(array($this, 'createPropertyValueListFromModelMappingPair'), $modelMappingList);
        $beanBeanClassPairList = array_map(null, $propertyValueLists, $beanClassList);

        $parameters = array(
            'user' => $user,
            'bean' => $this->bean,
            'list' => $beanBeanClassPairList
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
            $this->modelClass => array (
                'Call' => $this->getCallUpdateMapping(),
                'Meeting' => $this->getMeetingUpdateMapping()
            ),
        );
    }
}
