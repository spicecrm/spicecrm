<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceFTSManager\api\controllers\SearchController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * routes
 */
$routes = [
    [
        'method' => 'post',
        'route' => '/search',
        'class' => SearchController::class,
        'function' => 'search',
        'description' => 'process the search',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters' => [
            'searchterm' => [
                'in' => 'body',
                'description' => 'a searchterm to search by',
                'type' => ValidationMiddleware::TYPE_STRING,
            ],
            'modules' => [
                'in' => 'body',
                'description' => 'a comma separated list of modules to search in',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Contacts,Accounts',
                'required' => true
            ],
            'records' => [
                'in' => 'body',
                'description' => 'the number of records to return',
                'type' => ValidationMiddleware::TYPE_STRING,
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/search/phonenumber',
        'class' => SearchController::class,
        'function' => 'searchPhone',
        'description' => 'process search based on a phonenumber sent in request or body',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters' => [
            'searchterm' => [
                'in' => 'query', // or body
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a search term',
                'example' => '12124353045',
                'required' => false
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/search/export',
        'class' => SearchController::class,
        'function' => 'export',
        'description' => 'process the export for an fts request',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
];

/**
 * register the Extension
 */
$ftsConfig = SpiceConfig::getInstance()->config['fts'];
$RESTManager->registerExtension('search', '1.0', ['min_ngram' => $ftsConfig['min_ngram'], 'max_ngram' => $ftsConfig['max_ngram']], $routes);
