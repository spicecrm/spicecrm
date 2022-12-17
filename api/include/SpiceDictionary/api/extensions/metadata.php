<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceDictionary\api\controllers\MetadataController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * routes
 */

$routes = [
//    [
//        'method'      => 'get',
//        'route'       => '/metadata/modules',
//        'oldroute'    => '/metadata/modules',
//        'class'       => MetadataController::class,
//        'function'    => 'getModules',
//        'description' => 'get modules',
//        'options'     => ['noAuth' => false, 'adminOnly' => true],
//    ],
//    [
//        'method'      => 'get',
//        'route'       => '/metadata/vardefs/{module}',
//        'oldroute'    => '/metadata/vardefs/{module}',
//        'class'       => MetadataController::class,
//        'function'    => 'getVarDefsForModule',
//        'description' => 'get vardefs for module',
//        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
//        'parameters'  => [
//            'module' => [
//                'in'          => 'path',
//                'type'        => ValidationMiddleware::TYPE_MODULE,
//                'required'    => true,
//                'description' => 'Module name',
//            ],
//        ],
//    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('metadata', '1.0', [], $routes);
