<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\Emails\api\controllers\EmailsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();



$routes = [
    [
        'method'      => 'get',
        'route'       => '/track',
        'class'       => EmailsController::class,
        'function'    => 'trackEmail',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'sys'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_BASE64,
                'required'    => false,
            ],
            'id'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_BASE64,
                'required'    => true
            ]
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('emailtracker', '1.0', [], $routes);
