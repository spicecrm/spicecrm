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
        'route' => '/admin/repair/dictionary',
        'class' => DictionaryController::class,
        'function' => 'repairDictionary',
        'description' => 'repaire database, cache and relationships for specific dictionaries',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'dictionaries' => [
                'in' => 'body',
                'description' => 'an array containing dictionary names',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'required' => false
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/admin/repair/custom/enum',
        'class' => DictionaryController::class,
        'function' => 'repairCustomEnum',
        'description' => 'save all vardefs to sysdictionaryfields table and relationships to relationships table',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
//    [
//        'method' => 'get',
//        'route' => '/admin/dictionary/links',
//        'class' => DictionaryController::class,
//        'function' => 'checkLinks',
//        'description' => 'save all vardefs to sysdictionaryfields table and relationships to relationships table',
//        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => false],
//    ]
];

/**
 * get a Rest Manager Instance
 */
RESTManager::getInstance()->registerExtension('dictionary', '2.0', [], $routes);