<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Task;
use TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncState;

class SyncItems extends BaseSync {
    
    protected $syncExchangeFolderItemsFunctionName;
    protected $getExchangeItemsFunctionName;
    protected $syncSugarItemsFunctionName;
    protected $getSugarItemsFunctionName;
    protected $createExchangeItemsFunctionName;
    protected $updateExchangeItemsFunctionName;
    protected $deleteExchangeItemsFunctionName;
    protected $createSugarItemsFunctionName;
    protected $updateSugarItemsFunctionName;
    protected $deleteSugarItemsFunctionName;

    public function __construct($functionNames) {
        
        parent::__construct();
        $this->syncExchangeFolderItemsFunctionName = $functionNames['syncExchangeFolderItemsFunctionName'];
        $this->getExchangeItemsFunctionName = $functionNames['getExchangeItemsFunctionName'];
        $this->syncSugarItemsFunctionName = $functionNames['syncSugarItemsFunctionName'];
        $this->getSugarItemsFunctionName = $functionNames['getSugarItemsFunctionName'];
        $this->createExchangeItemsFunctionName = $functionNames['createExchangeItemsFunctionName'];
        $this->updateExchangeItemsFunctionName = $functionNames['updateExchangeItemsFunctionName'];
        $this->deleteExchangeItemsFunctionName = $functionNames['deleteExchangeItemsFunctionName'];
        $this->createSugarItemsFunctionName = $functionNames['createSugarItemsFunctionName'];
        $this->updateSugarItemsFunctionName = $functionNames['updateSugarItemsFunctionName'];
        $this->deleteSugarItemsFunctionName = $functionNames['deleteSugarItemsFunctionName'];
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @return \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef
     */
    public function synchronize($syncDef) {
        
        $user = new \User();
        $user->retrieve($syncDef->getUserId());
        $this->logger->info($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Starting regular sync");
        $this->logger->debug($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . '$syncDef: ', get_object_vars($syncDef));                        
        
        // first, query both interfaces
        try {
            $exchangeSyncData = $this->getExchangeSyncData($syncDef);
            $processExchangeResult = $exchangeSyncData['modelSyncState'];

            $sugarSyncResponse = $this->sugarInterface->{$this->syncSugarItemsFunctionName}($user, $syncDef->getSugarLastSyncDate(), null, $syncDef->getNextOffset());

            $processSugarResult = $this->processSugarResponse($syncDef, $sugarSyncResponse);

            // do Sync logic - determine which contacts go where...
            $syncLogicResult = $this->applySyncLogic($processExchangeResult, $processSugarResult, $syncDef);
            $this->logger->debug($user->full_name . "\t" . $syncDef->getSyncType() . "\t" .  ' $syncLogicResult: ', get_object_vars($syncLogicResult));

            // process the lists
            $createSugarResult = $this->createItemsInSugar($syncDef, $syncLogicResult);
            $updateSugarResult = $this->updateItemsInSugar($syncDef, $createSugarResult);
            $updateExchangeResult = $this->updateItemsInExchange($syncDef, $updateSugarResult);
            $createExchangeResult = $this->createItemsInExchange($syncDef, $updateExchangeResult);
            $deleteExchangeResult = $this->deleteItemsInExchange($syncDef, $createExchangeResult);
            $this->persistSyncStates($syncDef, $deleteExchangeResult);
            $this->logErrors($user, $syncDef, $deleteExchangeResult);

            $updatedSyncDef = clone $syncDef;
            $updatedSyncDef->setExchangeSyncState($exchangeSyncData['exchangeSyncState']);
            if($sugarSyncResponse['includesLastItemInRange']) {
                $updatedSyncDef->setSugarLastSyncDate($sugarSyncResponse['sugarLastSyncDate']);
                $updatedSyncDef->setNextOffset(0);
            } else {
                $updatedSyncDef->setNextOffset($sugarSyncResponse['nextOffset']);            
            }
            $this->logger->info($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Finished regular sync");                    
        } catch (\Exception $ex) {
            $this->errorLogger->error($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Error in regular sync: " . $ex->getMessage());            
            $updatedSyncDef = clone $syncDef;
        }
        return $updatedSyncDef;
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $processedExchangeResult
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $processedSugarResult
     * @return \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer
     */
    protected function applySyncLogic($processedExchangeResult, $processedSugarResult, $syncDef) {
        
        $exchangeContactSyncStateCompounds = array();
        foreach($processedExchangeResult->updateInSugar as $contactSyncStateCompound) {
            $contact = $contactSyncStateCompound->getModel();
            $exchangeContactSyncStateCompounds[$contact->getSugarId()] = $contactSyncStateCompound;
        }
        
        $sugarIdsOfExchangeContacts = array_keys($exchangeContactSyncStateCompounds);        
        
        $sugarContactSyncStateCompounds = array();
        foreach($processedSugarResult->updateInExchange as $contactSyncStateCompound) {
            $contact = $contactSyncStateCompound->getModel();
            $sugarContactSyncStateCompounds[$contact->getSugarId()] = $contactSyncStateCompound;
        }
        
        $sugarIdsOfSugarContacts = array_keys($sugarContactSyncStateCompounds);
        
        $sugarIdsForSyncLogic = array_intersect($sugarIdsOfExchangeContacts, $sugarIdsOfSugarContacts);
        $sugarIdsFromExchangeOnly = array_diff($sugarIdsOfExchangeContacts, $sugarIdsForSyncLogic);
        $sugarIdsFromSugarOnly = array_diff($sugarIdsOfSugarContacts, $sugarIdsForSyncLogic);
        
        $syncLogic = function($sugarId) use ($exchangeContactSyncStateCompounds, $sugarContactSyncStateCompounds) {
            $model = $sugarContactSyncStateCompounds[$sugarId]->getModel();
            $syncState = $exchangeContactSyncStateCompounds[$sugarId]->getSyncState();
            $syncStateCondition = $exchangeContactSyncStateCompounds[$sugarId]->getSyncStateCondition();
            $newCompound = new \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound($model, $syncState, $syncStateCondition);
            return $newCompound;
        };
        
        $updateInExchangeSyncLogicApplied = array_map($syncLogic, $sugarIdsForSyncLogic);
        $updateInExchangeRemainingContacts = array_map(function($id) use($sugarContactSyncStateCompounds) {return $sugarContactSyncStateCompounds[$id];}, $sugarIdsFromSugarOnly);
        
        $updateInExchange = array_merge($updateInExchangeSyncLogicApplied, $updateInExchangeRemainingContacts);
        
        $updateInSugar = array_map(function($id) use($exchangeContactSyncStateCompounds) {return $exchangeContactSyncStateCompounds[$id];}, $sugarIdsFromExchangeOnly);
        
        // resync items deleted in Exchange - not used for the moment
//        $createIdBeanPairs = function($itemSyncStateCompound) {
//            $item = $itemSyncStateCompound->getModel();
//            $syncState = $itemSyncStateCompound->getSyncState();
//            return array(
//                $item->getSugarId(),
//                $syncState->getBean()
//            );
//        };
//        $idBeanPairsToResync = array_map($createIdBeanPairs, $processedExchangeResult->deleteInSugar);
//        if($idBeanPairsToResync) {
//            $sugarRetrievesToResync = $this->sugarInterface->{$this->getSugarItemsFunctionName}($idBeanPairsToResync, $syncDef);            
//        } else {
//            $sugarRetrievesToResync = array();
//        }
//        $filterSuccessfulRetrieves = function($sugarRetrieve) {
//            return $sugarRetrieve['responseClass'] === 'Success';
//        };
//        $getModel = function($sugarRetrieve) {
//            return $sugarRetrieve['model'];
//        };
//        $successfulRetrieves = array_map($getModel, array_filter($sugarRetrievesToResync, $filterSuccessfulRetrieves));
//        $sugarItemsToResync = $this->createModelSyncStateCompounds($syncDef, $successfulRetrieves);
        // end resync
        
        
        
        $sortResult = new \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer();                
        $sortResult->createInExchange = $processedSugarResult->createInExchange;
        $sortResult->updateInExchange = $updateInExchange;
        $sortResult->deleteInExchange = $processedSugarResult->deleteInExchange;
        $sortResult->createInSugar = $processedExchangeResult->createInSugar;
        $sortResult->updateInSugar = $updateInSugar;
        $sortResult->deleteInSugar = array();
        $sortResult->overriddenOriginatingFromSugar = array();
        $sortResult->doNotProcess = array_merge($processedExchangeResult->doNotProcess, $processedSugarResult->doNotProcess);
        $sortResult->updateState = array_merge($processedExchangeResult->updateState, $processedSugarResult->updateState);
        $sortResult->deleteState = array_merge($processedExchangeResult->deleteState, $processedExchangeResult->deleteInSugar);

        return $sortResult;
    }
    
    protected function createModelSyncStateCompounds($syncDef, $contacts) {
        
        $syncStateRepository = $this->syncStateRepository;
        $contactsSyncStates = array_map(function($contact) use ($syncStateRepository, $syncDef) {return $syncStateRepository->getStoredSyncState($syncDef, $contact);}, $contacts);        
        $contactsWithSyncStates = array_map(null, $contacts, $contactsSyncStates);
        $addSyncStateCondition = function($contactSyncStatePair) use ($syncDef) {
            /* @var $syncState SyncState */            
            list($item, $storedSyncState) = $contactSyncStatePair;
            if($storedSyncState) {
                return new \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound($item, $storedSyncState, $storedSyncState->compareToSyncState($item));
            } else {
                $newSyncState = new SyncState($syncDef, $item);
                return new \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound($item, $newSyncState, SyncState::$NO_STATE);
            }
        };
        $contactSyncStateCompounds = array_map($addSyncStateCondition, $contactsWithSyncStates);
        return $contactSyncStateCompounds;
    }

    
    protected function createModelSyncStateCompoundsByItemIds($syncDef, $items) {
        
        $syncStateRepository = $this->syncStateRepository;
        $itemsSyncStates = array_map(function($item) use ($syncStateRepository, $syncDef) {return $syncStateRepository->getStoredSyncStateByItemId($syncDef, $item);}, $items);
        $itemsWithSyncStates = array_map(null, $items, $itemsSyncStates);
        $addSyncStateCondition = function($itemSyncStatePair) use ($syncDef) {
            /* @var $storedSyncState SyncState */            
            list($item, $storedSyncState) = $itemSyncStatePair;
            if($storedSyncState) {
                $itemWithSugarId = clone $item;
                $itemWithSugarId->setSugarId($storedSyncState->getBeanId());
                return new \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound($itemWithSugarId, $storedSyncState, $storedSyncState->compareToSyncState($item));
            } else {
                $newSyncState = new SyncState($syncDef, $item);
                return new \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound($item, $newSyncState, SyncState::$NO_STATE);
            }
        };
        $contactSyncStateCompounds = array_map($addSyncStateCondition, $itemsWithSyncStates);
        return $contactSyncStateCompounds;
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @return type
     */    
    protected function getExchangeSyncData($syncDef) {
        
        $exchangeSyncState = $syncDef->getExchangeSyncState() ? $syncDef->getExchangeSyncState() : NULL;
        $exchangeSyncFolderResponse = $this->exchangeInterface->{$this->syncExchangeFolderItemsFunctionName}($syncDef->getServer(), $syncDef->getUpn(), $exchangeSyncState);
        $createItems = isset($exchangeSyncFolderResponse['model']['create']) ? $exchangeSyncFolderResponse['model']['create'] : array();
        $updateItems = isset($exchangeSyncFolderResponse['model']['update']) ? $exchangeSyncFolderResponse['model']['update'] : array();
        $deleteItems = isset($exchangeSyncFolderResponse['model']['delete']) ? $exchangeSyncFolderResponse['model']['delete'] : array();
        $exchangeItems = array_merge($createItems,$updateItems);
        $this->logger->info(__CLASS__ . '::' . __FUNCTION__ . ' items read from Exchange : ' . count($createItems) . ' CreateItems, ' . count($updateItems) . ' UpdateItems and ' . count($deleteItems) . ' DeleteItems');
        if($exchangeItems) {
            $exchangeGetItemResponse = $this->exchangeInterface->{$this->getExchangeItemsFunctionName}($syncDef->getServer(), $syncDef->getUpn(),'',$exchangeItems);
        } else {
            $exchangeGetItemResponse = array();
        }
        $processExchangeResult = $this->processExchangeResponse($syncDef, $exchangeGetItemResponse, $deleteItems);
        return array(
            'modelSyncState' => $processExchangeResult,
            'includesLastItemInRange' => $exchangeSyncFolderResponse['includesLastItemInRange'],
            'exchangeSyncState'=> $exchangeSyncFolderResponse['syncState'],
        );
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param type $exchangeResponse
     * @return \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer
     */
    protected function processExchangeResponse($syncDef, $exchangeResponse, $deleteItems) {
        
        $result = new \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer;

        // determine contacts from exchange which have to be stored to Sugar
        $getItems = function($responseEntry) {
            return $responseEntry['model'];
        };
        $exchangeItems = array_map($getItems, $exchangeResponse);        
//        $exchangeItems = array_merge($exchangeResponse['model']['create'],$exchangeResponse['model']['update']);
        $exchangeItemSyncStateCompounds = $this->createModelSyncStateCompounds($syncDef, $exchangeItems);
        $deleteItemsSyncStateCompounds = $this->createModelSyncStateCompoundsByItemIds($syncDef, $deleteItems);
        
        
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
            
            $syncStateMatch = function($syncStateCondition) {
                return $syncStateCondition === SyncState::$EXCHANGE_STATE_AND_HASH_MATCH;
            };
            
            $item = $itemSyncStateCompound->getModel();
            $syncStateCondition = $itemSyncStateCompound->getSyncStateCondition();
            return $exchangeOnlyItem($item) || $syncStateMatch($syncStateCondition);
        };
        
        $filterContactsToCreate = function($itemSyncStateCompound) {
            $item = $itemSyncStateCompound->getModel();
            $sugarId = $item->getSugarId();
            return empty($sugarId) && $item->getSugarSync();
        };
        
        $filterContactsToUpdate = function($itemSyncStateCompound) {
            $syncStateCondition = $itemSyncStateCompound->getSyncStateCondition();
            return SyncState::$NO_MATCH === $syncStateCondition || SyncState::$EXCHANGE_STATE_ONLY_MATCHES === $syncStateCondition;            
        };
        
        $filterItemsToUpdateStateOnly = function($itemSyncStateCompound) {
            $syncStateCondition = $itemSyncStateCompound->getSyncStateCondition();
            return SyncState::$HASH_ONLY_MATCHES === $syncStateCondition;
        };
        
        $filterDeleteItemsToProcess = function($itemSyncStateCompound) {
            $syncStateCondition = $itemSyncStateCompound->getSyncStateCondition();
            return SyncState::$NO_STATE !== $syncStateCondition;
        };
        $filterDeleteItemsToIgnore = function($itemSyncStateCompound) {
            $syncStateCondition = $itemSyncStateCompound->getSyncStateCondition();
            return SyncState::$NO_STATE === $syncStateCondition;
        };        
        
        $exchangeItemsToIgnore = array_merge(array_filter($exchangeItemSyncStateCompounds, $filterExchangeContactsToIgnore), array_filter($deleteItemsSyncStateCompounds, $filterDeleteItemsToIgnore));
        $exchangeItemsToCreate = array_filter($exchangeItemSyncStateCompounds, $filterContactsToCreate);
        $exchangeItemsToUpdate = array_filter($exchangeItemSyncStateCompounds, $filterContactsToUpdate);
        $exchangeItemsUpdateStateOnly = array_filter($exchangeItemSyncStateCompounds, $filterItemsToUpdateStateOnly);
        $exchangeItemsToDelete = array_filter($deleteItemsSyncStateCompounds, $filterDeleteItemsToProcess);
        
        $result->doNotProcess = $exchangeItemsToIgnore;        
        $result->createInSugar = $exchangeItemsToCreate;
        $result->updateInSugar = $exchangeItemsToUpdate;
        $result->deleteInSugar = $exchangeItemsToDelete;
        $result->updateState = $exchangeItemsUpdateStateOnly;
    
        return $result;
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
            return !$model->getDeleted() && SyncState::$HASH_ONLY_MATCHES === $syncStateCondition;
        };
        
        $filterSugarContactsToDelete = function($contactSyncStateCompound) {
            $model = $contactSyncStateCompound->getModel();
            $syncStateCondition = $contactSyncStateCompound->getSyncStateCondition();
            return $model->getDeleted() && SyncState::$NO_STATE !== $syncStateCondition;            
        };
        
        $newSugarContactsToSync = array_filter($sugarContactSyncStateCompounds, $filterSugarContactsToCreate);
        $sugarContactsToSync = array_filter($sugarContactSyncStateCompounds, $filterSugarContactsToUpdate);
        $sugarContactsToIgnore = array_filter($sugarContactSyncStateCompounds, $filterSugarContactsToIgnore);
        $sugarContactsToDelete = array_filter($sugarContactSyncStateCompounds, $filterSugarContactsToDelete);
        
        $response = new \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer();
        $response->createInExchange = $newSugarContactsToSync;
        $response->updateInExchange = $sugarContactsToSync;
        $response->doNotProcess = $sugarContactsToIgnore;
        $response->deleteInExchange = $sugarContactsToDelete;
        
        return $response;
        
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $modelSyncState
     * @return \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound
     */
    protected function createItemsInSugar($syncDef, $modelSyncState) {
        
        $exchangeItemsToCreateCompounds = $modelSyncState->createInSugar;
        $getContact = function($compound) {
            return $compound->getModel();
        };
        $exchangeItems = array_map($getContact, $exchangeItemsToCreateCompounds);
        
        if($exchangeItems) {
            $interfaceResult = $this->sugarInterface->{$this->createSugarItemsFunctionName}($exchangeItems, $syncDef->getUserId());
            $compoundsWithResults = array_map(null, $exchangeItemsToCreateCompounds, $interfaceResult);            
            $successfullyCreatedContactSyncStateCompounds = array_map(array($this, 'getCompoundFromResultPair'), array_filter($compoundsWithResults, array($this, 'filterSuccessfulUpdates')));
            $failedCompoundsWithResult = array_filter($compoundsWithResults, array($this, 'filterFailedUpdates'));
        } else {
            $successfullyCreatedContactSyncStateCompounds = array();
            $failedCompoundsWithResult = array();
        }

        $result = clone $modelSyncState;
        $result->createInSugar = array();
        $result->updateInExchange = array_merge($modelSyncState->updateInExchange, $successfullyCreatedContactSyncStateCompounds);
        $result->errors = array_merge($modelSyncState->errors, $this->prependFunctionNameToErrors(__FUNCTION__, $failedCompoundsWithResult));
        return $result;
    }
       
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $syncQueueState
     * @return \TRBusinessConnector\Sync\ExchangeSync\ModelSyncStateCompound\ModelSyncStateCompound
     */    
    protected function updateItemsInSugar($syncDef, $syncQueueState) {
        
        $exchangeUpdates = $syncQueueState->updateInSugar;        
        $getItem = function($compound) {
            return $compound->getModel();
        };
        $exchangeItems = array_map($getItem, $exchangeUpdates);
                
        if($exchangeItems) {
            $interfaceResult = $this->sugarInterface->{$this->updateSugarItemsFunctionName}($exchangeItems, $syncDef->getUserId());
            $compoundsWithResults = array_map(null, $exchangeUpdates, $interfaceResult);
            $processedResults = $this->updateStates($compoundsWithResults);
            $filterSuccessfulUpdates = function($compoundWithResult) {
                list($compound,$result) = $compoundWithResult;
                if("Success" === $result['responseClass']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $filterFailedUpdates = function($compoundWithResult) {
                list($compound,$result) = $compoundWithResult;
                if("Success" !== $result['responseClass']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $getCompoundFromResult = function($result) {
                return $result[0];
            };
            $successfulUpdates = array_map($getCompoundFromResult, array_filter($processedResults, $filterSuccessfulUpdates));
            $failedUpdates = array_filter($processedResults, $filterFailedUpdates);
        } else {
            $successfulUpdates = array();
            $failedUpdates = array();
        }
        
        $result = clone $syncQueueState;
        $result->updateInSugar = array();
        $result->updateState = array_merge($syncQueueState->updateState, $successfulUpdates);
        $result->errors = array_merge($result->errors, $this->prependFunctionNameToErrors(__FUNCTION__, $failedUpdates));
        return $result;
    }    

    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $syncQueueState
     * @return \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer
     */    
    protected function createItemsInExchange($syncDef, $syncQueueState) {
        
        $itemCompounds = $syncQueueState->createInExchange;
        $getItem = function($compound) {
            $item = $compound->getModel();
            return $item;
        };
        $sugarItems = array_map($getItem, $itemCompounds);
        if($sugarItems) {
            $exchangeResult = $this->exchangeInterface->{$this->createExchangeItemsFunctionName}($syncDef->getServer(), $syncDef->getUpn(), '', $sugarItems);
            $compoundsWithResults = array_map(null, $itemCompounds, $exchangeResult);
            $processedExchangeResult = $this->updateStates($compoundsWithResults);            
            $filterSuccessfulUpdates = function($compoundWithResult) {
                list($compound, $result) = $compoundWithResult;
                if("Success" === $result['responseClass']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $filterFailedUpdates = function($compoundWithResult) {
                list($compound, $result) = $compoundWithResult;
                if("Success" !== $result['responseClass']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $getCompoundFromResult = function($result) {
                return $result[0];
            };
            $successfullyUpdatedCompounds = array_map($getCompoundFromResult, array_filter($processedExchangeResult, $filterSuccessfulUpdates));
            $failedUpdateCompounds = array_filter($processedExchangeResult, $filterFailedUpdates);
        } else {
            $successfullyUpdatedCompounds = array();
            $failedUpdateCompounds = array();
        }

        $result = clone $syncQueueState;
        $result->updateInExchange = array();
        $result->updateState = array_merge($syncQueueState->updateState, $successfullyUpdatedCompounds);
        $result->errors = array_merge($syncQueueState->errors, $this->prependFunctionNameToErrors(__FUNCTION__, $failedUpdateCompounds));
        return $result;
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $syncQueueState
     * @return type
     */
    protected function updateItemsInExchange($syncDef, $syncQueueState) {
                
        $itemCompounds = $syncQueueState->updateInExchange;
        $getItem = function($compound) {
            $item = $compound->getModel();
            $syncState = $compound->getSyncState();
            if($syncState) {
                $item->setExchangeId($syncState->getExchangeId());
                $item->setChangeKey($syncState->getChangeKey());
            }
            return $item;
        };
        $items = array_map($getItem, $itemCompounds);
        
        if($items) {
            $exchangeResult = $this->exchangeInterface->{$this->updateExchangeItemsFunctionName}($syncDef->getServer(), $syncDef->getUpn(), $items);
            $compoundsWithResults = array_map(null, $itemCompounds, $exchangeResult);
            $processedExchangeResult = $this->updateStates($compoundsWithResults);
            
            $filterSuccessfulUpdates = function($compoundWithResult) {
                $compound = $compoundWithResult[0];
                $result = $compoundWithResult[1];
                if("Success" === $result['responseClass']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $filterFailedUpdates = function($compoundWithResult) {
                $compound = $compoundWithResult[0];
                $result = $compoundWithResult[1];
                if("Error" === $result['responseClass'] && "ErrorItemNotFound" !== $result['responseCode']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $filterFailedUpdatesToCreate = function($compoundWithResult) {
                $compound = $compoundWithResult[0];
                $result = $compoundWithResult[1];
                if("Error" === $result['responseClass'] && "ErrorItemNotFound" === $result['responseCode']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            
            $getCompoundFromResult = function($result) {
                return $result[0];
            };
            $successfullyUpdatedCompounds = array_map($getCompoundFromResult, array_filter($processedExchangeResult, $filterSuccessfulUpdates));
            $failedUpdatesToCreate = array_map($getCompoundFromResult, array_filter($processedExchangeResult, $filterFailedUpdatesToCreate));
            $failedUpdateCompounds = array_filter($processedExchangeResult, $filterFailedUpdates);
        } else {
            $successfullyUpdatedCompounds = array();
            $failedUpdatesToCreate = array();
            $failedUpdateCompounds = array();
        }
        
        $result = clone $syncQueueState;
        $result->updateInExchange = array();
        $result->createInExchange = array_merge($syncQueueState->createInExchange, $failedUpdatesToCreate);
        $result->updateState = array_merge($syncQueueState->updateState, $successfullyUpdatedCompounds);
        $result->errors = array_merge($syncQueueState->errors, $this->prependFunctionNameToErrors(__FUNCTION__, $failedUpdateCompounds));
        return $result;
    }
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $syncQueueState
     * @return type
     */
    protected function deleteItemsInExchange($syncDef, $syncQueueState) {
                
        $itemCompounds = $syncQueueState->deleteInExchange;
        $getItem = function($compound) {
            $item = $compound->getModel();
            $syncState = $compound->getSyncState();
            if($syncState) {
                $item->setExchangeId($syncState->getExchangeId());
                $item->setChangeKey($syncState->getChangeKey());
            }
            return $item;
        };
        $items = array_map($getItem, $itemCompounds);
        
        if($items) {
            $exchangeResult = $this->exchangeInterface->{$this->deleteExchangeItemsFunctionName}($syncDef->getServer(), $syncDef->getUpn(), $items);
            $compoundsWithResults = array_map(null, $itemCompounds, $exchangeResult);
            $processedExchangeResult = $this->updateStates($compoundsWithResults);
            $filterSuccessfulUpdates = function($compoundWithResult) {
                $compound = $compoundWithResult[0];
                $result = $compoundWithResult[1];
                if("Success" === $result['responseClass']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $filterFailedUpdates = function($compoundWithResult) {
                $compound = $compoundWithResult[0];
                $result = $compoundWithResult[1];
                if("Success" !== $result['responseClass']) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            };
            $getCompoundFromResult = function($result) {
                return $result[0];
            };
            $successfullyUpdatedCompounds = array_map($getCompoundFromResult, array_filter($processedExchangeResult, $filterSuccessfulUpdates));
            $failedUpdateCompounds = array_filter($processedExchangeResult, $filterFailedUpdates);
        } else {
            $successfullyUpdatedCompounds = array();
            $failedUpdateCompounds = array();
        }
        
        $result = clone $syncQueueState;
        $result->deleteInExchange = array();
        $result->deleteState = array_merge($syncQueueState->deleteState, $successfullyUpdatedCompounds);
        $result->errors = array_merge($syncQueueState->errors, $this->prependFunctionNameToErrors(__FUNCTION__, $failedUpdateCompounds));
        return $result;
    }
    
    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $syncQueueState
     */    
    protected function persistSyncStates($syncDef, $syncQueueState) {
        
        $compounds = $syncQueueState->updateState;
        foreach($compounds as $compound) {
            $syncState = $compound->getSyncState();
            $this->syncStateRepository->save($syncState);
        }
        $deleteStateCompounds = $syncQueueState->deleteState;
        foreach($deleteStateCompounds as $deleteCompound) {
            $syncState = $deleteCompound->getSyncState();
            $this->syncStateRepository->delete($syncState);
        }        
    }

    /**
     * 
     * @param object $compoundWithResult
     * @return boolean
     */
    protected function filterSuccessfulUpdates($compoundWithResult) {
        list($compound,$result) = $compoundWithResult;
        if("Success" === $result['responseClass']) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    /**
     * 
     * @param object $compoundWithResult
     * @return boolean
     */    
    protected function filterFailedUpdates($compoundWithResult) {
        list($compound,$result) = $compoundWithResult;
        if("Success" !== $result['responseClass']) {
            return TRUE;
        } else {
            return FALSE;
        }
    }
    
    protected function getCompoundFromResultPair($resultPair) {
        list($compound) = $resultPair;
        return $compound;
    }

    /**
     * 
     * @param \User $user
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @param \TRBusinessConnector\Sync\ExchangeSync\Result\SyncQueueContainer $syncQueueState
     */        
    protected function logErrors($user, $syncDef, $syncQueueState) {
        
        foreach($syncQueueState->errors as $error) {
            $this->errorLogger->error($user->full_name . "\t" . $syncDef->getSyncType() . "\t" . "Error in regular sync", $error);
        }
    }
    
    protected function prependFunctionNameToErrors($functionName, $errors) {
        
        $prependFunction = function($error) use ($functionName) {
            array_unshift($error, $functionName);
            return $error;
        };
        
        $errorsWithFunctionName = array_map($prependFunction, $errors);
        return $errorsWithFunctionName;
    }
}
