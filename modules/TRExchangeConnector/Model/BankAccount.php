<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

/**
 * Description of BankAccount
 *
 * @author thomaskerle
 */
namespace TRBusinessConnector\Model;

class BankAccount extends AbstractModel {

    protected $vardefs = array(
        'bankName' => array(
            'type' => 'String'
        ),
        'countryCode' => array(
            'type' => 'String'
        ),
        'iban' => array(
            'type' => 'String'
        ),
        'bic' => array(
            'type' => 'String'
        ),
        'accountNumber' => array(
            'type' => 'String'
        ),        
    );        
    
}
