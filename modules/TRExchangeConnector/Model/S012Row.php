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
class S012Row extends AbstractModel {
    
    protected $vardefs = array(
        'vrsio' => array(
            'type' => 'String'
        ),
        'spmon' => array(
            'type' => 'String'
        ),
        'spjah' => array(
            'type' => 'String'
        ),
        'sptag' => array(
            'type' => 'String'
        ),
        'spwoc' => array(
            'type' => 'String'
        ),
        'spbup' => array(
            'type' => 'String'
        ),
        'ekorg' => array(
            'type' => 'String'
        ),
        'lifnr' => array(
            'type' => 'String'
        ),
        'matnr' => array(
            'type' => 'String'
        ),
        'werks' => array(
            'type' => 'String'
        ),
        'esokz' => array(
            'type' => 'String'
        ),
        'matkl' => array(
            'type' => 'String'
        ),
        'infnr' => array(
            'type' => 'String'
        ),
        'land1' => array(
            'type' => 'String'
        ),
        'periv' => array(
            'type' => 'String'
        ),
        'vwdat' => array(
            'type' => 'String'
        ),
        'basme' => array(
            'type' => 'String'
        ),
        'hwaer' => array(
            'type' => 'String'
        ),
        'menge' => array(
            'type' => 'Numeric'
        ),
        'wemng' => array(
            'type' => 'Numeric'
        ),
        'wemgm' => array(
            'type' => 'Numeric'
        ),
        'remng' => array(
            'type' => 'Numeric'
        ),
        
        'lsmng' => array(
            'type' => 'Numeric'
        ),
        'netwr' => array(
            'type' => 'Numeric'
        ),        
        'rewrt' => array(
            'type' => 'Numeric'
        ),
        'abstp' => array(
            'type' => 'Numeric'
        ),
        'abste' => array(
            'type' => 'Numeric'
        ),
        'aanfp' => array(
            'type' => 'Numeric'
        ),
        'aangp' => array(
            'type' => 'Numeric'
        ),
        'akonp' => array(
            'type' => 'Numeric'
        ),
        'alfpp' => array(
            'type' => 'Numeric'
        ),
        'alfpe' => array(
            'type' => 'Numeric'
        ),
        'alief' => array(
            'type' => 'Numeric'
        ),
        'mabw1' => array(
            'type' => 'Numeric'
        ),
        'mabw2' => array(
            'type' => 'Numeric'
        ),
        'mabw3' => array(
            'type' => 'Numeric'
        ),
        'mabw4' => array(
            'type' => 'Numeric'
        ),
        'mabw5' => array(
            'type' => 'Numeric'
        ),
        'tabw1' => array(
            'type' => 'Numeric'
        ),
        'tabw2' => array(
            'type' => 'Numeric'
        ),
        'tabw3' => array(
            'type' => 'Numeric'
        ),
        'tabw4' => array(
            'type' => 'Numeric'
        ),
        'tabw5' => array(
            'type' => 'Numeric'
        ),
        'tabw5' => array(
            'type' => 'Numeric'
        ),
        'lfzta' => array(
            'type' => 'Numeric'
        ),
        'lfztg' => array(
            'type' => 'Numeric'
        ),
        'menge_r' => array(
            'type' => 'Numeric'
        ),
        'remng_r' => array(
            'type' => 'Numeric'
        ),
        'wemng_r' => array(
            'type' => 'Numeric'
        ),
        'rewrt_r' => array(
            'type' => 'Numeric'
        ),
        'effwr_r' => array(
            'type' => 'Numeric'
        ),
        'wewrt' => array(
            'type' => 'Numeric'
        ),
        'remng_b' => array(
            'type' => 'Numeric'
        ),
        'wewrt_b' => array(
            'type' => 'Numeric'
        ),
        'rewrt_b' => array(
            'type' => 'Numeric'
        ),
        'remng_r_b' => array(
            'type' => 'Numeric'
        ),
        'rewrt_r_b' => array(
            'type' => 'Numeric'
        ),
        'wewrt_r_b' => array(
            'type' => 'Numeric'
        )
    );
    
    public function getSpmon() {
        if(strlen($this->spmon) == 6) {
            return substr($this->spmon, 4, 2);
        } else {
            return '';
        }        
    }
    
    public function getSpjah() {
        if(strlen($this->spmon) == 6) {
            return substr($this->spmon, 0, 4);
        } else {
            return '';
        }        
    }
}
