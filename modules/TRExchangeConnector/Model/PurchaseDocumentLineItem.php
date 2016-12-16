<?php

/*
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\Model;

/**
 * Description of PurchaseDocument
 *
 * @author thomaskerle
 */
class PurchaseDocumentLineItem extends AbstractModel {
    
    protected $vardefs = array(
        'docNumber' => array(
            'type' => 'String'
        ),
        'positionNumber' => array(
            'type' => 'String'
        ),
        'quantity' => array(
            'type' => 'Numeric'
        ),
        'unit' => array(
            'type' => 'String'
        ),
        'materialNumber' => array(
            'type' => 'String'
        ),
        'materialGroup' => array(
            'type' => 'String'
        ),
        'factory' => array(
            'type' => 'String'
        ),
        'storageLocation' => array(
            'type' => 'String'
        ),
        'orderPriceUnit' => array(
            'type' => 'String'
        ),
        'accountAssignmentCategory' => array(
            'type' => 'String'
        ),
        'positionText1' => array(
            'type' => 'String'
        ),
        'positionText2' => array(
            'type' => 'String'
        ),
        'currency' => array(
            'type' => 'String'
        ),        
        'amountNet' => array(
            'type' => 'Numeric'
        ),
        'deleted' => array(
            'type' => 'Numeric'
        )
    );
}
