<?php
namespace SpiceCRM\modules\Schedulers\api\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Schedulers\Scheduler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarQueue\SugarJobQueue;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SchedulerController{

    /**
     * returns a joblist
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function ScheduleReturnJobList(Request $req, Response $res, array $args): Response {
        return $res->withJson(Scheduler::getJobsList());
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function ScheduleCompleteJob(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        $scheduler = BeanFactory::getBean('Schedulers', $args['sid']);
        $job = $scheduler->createJob();
        ob_start();
        $jobStatus = $job->runJob(false);
        $job->completeJob($jobStatus);
        $result = ob_get_clean();
        return $res->withJson(['results' => $result]);
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
    public function ScheduleSubmitJob(Request $req, Response $res, array $args): Response {
        global $timedate;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        $sugarJobQueue = new SugarJobQueue();
        $scheduler = BeanFactory::getBean('Schedulers', $args['sid']);
        $scheduler->last_run = $timedate->nowDb();
        $scheduler->save();
        $job = $scheduler->createJob();
        return $res->withJson($sugarJobQueue->submitJob($job));
    }

}