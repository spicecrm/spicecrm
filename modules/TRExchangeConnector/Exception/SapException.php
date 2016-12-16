<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

/**
 * Description of SapException
 *
 * @author thomaskerle
 */
namespace TRBusinessConnector\Exception;

class SapException extends \Exception{
    
    protected $sapErrors;
    
    public function __construct($message, $sapErrors) {
        parent::__construct($message);
        $this->sapErrors = $sapErrors;
    }
    
    public function getSapErrors() {
        return $this->sapErrors;
    }
    
}
