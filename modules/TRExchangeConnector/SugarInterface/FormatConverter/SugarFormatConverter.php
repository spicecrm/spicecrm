<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */


/**
 * Description of RfcFormatConverter
 *
 * @author thomaskerle
 */
namespace TRBusinessConnector\SugarInterface\FormatConverter;

class SugarFormatConverter extends \TRBusinessConnector\FormatConverter\AbstractFormatConverter {
    
    public function convertFromInterface($value, $type) {
        
        switch($type) {
            case 'String':
                return $this->convertStringFromInterface($value);
            case 'Numeric':
                return $this->convertNumericFromInterface($value);
            case 'Date':
                return $this->convertDateFromInterface($value);
            case 'Time':
                return $this->convertTimeFromInterface($value);
            case 'DateTime':
                return $this->convertDateTimeFromInterface($value);
            case 'Bool':
                return $this->convertBoolFromInterface($value);
            default:
                throw new \Exception('Type ' . $type . 'not recognized');
        }
    }
    
    public function convertToInterface($value, $type) {
        
        switch($type) {
            case 'String':
                return $this->convertStringToInterface($value);
            case 'Numeric':
                return $this->convertNumericToInterface($value);
            case 'Date':
                return $this->convertDateToInterface($value);
            case 'Time':
                return $this->convertTimeToInterface($value);
            case 'DateTime':
                return $this->convertDateTimeToInterface($value);
            case 'Bool':
                return $this->convertBoolToInterface($value);                
            default:
                throw new \Exception('Type ' . $type . 'not recognized');
        }
    }    
    
    protected function convertStringFromInterface($value) {
        return html_entity_decode($value);
    }
    
    protected function convertStringToInterface($value) {
        return $value;
    }    
    
    protected function convertDateFromInterface($value) {
        return $value;
    }
    
    protected function convertDateToInterface($value) {
        return $value->asDbDate();
    }
    
    protected function convertTimeFromInterface($value) {
        return $value;
    }
    
    protected function convertTimeToInterface($value) {
        return $value->format("H:i:s");
    }
    
    protected function convertDateTimeFromInterface($value) {
        
        global $timedate, $current_user;
        if($value) {
            $GLOBALS['log']->fatal('SugarFormatConverter ' . __FUNCTION__ . ' conversion failed for value ' . print_r($value, true));            
            $sugarDateTimeObject = $timedate->fromUser($value);
            $GLOBALS['log']->fatal('SugarFormatConverter ' . __FUNCTION__ . ' conversion failed for value ' . print_r($current_user, true));                        
            $sugarDateTimeObject->setTimezone(new \DateTimeZone('UTC'));
            return $sugarDateTimeObject;
        } else {
            return null;
        }
    }
    
    protected function convertDateTimeToInterface($value) {
        
        if(is_object($value) && is_a($value,'SugarDateTime')) {            
            return $value->asDb();
        } else {
            return '';
        }
    }
    
    protected function convertNumericFromInterface($value) {
        return $value;
    }
    
    protected function convertNumericToInterface($value) {
        return $value;
    }
    
    protected function convertBoolFromInterface($value) {
        return $value;
    }
    
    protected function convertBoolToInterface($value) {
        return $value;
    }
}
