<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Result;

class SyncQueueContainer {
    
    public $createInExchange = array();
    public $updateInExchange = array();
    public $deleteInExchange = array();
    public $createInSugar = array();
    public $updateInSugar = array();
    public $deleteInSugar = array();
    public $overriddenOriginatingFromExchange = array();
    public $overriddenOriginatingFromSugar = array();
    public $updateState = array();
    public $deleteState = array();
    public $doNotProcess = array();
    public $errors = array();
    
    public static function mergeResults($first, $second) {
        
        $mergedResult = new $self();
        foreach(array_keys(get_class_vars($mergedResult)) as $property) {
            $mergedResult->$property = array_merge($first->$property, $second->$property);
        }
        return $mergedResult;
    }
    
}
