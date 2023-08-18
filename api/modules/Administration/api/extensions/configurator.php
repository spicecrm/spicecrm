<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\api\controllers\ConfiguratorController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;


$routes = [
    [
        'method'      => 'get',
        'route'       => '/configuration/configurator/editor/{category}',
        'oldroute'    => '/configurator/editor/{category}',
        'class'       => ConfiguratorController::class,
        'function'    => 'checkForConfig',
        'description' => 'checks if an config exists if not create an stdclass',
        'options'     => ['adminOnly' => true, 'validate' => true ],
        'parameters'  => [
            'category' => [
                'in' => 'path',
                'description' => 'Category',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/configurator/editor/{category}',
        'oldroute'       => '/configurator/editor/{category}',
        'class'       => ConfiguratorController::class,
        'function'    => 'writeConfToDb',
        'description' => 'writes not forbidden categories to the database',
        'options'     => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'category' => [
                'in' => 'path',
                'description' => 'Category',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
            'config' => [
                'in' => 'body',
                'description' => 'Various fields of the configuration DB table.',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/configurator/entries/{table}',
        'class'       => ConfiguratorController::class,
        'function'    => 'readConfig',
        'description' => 'reads the config from a db table as generic interface',
        'options'     => ['adminOnly' => true, 'validate' => true ],
        'parameters'  => [
            'table' => [
                'in' => 'path',
                'description' => 'Table',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/configurator/{table}/{id}',
        'oldroute'    => '/configurator/{table}/{id}',
        'class'       => ConfiguratorController::class,
        'function'    => 'deleteConfig',
        'description' => 'delete config entry',
        'options'     => ['adminOnly' => true, 'validate' => true ],
        'parameters'  => [
            'table' => [
                'in' => 'path',
                'description' => 'Table',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
            'id' => [
                'in' => 'path',
                'description' => 'ID',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/configurator/{table}/{id}',
        'oldroute'    => '/configurator/{table}/{id}',
        'class'       => ConfiguratorController::class,
        'function'    => 'writeConfig',
        'description' => 'writes config to database',
        'options'     => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'table' => [
                'in' => 'path',
                'description' => 'Table',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
            'id' => [
                'in' => 'path',
                'description' => 'ID',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ],
            'config' => [
                'in' => 'body',
                'description' => 'Various fields of the configuration DB table.',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/configurator/{table}',
        'class'       => ConfiguratorController::class,
        'function'    => 'writeConfigList',
        'description' => 'writes config list to database',
        'options'     => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'table' => [
                'in' => 'path',
                'description' => 'Table',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
            'config' => [
                'in' => 'body',
                'description' => 'Various fields of the configuration DB table.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/configurator/load',
        'oldroute'    => '/configurator/load',
        'class'       => ConfiguratorController::class,
        'function'    => 'loadDefaultConfig',
        'description' => 'loads clears the default config',
        'options'     => ['adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'versions' => [
                'in' => 'query',
                'description' => 'Versions',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
            'packages' => [
                'in' => 'query',
                'description' => 'Packages',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ]
        ]

    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/configurator/objectrepository',
        'oldroute'    => '/configurator/objectrepository',
        'class'       => ConfiguratorController::class,
        'function'    => 'getObjectRepositoryItems',
        'description' => 'Gets the object repository items as string, comma separated.',
        'options'     => ['adminOnly' => true, 'validate' => true ],
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('adminconfigurator', '1.0', [], $routes);

