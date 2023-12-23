<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\modules\Administration\api\controllers\ReferenceController;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('adminreference', '1.0');

/**
 * restrict routes to authenticated users
 */

$routes = [
    [
        'method'      => 'get',
        'route'       => '/system/reference',
        'oldroute'    => '/reference',
        'class'       => ReferenceController::class,
        'function'    => 'getCurrentSystemConf',
        'description' => 'get the current system Configuration',
        'options'     => ['adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/load/languages/{languages}',
        'oldroute'    => '/load/languages/{languages}',
        'class'       => ReferenceController::class,
        'function'    => 'loadSystemLanguage',
        'description' => 'load the system languages',
        'options'     => ['adminOnly' => false],
        'parameters'  => [
            'languages' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'comma separated list of languages',
                'example' => 'en_us,de_DE,es_es',
                'required' => false,
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/load/configs',
        'oldroute'    => '/load/configs',
        'class'       => ReferenceController::class,
        'function'    => 'cleanUpDefaultConf',
        'description' => 'cleanup and load the default configuration',
        'options'     => ['adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'package' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'package name',
                'example' => 'opportunitymanagement',
                'required' => false,
            ],
            'version' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'version name',
                'example' => '2021.01.001',
                'required' => false,
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);

