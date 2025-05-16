<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\api\controllers\PersonsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/vcard',
        'oldroute'    => '/{module}/convert/{id}/to/VCard',
        'class'       => PersonsController::class,
        'function'    => 'convertToVCard',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module.',
            ],
            'beanId'     => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean.',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('person', '1.0', [], $routes);
