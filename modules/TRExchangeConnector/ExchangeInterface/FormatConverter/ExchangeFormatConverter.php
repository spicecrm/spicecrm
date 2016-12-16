<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\FormatConverter;

class ExchangeFormatConverter extends \TRBusinessConnector\FormatConverter\AbstractFormatConverter {
    
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
            case 'StringCollection':
                return $this->convertStringCollectionFromInterface($value);                                
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
            case 'StringCollection':
                return $this->convertStringCollectionToInterface($value);                
            default:
                throw new \Exception('Type ' . $type . 'not recognized');
        }
    }
    
    protected function convertDateFromInterface($value) {
        return $value;
    }

    protected function convertDateTimeFromInterface($value) {
        if($value) {
            $sugarDateTimeObject = \SugarDateTime::createFromFormat(\DateTime::RFC3339, $value, new \DateTimeZone('UTC'));
            return $sugarDateTimeObject;
        }
        return $value;        
    }

    protected function convertDateTimeToInterface($value) {        
        if(is_a($value, 'SugarDateTime')) {
            return $value->format('Y-m-d\TH:i:s\Z');
        } else {
            return null;
        }      
    }

    protected function convertDateToInterface($value) {
        return $value;        
    }

    protected function convertNumericFromInterface($value) {
        return $value;        
    }

    protected function convertNumericToInterface($value) {
        return $value;        
    }

    protected function convertStringFromInterface($value) {
        return $value;        
    }

    protected function convertStringToInterface($value) {
        return $value;        
    }

    protected function convertTimeFromInterface($value) {
        return $value;        
    }

    protected function convertTimeToInterface($value) {
        return $value;        
    }

    protected function convertBoolFromInterface($value) {
        return $value ? true : false;        
    }

    protected function convertBoolToInterface($value) {
        return $value ? 'true' : 'false';        
    }
    
    protected function convertStringCollectionFromInterface($value) {
        
        if(!isset($value->String)) {
            return array();
        }        
        return $value->String;
    }    
    
    protected function convertStringCollectionToInterface($value) {
        
        if(is_array($value)) {
            $valueArray = $value;
        } else {
            $valueArray = array($value);            
        }
        $convertedValue = new \stdClass();
        $convertedValue->String = $valueArray;
        return $convertedValue;
    }
}
