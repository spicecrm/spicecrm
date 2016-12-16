<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;

abstract class AbstractSugarFunction extends \TRBusinessConnector\InterfaceFunction\BaseFunction {
    
    protected $api;
    protected $logger;
    protected $sugarMethod = '';
    
    public function __construct($api, $converter = null, $logger = null) {
        $this->api = $api;
        $this->logger = $logger;
        $this->converter = $converter;
    }
    
    public function call($callParameters) {
        
        $parameters = $this->createParameters($callParameters);
        if($this->logger) {
            $this->logger->debug('Calling Sugar funtion ' . $this->sugarMethod . 'with parameters:', $parameters);
        }    
        $result = $this->api->call($this->sugarMethod, $parameters);
        if($this->logger) {
            $this->logger->debug('Call of Sugar funtion ' . $this->sugarMethod . 'returned following result:', $result);
        }
        $errors = $this->retrieveErrors($result);        
        if(!empty($errors)) {
            throw new \Exception("Error in " . implode("/", $this->sugarMethod) . ".\n" . implode("\n", $errors));
        } else {
            return $this->retrieveResults($result);
        }
    }

    abstract protected function createParameters($callParameters);
    
    abstract protected function retrieveErrors($result);
    
    abstract protected function retrieveResults($result);
    
}
