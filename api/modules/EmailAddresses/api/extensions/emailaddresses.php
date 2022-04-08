<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\EmailAddresses\api\controllers\EmailAddressesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('emailaddresses', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/EmailAddresses/{searchterm}',
        'oldroute' => '/EmailAddresses/{searchterm}',
        'class' => EmailAddressesController::class,
        'function' => 'searchMailAddress',
        'description' => 'searches for emails ',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'searchterm' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'A search term',
            ],
        ],
    ],
    [
        'method' => 'post',
        'route' => '/module/EmailAddress/searchbeans',
        'oldroute' => '/EmailAddress/searchBeans',
        'class' => EmailAddressesController::class,
        'function' => 'getMailText',
        'description' => 'get and parse the body of an email',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'addresses' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype' => ValidationMiddleware::TYPE_EMAIL,
                'required' => true,
                'description' => 'An array containing email addresses',
            ],
            'message_id' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'a string containing a key',
            ]
        ],
    ],
    [
        'method' => 'get',
        'route' => '/module/EmailAddresses/{parentmodule}/{parentid}',
        'class' => EmailAddressesController::class,
        'function' => 'searchParentBeanMailAddress',
        'description' => 'searches for emailaddresses related to the parent bean',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'parentmodule' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ]
        ],
    ]
];

$RESTManager->registerRoutes($routes);
