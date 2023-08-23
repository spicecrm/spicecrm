<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SchedulerJobs;

use DateTime;
use DateTimeZone;
use Cron\CronExpression;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\SchedulerJobTasks\SchedulerJobTask;
use SpiceCRM\modules\Mailboxes\Mailbox;
use SpiceCRM\includes\ErrorHandlers\Exception;

/**
 * handles loading/creating jobs and their jobs to manage executing crontab jobs
 * Class Job
 * @package SpiceCRM\modules\Jobs
 */
class SchedulerJob extends SpiceBean
{

    /**
     * holds the name of the job
     */
    public $name;
    /**
     * holds the date time start
     */
    public $date_time_start;
    /**
     * holds the date time end
     */
    public $date_time_end;
    /**
     * holds the job status
     */
    public $job_status;
    /**
     * holds the job interval
     */
    public $job_interval;
    /**
     * holds the assigned user id
     */
    public $assigned_user_id;
    /**
     * holds execute time of the job
     */
    public $next_run_date;
    /**
     * holds the last execution date
     */
    public $last_run_date;
    /**
     * holds the last run message
     */
    public $last_run_message;
    /**
     * holds the last run resolution
     */
    public $last_run_resolution;
    /**
     * holds the hold on failure
     */
    public $hold_on_failure;
    /**
     * holds the notify user boolean to send email on error
     */
    public $notify_user;

    function bean_implements($interface): bool
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    /**
     *
     * override the sugar save
     * @param false $check_notify
     * @param bool $fts_index_bean
     * @return int|string
     */
    public function save($check_notify = false, $fts_index_bean = true)
    {
        $this->next_run_date = $this->getNextRunDate();
        return parent::save($check_notify, $fts_index_bean);
    }

    /**
     * calculate job execution time by cron expression library
     */
    public function getNextRunDate(): string
    {
        $now = TimeDate::getInstance()->getNow();
        $startDate = TimeDate::getInstance()->fromString($this->date_time_start);
        $date = !empty($this->date_time_start) && $startDate > $now ? $startDate : $now;
        $expression = str_replace('::', ' ', $this->job_interval);
        $cronExpression = CronExpression::factory($expression);
        $executeTime = $cronExpression->getNextRunDate($date);
        return TimeDate::getInstance()->asDb($executeTime);
    }

    /**
     * kill running task by process id
     */
    public function killProcess(): bool
    {
        if (empty($this->process_id)) return false;

        if (SpiceUtils::isWindows()) {
            return exec("taskkill /F /PID {$this->process_id}");
        } else {
            return exec("kill -9 {$this->process_id}");
        }
    }

    /**
     * Update the job run fields
     */
    public function beforeRun()
    {
        global $overCLI;

        // set the status explicit on the DB with commit
        $this->setStatus('Running');

        $this->last_run_date = TimeDate::getInstance()->nowDb();
        $this->job_status = 'Running';

        if ($overCLI) {
            $this->process_id = getmypid();
            $this->next_run_date = $this->getNextRunDate();
            $this->updateM2MFields();
        }

        $this->save();
    }

    /**
     * sets the status transactional and commits it as well
     *
     * @param $status
     * @return void
     * @throws \Exception
     */
    private function setStatus($status){
        $dbConn = DBManagerFactory::getInstance('jobupdate');
        $dbConn->query("UPDATE {$this->_tablename} SET job_status='{$status}' WHERE id='{$this->id}'");
        $dbConn->commit();
    }

    /**
     * update the necessary field and save
     * @param SchedulerJobTask $lastTask
     */
    public function afterRun(SchedulerJobTask $lastTask)
    {
        global $overCLI;

        if ($overCLI) {
            $this->process_id = '';
        }

        if ($this->job_status == 'Running') {
            $this->job_status = 'Active';
        }

        $this->last_run_resolution = $lastTask->last_run_resolution;
        $this->last_run_message = $lastTask->last_run_message;

        if ($lastTask->last_run_resolution == SchedulerJobTask::JOB_TASK_RESOLUTION_FAILURE) {

            $this->job_status = $this->hold_on_failure == 1 ? 'OnHold' : $this->job_status;
            $this->sendFailureNotifyEmail();
        }

        $this->save();
    }

    /**
     * update the many to many relationship fields between jobs and job tasks
     * @throws \Exception
     */
    private function updateM2MFields()
    {
        $db = DBManagerFactory::getInstance();
        $db->query("UPDATE schedulerjobs_schedulerjobtasks SET next_run_date = '{$this->next_run_date}', date_modified = {$db->now()} WHERE schedulerjob_id = '{$this->id}'");
    }

