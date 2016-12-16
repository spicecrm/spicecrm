<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Scheduler;

class InitialSync {

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDefRepository
     */
    protected $syncDefRepository;

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\InitialSyncContactsFromExchange
     */
    protected $initialSyncContactsFromExchange;

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\InitialSyncContactsFromExchange
     */
    protected $initialSyncContactsFromSugar;

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\SyncTasksInitialFromExchange
     */
    protected $initialSyncTasksFromExchange;

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\InitialSyncTasksFromExchange
     */
    protected $initialSyncTasksFromSugar;

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\SyncCalendarItemsInitialFromExchange
     */
    protected $initialSyncCalendarItemsFromExchange;

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\SyncCalendarItemsInitialToExchange
     */
    protected $initialSyncCalendarItemsToExchange;

    public function __construct() {

        $this->syncDefRepository = new \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDefRepository();
    }

    public function runScheduledSyncs() {

        $maxExecutionTimeSeconds = 50;
        $startTimeStamp = time();
        $startTime = new \SugarDateTime('@' . $startTimeStamp);

        while (time() - $startTimeStamp < $maxExecutionTimeSeconds) {

            $syncDef = $this->syncDefRepository->getNextSyncDefForInitialSync($startTime);
            // no syncdef, nothing to do...
            if (!$syncDef) {
                break;                
            }

            $syncType = $syncDef->getSyncType();
            switch ($syncType) {
                case 'Contacts':
                    $updatedSyncDef = $this->initialSyncContacts($syncDef);
                    break;
                case 'Tasks':
                    $updatedSyncDef = $this->initialSyncTasks($syncDef);
                    break;
                case 'CalendarItems':
                    $updatedSyncDef = $this->initialSyncCalendarItems($syncDef);
                    break;
            }
            if ($updatedSyncDef) {
                $this->syncDefRepository->save($updatedSyncDef);
            }
        }
    }

    protected function initialSyncContacts($syncDef) {

        $exchangeSyncNotCompleted = !$syncDef->getInitialSyncFromExchangeCompleted();
        if ($exchangeSyncNotCompleted) {
            if (!$this->initialSyncContactsFromExchange) {
                $this->initialSyncContactsFromExchange = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncContactsInitialFromExchange();
            }
            $updatedSyncDef = $this->initialSyncContactsFromExchange->synchronize($syncDef);
        } else {
            if (!$this->initialSyncContactsToExchange) {
                $this->initialSyncContactsToExchange = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncContactsInitialToExchange();
            }
            $updatedSyncDef = $this->initialSyncContactsToExchange->synchronize($syncDef);
        }
        return $updatedSyncDef;
    }

    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @return \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef
     */
    protected function initialSyncTasks($syncDef) {

        $exchangeSyncNotCompleted = !$syncDef->getInitialSyncFromExchangeCompleted();
        if ($exchangeSyncNotCompleted) {
            if (!$this->initialSyncTasksFromExchange) {
                $this->initialSyncTasksFromExchange = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncTasksInitialFromExchange();
            }
            $updatedSyncDef = $this->initialSyncTasksFromExchange->synchronize($syncDef);
        } else {
            if (!$this->initialSyncTasksToExchange) {
                $this->initialSyncTasksToExchange = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncTasksInitialToExchange();
            }
            $updatedSyncDef = $this->initialSyncTasksToExchange->synchronize($syncDef);
        }
        return $updatedSyncDef;
    }

    /**
     * 
     * @param \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef $syncDef
     * @return \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef
     */
    protected function initialSyncCalendarItems($syncDef) {

        $exchangeSyncNotCompleted = !$syncDef->getInitialSyncFromExchangeCompleted();
        if ($exchangeSyncNotCompleted) {
            if (!$this->initialSyncCalendarItemsFromExchange) {
                $this->initialSyncCalendarItemsFromExchange = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncCalendarItemsInitialFromExchange();
            }
            $updatedSyncDef = $this->initialSyncCalendarItemsFromExchange->synchronize($syncDef);
        } else {
            if (!$this->initialSyncCalendarItemsToExchange) {
                $this->initialSyncCalendarItemsToExchange = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncCalendarItemsInitialToExchange();
            }
            $updatedSyncDef = $this->initialSyncCalendarItemsToExchange->synchronize($syncDef);
        }
        return $updatedSyncDef;
    }

}
