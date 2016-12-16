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
class PurchaseDocument extends AbstractModel {
    
    protected $vardefs = array(
        'docNumber' => array(
            'type' => 'String'
        ),
        'docType' => array(
            'type' => 'String'
        ),
        'docDate' => array(
            'type' => 'Date'
        ),
        'lifnr' => array(
            'type' => 'String'
        ),
        'ekorg' => array(
            'type' => 'String'
        ),
        'ekgrp' => array(
            'type' => 'String'
        ),
        'currency' => array(
            'type' => 'String'
        ),
        'amountNet' => array(
            'type' => 'Numeric'
        ),
        'notComplete' => array(
            'type' => 'String'
        ),
        'deleted' => array(
            'type' => 'Numeric'
        )
    );
    
    protected $lineItems = array();
    
    public function addLineItem($lineItem) {
        $this->lineItems[] = $lineItem;
        if(!$lineItem->getDeleted()) {
            $this->amountNet += $lineItem->getAmountNet();
        }
    }
    
    public function getLineItems() {
        return $this->lineItems;
    }
    
    private function setAmountNet() {}
    
}
