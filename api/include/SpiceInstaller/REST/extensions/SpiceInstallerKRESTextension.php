<?php
use SpiceCRM\includes\SpiceInstaller\REST\controllers\SpiceInstallerKRESTController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\RESTManager;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/isysinfo',
        'class'       => SpiceInstallerKRESTController::class,
        'function'    => 'getSysInfo',
        'description' => '',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceinstaller/check',
        'class'       => SpiceInstallerKRESTController::class,
        'function'    => 'checkSystem',
        'description' => '',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceinstaller/checkreference',
        'class'       => SpiceInstallerKRESTController::class,
        'function'    => 'checkReference',
        'description' => '',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceinstaller/getlanguages',
        'class'       => SpiceInstallerKRESTController::class,
        'function'    => 'getLanguages',
        'description' => '',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceinstaller/checkdb',
        'class'       => SpiceInstallerKRESTController::class,
        'function'    => 'checkDB',
        'description' => '',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceinstaller/checkfts',
        'class'       => SpiceInstallerKRESTController::class,
        'function'    => 'checkFTS',
        'description' => '',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceinstaller/install',
        'class'       => SpiceInstallerKRESTController::class,
        'function'    => 'install',
        'description' => '',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
];

$RESTManager->registerExtension('spiceinstaller', '1.0', [], $routes);
