<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\BaseInterface;


class BaseInterface {
        
    protected $functionNamespacePrefix = '';    
    protected $functionRepository = array();
    protected $api = NULL;
    protected $converter = NULL;
    protected $logger = NULL;
    
    protected function getMethodClass($methodClassName) {
        
        if(array_key_exists($methodClassName, $this->functionRepository)) {
            $methodClass = $this->functionRepository[$methodClassName];
        } else {
            $namespacedMethodClassName = $this->functionNamespacePrefix . $methodClassName;
            $methodClass = new $namespacedMethodClassName($this->api, $this->converter, $this->logger);
            $this->functionRepository[$methodClassName] = $methodClass;
        }
        return $methodClass;
    }
    
    public function callInterfaceFunction($name, $arguments) {
        
        $methodClass = $this->getMethodClass(ucfirst($name));
        return $methodClass->call($arguments);        
    }    
}
