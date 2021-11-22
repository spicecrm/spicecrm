<?php
namespace SpiceCRM\modules\SchedulerJobs\schedulerjobtasks;

use SpiceCRM\includes\Logger\LoggerManager;

class SchedulerJobsSchedulerJobTasks
{
    /**
     * Job 29
     * Test Job, does nothing, for testing of scheduler
     */
    public function schedulerTest(): bool {
        echo "Scheduler Test (function schedulerTest() executed, nothing else is done.\n";
        LoggerManager::getLogger()->debug('Scheduler Test');
        return true;
    }
}