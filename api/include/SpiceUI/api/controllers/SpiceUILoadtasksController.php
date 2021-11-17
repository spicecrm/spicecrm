<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use stdClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceUILoadtasksController
{
    public function getLoadTasks(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $tasksArray = [];
        $routes = $db->query("SELECT * FROM sysuiloadtasks UNION SELECT * FROM sysuicustomloadtasks");
        while ($route = $db->fetchByAssoc($routes)) {

            $tasksArray[] = $route;

        }
        return $res->withJson($tasksArray);
    }

    public function executeLoadTask(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $responseArray = [];
        $taskitems = $db->query("SELECT * FROM sysuiloadtaskitems WHERE sysuiloadtasks_id = '{$args['loadtaskid']}' UNION SELECT * FROM sysuicustomloadtaskitems WHERE sysuiloadtasks_id = '{$args['loadtaskid']}'");
        while ($taskitem = $db->fetchByAssoc($taskitems)) {
            // check if static call or not
            try {
                if (strpos($taskitem['method'], '::') > 0) {
                    $responseArray[$taskitem['name']] = $taskitem['method']();
                } elseif (strpos($taskitem['method'], '->') > 0) {
                    $funcArray = explode('->', $taskitem['method']);
                    if (!class_exists($funcArray[0])) {
                        throw new Exception("Class {$funcArray[0]} not found.");
                    }
                    $obj = new $funcArray[0]();
                    $responseArray[$taskitem['name']] = $obj->{$funcArray[1]}();
                } else {
                    throw new Exception('Load task method malformed.');
                }
            } catch (Exception $e) {
                if (!isset($responseArray[$taskitem['name']])) {
                    $responseArray[$taskitem['name']] = $e->getMessage();
                }
            } catch (\Exception $e) {
                $responseArray[$taskitem['name']] = new stdClass();
            }
        }
        return $res->withJson($responseArray);
    }
}
