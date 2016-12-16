<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\SyncDef;


class SyncDef {
    
    private $id;
    private $syncType;
    private $userId;
    private $server;
    private $upn;
    private $distinguishedFolderName;
    private $folderId;
    private $initialSyncFromExchangeCompleted;
    private $initialSyncToExchangeCompleted;
    private $exchangeSyncState;
    /**
     *
     * @var \SugarDateTime
     */
    private $startAfter;
    /**
     *
     * @var \SugarDateTime
     */
    private $sugarLastSyncDate;
    private $nextOffset;    
    /**
     *
     * @var \SugarDateTime 
     */
    private $dateModified;
    private $deleted;

    function getId() {
        return $this->id;
    }

    function getSyncType() {
        return $this->syncType;
    }

    function getUserId() {
        return $this->userId;
    }
    
    function getServer() {
        return $this->server;
    }    

    function getUpn() {
        return $this->upn;
    }

    function getDistinguishedFolderName() {
        return $this->distinguishedFolderName;
    }

    function getFolderId() {
        return $this->folderId;
    }

    function getInitialSyncFromExchangeCompleted() {
        return $this->initialSyncFromExchangeCompleted;
    }

    function getInitialSyncToExchangeCompleted() {
        return $this->initialSyncToExchangeCompleted;
    }

    function getExchangeSyncState() {
        return $this->exchangeSyncState;
    }

    public function getStartAfter() {
        return $this->startAfter;
    }

    function getSugarLastSyncDate() {
        return $this->sugarLastSyncDate;
    }
    
    public function getNextOffset() {
        return $this->nextOffset;
    }    

    function getDateModified() {
        return $this->dateModified;
    }

    function getDeleted() {
        return $this->deleted;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setSyncType($syncType) {
        $this->syncType = $syncType;
    }

    function setUserId($userId) {
        $this->userId = $userId;
    }
    
    function setServer($server) {
        $this->server = $server;
    }
    
    function setUpn($upn) {
        $this->upn = $upn;
    }

    function setDistinguishedFolderName($distinguishedFolderName) {
        $this->distinguishedFolderName = $distinguishedFolderName;
    }

    function setFolderId($folderId) {
        $this->folderId = $folderId;
    }

    function setInitialSyncFromExchangeCompleted($initialSyncFromExchangeCompleted) {
        $this->initialSyncFromExchangeCompleted = $initialSyncFromExchangeCompleted;
    }

    function setInitialSyncToExchangeCompleted($initialSyncToExchangeCompleted) {
        $this->initialSyncToExchangeCompleted = $initialSyncToExchangeCompleted;
    }

    function setExchangeSyncState($syncState) {
        $this->exchangeSyncState = $syncState;
    }

    public function setStartAfter(\SugarDateTime $startAfter) {
        $this->startAfter = $startAfter;
    }
    
    function setSugarLastSyncDate(\SugarDateTime $sugarLastSyncDate) {
        $this->sugarLastSyncDate = $sugarLastSyncDate;
    }
    
    public function setNextOffset($nextOffset) {
        $this->nextOffset = $nextOffset;
    }    

    function setDateModified($dateModified) {
        $this->dateModified = $dateModified;
    }

    function setDeleted($deleted) {
        $this->deleted = $deleted;
    }

    function getArrayForJson() {
        
        global $timedate;
        
        $vars = get_object_vars($this);
        foreach($vars as &$var) {
            if(is_a($var, 'SugarDateTime')) {
                $var = $timedate->asUser($var);
            }            
        }
        return $vars;
    }
    
    function reset() {
        $this->initialSyncFromExchangeCompleted = false;
        $this->initialSyncToExchangeCompleted = false;
        $this->sugarLastSyncDate = null;
        $this->exchangeSyncState = null;
        $this->nextOffset = 0;
    }
    
    function getSugarBeanTypes() {
        
        switch($this->syncType) {
            case 'Contacts':
                return array('Contact');
            case 'Tasks':
                return array('Task');
            case 'CalendarItems':
                return array('Meeting','Call');
        }
    }
}
