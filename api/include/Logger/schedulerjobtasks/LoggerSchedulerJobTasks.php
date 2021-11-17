<?php
namespace SpiceCRM\includes\Logger\schedulerjobtasks;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class LoggerSchedulerJobTasks
{
    /**
     * Job 26
     * Clean SysLogs
     */
    public function cleanSysLogs(): bool {
        $defaultInterval = "7 DAY";
        $q = "DELETE FROM syslogs WHERE date_entered < DATE_SUB(now(), INTERVAL ".(isset(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) && !empty(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) ? SpiceConfig::getInstance()->config['logger']['db']['clean_interval'] : $defaultInterval).")";
        DBManagerFactory::getInstance()->query($q);
        return true;
    }
}