<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\Sync\ExchangeSync\SyncDef;

class SyncDefRepository {
    
    protected $dbFields = array (
        'id',
        'sync_type',
        'user_id',
        'server',
        'upn',
        'distinguished_folder_name',
        'folder_id',
        'initial_from_exchange_compl',
        'initial_to_exchange_compl',
        'exchange_sync_state',
        'start_after',
        'sugar_last_sync_date',
        'next_offset',
        'date_modified',
        'deleted'
    );
    
    protected $tableName = "exchangesyncdefs";
    
    /**
     * 
     * @param string $id
     * @return SyncDef
     */
    public function get($id) {
        
        global $db;
        
        $fieldList = implode(",", $this->dbFields);
        
        $query = "SELECT " . $fieldList . " FROM " . $this->tableName . " "
                . "WHERE id='" . $db->quote($id) . "'" ;
        $result = $db->limitQuery($query, 0 ,1);
        if($row = $db->fetchByAssoc($result)) {
            return $this->createSyncDefFromDbRow($row);
        } else {
            return NULL;
        }        
    }
    
    /**
     * 
     * @global \DBManager $db
     * @return SyncDef
     */
    public function getOldestSyncDefForInitialSyncFromExchange() {
        
        global $db;
        
        $fieldList = implode(",", $this->dbFields);
        
        $query = "SELECT " . $fieldList . " FROM " . $this->tableName . " "
                . "WHERE initial_from_exchange_compl = 0 AND deleted = 0 ORDER BY date_modified";
        $result = $db->limitQuery($query, 0 ,1);
        if($row = $db->fetchByAssoc($result)) {
            return $this->createSyncDefFromDbRow($row);
        } else {
            return NULL;
        }
    }   
    
    /**
     * 
     * @global \DBManager $db
     * @return SyncDef
     */
    public function getOldestSyncDefForInitialSyncToExchange() {
        
        global $db;
        
        $fieldList = implode(",", $this->dbFields);
        
        $query = "SELECT " . $fieldList . " FROM " . $this->tableName . " "
                . "WHERE initial_from_exchange_compl = 1 AND initial_to_exchange_compl = 0 AND deleted = 0 ORDER BY date_modified";
        $result = $db->limitQuery($query, 0 ,1);
        if($row = $db->fetchByAssoc($result)) {
            return $this->createSyncDefFromDbRow($row);
        } else {
            return NULL;
        }
    }

    /**
     * 
     * @global \DBManager $db
     * @param SyncDef $syncDef
     */    
    public function getNextSyncDefForInitialSync($cutOffDate = null) {

        global $db;
        
        if(null === $cutOffDate) {
            $cutOffDate = new \SugarDateTime();
        }        
        
        $fieldList = implode(",", $this->dbFields);
        
        $query = "SELECT " . $fieldList . " FROM " . $this->tableName . " "
                . "WHERE NOT(initial_from_exchange_compl = 1 AND initial_to_exchange_compl = 1) AND deleted = 0 AND date_modified < '" . $cutOffDate->asDb() . "' ORDER BY date_modified";
        $result = $db->limitQuery($query, 0 ,1);
        if($row = $db->fetchByAssoc($result)) {
            return $this->createSyncDefFromDbRow($row);
        } else {
            return NULL;
        }
    }   
    
    /**
     * 
     * @global \DBManager $db
     * @param \SugarDateTime $cutOffDate
     */    
    public function getNextSyncDefForSync($cutOffDate = null) {

        global $db;
        
        if(null === $cutOffDate) {
            $cutOffDate = new \SugarDateTime();
        }
        
        $fieldList = implode(",", $this->dbFields);
        
        $query = "SELECT " . $fieldList . " FROM " . $this->tableName . " "
                . "WHERE initial_from_exchange_compl = 1 AND initial_to_exchange_compl = 1 AND deleted = 0 AND date_modified < '" . $cutOffDate->asDb() . "' ORDER BY date_modified";
        $result = $db->limitQuery($query, 0 ,1);
        if($row = $db->fetchByAssoc($result)) {
            return $this->createSyncDefFromDbRow($row);
        } else {
            return NULL;
        }
    }
    
    /**
     * 
     * @param string $userId
     */
    public function getSyncDefListForUserId($userId) {
        
        global $db;
        
        if(!$userId) {
            return array();
        }
        
        $fieldList = implode(",", $this->dbFields);
        
        $query = "SELECT " . $fieldList . " FROM " . $this->tableName . " "
                . "WHERE user_id = '" . $db->quote($userId) . "'";
        
        $result = $db->query($query);
        $list = array();
        while($row = $db->fetchByAssoc($result)) {
            $list[] = $this->createSyncDefFromDbRow($row);
        }
        return $list;
    }
    
