<?php
namespace SpiceCRM\includes\SpiceFTSManager\schedulerjobtasks;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceFTSManagerSchedulerJobTasks
{
    /**
     * Job 27
     * Clean sysftslogs
     */
    public function cleanSysFTSLogs(): bool {
        $defaultInterval = "14 DAY";
        $q = "DELETE FROM sysftslog WHERE date_created < DATE_SUB(now(), INTERVAL ".(isset(SpiceConfig::getInstance()->config['fts']['log_clean_interval']) && !empty(SpiceConfig::getInstance()->config['fts']['clean_interval']) ? SpiceConfig::getInstance()->config['fts']['log_clean_interval'] : $defaultInterval).")";
        DBManagerFactory::getInstance()->query($q);
        return true;
    }

    /**
     * Job 30 (20B) .. run the bulk text indexer
     *
     * @return bool
     */
    public function fullTextIndexBulk(): bool {
        // no date formatting


        // determine package size
        $packagesize = SpiceConfig::getInstance()->config['fts']['schedulerpackagesize'] ?: 5000;
        SpiceFTSHandler::getInstance()->bulkIndexBeans($packagesize, null, true );
        ob_end_clean();
        return true;
    }
}