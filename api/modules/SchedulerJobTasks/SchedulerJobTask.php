<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SchedulerJobTasks;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\templates\basic\Basic;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * handle executing job and setting the status
 * Class JobTask
 * @package SpiceCRM\modules\JobTasks
 */
class SchedulerJobTask extends Basic
{
    /**
     * holds the job status queued constant
     */
    const JOB_TASK_STATUS_ACTIVE = 'active';
    /**
     * holds the job status running constant
     */
    const JOB_TASK_STATUS_RUNNING = 'running';
    /**
     * holds the job  failure constant
     */
    const JOB_TASK_STATUS_ON_HOLD = 'on_hold';
    /**
     * holds the job status done constant
     */
    const JOB_TASK_RESOLUTION_DONE = 'done';
    /**
     * holds the job  failure constant
     */
    const JOB_TASK_RESOLUTION_FAILURE = 'failed';
    /**
     * holds the name of the subdirectory of modules or includes wherein the scheduler job task classes are kept
     */
    const SCHEDULER_JOB_TASKS_DIRECTORY = 'schedulerjobtasks';
    /**
     * holds the name of the job
     */
    public $name;
    /**
     * holds execute time of the job
     */
    public $next_run_date;
    /**
     * holds the last execution date
     */
    public $last_run_date;
    /**
     * holds the method params of the job
     */
    public $method;
    /**
     * holds the method params of the job
     */
    public $method_params;
    /**
     * holds the assigned user id of the job
     */
    public $assigned_user_id;
    /**
     * holds the hold on failure boolean
     */
    public $hold_on_failure;
    /**
     * holds the status id of the job
     */
    public $last_run_resolution;
    /**
     * holds the status id of the job
     */
    public $jobtask_status;
    /**
     * holds the last run message
     */
    public $last_run_message;
    /**
     * holds the non-db run by job id
     */
    public $run_by_job_id;

    /**
     * resolve job as success/failure or call retry
     * @param string $resolution
     * @param string|null $message
     */
    public function resolve(string $resolution, string $message = null)
    {

        switch ($resolution) {
            case self::JOB_TASK_RESOLUTION_FAILURE:

                $this->last_run_resolution = $resolution;
                $this->jobtask_status = $this->hold_on_failure == 1 ? self::JOB_TASK_STATUS_ON_HOLD : self::JOB_TASK_STATUS_ACTIVE;
                $this->runFallbackTask();
                break;
            case self::JOB_TASK_RESOLUTION_DONE:

                $this->last_run_resolution = $resolution;
                $this->jobtask_status = self::JOB_TASK_STATUS_ACTIVE;
                break;
        }

        if (!empty($message)) {
            $this->last_run_message .= "$message \n";
        }

        $this->save();

        $this->writeLog();

        LoggerManager::getLogger()->debug("SchedulerJobTask {$this->id} ({$this->name}) Resolved: $message");
    }

    /**
     * run fallback task
     */
    public function runFallbackTask()
    {

        if (empty($this->fallback_task_id)) return;
        $fallbackTask = BeanFactory::getBean('SchedulerJobTasks', $this->fallback_task_id);
        $return = $fallbackTask->run($this->run_by_job_id);

        if (!$return['success']) {
            LoggerManager::getLogger()->fatal('scheduler',"SchedulerJobTask {$fallbackTask->id} ({$fallbackTask->name}) failed");
        } else {
            LoggerManager::getLogger()->info('scheduler', "SchedulerJobTask {$fallbackTask->id} ({$fallbackTask->name}) successfully executed");
        }
    }

    /**
     * create a new job log entry
     */
    private function writeLog()
    {
        $db = DBManagerFactory::getInstance();
        $guid = SpiceUtils::createGuid();
        $q = "INSERT INTO schedulerjob_log (id, schedulerjob_id, schedulerjobtask_id, executed_on, resolution, message) ";
        $q .= "VALUES('$guid', '{$this->run_by_job_id}', '{$this->id}', '{$this->last_run_date}', '{$this->last_run_resolution}', '{$this->last_run_message}')";
        $db->query($q);
    }

