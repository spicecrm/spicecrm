<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\SpiceImports\api\controllers\SpiceImportsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/SpiceImports/savedimports/{beanName}',
        'oldroute'    => '/modules/SpiceImports/savedImports/{beanName}',
        'class'       => SpiceImportsController::class,
        'function'    => 'getSavedImports',
        'description' => 'get the saved spice imports',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'Module name',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceImports/filepreview',
        'oldroute'    => '/modules/SpiceImports/filePreview',
        'class'       => SpiceImportsController::class,
        'function'    => 'getFilePreview',
        'description' => 'get the file reviews',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'separator' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['comma', 'semicolon'],
                'required'    => true,
                'description' => ''
            ],
            'enclosure' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['single', 'double', 'none'],
                'required'    => true,
                'description' => ''
            ],
            'file_md5'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => ''
            ],
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceImports/upf',
        'oldroute'    => '/modules/SpiceImports/upf',
        'class'       => SpiceImportsController::class,
        'function'    => 'deleteImportFile',
        'description' => 'delete the import files',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceImports/import',
        'oldroute'    => '/modules/SpiceImports/import',
        'class'       => SpiceImportsController::class,
        'function'    => 'saveFromImport',
        'description' => 'saves data from an imports',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        /*
        'parameters'  => [
            'objectimport' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_JSON,
                'required'    => true,
                'description' => '',
            ],
        ],
        */
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceImports/{importId}/logs',
        'oldroute'    => '/modules/SpiceImports/{importId}/logs',
        'class'       => SpiceImportsController::class,
        'function'    => 'getImportLog',
        'description' => 'get the spice import log entries',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'importId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the import',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spiceimports', '1.0', [], $routes);
