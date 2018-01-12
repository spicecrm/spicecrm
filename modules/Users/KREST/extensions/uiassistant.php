<?php
require_once('KREST/handlers/module.php');

$KRESTModuleHandler = new KRESTModuleHandler($app);

$app->group('/assistant', function () use ($app, $KRESTModuleHandler) {
    $app->get('/list', function () use ($app, $KRESTModuleHandler) {
        global $db, $current_user;
        $retArray = array();
        // todo: this needs to be done nicer ... just a workarodun now to get a feed for the front page
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

        echo json_encode($retArray);
    });
});