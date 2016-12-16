<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\Model;


class ExchangeBaseModel extends AbstractModel {
    
    protected $commonVardefs = array(
        'sugarId' => array (
            'type' => 'String',
            'useForHash' => true,
        ),
        'sugarSync' => array (
            'type' => 'Bool',
        ),
        'exchangeId' => array (
            'type' => 'String'
        ),
        'changeKey' => array (
            'type' => 'String',
        ),
        'dateModified' => array(
            'type' => 'DateTime'
        ),
        'deleted' => array(
            'type' => 'Bool'
        )
    );
    
    protected $modelVardefs = array();
    
    protected $hashFields;
    
    public function __construct() {
        $this->vardefs = array_merge($this->commonVardefs, $this->modelVardefs);
    }
    
    public function __get($name) {
        if (!array_key_exists($name, $this->vardefs)) {
            throw new \Exception("field " . $name . " not defined");
        }
        if(isset($this->{$name})) {
            return $this->{$name};
        } else {
            return null;
        }
    }
    
    public function getHash() {
        
        $hashFields = $this->getHashFields();
        $model = $this;
        $appendHashString = function($hashString, $field) use ($model) {
            $getter = "get" . ucfirst($field);
            $newHashString = $hashString . $field . trim($model->valueToString($model->{$getter}()));
            return $newHashString;
        };
        $hashString  = array_reduce($hashFields, $appendHashString, "");
        return hash('md5', $hashString);
    }
    
    protected function getHashFields() {
        
        if(!isset($this->hashFields)) {
            $filterHashFields = function($vardef) {
                return isset($vardef['useForHash']) && $vardef['useForHash'] === true;
            };
            $hashFields = array_keys(array_filter($this->getVardefs(), $filterHashFields));
            sort($hashFields);
            $this->hashFields = $hashFields;
        }
        return $this->hashFields;
    }
    
    public function valueToString($value) {
        
        if(is_object($value) && is_a($value, 'SugarDateTime')) {
            return $value->asDb();
        } else {
            return (string) $value;
        }
    }
    
    public function getSugarBeanType() {
        
        return 'ExchangeBaseModel';
    }
    
    public function compareHashFields(ExchangeBaseModel $modelToCompare) {
        
        $hashFields = $this->getHashFields();
        $differences = array();
        foreach($hashFields as $hashField) {
            $getter = "get" . ucfirst($hashField);
            if($this->$getter() !== $modelToCompare->$getter()) {
                $differences[$hashField] = array(
                    $this->$getter(),
                    $modelToCompare->$getter()
                );
            }
        }
        return $differences;
    }
    
}
