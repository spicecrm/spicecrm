<?php

namespace SpiceCRM\includes\SpiceCronJobs;

use Exception;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SystemStartupMode\SystemStartupMode;
use SpiceCRM\includes\utils\SpiceUtils;
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

        $admin = BeanFactory::getBean('Users', '1');
        AuthenticationController::getInstance()->setCurrentUser($admin);

        self::cleanZombieJobs();

        $this->killMaxTimeExceededJobs();

        $pid = getmypid();
        LoggerManager::getLogger()->debug("---> CRON: PROCESS_ID: '$pid': Run Jobs <---");

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

    /**
     * Check all supposedly running scheduler jobs and their tasks whether they are really running or not. If not, clean them.
     */
    public static function cleanZombieJobs(): void
    {
        # Get all Scheduler Jobs with status 'Running':
        $supposedRunningJobs = BeanFactory::newBean('SchedulerJobs')->get_full_list('', "schedulerjobs.job_status = 'Running'") ?? [];

        # Determine all Scheduler Jobs that are running according to the database but are actually no longer running ( = Zombie Jobs ):
        $zombieJobs = [];
        foreach ( $supposedRunningJobs as $supposedRunningJob )
            if ( !self::processExistsOnOS( $supposedRunningJob->process_id ))
                $zombieJobs[$supposedRunningJob->id] = true;

        # For every supposedly running Job: Reset it and check also its tasks.
        foreach ( $supposedRunningJobs as $supposedRunningJob ) {
            if ( isset( $zombieJobs[$supposedRunningJob->id] ))
            {
                $atLeastOneTaskRunning = false;
                foreach ( $supposedRunningJob->get_linked_beans('schedulerjobtasks') as $taskOfSuppostedRunningJob ) {
                    if ( $taskOfSuppostedRunningJob->jobtask_status !== 'inactive' ) {
                        if ( $taskOfSuppostedRunningJob->jobtask_status === 'running' ) {
                            $parentJobs = $taskOfSuppostedRunningJob->get_linked_beans('schedulerjobs',);
                            # Check if the task has at least one parent job that is legitimately described as "Running", so don´t touch the task:
                            foreach ( $parentJobs as $parentJob ) if ( $parentJob->job_status === 'Running' and !isset( $zombieJobs[$parentJob->id] )) continue 2;
                            # Otherwise set the job task from "Running" to "Active" and set the resolution of the last run:
                            $taskOfSuppostedRunningJob->jobtask_status = SchedulerJobTask::JOB_TASK_STATUS_ACTIVE;
                            $taskOfSuppostedRunningJob->last_run_resolution = SchedulerJobTask::JOB_TASK_RESOLUTION_FAILURE;
                            $taskOfSuppostedRunningJob->save();
                            $taskOfSuppostedRunningJob->run_by_job_id = $supposedRunningJob->id;
                            $taskOfSuppostedRunningJob->last_run_message = 'Abruptly aborted. Became a zombie task.';
                            $taskOfSuppostedRunningJob->writeLog();
                            $atLeastOneTaskRunning = true;
                        }
                    }
                }
                # Set the job status from "Running" to "Active", set the resolution of the last run and remove the process_id:
                $supposedRunningJob->job_status = 'Active';
                if ( $atLeastOneTaskRunning ) {
                    $supposedRunningJob->last_run_resolution = SchedulerJobTask::JOB_TASK_RESOLUTION_FAILURE;
                    $supposedRunningJob->last_run_message = 'Abruptly aborted. Became a zombie job.';
                }
                $supposedRunningJob->process_id = '';
                $supposedRunningJob->save();
            }
        }
    }

    /**
     * Check if a process exists on the operating system.
     */
    public static function processExistsOnOS( $processId ): bool
    {
        if ( empty( $processId )) return false;
        if ( SpiceUtils::isWindows() ) {
            $result = exec("tasklist /fi \"pid eq $processId\" /nh /fo:csv");
            if ( $result === false ) return true; # exec() failed, so we don't know if the process is dead.
            $result = explode('","', $result );
            return count( $result ) > 1;
        } else {
            $result = exec("ps -p $processId -o comm=");
            if ( $result === false ) return true; # exec() failed, so we don't know if the process is dead.
            return !empty( $result );
        }
    }

}