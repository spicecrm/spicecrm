<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\modules\CampaignLog\api\controllers\CampaignLogController;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('telecockpit', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/CampaignLog/{id}/{status}',
        'oldroute'    => '/module/CampaignLog/{campaignlogid}/{status}',
        'class'       => CampaignLogController::class,
        'function'    => 'getCampaignLogByStatus',
        'description' => 'gets campaign logs by status',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of campaign log entry',
                'example' => 'c7a88116-97e0-11eb-8c42-00fffe0c4f07',
                'required' => true
            ],
            'status' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'status to set in campaign log attempted|called|completed',
                'example' => 'attempted',
                'required' => true
            ],
            'planned_activity_date' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_DATETIME,
                'description' => 'UTC date and time of the attempt. Only needed for attempted.',
                'example' => '2021-02-23 11:25:06',
                'required' => false
            ],
            'call_id' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of the call created. ONly needed for called',
                'example' => '30d70a8f-97e1-11eb-8c42-00fffe0c4f07',
                'required' => false
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
