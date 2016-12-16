<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;
use TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncState;
use TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound;

ini_set('memory_limit', -1);

class BaseSync {

    /**
     *
     * @var \TRBusinessConnector\ExchangeInterface\ExchangeInterface 
     */
    protected $exchangeInterface;
    
    /**
     *
     * @var \TRBusinessConnector\SugarInterface\SugarInterface
     */
    protected $sugarInterface;
    
    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncStateRepository
     */
    protected $syncStateRepository;
    
    protected $logger;
    protected $errorLogger;
    
    public function __construct() {
        
        global $sugar_config;
        
        $this->exchangeInterface = \TRBusinessConnector\ExchangeInterface\ExchangeInterface::getInstance();
        $this->sugarInterface = new \TRBusinessConnector\SugarInterface\SugarInterface();
        $this->syncStateRepository = new \TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncStateRepository();
        if(isset($sugar_config['TRExchangeSync']['log_level'])) {
            $logLevel = $sugar_config['TRExchangeSync']['log_level'];
        } else {
            $logLevel = \Psr\Log\LogLevel::INFO;
        }        
        $this->logger = new \Katzgrau\KLogger\Logger($sugar_config['log_dir'] . DIRECTORY_SEPARATOR . 'TRExchangeSyncLogs/Sync', $logLevel);
        $this->errorLogger = new \Katzgrau\KLogger\Logger($sugar_config['log_dir'] . DIRECTORY_SEPARATOR . 'TRExchangeSyncLogs/Errors', \Psr\Log\LogLevel::DEBUG);
    }
    
    function updateStates($compoundsWithResults) {

        $updateState = function($compoundWithResult) {
            $compound = $compoundWithResult[0];
            $result = $compoundWithResult[1];
            if ($result['responseClass'] === "Success") {
                $model = $result['model'];
                $newSyncState = clone $compound->getSyncState();
                $newSyncState->updateWithModel($model);
                $newCompound = new ModelSyncStateCompound($model, $newSyncState, SyncState::$EXCHANGE_STATE_AND_HASH_MATCH);
                return array($newCompound, $result);
            } else {
                return $compoundWithResult;
            }
        };
        $processedCompounds = array_map($updateState, $compoundsWithResults);
        return $processedCompounds;
    }

}
