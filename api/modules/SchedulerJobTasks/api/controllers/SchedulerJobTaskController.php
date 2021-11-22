<?php

namespace SpiceCRM\modules\SchedulerJobTasks\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SchedulerJobTasks\SchedulerJobTask;

class SchedulerJobTaskController
{
    /**
     * return a list of the job task log
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function loadJobTaskLog(Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $params = $req->getQueryParams();
        $logArray = [];
        $sortField = $params['sortfield'] ?: 'executed_on';
        $q = "SELECT j.name, j.id rel_id, 'SchedulerJobs' rel_module, l.* FROM schedulerjob_log l LEFT JOIN schedulerjobs j ON j.id = l.schedulerjob_id WHERE l.schedulerjobtask_id = '{$args['id']}' ORDER BY l.$sortField DESC";
        $query = $db->limitQuery($q, $params['offset'], $params['limit']);
        $countRes = $db->fetchOne("SELECT COUNT(id) c FROM schedulerjob_log where schedulerjob_id = '{$args['id']}'");

        while ($log = $db->fetchByAssoc($query)) $logArray[] = $log;

        return $res->withJson(['list' => $logArray, 'count' => $countRes['c']]);
    }

    /**
     * run a specific job task immediately
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function runJobTask(Request $req, Response $res, array $args): Response
    {
        $jobTask = BeanFactory::getBean('SchedulerJobTasks', $args['id']);

        $return = $jobTask->run();

        return $res->withJson($return['success']);
    }

    /**
     * Returns all class names of schedulerjobtasks classes.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getSchedulerJobTaskClasses(Request $req, Response $res, array $args): Response {
        $classList = [];
        $checkRootPaths = ['include', 'modules', 'extensions/include', 'extensions/modules', 'custom/modules', 'custom/include'];

        foreach ($checkRootPaths as $checkRootPath) {
            $dirHandle = opendir("./$checkRootPath");
            if ($dirHandle) {
                while (($nextDir = readdir($dirHandle)) !== false) {
                    if ($nextDir != '.' && $nextDir != '..' && is_dir("./$checkRootPath/$nextDir")
                        && file_exists("./$checkRootPath/$nextDir/" . SchedulerJobTask::SCHEDULER_JOB_TASKS_DIRECTORY)
                    ) {
                        $subDirHandle = opendir("./$checkRootPath/$nextDir/" . SchedulerJobTask::SCHEDULER_JOB_TASKS_DIRECTORY);
                        if ($subDirHandle) {
                            while (false !== ($nextFile = readdir($subDirHandle))) {
                                if (preg_match('/.php$/', $nextFile)) {
                                    require_once("./$checkRootPath/$nextDir/" . SchedulerJobTask::SCHEDULER_JOB_TASKS_DIRECTORY . "/$nextFile");
                                }
                            }
                        }
                    }
                }
            }
        }

        foreach (get_declared_classes() as $className) {
            if (strpos($className, SchedulerJobTask::SCHEDULER_JOB_TASKS_DIRECTORY) !== false) {
                $classList[] = $className;
            }
        }

        return $res->withJson($classList);
    }
}