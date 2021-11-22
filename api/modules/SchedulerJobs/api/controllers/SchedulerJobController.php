<?php

namespace SpiceCRM\modules\SchedulerJobs\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SchedulerJobTasks\SchedulerJobTask;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class SchedulerJobController
{
    /**
     * return a list of the job log
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function loadJobLog(Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $params = $req->getQueryParams();
        $logArray = [];
        $sortField = $params['sortfield'] ?: 'executed_on';

        $query = $db->limitQuery("SELECT l.*, t.id rel_id, 'SchedulerJobTasks' rel_module, t.name name FROM schedulerjob_log l, schedulerjobtasks t WHERE t.id = l. schedulerjobtask_id AND l. schedulerjob_id = '{$args['id']}' ORDER BY l.$sortField DESC", $params['offset'], $params['limit']);
        $countRes = $db->fetchOne("SELECT COUNT(id) c FROM  schedulerjob_log where  schedulerjob_id = '{$args['id']}'");

        while ($log = $db->fetchByAssoc($query)) $logArray[] = $log;

        return $res->withJson(['list' => $logArray, 'count' => $countRes['c']]);
    }

    /**
     * run a specific job immediately
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function runJob(Request $req, Response $res, array $args): Response
    {
        $job = BeanFactory::getBean('SchedulerJobs', $args['id']);
        $return = $job->runTasks();

        return $res->withJson($return['success']);
    }

    /**
     * creates and submits a job
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function scheduleJob(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        $job = BeanFactory::getBean('SchedulerJobs', $args['id']);
        $job->next_run_date = $job->getNextRunDate();
        $job->save();

        return $res->withJson(true);
    }

    /**
     * run a specific job immediately
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function killJobProcess(Request $req, Response $res, array $args): Response
    {
        $job = BeanFactory::getBean('SchedulerJobs', $args['id']);
        $job->killProcess();

        $job->job_status = 'Active';
        $job->save();

        $tasks = $job->get_linked_beans('schedulerjobtasks', null, [], 0, -1, 0, "schedulerjobtasks.jobtask_status = 'running'");

        foreach ($tasks as $task) {
            $task->jobtask_status = SchedulerJobTask::JOB_TASK_STATUS_ACTIVE;
            $task->save();
        }

        return $res->withJson(true);

    }

    /**
     * add related tasks to job
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function addRelatedTasks(Request $req, Response $res, array $args): Response
    {

        $jobId = $args['beanId'];
        $relatedIds = $req->getParsedBody();
        $retArray = [];

        $job = BeanFactory::getBean('SchedulerJobs', $jobId);

        if ($job === false) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $jobId, 'module' => 'SchedulerJobs']);

        $job->load_relationship('schedulerjobtasks');

        if (!SpiceACL::getInstance()->checkAccess('SchedulerJobs', 'edit', true) && !SpiceACL::getInstance()->checkAccess('SchedulerJobs', 'editrelated', true))
            throw (new ForbiddenException("Forbidden to edit in module 'SchedulerJobs'."))->setErrorCode('noModuleEdit');

        $additionalValues = [
            'next_run_date' => $job->getNextRunDate(),
            'sequence' => $job->get_linked_beans_count('schedulerjobtasks')
        ];

        foreach ($relatedIds as $relatedId) {
            $additionalValues['sequence']++;
            $result = $job->{'schedulerjobtasks'}->add($relatedId, $additionalValues);
            if (!$result)
                throw new Exception("Something went wrong by adding $relatedId to 'jobtasks");
            $retArray[$relatedId] = $job->{'schedulerjobtasks'}->relationship->relid;
        }

        return $res->withJson($retArray);
    }
}