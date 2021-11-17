<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\KREST\controllers\CoreController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/',
        'class'       => CoreController::class,
        'function'    => 'getExtensions',
        'description' => 'get the loaded Extensions',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/sysinfo',
        'oldroute'    => '/sysinfo',
        'class'       => CoreController::class,
        'function'    => 'getSysinfo',
        'description' => 'get vital system information for the startup',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'oldroute'    => '/language/{language}',
        'route'       => '/system/language',
        'class'       => CoreController::class,
        'function'    => 'getLanguage',
        'summary'     => 'loads the specific language strings',
        'description' => 'loads the specific language strings',
        'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'setPreferences' => [
                'in' => 'query',
                'description' => 'set the preferences',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => 'de_DE'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'oldroute'    => '/language/{language}',
        'route'       => '/system/language/{language}',
        'class'       => CoreController::class,
        'function'    => 'getLanguage',
        'summary'     => 'loads the specific language strings',
        'description' => 'loads the specific language strings',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'parameters' => [
            'language' => [
                'in' => 'path',
                'description' => 'requested language',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'example' => 'de_DE'
            ],
            'setPreferences' => [
                'in' => 'query',
                'description' => 'set the preferences',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => 'de_DE'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/system/guid',
        'class'       => CoreController::class,
        'function'    => 'generateGuid',
        'description' => 'helper to generate a GUID',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/system/httperrors',
        'oldroute'    => '/httperrors',
        'class'       => CoreController::class,
        'function'    => 'postHttpErrors',
        'description' => 'Logs HTTP errors got from the frontend.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true, 'excludeBodyValidation' => true],
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
        'route'       => '/system/shorturl/{key}',
        'class'       => CoreController::class,
        'function'    => 'getRedirection',
        'description' => 'get redirection data for a short url',
        'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'key' => [
                'in'          => 'path',
                'description' => 'Short URL key',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example'     => 'gX2qwKsKc',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^[a-km-zA-HJ-NP-Z2-9]+$#'
                ]
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
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/Swagger',
        'oldroute'    => '/swagger',
        'class'       => CoreController::class,
        'function'    => 'getSwagger',
        'description' => 'Returns all swagger definitions of the API',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'modules'    => [
                'in'          => 'body',
                'description' => 'The modules names for which the generic routes will be instantiated.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => 'module',
                'required'    => false,
            ],
            'extensions' => [
                'in'          => 'body',
                'description' => 'The extension names for which the swagger file will be generated.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => 'extension',
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
