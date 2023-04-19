<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\SpiceACLObjects\api\controllers\SpiceACLObjectsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('spiceaclobjects', '1.0');


$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects',
        'oldroute'    => '/spiceaclobjects',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getSpiceACLObjects',
        'description' => 'Get Spice Auth Object by module or search term',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'moduleid' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of the module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => false
            ],
            'searchterm' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a search term',
                'example' => '',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/defaultobjects',
        'oldroute'    => '/spiceaclobjects/createdefaultobjects',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'createDefaultObjects',
        'description' => 'Create default ACL objects',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'moduleid' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a module id',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => false
            ],
            'modulename' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects/modules',
        'oldroute'    => '/spiceaclobjects/authtypes',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getACLModules',
        'description' => 'get usage count of SpiceACLObjects for all modules under acl',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
//    [
//        'method'      => 'delete',
//        'route'       => '/spiceaclobjects/authtypes/{id}',
//        'class'       => SpiceACLObjectsController::class,
//        'function'    => 'deleteAuthType',
//        'description' => 'Delete Auth Type',
//        'options'     => ['noAuth' => false, 'adminOnly' => false],
//    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getACLModule',
        'description' => 'get ACL module name, including fields and actions for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of module which is under acl',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/fields/{field}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypefields/{field}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'addACLModuleField',
        'description' => 'Create  field entry for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'field' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'field name',
                'example' => 'date_entered',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/fields/{fieldid}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypefields/{fieldid}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteACLModuleField',
        'description' => 'Delete field entry for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'fieldid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of field',
                'example' => '37fdc731-3fa0-11eb-94d8-42010a9c008e',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/actions',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypeactions',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getACLModuleActions',
        'description' => 'Get Auth Type Action',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/actions/{action}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypeactions/{action}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'addACLModuleAction',
        'description' => 'Create ACL action for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'action' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'action itself',
                'example' => 'edit',
                'required' => true
            ],
            'description' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a textual description for the acl action',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/actions/{actionid}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypeactions/{actionid}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteACLModuleAction',
        'description' => 'Delete action for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL Module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'actionid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL Module action',
                'example' => '37e9c102-3fa0-11eb-94d8-42010a9c008e',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/{id}/activation',
        'oldroute'    => '/spiceaclobjects/activation/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'activateObject',
        'description' => 'activate specified ACL Object',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id for ACL Object',
                'example' => '19c16e85-d253-4015-9cf5-5e4fa12ada50',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLObjects/{id}/activation',
        'oldroute'    => '/spiceaclobjects/activation/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deactivateObject',
        'description' => 'deactivate specified ACL Object',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id for ACL Object',
                'example' => '19c16e85-d253-4015-9cf5-5e4fa12ada50',
                'required' => true
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
