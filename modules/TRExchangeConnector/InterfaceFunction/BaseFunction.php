<?php

/*
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\InterfaceFunction;

/**
 * Description of BaseFunction
 *
 * @author thomaskerle
 */
class BaseFunction {
    
    protected $converter;
    
    public function __construct($formatConverter) {
        $this->converter = $formatConverter;
    }
    
    public function getModelMappings() {
        return array();
    }
    
    protected function createModelFromInterfaceData($interfaceData, $modelClass) {

        $model = new $modelClass();
        $modelVardefs = $model->getVardefs();
        $mappings = $this->getModelMappings();
        $interfaceDataMap = $mappings[$modelClass];
        foreach($interfaceDataMap as $interfaceField => $mapping) {
            $setter = "set" . ucfirst($mapping);
            $model->{$setter}($this->convertValueFromInterface($interfaceData[$interfaceField], $modelVardefs[$mapping]['type']));
        }
        return $model;
        
    }
    
    
    protected function convertValueFromInterface($value, $type) {
        
        if(!isset($this->converter)) {
            return $value;
        } else {
            return $this->converter->convertFromInterface($value,$type);
        }
        
    }

    protected function convertValueToInterface($value, $type) {
        
        if(!isset($this->converter)) {
            return $value;
        } else {
            return $this->converter->convertToInterface($value,$type);
        }
        
    }
}
