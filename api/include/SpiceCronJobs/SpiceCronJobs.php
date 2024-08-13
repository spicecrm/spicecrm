<?php

namespace SpiceCRM\includes\SpiceCronJobs;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SystemStartupMode\SystemStartupMode;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\SchedulerJobs\SchedulerJob;
use SpiceCRM\modules\SchedulerJobTasks\SchedulerJobTask;

class SpiceCronJobs
{
    /**
     * run the jobs
     * @param string|null $jobId
     * @throws Exception
     */
    public function runJobs(string $jobId = null)
    {
        if (SystemStartupMode::maintenanceModeEnabled() || SystemStartupMode::recoveryModeEnabled()) return;

        $this->killMaxTimeExceededJobs();

        $pid = getmypid();
        LoggerManager::getLogger()->debug("---> CRON: PROCESS_ID: '$pid': Run Jobs <---");

        $admin = BeanFactory::getBean('Users', '1');
        AuthenticationController::getInstance()->setCurrentUser($admin);

        if (empty($jobId)) {
            $jobs = $this->loadJobs();
        } else {
            $jobs = [BeanFactory::getBean('SchedulerJobs', $jobId)];
        }

        /** @var SchedulerJob $job */
        foreach ($jobs as $job) {
            $job->runTasks(empty($jobId));
        }
    }

    /**
     * kill all the jobs that exceeded the maximum execution time
     * @return void
     * @throws DatabaseException
     */
    public function killMaxTimeExceededJobs()
    {
        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT id, last_run_date, max_execution_minutes FROM schedulerjobs WHERE max_execution_minutes IS NOT NULL AND max_execution_minutes > 0 AND job_status = 'Running' AND deleted != 1");

        while ($row = $db->fetchByAssoc($query)) {

            $diff = (TimeDate::getInstance()->getNow()->getTimestamp() - TimeDate::getInstance()->fromDb($row['last_run_date'])->getTimestamp()) / 60;

            if ($diff < $row['max_execution_minutes']) continue;

            /** @var SchedulerJob $job */
            $job = BeanFactory::getBean('SchedulerJobs', $row['id']);

            $job->killProcess();
        }
    }

    /**
     * load job ids from db
     * @return array
     * @throws Exception
     */
    private function loadJobs(): array
    {
        $db = DBManagerFactory::getInstance();
        $job = BeanFactory::newBean('SchedulerJobs');
        return $job->get_full_list('last_run_resolution, priority', "schedulerjobs.next_run_date <= {$db->now()} AND schedulerjobs.job_status = 'Active'") ?? [];
    }

    /**
     * handle fatal errors and update jobs status
     */
    public static function shutdownHandler()
    {
        $lastError = error_get_last();

        if (!in_array($lastError['type'], [E_ERROR, E_USER_ERROR, E_COMPILE_ERROR, E_CORE_ERROR, E_PARSE])) return;

        LoggerManager::getLogger()->fatal("CRON: {$lastError['message']} in ({$lastError['file']}) on line: {$lastError['line']}\n");

        self::adjustFailedJobsStatus();
    }

    private static function adjustFailedJobsStatus()
    {
        $lastError = error_get_last();

        $processId = getmypid();
        $onHold = SchedulerJobTask::JOB_TASK_STATUS_ON_HOLD;

        $job = BeanFactory::newBean('SchedulerJobs');
        $jobs = $job->get_full_list('schedulerjobs.priority', "schedulerjobs.process_id = '$processId' AND schedulerjobs.job_status = 'Running'");

        foreach ($jobs as $job) {


            $tasks = $job->get_linked_beans('schedulerjobtasks', null, [], 0, -1, 0, "schedulerjobtasks.jobtask_status != '$onHold'");

            foreach ($tasks as $task) {
                $task->next_run_date = $job->next_run_date;
                $task->resolve(SchedulerJobTask::JOB_TASK_RESOLUTION_FAILURE, $lastError['message']);
            }

            $lastTask = end($tasks);
            $job->afterRun($lastTask);
        }
    }
}