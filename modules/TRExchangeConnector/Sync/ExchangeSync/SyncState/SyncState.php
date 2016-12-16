<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\SyncState;


class SyncState {
    
    public static $NO_STATE = 0;
    public static $NO_MATCH = 1;
    public static $EXCHANGE_STATE_ONLY_MATCHES = 2;
    public static $HASH_ONLY_MATCHES = 3;
    public static $EXCHANGE_STATE_AND_HASH_MATCH = 4;
    
    protected $id;
    protected $userId = '';
    protected $upn = '';
    protected $exchangeId = '';
    protected $changeKey = '';
    protected $bean = '';
    protected $beanId = '';
    protected $beanHash = '';
    protected $dateModified;
    protected $deleted = 0;
    
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Model\ExchangeBaseModel $model
     */
    public function __construct($syncDef = null, $model = null) {
        
        if($syncDef) {
            $this->userId = $syncDef->getUserId();
            $this->upn = $syncDef->getUpn();
        }
        if($model) {
            $this->exchangeId = $model->getExchangeId();
            $this->changeKey = $model->getChangeKey();
            $this->bean = $model->getSugarBeanType();
            $this->beanId = $model->getSugarId();
            $this->beanHash = $model->getHash();
        }
    }

    public function isInSync($upn, $model) {
        
        $storedSyncState = $this->getStoredSyncState($upn, $model);
        
        if($storedSyncState === NULL) {
            return false;
        }
        
        $exchangeIdMatches = $storedSyncState['exchange_id'] === $model->getExchangeId();
        $changeKeyMatches = $storedSyncState['change_key'] === $model->getChangeKey();
        $modelHash = $model->getHash();
        $hashMatches = $storedSyncState['bean_hash'] === $model->getHash();
        
        return $exchangeIdMatches && $changeKeyMatches && $hashMatches;
    }
    
    public function exchangeSyncStateMatches($upn, $model) {
        
        $storedSyncState = $this->getStoredSyncState($upn, $model);
        
        if($storedSyncState === NULL) {
            return false;
        }
        
        $exchangeIdMatches = $storedSyncState['exchange_id'] === $model->getExchangeId();
        $changeKeyMatches = $storedSyncState['change_key'] === $model->getChangeKey();
        
        return $exchangeIdMatches && $changeKeyMatches;
    }
    
    public function compareToSyncState($model) {
        
        $exchangeIdMatches = $this->exchangeId === $model->getExchangeId();
        $changeKeyMatches = $this->changeKey === $model->getChangeKey();
        $modelHash = $model->getHash();
        $hashMatches = $this->beanHash === $model->getHash();
        
        if ($exchangeIdMatches && $changeKeyMatches && $hashMatches) {
            return self::$EXCHANGE_STATE_AND_HASH_MATCH;
        } elseif($hashMatches) {
            return self::$HASH_ONLY_MATCHES;
        } elseif($exchangeIdMatches && $changeKeyMatches) {
            return self::$EXCHANGE_STATE_ONLY_MATCHES;
        } else {
            return self::$NO_MATCH;
        }
    }
    
    public function updateWithModel($model) {
        
        $this->setExchangeId($model->getExchangeId());
        $this->setChangeKey($model->getChangeKey());
        $this->setBeanHash($model->getHash());
    }
    
    public function persistSyncState($upn, $model) {
        
        $syncState = $this->getStoredSyncState($upn, $model);
        if($syncState) {
            $this->updateSyncState($syncState['id'], $upn, $model);
        } else {
            $this->createSyncState($upn, $model);
        }
    }
    
    public function getStoredSyncState($upn, $model) {
        
        global $db;
        
        $query = "SELECT id, user_id, upn, exchange_id, change_key, bean, bean_id, bean_hash, date_modified, deleted "
                . "FROM exchangeobjectsyncstate "
                . "WHERE bean = '" . $model->getSugarBeanType() . "' AND bean_id ='" . $model->getSugarId() . "' AND upn = '" . $upn . "' AND deleted = 0";
        
        $result = $db->query($query);
        
        if($row = $db->fetchByAssoc($result)) {
            $syncState = $row;
        } else {
            $syncState = NULL;
        }
            
        return $syncState;
    }    
    
    protected function updateSyncState($id, $upn, $model) {
        
        global $db, $timedate;
        
        $quoteValue = function($value) {return "'" . $value . "'";};
        $assignments = array (
            'exchange_id' => $quoteValue($model->getExchangeId()), 
            'change_key' => $quoteValue($model->getChangeKey()),
            'bean_hash' => $quoteValue($model->getHash()),
            'date_modified' => $quoteValue($timedate->nowDb()),            
        );
        
        $setClauseParts = array();
        foreach($assignments as $field => $value) {
            $setClauseParts[]= $db->quote($field) . " = " . $value;
        }
        $setClause = implode(",", $setClauseParts);
        $query = "UPDATE exchangeobjectsyncstate SET " . $setClause . " WHERE id = '" . $id . "';";
        $db->query($query);
        
    }
    
    protected function createSyncState($upn, $model) {
        
        global $db, $timedate;
        
        $quoteValue = function($value) {return "'" . $value . "'";};
        $insertFields = array(
            'id' => $quoteValue(create_guid()), 
            'user_id' => $quoteValue(''), 
            'upn' => $quoteValue($upn), 
            'exchange_id' => $quoteValue($model->getExchangeId()), 
            'change_key' => $quoteValue($model->getChangeKey()), 
            'bean' => $quoteValue($model->getSugarBeanType()),
            'bean_id' => $quoteValue($model->getSugarId()),
            'bean_hash' => $quoteValue($model->getHash()),
            'date_modified' => $quoteValue($timedate->nowDb()),
            'deleted' => 0
        );
        
        $query = "INSERT INTO exchangeobjectsyncstate( " . implode(",", array_keys($insertFields)) . ") "
                . "VALUES (" . implode(",", array_values($insertFields)) . ");";
        $db->query($query);
    }
    
    public function getId() {
        return $this->id;
    }

    public function getUserId() {
        return $this->userId;
    }

    public function getUpn() {
        return $this->upn;
    }

    public function getExchangeId() {
        return $this->exchangeId;
    }

    public function getChangeKey() {
        return $this->changeKey;
    }

    public function getBean() {
        return $this->bean;
    }

    public function getBeanId() {
        return $this->beanId;
    }

    public function getBeanHash() {
        return $this->beanHash;
    }

    public function getDateModified() {
        return $this->dateModified;
    }

    public function getDeleted() {
        return $this->deleted;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setUserId($userId) {
        $this->userId = $userId;
    }

    public function setUpn($upn) {
        $this->upn = $upn;
    }

    public function setExchangeId($exchangeId) {
        $this->exchangeId = $exchangeId;
    }

    public function setChangeKey($changeKey) {
        $this->changeKey = $changeKey;
    }

    public function setBean($bean) {
        $this->bean = $bean;
    }

    public function setBeanId($beanId) {
        $this->beanId = $beanId;
    }

    public function setBeanHash($beanHash) {
        $this->beanHash = $beanHash;
    }

    public function setDateModified($dateModified) {
        $this->dateModified = $dateModified;
    }

    public function setDeleted($deleted) {
        $this->deleted = $deleted;
    }

    
}