    /**
     * Shutdown handler to be called if something breaks in the middle of the job running
     */
    public function shutdownHandler()
    {
        if ($this->last_run_resolution == self::JOB_TASK_RESOLUTION_DONE || !empty($this->last_run_message)) return;

        $this->resolve(
            self::JOB_TASK_RESOLUTION_FAILURE,
            'execution failed'
        );
    }

    /**
     * run the job method and log the process
     * @param string|null $jobId
     * @return array
     */
    public function run(string $jobId = null): array
    {
        register_shutdown_function([$this, 'shutdownHandler']);

        $this->beforeRun($jobId);

        $jobExecutionClassMethod = $this->loadJobExecutionClassMethod();

        if (!$jobExecutionClassMethod) {
            return ['success' => false, 'message' => 'problem with the job task method'];
        }

        $executed = $this->executeMethod($jobExecutionClassMethod);

        $success = $executed === true || boolval($executed['success']);

        if ($success) {

            $message = $executed['message'] ?? 'was successfully executed';

            $this->resolve(self::JOB_TASK_RESOLUTION_DONE, $message);

        } else {

            $message = $executed['message'] ?? 'execution failed';

            $this->resolve(self::JOB_TASK_RESOLUTION_FAILURE, $message);
        }

        return ['success' => $success, 'message' => $message];
    }

    /**
     * set necessary fields before run
     * @param string $jobId
     */
    private function beforeRun(string $jobId = null)
    {
        $this->run_by_job_id = $jobId;

        $this->jobtask_status = self::JOB_TASK_STATUS_RUNNING;
        $this->last_run_date = TimeDate::getInstance()->nowDb();

        $this->save();
    }

    /**
     * execute the job method
     * @param $classMethod
     * @return mixed | false
     */
    private function executeMethod($classMethod)
    {
        LoggerManager::getLogger()->info('scheduler', "-----> SchedulerJobTask starting Job with execution method: $this->method");
//        if (!$classMethod->class) {
//            include_once 'modules/SchedulerJobs/_AddJobsHere.php';
//            return call_user_func_array($classMethod->method, [$this->method_params]);
//        } else {
            try {
                return call_user_func_array([$classMethod->class, $classMethod->method], [$this->method_params]);

            } catch (Exception $exception) {
                LoggerManager::getLogger()->fatal('scheduler',"SchedulerJobTask {$this->id} ({$this->name}) Exception: {$exception->getMessage()} Stack Trace: {$exception->getTraceAsString()}");
                return ['success' => false, 'message' => "Exception: " . $exception->getMessage()];
            }
//        }
    }

    /**
     * get the execution class and method and return an object
     * @return null|object
     */
    private function loadJobExecutionClassMethod()
    {
        $isFunction = strpos(html_entity_decode($this->method), 'function::') === 0;
        $separator = $isFunction ? '::' : '->';
        $methodArray = explode($separator, html_entity_decode($this->method));
        $className = $methodArray[0];
        $methodName = $methodArray[1];

        if ($isFunction) {
//            include_once 'modules/SchedulerJobs/_AddJobsHere.php';
            if (!is_callable($methodName)) {
                $this->resolve(
                    self::JOB_TASK_RESOLUTION_FAILURE,
                    "Function $methodName is not callable"
                );
                return null;
            }

            return (object)['class' => null, 'method' => $methodName];
        }

        if (!class_exists($className)) {
            $this->resolve(
                self::JOB_TASK_RESOLUTION_FAILURE,
                "Could not instantiate the method class $className"
            );
            return null;
        }

        $classInstance = new $className();

        if (!is_callable([$classInstance, $methodName])) {
            $this->resolve(
                self::JOB_TASK_RESOLUTION_FAILURE,
                "Could not call the method $methodName"
            );
            return null;
        }

        return (object)['class' => $classInstance, 'method' => $methodName];
    }
}
