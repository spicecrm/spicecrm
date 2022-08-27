<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\ProspectLists\api\controllers\ProspectListsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('prospectlists', '1.0');
$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/ProspectLists/createfromlist/{listid}',
        'oldroute'    => '/modules/ProspectLists/createfromlist/{listid}',
        'class'       => ProspectListsController::class,
        'function'    => 'createFromListId',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'listid' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of list',
                'required' => true
            ],
            'targetlistname' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'name of targetlist'
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/ProspectLists/exportfromlist',
        'oldroute'    => '/modules/ProspectLists/exportFromList',
        'class'       => ProspectListsController::class,
        'function'    => 'exportFromList',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'module' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'module',
                'required' => true
            ],
            'modulefilter' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'modulefilter'
            ],
            'ids' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'array of the selected ids'
            ],
            'listid' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of list'
            ],
            'targetlistname' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'name of targetlist'
            ],
            'listtype' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'type of current list'
            ],
            'owner' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'description' => 'is owner of current list'
            ],
            'searchterm' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'search string'
            ],
            'aggregates' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'array of selected aggregates'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/ProspectLists/getrelated/{beanName}/{beanId}',
        'class'       => ProspectListsController::class,
        'function'    => 'getRelatedModules',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'links'          => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'required'    => true,
                'description' => 'array with the links to check beans relationship',
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/ProspectLists/fromModule',
        'class'       => ProspectListsController::class,
        'function'    => 'saveTargetList',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'data'          => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'required'    => true,
                'description' => 'array with the ids to check beans relationship',
            ],
        ]
    ],

];

$RESTManager->registerRoutes($routes);

