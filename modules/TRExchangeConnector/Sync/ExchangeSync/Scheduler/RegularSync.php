<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace TRBusinessConnector\Sync\ExchangeSync\Scheduler;

class RegularSync {

    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDefRepository
     */
    protected $syncDefRepository;
    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\SyncContacts
     */
    protected $syncContactsTask;
    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\SyncTasks
     */
    protected $syncTasksTask;
    /**
     *
     * @var \TRBusinessConnector\Sync\ExchangeSync\Task\SyncCalendarItems
     */
    protected $syncCalendarItemsTask;
    
    public function __construct() {
        
        $this->syncDefRepository = new \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDefRepository();
    }
    
    public function runScheduledSyncs() {
        
        $maxExecutionTimeSeconds = 50;
        $startTimeStamp = time();
        $startTime = new \SugarDateTime('@' . $startTimeStamp);
        
        while(time() - $startTimeStamp < $maxExecutionTimeSeconds) {
            $syncDef = $this->syncDefRepository->getNextSyncDefForSync($startTime);
            // no more syncdef, nothing to do...
            if(!$syncDef)  {
                break;
            }

           $syncType = $syncDef->getSyncType();
            switch($syncType) {
                case 'Contacts':
                    $updatedSyncDef = $this->syncContacts($syncDef);
                    break;
                case 'Tasks':
                    $updatedSyncDef = $this->syncTasks($syncDef);
                    break;
                case 'CalendarItems':
                    $updatedSyncDef = $this->syncCalendarItems($syncDef);
                    break;
            }
            if($updatedSyncDef) {
                $this->syncDefRepository->save($updatedSyncDef);            
            }
        }
        
    }
    
    protected function syncContacts($syncDef) {
        
        if(!$this->syncContactsTask) {
            $this->syncContactsTask = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncContacts();
        }
        $updatedSyncDef = $this->syncContactsTask->synchronize($syncDef);
        return $updatedSyncDef;
    }
    
    protected function syncTasks($syncDef) {
        
        if(!$this->syncTasksTask) {
            $this->syncTasksTask = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncTasks();
        }
        $updatedSyncDef = $this->syncTasksTask->synchronize($syncDef);
        return $updatedSyncDef;
    }
    
    protected function syncCalendarItems($syncDef) {
        
        if(!$this->syncCalendarItemsTask) {
            $this->syncCalendarItemsTask = new \TRBusinessConnector\Sync\ExchangeSync\Task\SyncCalendarItems();
        }
        $updatedSyncDef = $this->syncCalendarItemsTask->synchronize($syncDef);
        return $updatedSyncDef;
    }
}
