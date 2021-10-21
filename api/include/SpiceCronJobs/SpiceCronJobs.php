<?php

namespace SpiceCRM\includes\SpiceCronJobs;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
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
        $pid = getmypid();
        LoggerManager::getLogger()->debug("---> CRON: PROCESS_ID: '$pid': Run Jobs <---");

        if (empty($jobId)) {
            $jobs = $this->loadJobs();
        } else {
            $jobs = [BeanFactory::getBean('SchedulerJobs', $jobId)];
        }

        foreach ($jobs as $job) {

            $job->runTasks();
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
        return $job->get_full_list('schedulerjobs.priority', "schedulerjobs.next_run_date <= {$db->now()} AND schedulerjobs.job_status = 'Active'") ?? [];
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