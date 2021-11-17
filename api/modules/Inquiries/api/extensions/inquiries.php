<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Inquiries\api\controllers\InquiriesController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('inquiries', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Inquiries/fromavada/{module}',
        'class'       => InquiriesController::class,
        'function'    => 'createFromAvada',
        'description' => 'create a bean using Wordpress Avada Plugin',
        'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Inquiries/catalogs',
        'class'       => InquiriesController::class,
        'function'    => 'getCatalogs',
        'description' => 'get product list for product group defined in config[catalogorders][productgroup_id]',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
    ],
];

$RESTManager->registerRoutes($routes);