    /**
     * execute the job tasks
     * execute job tasks
     */
    public function runTasks($checkDate = true): array
    {
        $db = DBManagerFactory::getInstance();

        // double check that the job is not running alreasy and the next run date is still in the past
        // that woudl have been set to a future date if the job was completed in aprallel already
        $sql = "SELECT job_status, next_run_date FROM {$this->_tablename} WHERE id = '{$this->id}'";
        $status = $db->fetchOne($sql);

        // job status check
        if($status['job_status'] == 'Running') return ['success' => false, 'message' => 'JOB is running already'];
        // job run date check if not set to omit (this will happen when the user manually executes a task
        if($checkDate && new DateTime($status['next_run_date'], new DateTimeZone('UTC')) > new DateTime('now', new DateTimeZone('UTC'))) return ['success' => false, 'message' => 'JOB did run already'];

        // do the before checks
        $this->beforeRun();

        # Feature: In case the assigned user of the cron job is different to the current user (basically "1"), use it instead.
        $currentUserChanged = false;
        $initialUser = AuthenticationController::getInstance()->getCurrentUser();
        if ( isset( $this->assigned_user_id[0] ) and $this->assigned_user_id !== $initialUser->id ) {
            $currentUserChanged = true;
            $cronjobUser = BeanFactory::getBean('Users', $this->assigned_user_id );
            if (!$cronjobUser) {
                throw (new Exception('Cannot run Cronjob, not existing Cronjob User (ID: ' . $this->assigned_user_id . ')'));
            }
            AuthenticationController::getInstance()->setCurrentUser($cronjobUser);
        }

        $onHold = SchedulerJobTask::JOB_TASK_STATUS_ON_HOLD;

        $tasks = $this->get_linked_beans('schedulerjobtasks', null, [], 0, -1, 0, "schedulerjobtasks.jobtask_status != '$onHold'");
        usort($tasks, function ($a, $b) {
            return $a->jobtask_sequence < $b->jobtask_sequence ? -1 : 1;
        });

        $executed = true;
        $lastTask = end($tasks);

        foreach ($tasks as $task) {

            $return = $this->runTask($task);

            if (!$return['success']) {
                $executed = false;
                $lastTask = $task;
                if ($this->hold_on_failure == 1) {
                    break;
                }
            }
        }

        $this->afterRun($lastTask);

        # restore current user
        if ( $currentUserChanged ) AuthenticationController::getInstance()->setCurrentUser( $initialUser );

        return ['success' => $executed, 'message' => $this->last_run_message];
    }

    /**
     * execute the given job
     * @param SchedulerJobTask $task
     * @return array
     */
    private function runTask(SchedulerJobTask $task): array
    {
        $task->next_run_date = $this->next_run_date;
        $res = $task->run($this->id);

        if (!$res['success']) {
            LoggerManager::getLogger()->fatal('scheduler', "SchedulerJobTask: {$task->id}: ({$task->name}) failed");
        } else {
            LoggerManager::getLogger()->info('scheduler', "SchedulerJobTask: {$task->id}: ({$task->name}) successfully executed");
        }

        return $res;
    }

    /**
     * send a failure notify email to the assigned user
     */
    private function sendFailureNotifyEmail()
    {
        if ($this->notify_user != 1) return;

        $user = BeanFactory::getBean('Users', $this->assigned_user_id);
        $mailbox = Mailbox::getDefaultMailbox();
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $currentUserName = empty($currentUser) ? 'Unknown' : "{$currentUser->user_name} ({$currentUser->first_name} {$currentUser->last_name})";
        if (empty($user->email1) || empty($mailbox)) return;

        $email = BeanFactory::newBean('Emails');
        $client = SpiceConfig::getInstance()->config['client'];
        $client = $client ? "($client)" : "";

        $email->name = "Notification: Job Execution Failure $client";
        $email->body = "Failed to execute Job Task <strong>{$this->name}</strong> executed by <strong>$currentUserName</strong> with the following error messages: <br>" . nl2br($this->last_run_message);
        $email->mailbox_id = $mailbox->id;
        $email->addEmailAddress('from', $mailbox->imap_pop3_username);
        $email->addEmailAddress('to', $user->email1);

        $email->sendEmail();
    }
}
