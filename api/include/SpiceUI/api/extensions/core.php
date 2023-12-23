<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceUI\api\controllers\CoreController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/',
        'class'       => CoreController::class,
        'function'    => 'getExtensions',
        'description' => 'get the loaded Extensions',
        'options'     => ['noAuth' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/sysinfo',
        'oldroute'    => '/sysinfo',
        'class'       => CoreController::class,
        'function'    => 'getSysinfo',
        'description' => 'get vital system information for the startup',
        'options'     => ['noAuth' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/sysassets',
        'class'       => CoreController::class,
        'function'    => 'getSysAssets',
        'description' => 'gets the system assets (images and color settings)',
        'options'     => ['noAuth' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/system/language',
        'class'       => CoreController::class,
        'function'    => 'getLanguage',
        'summary'     => 'loads the specific language strings',
        'description' => 'loads the specific language strings',
        'options'     => ['noAuth' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/system/language/{language}',
        'class'       => CoreController::class,
        'function'    => 'getLanguage',
        'summary'     => 'loads the specific language strings',
        'description' => 'loads the specific language strings',
        'options'     => ['noAuth' => true, 'validate' => true],
        'parameters' => [
            'language' => [
                'in' => 'path',
                'description' => 'requested language',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'example' => 'de_DE'
            ]
        ]
    ],

    [
        'method'      => 'post',
        'route'       => '/system/httperrors',
        'oldroute'    => '/httperrors',
        'class'       => CoreController::class,
        'function'    => 'postHttpErrors',
        'description' => 'Logs HTTP errors got from the frontend.',
        'options'     => ['validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'errors' => [
                'in'          => 'body',
                'description' => 'Data of the errors occurred in the frontend.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype' => ValidationMiddleware::TYPE_COMPLEX,
                'required' => true
            ],
        ],
    ],

    [
        'method'      => 'get',
        'route'       => '/admin/routes',
        'oldroute'    => '/routes',
        'class'       => CoreController::class,
        'function'    => 'getRoutes',
        'description' => 'get the routes from the restmanager',
        'options'     => ['validate' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/swagger',
        'oldroute'    => '/swagger',
        'class'       => CoreController::class,
        'function'    => 'getSwagger',
        'description' => 'Returns all swagger definitions of the API',
        'options'     => ['validate' => true],
        'parameters'  => [
            'modules'    => [
                'in'          => 'body',
                'description' => 'The modules names for which the generic routes will be instantiated.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_MODULE,
                'required'    => false,
            ],
            'extensions' => [
                'in'          => 'body',
                'description' => 'The extension names for which the swagger file will be generated.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_EXTENSION,
                'required'    => false,
            ],
            'node' => [
                'in'          => 'body',
                'description' => 'A (partial) API path. All routes including the node at the beginning of its path will be included in the generated swagger file.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example'     => '/example',
                'required'    => false,
            ],
        ],
    ],
];

/**
 * register the extension
 */

RESTManager::getInstance()->registerExtension(
    'core',
    '2.0',
    ['edit_mode' => SpiceConfig::getInstance()->config['workbench_edit_mode']['mode'] ?: 'custom'],
    $routes
);
