<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound;
use TRBusinessConnector\Model\AbstractModel;
use TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncState;

class ModelSyncStateCompound {
    
    /**
     *
     * @var AbstractModel
     */
    protected $model;
    /**
     *
     * @var SyncState
     */
    protected $syncState;
    protected $syncStateCondition;
    
    function getModel() {
        return $this->model;
    }

    function getSyncState() {
        return $this->syncState;
    }

    function getSyncStateCondition() {
        return $this->syncStateCondition;
    }

    function setModel(AbstractModel $model) {
        $this->model = $model;
    }

    function setSyncState(SyncState $syncState) {
        $this->syncState = $syncState;
    }

    function setSyncStateCondition($syncStateCondition) {
        $this->syncStateCondition = $syncStateCondition;
    }
    
    public function __construct(AbstractModel $model, SyncState $syncState, $syncStateCondition) {
        $this->model = $model;
        $this->syncState = $syncState;
        $this->syncStateCondition = $syncStateCondition;
    }

}
