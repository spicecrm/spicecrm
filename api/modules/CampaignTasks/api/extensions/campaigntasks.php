<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\CampaignTasks\api\controllers\CampaignTasksController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('campaigntasks', '1.0', ['pdflimit' => SpiceConfig::getInstance()->config['mailmerge']['pdflimit']]);

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/CampaignTasks/{id}/items',
        'oldroute'    => '/module/CampaignTasks/{campaignid}/items',
        'class'       => CampaignTasksController::class,
        'function'    => 'getCampaignTaskItems',
        'description' => 'get campaign tasks defined for a specific campaign',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'offset' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'offset for list',
                'example' => 25,
                'required' => false
            ],
            'limit' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'limit for list',
                'example' => 50,
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/CampaignTasks/{id}/activate',
        'oldroute'    => '/module/CampaignTasks/{campaigntaskid}/activate',
        'class'       => CampaignTasksController::class,
        'function'    => 'activateCampaignTask',
        'description' => 'delete old campaign logs and activte campaign task by inserting new ones',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id'    => [
                'in'          => 'path',
                'description' => 'Campaign Task id',
                'type'        => ValidationMiddleware::TYPE_GUID,
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'    => '/module/CampaignTasks/{id}/targetcount',
        'class'       => CampaignTasksController::class,
        'function'    => 'getTargetCount',
        'description' => 'returns the number of targets via linked target lists',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id'    => [
                'in'          => 'path',
                'description' => 'Campaign Task id',
                'type'        => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'    => '/module/CampaignTasks/{id}/mailmerge',
        'class'       => CampaignTasksController::class,
        'function'    => 'mailmergeCampaignTask',
        'description' => 'genereate a PDF for a mailmerge campaign',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id'    => [
                'in'          => 'path',
                'description' => 'Campaign Task id',
                'type'        => ValidationMiddleware::TYPE_GUID
            ],
            'start'    => [
                'in'          => 'path',
                'description' => 'the index to start the letter from',
                'type'        => ValidationMiddleware::TYPE_NUMERIC
            ],
            'limit'    => [
                'in'          => 'path',
                'description' => 'the number of records to print',
                'type'        => ValidationMiddleware::TYPE_NUMERIC
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/CampaignTasks/{id}/export',
        'oldroute'    => '/module/CampaignTasks/{campaignid}/export',
        'class'       => CampaignTasksController::class,
        'function'    => 'exportCampaignTask',
        'description' => 'Export Campaign Task',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id'    => [
                'in'          => 'path',
                'description' => 'Campaign Task id',
                'type'        => ValidationMiddleware::TYPE_GUID,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/CampaignTasks/{id}/sendtestmail',
        'oldroute'    => '/module/CampaignTasks/{campaigntaskid}/sendtestmail',
        'class'       => CampaignTasksController::class,
        'function'    => 'sendCampaignTaskTestEmail',
        'description' => 'send a test mail for campaign task',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id'    => [
                'in'          => 'path',
                'description' => 'Campaign Task id',
                'type'        => ValidationMiddleware::TYPE_GUID,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/CampaignTasks/{id}/queuemail',
        'oldroute'    => '/module/CampaignTasks/{campaigntaskid}/queuemail',
        'class'       => CampaignTasksController::class,
        'function'    => 'queueCampaignTaskEmail',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id'    => [
                'in'          => 'path',
                'description' => 'Campaign Task id',
                'type'        => ValidationMiddleware::TYPE_GUID,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/CampaignTasks/{id}/livecompile/{parentmodule}/{parentid}',
        'oldroute'    => '/CampaignTasks/liveCompile/{module}/{parent}',
        'class'       => CampaignTasksController::class,
        'function'    => 'liveCompileEmailBody',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'parentmodule' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'name of parent module',
                'example' => 'Accounts',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'if of parent bean',
                'example' => '2816ba5c-97e7-11eb-8c42-00fffe0c4f07',
                'required' => true
            ],
            'html' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'html string',
                'example' => '',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/CampaignTasks/export/reports',
        'class'       => CampaignTasksController::class,
        'function'    => 'getExportReports',
        'description' => 'get all reports based on CampaignTasks module',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
];

$RESTManager->registerRoutes($routes);
