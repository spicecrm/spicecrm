<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Campaigns\api\controllers\CampaignsController;

use SpiceCRM\includes\RESTManager;


/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('campaigns', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Contacts/{id}/newsletters/subscriptions',
        'oldroute'    => '/newsletters/subscriptions/{contactid}',
        'class'       => CampaignsController::class,
        'function'    => 'getSubscriptionList',
        'description' => 'get newsletters subscriptions for specific contact where a newsletter corresponds to a campaign in CRM',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the contact',
                'type' => 'guid',
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Contacts/{id}/newsletters/subscriptions',
        'oldroute'    => '/newsletters/subscriptions/{contactid}',
        'class'       => CampaignsController::class,
        'function'    => 'changeSubscriptionType',
        'description' => 'subscribe or unsubscribe to newsletters for specific contact where a newsletter corresponds to a campaign in CRM',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the contact',
                'type' => 'guid',
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ],
            'subscribed' => [
                'in' => 'body',
                'description' => 'array of campaign associative arrays to subscribe for the contact',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '[["id"=>"a29342d1-897b-11eb-9bff-00fffe0c4f07"], ["id"=>"b061e2ab-897b-11eb-9bff-00fffe0c4f07"]]',
                'required' => false
            ],
            'unsubscribed' => [
                'in' => 'body',
                'description' => 'array of campaign associative arrays to unsubscribe for the contact',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '[["id"=>"a29342d1-897b-11eb-9bff-00fffe0c4f07"], ["id"=>"b061e2ab-897b-11eb-9bff-00fffe0c4f07"]]',
                'required' => false
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/module/Campaigns/{campaignId}/delete',
        'class' => CampaignsController::class,
        'function' => 'deleteCampaign',
        'description' => 'delete campaign with its campaign tasks and campaignlogs',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'campaignId' => [
                'in' => 'path',
                'description' => 'id of campaign to delete',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => 'a29342d1-897b-11eb-9bff-00fffe0c4f07',
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);