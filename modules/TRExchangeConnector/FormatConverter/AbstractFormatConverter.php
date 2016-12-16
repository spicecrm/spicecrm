<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

/**
 * Description of AbstractFormatConverter
 *
 * @author thomaskerle
 */
namespace TRBusinessConnector\FormatConverter;

abstract class AbstractFormatConverter {

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
            default:
                throw new \Exception('Type ' . $type . 'not recognized');
        }
    }
    
    
    abstract protected function convertStringFromInterface($value);
    
    abstract protected function convertStringToInterface($value);    
    
    abstract protected function convertNumericFromInterface($value);
    
    abstract protected function convertNumericToInterface($value);    
    
    abstract protected function convertDateFromInterface($value);
    
    abstract protected function convertDateToInterface($value);
    
    abstract protected function convertTimeFromInterface($value);
    
    abstract protected function convertTimeToInterface($value);    
    
    abstract protected function convertDateTimeFromInterface($value);
    
    abstract protected function convertDateTimeToInterface($value);    
    
}
