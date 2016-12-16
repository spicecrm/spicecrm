<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

/**
 * Description of AbstractModel
 *
 * @author thomaskerle
 */

namespace TRBusinessConnector\Model;

abstract class AbstractModel {
    
    protected $vardefs;
    
    public function getVardefs() {
        return $this->vardefs;
    }

    public function __set($name, $value) {
        
        if (!array_key_exists($name, $this->vardefs)) {
            throw new \Exception("field " . $name . " not defined");
        }
        $this->{$name} = $value;
    }

    public function __get($name) {
        if (!array_key_exists($name, $this->vardefs)) {
            throw new \Exception("field " . $name . " not defined");
        }
        return $this->{$name};
    }
    
    public function __call($functionName, $parameters) {
        
        if(substr($functionName,0,3) === 'get') {
            return $this->__get(lcfirst(substr($functionName, 3)));
        } else if (substr($functionName,0,3) === 'set') {
            return $this->__set(lcfirst(substr($functionName, 3)), $parameters[0]);
        }
    }
}
