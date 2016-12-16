<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\SyncState;


class SyncStateRepository {
    
    public static $NO_STATE = 0;
    public static $NO_MATCH = 1;
    public static $EXCHANGE_STATE_ONLY_MATCHES = 2;
    public static $HASH_ONLY_MATCHES = 3;
    public static $EXCHANGE_STATE_AND_HASH_MATCH = 4;
    
    protected $tableName= 'exchangeobjectsyncstate';
    
    public function isInSync($syncDef, $model) {
        
        $storedSyncState = $this->getStoredSyncState($syncDef, $model);
        
        if($storedSyncState === NULL) {
            return false;
        }
        
        $exchangeIdMatches = $storedSyncState['exchange_id'] === $model->getExchangeId();
        $changeKeyMatches = $storedSyncState['change_key'] === $model->getChangeKey();
        $modelHash = $model->getHash();
        $hashMatches = $storedSyncState['bean_hash'] === $model->getHash();
        
        return $exchangeIdMatches && $changeKeyMatches && $hashMatches;
    }
    
    public function exchangeSyncStateMatches($syncDef, $model) {
        
        $storedSyncState = $this->getStoredSyncState($syncDef, $model);
        
        if($storedSyncState === NULL) {
            return false;
        }
        
        $exchangeIdMatches = $storedSyncState['exchange_id'] === $model->getExchangeId();
        $changeKeyMatches = $storedSyncState['change_key'] === $model->getChangeKey();
        
        return $exchangeIdMatches && $changeKeyMatches;
    }
    
