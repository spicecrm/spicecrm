<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\Model;


class ExchangeTask extends ExchangeBaseModel {
    
    protected $modelVardefs = array(
        'name' => array(
            'type' => 'String',
            'useForHash' => true,
        ),
        'description' => array(
            'type' => 'String',
            'useForHash' => true,
        ),
        'dateStart' => array(
            'type' => 'DateTime',
            'useForHash' => true
        ),
        'dateStartFlag' => array(
            'type' => 'Bool',
            'useForHash' => false
        ),
        'dateDue' => array(
            'type' => 'DateTime',
            'useForHash' => true
        ),
        'dateDueFlag' => array(
            'type' => 'Bool',
            'useForHash' => false
        ),
        'status' => array(
            'type' => 'String',
            'useForHash' => true,            
        ),
        'exchangeStatus' => array(
            'type' => 'String',
            'useForHash' => false,            
        ),
        'priority' => array(
            'type' => 'String',
            'useForHash' => true,            
        ),
        'importance' => array (
            'type' => 'String',
            'useForHash' => false,
        ),
        'sugarDateStart' => array(
            'type' => 'DateTime',
            'useForHash' => false
        ),
        'sugarDateDue' => array(
            'type' => 'DateTime',
            'useForHash' => false
        ),        
    );
    
    protected $sugarExchangePriorityMapping = array (
        // Sugar => Exchange
        'Low' => 'Low',
        'Medium' => 'Normal',
        'High' => 'High',
    );
    
    protected $sugarExchangeStatusMapping = array (
        // Sugar => Exchange
        'Not Started' => 'NotStarted',
        'In Progress' => 'InProgress',
        'Completed' => 'Completed',
        'Pending Input' => 'WaitingOnOthers',
        'Deferred' => 'Deferred',
    );
    
    public function setPriority($priority) {
        
        $this->priority = $priority;
        $this->importance = isset($this->sugarExchangePriorityMapping[$priority]) ? $this->sugarExchangePriorityMapping[$priority] : null;
    }
    
    public function setImportance($importance) {
        
        $this->importance = $importance;
        $exchangeSugarPriorityMapping = array_flip($this->sugarExchangePriorityMapping);
        $this->priority = isset($exchangeSugarPriorityMapping[$importance]) ? $exchangeSugarPriorityMapping[$importance] : null;        
    }
    
    public function setStatus($status) {
        
        $this->status = $status;
        $this->exchangeStatus = isset($this->sugarExchangeStatusMapping[$status]) ? $this->sugarExchangeStatusMapping[$status] : null;
    }
    
    public function setExchangeStatus($exchangeStatus) {
        
        $this->exchangeStatus = $exchangeStatus;
        $exchangeSugarStatusMapping = array_flip($this->sugarExchangeStatusMapping);
        $this->status = isset($exchangeSugarStatusMapping[$exchangeStatus]) ? $exchangeSugarStatusMapping[$exchangeStatus] : null;        
    }
    
    public function getDateStartFlag() {
        
        if(isset($this->dateStart) && $this->dateStart) {
            return false;
        } else {
            return true;
        }
    }
    
    public function getDateDueFlag() {
        
        if(isset($this->dateDue) && $this->dateDue) {
            return false;
        } else {
            return true;
        }
    }
    
    public function getSugarBeanType() {
        
        return 'Task';
    }
    
}
