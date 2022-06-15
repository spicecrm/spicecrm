<?php

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceDictionary\api\controllers\MigrateController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();



/**
 * restrict routes to admin users
 */
$routes = [
    [
        'method'      => 'post',
        'route'       => '/admin/migrate/legacydoms',
        'class'       => MigrateController::class,
        'function'    => 'migrateIdFields',
//        'function'    => 'migrateLegacyDomTranslations',
//        'function'    => 'migrateLegacyDoms',
        'description' => 'write language app_list_strings to sysdomainfieldvalidations',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [],
    ],
//    [
//        'method'      => 'post',
//        'route'       => '/spicedictionary/repaircache',
//        'class'       => MigrateController::class,
//        'function'    => 'repairCache',
//        'description' => 'write to sysdictionaryfields',
//        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
//        'parameters'  => [
//
//        ],
//    ],
    [
        'method'      => 'get',
        'route'       => '/spicedictionary/{module}',
        'class'       => MigrateController::class,
        'function'    => 'getDictionary',
        'description' => 'load vardefs for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
            ]
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/spicedictionary/migratemetadata',
        'class'       => MigrateController::class,
        'function'    => 'migrateMetadata',
        'description' => 'create dictionary definitions and items for metadata definitions',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [

        ],
    ],

];

/**
 * register the Extension
 */
$RESTManager->registerExtension('migrate', '1.0', [], $routes);

