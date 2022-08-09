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
        'function' => 'repairCacheDb',
        'description' => 'save all vardefs to sysdictionaryfields table and relationships to relationships table',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method' => 'post',
        'route' => '/admin/repair/custom/enum',
        'class' => DictionaryController::class,
        'function' => 'repairCustomEnum',
        'description' => 'save all vardefs to sysdictionaryfields table and relationships to relationships table',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
];

/**
 * get a Rest Manager Instance
 */
RESTManager::getInstance()->registerExtension('dictionary', '2.0', [], $routes);