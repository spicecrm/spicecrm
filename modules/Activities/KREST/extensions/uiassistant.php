<?php
require_once('KREST/handlers/module.php');

$KRESTModuleHandler = new KRESTModuleHandler($app);

$app->group('/assistant', function () use ($app, $KRESTModuleHandler) {
    $app->get('/list', function ($req, $res, $args) use ($app, $KRESTModuleHandler) {
        global $db, $current_user;

        $params = $req->getParams();

        $objectFilters = json_decode($params['objectfilters']) ?: [];
        $timeFilter = $params['timefilter'] ?: 'today';

        $retArray = array();
        // todo: this needs to be done nicer ... just a workarodun now to get a feed for the front page
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
            $seed = BeanFactory::getBean($record['module'], $record['id']);
            if ($seed)
                $retArray[] = array(
                    'id' => $record['id'],
                    'module' => $record['module'],
                    'data' => $KRESTModuleHandler->mapBeanToArray($record['module'], $seed)
                );
        }
        */

        if(count($objectFilters) == 0 || array_search('Calls', $objectFilters) !== false) {
            $call = BeanFactory::getBean('Calls');
            $calls = $call->get_user_calls($current_user, $timeFilter);
            foreach ($calls as $call){
                $retArray[] = array(
                    'id' => $call->id,
                    'module' => 'Calls',
                    'date' => $call->date_start,
                    'data' => $KRESTModuleHandler->mapBeanToArray('Calls', $call)
                );
            }
        }

        if(count($objectFilters) == 0  || array_search('Meetings', $objectFilters) !== false) {
            $meeting = BeanFactory::getBean('Meetings');
            $meetings = $meeting->get_user_meetings($current_user, $timeFilter);
            foreach ($meetings as $meeting){
                $retArray[] = array(
                    'id' => $meeting->id,
                    'module' => 'Meetings',
                    'date' => $meeting->date_start,
                    'data' => $KRESTModuleHandler->mapBeanToArray('Meetings', $meeting)
                );
            }
        }

        if(count($objectFilters) == 0  || array_search('Tasks', $objectFilters) !== false) {
            $task = BeanFactory::getBean('Tasks');
            $tasks = $task->get_user_tasks($current_user, $timeFilter);
            foreach ($tasks as $task){
                $retArray[] = array(
                    'id' => $task->id,
                    'module' => 'Tasks',
                    'date' => $task->date_due,
                    'data' => $KRESTModuleHandler->mapBeanToArray('Tasks', $task)
                );
            }
        }

        usort($retArray, function ($a, $b){
            return $a['date'] > $b['date']  ? 1 : -1;
        });

        echo json_encode($retArray);
    });
});