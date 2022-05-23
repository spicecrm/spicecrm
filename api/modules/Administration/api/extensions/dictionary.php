<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Administration\api\controllers\DictionaryController;

$routes = [
    [
        'method' => 'get',
        'route' => '/admin/repair/cachedb',
        'class' => DictionaryController::class,
        'function' => 'repairVardefs',
        'description' => 'save all vardefs to sysdictionaryfields table',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
];

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance()->registerExtension('dictionary', '2.0', [], $routes);