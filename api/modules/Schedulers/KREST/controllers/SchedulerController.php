<?php
namespace SpiceCRM\modules\Schedulers\KREST\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Schedulers\Scheduler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarQueue\SugarJobQueue;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;


class SchedulerController{

    /**
     * returns a joblist
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function ScheduleReturnJobList($req, $res, $args){
        return $res->withJson(Scheduler::getJobsList());
    }

    /**
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function ScheduleCompleteJob($req, $res, $args){
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
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function ScheduleSubmitJob($req, $res, $args){
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