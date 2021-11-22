<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

namespace SpiceCRM\modules\SchedulerJobs;

use Cron\CronExpression;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\SchedulerJobTasks\SchedulerJobTask;
use SpiceCRM\modules\Mailboxes\Mailbox;

/**
 * handles loading/creating jobs and their jobs to manage executing crontab jobs
 * Class Job
 * @package SpiceCRM\modules\Jobs
 */
class SchedulerJob extends SugarBean
{
    var $table_name = "schedulerjobs";
    var $object_name = "SchedulerJob";
    var $module_dir = "SchedulerJobs";
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
        if (empty($this->next_run_date)) {
            $this->next_run_date = $this->getNextRunDate();
        }
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

        if (is_windows()) {
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
    public function runTasks(): array
    {
        $this->beforeRun();

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
            LoggerManager::getLogger()->fatal("SchedulerJobTask: {$task->id}: ({$task->name}) failed");
        } else {
            LoggerManager::getLogger()->info("SchedulerJobTask: {$task->id}: ({$task->name}) successfully executed");
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
        $email->name = 'Notification: Job Execution Failure';
        $email->body = "Failed to execute Job Task <strong>{$this->name}</strong> executed by <strong>$currentUserName</strong> with the following error messages: <br>" . nl2br($this->last_run_message);
        $email->mailbox_id = $mailbox->id;
        $email->addEmailAddress('from', $mailbox->imap_pop3_username);
        $email->addEmailAddress('to', $user->email1);

        $email->sendEmail();
    }
}
