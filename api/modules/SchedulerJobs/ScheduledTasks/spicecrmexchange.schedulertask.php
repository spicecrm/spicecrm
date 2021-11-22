<?php

use SpiceCRM\extensions\includes\SpiceCRMExchange\Connectivity\SpiceCRMExchangeReSync;
use SpiceCRM\extensions\includes\SpiceCRMExchange\Connectivity\SpiceCRMExchangeSubscriptions;
use SpiceCRM\extensions\includes\SpiceCRMExchange\Connectivity\SpiceCRMExchangeUserSyncConfigController;
use SpiceCRM\extensions\includes\SpiceCRMExchange\FolderHandlers\ExchangeCalendar;

if (!function_exists('processExchangeSynchronization')) {
    $job_strings[] = 'processExchangeSynchronization';

    /**
     * Job
     * processExchangeSynchronization
     */
    function processExchangeSynchronization() {
        $controller = new SpiceCRMExchangeUserSyncConfigController();
        $controller->processSynchronizations();

        return true;
    }
}

if (!function_exists('resyncEwsSubscriptions')) {
    /**
     *
     * Resynchronizes lost EWS subscriptions.
     * @return bool
     * @throws Exception
     */
    $job_strings[] = 'resyncEwsSubscriptions';
    function resyncEwsSubscriptions() {
        SpiceCRMExchangeSubscriptions::resyncAll();
        return true;
    }
}

if (!function_exists('resyncUserSubscriptions')) {
    /**
     * Resynchronizes events from exchange to CRM
     * @return bool
     */
    $job_strings[] = 'resyncUserSubscriptions';
    function resyncUserSubscriptions() {
        $resync = new SpiceCRMExchangeReSync();
        $resync->processReSynchronizations();
        return true;
    }
}

if (!function_exists('processEwsQueue')) {
    /**
     * Processes the Exchange bean sync queue.
     *
     * @return bool
     */
    $job_strings[] = 'processEwsQueue';
    function processEwsQueue() {
        ExchangeCalendar::processSyncQueue();
        return true;
    }
}
