<?php
namespace SpiceCRM\includes\SpiceFTSManager\schedulerjobtasks;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;

class SpiceFTSManagerSchedulerJobTasks
{
    /**
     * Job 27
     * Clean sysftslogs
     * @deprecated
     */
    public function cleanSysFTSLogs(): bool {
        // calculate date time in php to have a cross database conform SQL quer
        $defaultInterval = "P14D"; // 14 days
        $timeDate = TimeDate::getInstance()->getNow();
        $timeDate->sub(new \DateInterval((isset(SpiceConfig::getInstance()->config['logger']['fts']['log_clean_interval']) && !empty(SpiceConfig::getInstance()->config['logger']['fts']['log_clean_interval']) ? SpiceConfig::getInstance()->config['logger']['fts']['log_clean_interval'] : $defaultInterval)));
        $calculatedDate = TimeDate::getInstance()->asDb($timeDate);
        $db = DBManagerFactory::getInstance();

        if($db->tableExists('sysapilog')){
            $q = "DELETE FROM sysapilog WHERE date_entered < '{$calculatedDate}' AND route like '/elasticsearch%'";
            $db->query($q);
        }
        elseif($db->tableExists('sysftslog')){
            $q = "DELETE FROM sysftslog WHERE date_created < '{$calculatedDate}'";
            $db->query($q);
        }
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