    public function getSyncUserIds() {
        
        global $db;
        
        $query = "SELECT user_id FROM " . $this->tableName . " "
                . "GROUP BY user_id";
        $result = $db->query($query);
        $list = array();
        while($row = $db->fetchByAssoc($result)) {
            $list[] = $row['user_id'];
        }
        return $list;        
    }
    
    /**
     * 
     * @global \DBManager $db
     * @param SyncDef $syncDef
     */
    public function save($syncDef) {
        
        global $db;
        
        $timestamp = new \SugarDateTime();
        
        $assignments = array (
            'user_id' => $db->quoted($syncDef->getUserId()),
            'server' => $db->quoted($syncDef->getServer()),
            'upn' => $db->quoted($syncDef->getUpn()),
            'distinguished_folder_name' => $db->quoted($syncDef->getDistinguishedFolderName()),
            'folder_id' => $db->quoted($syncDef->getFolderId()),
            'initial_from_exchange_compl' => $syncDef->getInitialSyncFromExchangeCompleted() ? 1 : 0,
            'initial_to_exchange_compl' => $syncDef->getInitialSyncToExchangeCompleted() ? 1 : 0,
            'sync_type' => $db->quoted($syncDef->getSyncType()),
            'exchange_sync_state' => $this->createClobValue($db->quote($syncDef->getExchangeSyncState())),
            'start_after' => $db->convert($syncDef->getStartAfter() ? $db->quoted($syncDef->getStartAfter()->asDb()) : "'0001-01-01 00:00:00'", 'datetime'),
            'sugar_last_sync_date' => $db->convert($syncDef->getSugarLastSyncDate() ? $db->quoted($syncDef->getSugarLastSyncDate()->asDb()) : "'0001-01-01 00:00:00'", 'datetime'),
            'next_offset' => ($syncDef->getNextOffset() !== null ? $syncDef->getNextOffset() : 0),
            'date_modified' => $db->convert($db->quoted($timestamp->asDb()),'datetime'),
            'deleted' => $syncDef->getDeleted() ? 1 : 0,
        );
        
        $id = $syncDef->getId();
        if(empty($id)) {
            $assignments['id'] = $db->quoted(create_guid());
            $query = $this->createInsertQuery($assignments);
        } else {
            $query = $this->createUpdateQuery($db->quoted($id), $assignments);
        }
        
        $db->query($query);
        return $syncDef;
    }
    
    
    /**
     * 
     * @param SyncDef $syncDef
     */
    public function deletePermanently($syncDef) {
        
        global $db;
        
        if(!$syncDef) {
            return;
        }
        
        $query = "DELETE FROM " . $this->tableName . " WHERE id = '" . $db->quote($syncDef->getId()) . "'";
        $db->query($query);
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
        
        $fieldListParts = array();
        $valueListParts = array();
        
        foreach($assignments as $property => $value) {
            $fieldListParts[] = $property;
            $valueListParts[] = $value;
        }
        
        $fieldList = implode(",", $fieldListParts);
        $valueList = implode(",", $valueListParts);
        
        $query = "INSERT INTO " . $this->tableName . "(" . $fieldList . ") "
                . "VALUES(" . $valueList . ")";
        
        return $query;
    }
    
    /**
     * 
     * @param array $dbRow
     * @return \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef
     */
    private function createSyncDefFromDbRow($dbRow) {
        
        global $timedate;
        
        $syncDef = new SyncDef();
        $syncDef->setId($dbRow['id']);
        $syncDef->setSyncType(trim($dbRow['sync_type']));
        $syncDef->setUserId($dbRow['user_id']);
        $syncDef->setServer($dbRow['server']);
        $syncDef->setUpn($dbRow['upn']);
        $syncDef->setExchangeSyncState($dbRow['exchange_sync_state']);
        $syncDef->setInitialSyncFromExchangeCompleted($dbRow['initial_from_exchange_compl'] ? TRUE : FALSE);
        $syncDef->setInitialSyncToExchangeCompleted($dbRow['initial_to_exchange_compl'] ? TRUE : FALSE);
        $syncDef->setStartAfter($dbRow['start_after'] ? $timedate->fromDb($dbRow['start_after']) : null);
        $syncDef->setSugarLastSyncDate($dbRow['sugar_last_sync_date'] ? $timedate->fromDb($dbRow['sugar_last_sync_date']) : null);
        $syncDef->setNextOffset($dbRow['next_offset']);
        $syncDef->setDeleted($dbRow['deleted'] ? TRUE : FALSE);
        return $syncDef;
    }
    
    private function createClobValue($stringValue) {
        
        $toClob = function($s) {return "to_clob('" . $s . "')";};
        $clobs = array_map($toClob, str_split($stringValue,3500));
        return implode("||",$clobs);
    }
}
