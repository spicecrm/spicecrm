<?php
namespace SpiceCRM\includes\Logger\schedulerjobtasks;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use DateInterval;

class LoggerSchedulerJobTasks
{
    /**
     * Job 26
     * Clean SysLogs
     */
    public function cleanSysLogs(): bool {
        // calculate date time in php to have a cross database conform SQL quer
        $defaultInterval = "P7D"; // 7 days
        $timeDate = TimeDate::getInstance()->getNow();
        $timeDate->sub(new DateInterval((isset(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) && !empty(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) ? SpiceConfig::getInstance()->config['logger']['db']['clean_interval'] : $defaultInterval)));
        $calculatedDate = TimeDate::getInstance()->asDb($timeDate);
        $q = "DELETE FROM syslogs WHERE date_entered < '{$calculatedDate}'";
        DBManagerFactory::getInstance()->query($q);
        return true;
    }


    /**
     * Job 26
     * Clean SysLogs
     */
    public function cleanSysAPILog(): bool {
        // calculate date time in php to have a cross database conform SQL quer
        $defaultInterval = "P7D"; // 7 days
        $timeDate = TimeDate::getInstance()->getNow();
        $timeDate->sub(new DateInterval((isset(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) && !empty(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) ? SpiceConfig::getInstance()->config['logger']['db']['clean_interval'] : $defaultInterval)));
        $calculatedDate = TimeDate::getInstance()->asDb($timeDate);
        $q = "DELETE FROM sysapilog WHERE date_entered < '{$calculatedDate}'";
        DBManagerFactory::getInstance()->query($q);
        return true;
    }
}