<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;
use TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncState;

class SyncItemsInitialToExchange extends SyncItems {
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @return \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef
     */
    public function synchronize($syncDef) {
        
        $user = new \User();
        $user->retrieve($syncDef->getUserId());
        
        try {
            $this->logger->info($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Starting inital sync to Exchange");
            $this->logger->debug($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . '$syncDef: ', get_object_vars($syncDef));                                                

            $sugarSyncData = $this->getSugarSyncData($user, $syncDef);
            $processSugarResult = $sugarSyncData['modelSyncState'];

            // process the lists
            $updateExchangeResult = $this->updateItemsInExchange($syncDef, $processSugarResult);
            $createExchangeResult = $this->createItemsInExchange($syncDef, $updateExchangeResult);
            $this->persistSyncStates($syncDef, $createExchangeResult);
            $this->logErrors($user, $syncDef, $createExchangeResult);

            $updatedSyncDef = clone $syncDef;
            if($sugarSyncData['includesLastItemInRange']) {
                $updatedSyncDef->setInitialSyncToExchangeCompleted($sugarSyncData['includesLastItemInRange']);
                $updatedSyncDef->setNextOffset(0);
            } else {
                $updatedSyncDef->setNextOffset($sugarSyncData['nextOffset']);            
            }
            $updatedSyncDef->setSugarLastSyncDate($sugarSyncData['sugarLastSyncDate']);
            $this->logger->info($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Finished initial sync to Exchange");                    
        } catch (\Exception $ex) {
            $this->errorLogger->error($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Error in initial sync to exchange: " . $ex->getMessage());            
            $updatedSyncDef = clone $syncDef;
        }
        return $updatedSyncDef;
    }

    /**
     * 
     * @param type $user
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @return type
     */
    protected function getSugarSyncData($user, $syncDef) {
                    
        $sugarSyncResponse = $this->sugarInterface->{$this->getSugarItemsFunctionName}($user, null, $syncDef->getStartAfter(), $syncDef->getNextOffset());
        $processSugarResult = $this->processSugarResponse($syncDef, $sugarSyncResponse);
        return array (
            'includesLastItemInRange' => $sugarSyncResponse['includesLastItemInRange'],
            'sugarLastSyncDate' => $sugarSyncResponse['sugarLastSyncDate'],
            'nextOffset' => $sugarSyncResponse['nextOffset'],
            'modelSyncState' => $processSugarResult
        );
    }
    
    
    protected function processSugarResponse($syncDef, $sugarResponse) {

        $contacts = $sugarResponse['list'];
        $sugarContactSyncStateCompounds = $this->createModelSyncStateCompounds($syncDef, $contacts);
        
        $filterSugarContactsToUpdate = function($contactSyncStateCompound) {
            $model = $contactSyncStateCompound->getModel();
            $syncStateCondition = $contactSyncStateCompound->getSyncStateCondition();
            return !$model->getDeleted() && SyncState::$NO_MATCH === $syncStateCondition;
        };
        
        $filterSugarContactsToCreate = function($contactSyncStateCompound) {
            $model = $contactSyncStateCompound->getModel();
            $syncStateCondition = $contactSyncStateCompound->getSyncStateCondition();   
            return !$model->getDeleted() && SyncState::$NO_STATE === $syncStateCondition;
        };
        
        $filterSugarContactsToIgnore = function($contactSyncStateCompound) {
            $model = $contactSyncStateCompound->getModel();
            $syncStateCondition = $contactSyncStateCompound->getSyncStateCondition();
            return $model->getDeleted() || SyncState::$HASH_ONLY_MATCHES === $syncStateCondition;
        }; 
        
        $newSugarContactsToSync = array_filter($sugarContactSyncStateCompounds, $filterSugarContactsToCreate);
        $sugarContactsToSync = array_filter($sugarContactSyncStateCompounds, $filterSugarContactsToUpdate);
        $sugarContactsToIgnore = array_filter($sugarContactSyncStateCompounds, $filterSugarContactsToIgnore);
        
        $response = new \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer();
        $response->createInExchange = $newSugarContactsToSync;
        $response->updateInExchange = $sugarContactsToSync;
        $response->doNotProcess = $sugarContactsToIgnore;
        
        return $response;
        
    }
    
}
