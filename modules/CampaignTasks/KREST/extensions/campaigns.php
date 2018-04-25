<?php

require_once('KREST/handlers/module.php');


$app->get('/module/CampaignTasks/{campaignid}/items', function($req, $res, $args) use ($app) {

    $campaignLog = BeanFactory::getBean('CampaignLog');
    $list = $campaignLog->get_list("", "campaigntask_id = '{$args['campaignid']}'", $args['offset'] ?: 0, $args['limit'] ?: 20);

    // get a KREST Handler
    $KRESTModuleHandler = new KRESTModuleHandler($app);

    // empty items structure for the return
    $items = [];

    foreach($list['list'] as $item){
        $seed = BeanFactory::getBean($item->target_type, $item->target_id);
        $items[] = array(
            'campaignlog_id' => $item->id,
            'campaignlog_activity_type' => $item->activity_type,
            // tbd
            'data' => $KRESTModuleHandler->mapBeanToArray($item->target_type, $seed)
        );
    }

    echo json_encode(array('items' => $items));
});

$app->post('/module/CampaignTasks/{campaignid}/activate', function($req, $res, $args) use ($app) {

    // load the campaign task
    $campaignTask = BeanFactory::getBean('CampaignTasks', $args['campaignid']);

    // activate the campaigntask
    $campaignTask->track_prospects();

    echo json_encode(array('success' => true, 'id' => $args['campaignid']));
});

