<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\modules\Campaigns\api\controllers\ContactsSubscriptionsController;

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
        'class'       => ContactsSubscriptionsController::class,
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
        'class'       => ContactsSubscriptionsController::class,
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
];

$RESTManager->registerRoutes($routes);