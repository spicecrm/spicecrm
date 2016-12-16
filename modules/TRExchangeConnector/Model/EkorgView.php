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
 * Description of EkorgView
 *
 * @author thomaskerle
 */
class EkorgView extends AbstractModel {
    
    protected $vardefs = array(
        'lifnr' => array(
            'type' => 'String'
        ),
        'ekorg' => array(
            'type' => 'String'
        ),
        'ekgrp' => array(
            'type' => 'String'
        ),        
        'inco1' => array(
            'type' => 'String'
        ),
        'inco2' => array(
            'type' => 'String'
        ),
        'paymentTermsKey' => array(
            'type' => 'String'
        ),
        'vendorStatus' => array(
            'type' => 'String'
        ),
        'vendorAccount' => array(
            'type' => 'String'
        ),
        'orderCurrency' => array(
            'type' => 'String'
        )
    );        
}
