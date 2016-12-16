<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;
use TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncState;

class SyncItemsInitialFromExchange extends SyncItems {
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @return \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef
     */
    public function synchronize($syncDef) {
        
        $user = new \User();
        $user->retrieve($syncDef->getUserId());
        
        try {
            $this->logger->info($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Starting inital sync from Exchange");
            $this->logger->debug($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . '$syncDef: ', get_object_vars($syncDef));                                

            $exchangeSyncData = $this->getExchangeSyncData($syncDef);
            $processExchangeResult = $exchangeSyncData['modelSyncState'];

            $syncLogicResult = $this->loadSugarItemsForExchangeResult($syncDef, $user, $processExchangeResult);

            // process the lists        
            $createSugarResult = $this->createItemsInSugar($syncDef, $syncLogicResult);
            $updateSugarResult = $this->updateItemsInSugar($syncDef, $createSugarResult);
            $updateExchangeResult = $this->updateItemsInExchange($syncDef, $updateSugarResult);
            $createExchangeResult = $this->createItemsInExchange($syncDef, $updateExchangeResult);
            $this->persistSyncStates($syncDef, $createExchangeResult);
            $this->logErrors($user, $syncDef, $createExchangeResult);

            $updatedSyncDef = clone $syncDef;
            $updatedSyncDef->setInitialSyncFromExchangeCompleted($exchangeSyncData['includesLastItemInRange']);
            $updatedSyncDef->setExchangeSyncState($exchangeSyncData['exchangeSyncState']);
            $this->logger->info($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Finished initial sync from Exchange");        
        } catch (\Exception $ex) {
            $this->errorLogger->error($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Error in initial sync from exchange: " . $ex->getMessage());            
            $updatedSyncDef = clone $syncDef;
        }
        return $updatedSyncDef;
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $syncQueueContainer
     * @return \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer
     */
    protected function mockProcessing($syncDef, $syncQueueContainer) {
        
        $mockResult = clone $syncQueueContainer;
        $mockResult->updateInExchange = array();
        $mockResult->updateState = array_merge($syncQueueContainer->updateInExchange, $syncQueueContainer->updateState);
        return $mockResult;
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \User $user
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $modelSyncState
     * @return \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer
     */
    protected function loadSugarItemsForExchangeResult($syncDef, $user, $modelSyncState) {
        
        $itemCompounds = $modelSyncState->updateInSugar;
        
        $getSugarIdBeanPair = function($modelCompound) {
            $model = $modelCompound->getModel();
            return array (
                $model->getSugarId(),
                $model->getSugarBeanType()
            );
        };       
        
        $sugarIdBeanPairsOfExchangeUpdateModels = array_map($getSugarIdBeanPair, $itemCompounds);        
        $sugarRetrieves = $this->sugarInterface->{$this->getSugarItemsFunctionName}($sugarIdBeanPairsOfExchangeUpdateModels, $user);
        
        $modelRetrievePairs = array_map(null, $itemCompounds, $sugarRetrieves);
        
        $filterSuccessfulRetrieves = function($modelRetrievePairs) {
            list($itemCompound,$sugarRetrieve) = $modelRetrievePairs;            
            return $sugarRetrieve['responseClass'] === 'Success';
        };
        
        $filterFailedRetrieves = function($modelRetrievePairs) {
            list($itemCompound,$sugarRetrieve) = $modelRetrievePairs;            
            return $sugarRetrieve['responseClass'] !== 'Success';
        };
        
        $successfulModelRetrievePairs = array_filter($modelRetrievePairs, $filterSuccessfulRetrieves);
        $failedModelRetrievePairs = array_filter($modelRetrievePairs, $filterFailedRetrieves);
        
        $syncLogic = function($modelRetrievePairs) {
            list($exchangeCompound, $sugarRetrieve) = $modelRetrievePairs;
            $model = $sugarRetrieve['model'];
            $syncState = $exchangeCompound->getSyncState();
            $syncStateCondition = $exchangeCompound->getSyncStateCondition();
            $newCompound = new \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound($model, $syncState, $syncStateCondition);
            return $newCompound;
        };
        
        $updateExchangeResult = array_map($syncLogic, $successfulModelRetrievePairs);        
        
        $result = clone $modelSyncState;
        $result->updateInSugar = array();
        $result->updateInExchange = $updateExchangeResult;
        $result->doNotProcess = array_merge($modelSyncState->doNotProcess, $failedModelRetrievePairs);
        $result->errors = array_merge($modelSyncState->errors, $failedModelRetrievePairs);
        return $result;
    }
        
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param type $exchangeResponse
     * @return \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer
     */
    protected function processExchangeResponse($syncDef, $exchangeResponse) {
        
        $result = new \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer;

        // determine contacts from exchange which have to be stored to Sugar
        $getItems = function($responseEntry) {
            return $responseEntry['model'];
        };
        $exchangeItems = array_map($getItems, $exchangeResponse);
        $exchangeItemSyncStateCompounds = $this->createModelSyncStateCompounds($syncDef, $exchangeItems);
        
        $filterExchangeContactsToIgnore = function($itemSyncStateCompound) {
            
            $exchangeOnlyItem = function($contact) {
                $sugarId = $contact->getSugarId();
                $sugarIdNotSet = empty($sugarId);
                $syncFlagSet = $contact->getSugarSync();
                $syncFlagNotSet = !$syncFlagSet;
                if($sugarIdNotSet &&  $syncFlagNotSet) {
                    return TRUE;                     
                } else { 
                    return FALSE;
                }
            };            
            $item = $itemSyncStateCompound->getModel();
            $syncStateCondition = $itemSyncStateCompound->getSyncStateCondition();
            return $exchangeOnlyItem($item) || SyncState::$EXCHANGE_STATE_AND_HASH_MATCH === $syncStateCondition;
        };
        
        $filterContactsToCreate = function($itemSyncStateCompound) {
            $item = $itemSyncStateCompound->getModel();
            $sugarId = $item->getSugarId();
            return empty($sugarId) && $item->getSugarSync();
        };
        
        $filterContactsToUpdate = function($itemSyncStateCompound) {
            
            $syncItem = function($item) {
                $sugarId = $item->getSugarId();
                $sugarIdSet = !empty($sugarId);
                $syncFlagSet = $item->getSugarSync();
                if($sugarIdSet &&  $syncFlagSet) {
                    return TRUE;                     
                } else { 
                    return FALSE;
                }
            };                        
            $item = $itemSyncStateCompound->getModel();
            $syncStateCondition = $itemSyncStateCompound->getSyncStateCondition();
            return $syncItem($item) && SyncState::$EXCHANGE_STATE_AND_HASH_MATCH !== $syncStateCondition;
        };
        
        $exchangeItemsToIgnore = array_filter($exchangeItemSyncStateCompounds, $filterExchangeContactsToIgnore);        
        $exchangeItemsToCreate = array_filter($exchangeItemSyncStateCompounds, $filterContactsToCreate);
        $exchangeItemsToUpdate = array_filter($exchangeItemSyncStateCompounds, $filterContactsToUpdate);
        
        $result->doNotProcess = $exchangeItemsToIgnore;        
        $result->createInSugar = $exchangeItemsToCreate;
        $result->updateInSugar = $exchangeItemsToUpdate;
    
        return $result;
    }
    
}
