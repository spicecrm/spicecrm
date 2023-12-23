<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\api\controllers\PackageController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/repositories',
        'oldroute'    => '/packages/repositories',
        'class'       => PackageController::class,
        'function'    => 'getRepositories',
        'description' => 'get the links to available repositories to retrieve packages from',
        'options'     => ['adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages',
        'class'       => PackageController::class,
        'function'    => 'getPackages',
        'description' => 'get all packages',
        'options'     => ['adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/{repository}',
        'class'       => PackageController::class,
        'function'    => 'getPackages',
        'description' => 'get all packages for selected repository',
        'options'     => ['adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'repository' => [
                'in' => 'path',
                'description' => 'the repository id to retrieve the package from',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => false,
                'example' => 'b5feb33a-8ae4-11eb-b159-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/package/{package}[/{repository}]',
        'oldroute'       => '/packages/package/{package}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadPackage',
        'description' => 'load a specific package from a specific repository',
        'options'     => ['adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'package' => [
                'in' => 'path',
                'description' => 'name of the package to retrieve ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'opportunitymanagement'
            ],
            'repository' => [
                'in' => 'path',
                'description' => 'the repository id to retrieve the package from',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => false,
                'example' => 'b5feb33a-8ae4-11eb-b159-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/packages/package/{package}',
        'oldroute'    => '/packages/package/{package}',
        'class'       => PackageController::class,
        'function'    => 'deletePackage',
        'description' => 'unload a specific package',
        'options'     => ['adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'package' => [
                'in' => 'path',
                'description' => 'the package name to remove from current configuration ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'opportunitymanagement'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/language/{language}[/{repository}]',
        'oldroute'    => '/packages/language/{language}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadLanguage',
        'description' => 'load a specific language into current configuration from a specific repository',
        'options'     => ['adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'language' => [
                'in' => 'path',
                'description' => 'the language name to add to current configuration ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'de_DE'
            ],
            'repository' => [
                'in' => 'path',
                'description' => 'the repository id to get the package from',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => false,
                'example' => 'b5feb33a-8ae4-11eb-b159-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/packages/language/{language}',
        'oldroute'    => '/packages/language/{language}',
        'class'       => PackageController::class,
        'function'    => 'deleteLanguage',
        'description' => 'remove a specific language and its translations from current configuration',
        'options'     => ['adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'language' => [
                'in' => 'path',
                'description' => 'the language name to remove from current configuration ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'de_DE'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/repositories/metadata',
        'class'       => PackageController::class,
        'function'    => 'loadRepositoriesMetadata',
        'description' => 'load packages and version from all repositories for the system',
        'options'     => ['adminOnly' => true, 'validate' => true],
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('adminpackages', '1.0', [], $routes);

