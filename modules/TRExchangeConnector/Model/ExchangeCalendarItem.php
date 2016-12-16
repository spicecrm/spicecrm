<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\Model;


class ExchangeCalendarItem extends ExchangeBaseModel {
    
    protected $modelVardefs = array(
        'accountId' => array (
            'type' => 'String',
            'useForHash' => false
        ),
        'assignedUserId' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'assignedUserName' => array (
            'type' => 'String',
        ),
        'parentId' => array (
            'type' => 'String',
            'useForHash' => true
        ),
        'parentType' => array (
            'type' => 'String',
            'useForHash' => true
        ),        
        'parentName' => array (
            'type' => 'String',
        ),        
        'sugarType' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'name' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'location' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'dateStart' => array (
            'type' => 'DateTime',
            'useForHash' => true
        ),
        'durationHours' => array (
            'type' => 'Numeric',
        ),
        'durationMinutes' => array (
            'type' => 'Numeric',
        ),
        'dateEnd' => array (
            'type' => 'DateTime',
            'useForHash' => true
        ),
        'description' => array (
            'type' => 'String',
            'useForHash' => true
        ),
        'sugarStatus' => array (
            'type' => 'String',
            'useForHash' => true
        ),
        'categories' => array (
            'type' => 'StringCollection',
            'useForHash' => false
        ),
    );
    
    public function getDurationHours() {
        if($this->dateStart && $this->dateEnd) {
            return $this->dateStart->diff($this->dateEnd)->h;
        } else {
            return 0;
        }
    }
    
    public function getDurationMinutes() {
        if($this->dateStart && $this->dateEnd) {
            return $this->dateStart->diff($this->dateEnd)->i;
        } else {
            return 0;
        }        
    }
    
    public function getSugarBeanType() {
        
        global $beanList;
        
        return $beanList[$this->getSugarType()];
    }
    
}