    public function compareToSyncState($syncDef, $model) {
        
        $storedSyncState = $this->getStoredSyncState($syncDef, $model);
        
        if($storedSyncState === NULL) {
            return self::$NO_STATE;
        }
        
        $exchangeIdMatches = $storedSyncState['exchange_id'] === $model->getExchangeId();
        $changeKeyMatches = $storedSyncState['change_key'] === $model->getChangeKey();
        $modelHash = $model->getHash();
        $hashMatches = $storedSyncState['bean_hash'] === $model->getHash();
        
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
    
    public function persistSyncState($syncDef, $model) {
        
        $syncState = $this->getStoredSyncState($syncDef, $model);
        if($syncState) {
            $this->updateSyncState($syncState['id'], $syncDef, $model);
        } else {
            $this->createSyncState($syncDef, $model);
        }
    }
    
    /**
     * 
     * @global type $db
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param type $model
     * @return SyncState
     */
    public function getStoredSyncState($syncDef, $model) {
        
        global $db;
        
        $sugarId = $model->getSugarId();
        if(empty($sugarId)) {
            return NULL;
        }
        
        $query = "SELECT id, user_id, upn, exchange_id, change_key, bean, bean_id, bean_hash, date_modified, deleted "
                . "FROM exchangeobjectsyncstate "
                . "WHERE bean = '" . $model->getSugarBeanType() . "' AND bean_id ='" . $model->getSugarId() . "' AND upn = '" . $syncDef->getUpn() . "' AND user_id ='" . $syncDef->getUserId() . "' AND deleted = 0";
        
        $result = $db->query($query);
        
        if($row = $db->fetchByAssoc($result)) {
            $syncState = $this->createSyncStateFromRow($row);
        } else {
            $syncState = NULL;
        }
            
        return $syncState;
    }
    
    public function getStoredSyncStateByItemId($syncDef, $model) {
        
        global $db;
        
        $exchangeId = $model->getExchangeId();
        if(empty($exchangeId)) {
            return null;
        }
        
        $query = "SELECT id, user_id, upn, exchange_id, change_key, bean, bean_id, bean_hash, date_modified, deleted "
                . "FROM exchangeobjectsyncstate "
                . "WHERE exchange_id ='" . $exchangeId . "' AND upn = '" . $syncDef->getUpn() . "' AND user_id ='" . $syncDef->getUserId() . "' AND deleted = 0";
        
        $result = $db->query($query);
        
        if($row = $db->fetchByAssoc($result)) {
            $syncState = $this->createSyncStateFromRow($row);
        } else {
            $syncState = null;
        }
            
        return $syncState;        
    }
    
    /**
     * 
     * @param SyncState $syncState
     */
    public function delete($syncState) {

        global $db, $timedate;
        
        $quoteValue = function($value) {return "'" . $value . "'";};
        $assignments = array (
            'date_modified' => $db->convert($db->quoted($timedate->nowDb()),'datetime'),
            'deleted' => 1
        );
        
        $setClauseParts = array();
        foreach($assignments as $field => $value) {
            $setClauseParts[]= $db->quote($field) . " = " . $value;
        }
        $setClause = implode(",", $setClauseParts);
        $query = "UPDATE exchangeobjectsyncstate SET " . $setClause . " WHERE id = '" . $syncState->getId() . "'";
        $db->query($query);        
    }
    
    
    protected function updateSyncState($id, $syncDef, $model) {
        
        global $db, $timedate;
        
        $quoteValue = function($value) {return "'" . $value . "'";};
        $assignments = array (
            'exchange_id' => $quoteValue($model->getExchangeId()), 
            'change_key' => $quoteValue($model->getChangeKey()),
            'bean_hash' => $quoteValue($model->getHash()),
            'date_modified' => $db->convert($db->quoted($timedate->nowDb()),'datetime'),       
        );
        
        $setClauseParts = array();
        foreach($assignments as $field => $value) {
            $setClauseParts[]= $db->quote($field) . " = " . $value;
        }
        $setClause = implode(",", $setClauseParts);
        $query = "UPDATE exchangeobjectsyncstate SET " . $setClause . " WHERE id = '" . $id . "'";
        $db->query($query);
        
    }
    
    /**
     * 
     * @global \TRBusinessConnector\Sync\ExchangeSync\SyncState\type $db
     * @global type $timedate
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param type $model
     */
    protected function createSyncState($syncDef, $model) {
        
        global $db, $timedate;
        
        $quoteValue = function($value) {return "'" . $value . "'";};
        $insertFields = array(
            'id' => $quoteValue(create_guid()), 
            'user_id' => $quoteValue(''), 
            'upn' => $quoteValue($syncDef->getUpn()), 
            'exchange_id' => $quoteValue($model->getExchangeId()), 
            'change_key' => $quoteValue($model->getChangeKey()), 
            'bean' => $quoteValue($model->getSugarBeanType()),
            'bean_id' => $quoteValue($model->getSugarId()),
            'bean_hash' => $quoteValue($model->getHash()),
            'date_modified' => $db->convert($db->quoted($timedate->nowDb()),'datetime'),
            'deleted' => 0
        );
        
        $query = "INSERT INTO exchangeobjectsyncstate( " . implode(",", array_keys($insertFields)) . ") "
                . "VALUES (" . implode(",", array_values($insertFields)) . ")";
        $db->query($query);
    }
    
    protected function createSyncStateFromRow($row) {
        
        $syncState = new SyncState();
        $syncState->setId($row['id']);
        $syncState->setUserId($row['user_id']);
        $syncState->setUpn($row['upn']);
        $syncState->setExchangeId($row['exchange_id']);
        $syncState->setChangeKey($row['change_key']);
        $syncState->setBean($row['bean']);
        $syncState->setBeanId($row['bean_id']);
        $syncState->setBeanHash($row['bean_hash']);
        $syncState->setDateModified(new \SugarDateTime($row['date_modified']));
        $syncState->setDeleted($row['deleted']);
        return $syncState;
        
    }
    
    /**
     * 
     * @global \DBManager $db
     * @param SyncDef $syncDef
     */
    public function save($syncState) {
        
        global $db, $timedate;
        
        $quoteString = function($string) {
            return "'" . $string . "'";
        };
        
        $timestamp = new \SugarDateTime();
        
        $assignments = array (
            'user_id' => $quoteString($syncState->getUserId()), 
            'upn' => $quoteString($syncState->getUpn()), 
            'exchange_id' => $quoteString($syncState->getExchangeId()), 
            'change_key' => $quoteString($syncState->getChangeKey()), 
            'bean' => $quoteString($syncState->getBean()),
            'bean_id' => $quoteString($syncState->getBeanId()),
            'bean_hash' => $quoteString($syncState->getBeanHash()),
            'date_modified' => $db->convert($db->quoted($timedate->nowDb()),'datetime'),
            'deleted' => $syncState->getDeleted()
        );
        
        $id = $syncState->getId();
        if(empty($id)) {
            $newId = create_guid();
            $assignments['id'] = $quoteString($newId);
            $syncState->setId($newId);
            $query = $this->createInsertQuery($assignments);
        } else {
            $query = $this->createUpdateQuery($quoteString($id), $assignments);
        }
        
        $db->query($query);
        return $syncState;
    }
    
    public function purgeSyncState($syncDef) {
        
        global $db;
        
        $sugarBeanWhere = "'" . implode("','", $syncDef->getSugarBeanTypes()) . "'";
        
        $query = "DELETE FROM exchangeobjectsyncstate "
                . "WHERE upn = '" . $syncDef->getUpn() . "' AND user_id ='" . $syncDef->getUserId() . "' AND bean IN (" . $sugarBeanWhere . ")";
        
        $result = $db->query($query);
    }
    
    private function createUpdateQuery($id, $assignments) {
        
        $setClauseParts = array();
        foreach($assignments as $property => $value) {
            $setClauseParts[] = $property . " = " . $value;
        }
        $setClause = implode(",", $setClauseParts);
        
        $query = "UPDATE " . $this->tableName . " "
                . "SET " . $setClause . " "
                . "WHERE id = " . $id;
        return $query;
    }
    
    private function createInsertQuery($assignments) {
        
        global $db;
        
        $fieldListParts = array();
        $valueListParts = array();
        
        foreach($assignments as $property => $value) {
            $fieldListParts[] = $db->quote($property);
            $valueListParts[] = $value;
        }
        
        $fieldList = implode(",", $fieldListParts);
        $valueList = implode(",", $valueListParts);
        
        $query = "INSERT INTO " . $this->tableName . "(" . $fieldList . ") "
                . "VALUES(" . $valueList . ")";
        return $query;
    }
    
    
    
    
}
