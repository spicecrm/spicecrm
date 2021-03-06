<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use stdClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceUILoadtasksController
{
    public function getLoadTasks(Request $req, Response $res, $args)
    {
        $db = DBManagerFactory::getInstance();
        $tasksArray = [];
        $routes = $db->query("SELECT * FROM sysuiloadtasks UNION SELECT * FROM sysuicustomloadtasks");
        while ($route = $db->fetchByAssoc($routes)) {

            $tasksArray[] = $route;

        }
        return $res->withJson($tasksArray);
    }

    public function executeLoadTask(Request $req, Response $res, $args)
    {
        $db = DBManagerFactory::getInstance();
        $responseArray = [];
        $taskitems = $db->query("SELECT * FROM sysuiloadtaskitems WHERE sysuiloadtasks_id = '{$args['loadtaskid']}' UNION SELECT * FROM sysuicustomloadtaskitems WHERE sysuiloadtasks_id = '{$args['loadtaskid']}'");
        while ($taskitem = $db->fetchByAssoc($taskitems)) {
            // check if static call or not
            if (strpos($taskitem['method'], '::') > 0) {
                try {
                    $responseArray[$taskitem['name']] = $taskitem['method']();
                } catch (Exception  $e) {
                    $responseArray[$taskitem['name']] = new stdClass();
                }
            } else if(strpos($taskitem['method'], '->') > 0){
                try{
                    $funcArray = explode('->', $taskitem['method']);
                    $obj = new $funcArray[0]();
                    $responseArray[$taskitem['name']] = $obj->{$funcArray[1]}();
                } catch(Exception  $e){
                    $responseArray[$taskitem['name']] = new stdClass();
                }
            } else {
                $responseArray[$taskitem['name']] = new stdClass();
            }
        }
        return $res->withJson($responseArray);
    }

}
