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
 * Description of MaterialGroup
 *
 * @author thomaskerle
 */
class MaterialGroupRelation extends AbstractModel {
    
    protected $vardefs = array(

        'sugarAccountId' => array(
            'type' => 'String'
        ),        
        'lifnr' => array(
            'type' => 'String'
        ),
        'id' => array(
            'type' => 'String'
        ),
        'text' => array(
            'type' => 'String'
        )
    );
}
