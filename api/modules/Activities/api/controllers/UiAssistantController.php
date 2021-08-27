<?php
namespace  SpiceCRM\modules\Activities\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\includes\authentication\AuthenticationController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\RESTManager;


class UiAssistantController{


    public function getUiAssist(Request $req, Response $res, array $args): Response{
        $postBody = $req->getParsedBody();

        $activitiyHandler = new SpiceFTSActivityHandler();
        $results = $activitiyHandler->loadActivities('Assistant', null, $postBody['start'] ?: 0, $postBody['limit'] ?: 100, $postBody['searchterm']);

        return $res->withJson($results);
    }

    public function getUiAssistX(Request $req, Response $res, array $args): Response
    {
        $RESTManager = RESTManager::getInstance();
        $KRESTModuleHandler = new ModuleHandler($RESTManager->app);
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $params = $req->getQueryParams();

        $objectFilters = json_decode($params['objectfilters']) ?: [];
        $timeFilter = $params['timefilter'] ?: 'today';

        $retArray = [];
        // todo: this needs to be done nicer ... just a workaround now to get a feed for the front page
        /*
        $records = $db->query("select * from (SELECT bean module, bean_id id, reminder_date DATE FROM spicereminders WHERE user_id  ='$current_user->id'
                                union
                                select 'Calls' module, id, date_start date from calls where assigned_user_id = '$current_user->id' and deleted = 0 and status = 'planned'
                                union
                                select 'Meetings' module, id, date_start date from meetings where assigned_user_id = '$current_user->id' and deleted = 0  and status = 'planned'
                                union
                                select 'Tasks' module, id, date_due date from tasks where assigned_user_id = '$current_user->id' and deleted = 0  and status in ('Not Started', 'In Progress', 'Pending Input')
                                union
                                select 'Opportunities' module, id, date_closed date from opportunities where assigned_user_id = '$current_user->id' and deleted = 0  and sales_stage not like \"%close%\"
                                ) unionsel order by date asc");
        while ($record = $db->fetchByAssoc($records)) {
            $seed = \SpiceCRM\data\BeanFactory::getBean($record['module'], $record['id']);
            if ($seed)
                $retArray[] = array(
                    'id' => $record['id'],
                    'module' => $record['module'],
                    'data' => $KRESTModuleHandler->mapBeanToArray($record['module'], $seed)
                );
        }
        */

        if(SpiceACL::getInstance()->checkAccess('Calls', 'list', true) && (count($objectFilters) == 0 || array_search('Calls', $objectFilters) !== false)) {
            $call = BeanFactory::getBean('Calls');
            $calls = $call->get_user_calls($current_user, $timeFilter);
            foreach ($calls as $call){
                $retArray[] = [
                    'id' => $call->id,
                    'module' => 'Calls',
                    'date_activity' => $call->date_start,
                    'data' => $KRESTModuleHandler->mapBeanToArray('Calls', $call)
                ];
            }
        }

        if(SpiceACL::getInstance()->checkAccess('Meetings', 'list', true) && (count($objectFilters) == 0  || array_search('Meetings', $objectFilters) !== false)) {
            $meeting = BeanFactory::getBean('Meetings');
            $meetings = $meeting->get_user_meetings($current_user, $timeFilter);
            foreach ($meetings as $meeting){
                $retArray[] = [
                    'id' => $meeting->id,
                    'module' => 'Meetings',
                    'date_activity' => $meeting->date_start,
                    'data' => $KRESTModuleHandler->mapBeanToArray('Meetings', $meeting)
                ];
            }
        }

        if(SpiceACL::getInstance()->checkAccess('Tasks', 'list', true) && (count($objectFilters) == 0  || array_search('Tasks', $objectFilters) !== false)) {
            $task = BeanFactory::getBean('Tasks');
            $tasks = $task->get_user_tasks($current_user, $timeFilter);
            foreach ($tasks as $task){
                $retArray[] = [
                    'id' => $task->id,
                    'module' => 'Tasks',
                    'date_activity' => $task->date_due,
                    'data' => $KRESTModuleHandler->mapBeanToArray('Tasks', $task)
                ];
            }
        }

        usort($retArray, function ($a, $b){
            return $a['date_activity'] > $b['date_activity']  ? 1 : -1;
        });

        return $res->withJson($retArray);
    }
}
