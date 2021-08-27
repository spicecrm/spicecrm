<?php
namespace SpiceCRM\modules\KReports\schedulerjobtasks;

use kschedulingcronhandler;

class KReporterSchedulerJobTasks
{
    public function runScheduledKReports(): bool {
        require_once('extensions/modules/KReports/Plugins/Integration/kscheduling/kschedulingcronhandler.php');
        $kreportscheduler = new kschedulingcronhandler();
        $kreportscheduler->initializeScheduledReports();
        $kreportscheduler->runScheduledReports();
        return true;
    }
}