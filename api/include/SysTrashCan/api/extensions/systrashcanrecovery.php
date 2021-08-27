<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SysTrashCan\api\controllers\SysTrashCanRecoveryController;
use SpiceCRM\includes\authentication\AuthenticationController;


$routes = [
    [
        'method'      => 'get',
        'route'       => '/admin/systrashcan',
        'oldroute'    => '/systrashcan',
        'class'       => SysTrashCanRecoveryController::class,
        'function'    => 'getTrashedRecords',
        'description' => 'get all records contained in trash can',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/systrashcan/related/{transactionid}/{recordid}',
        'oldroute'    => '/systrashcan/related/{transactionid}/{recordid}',
        'class'       => SysTrashCanRecoveryController::class,
        'function'    => 'getRelatedTrashRecords',
        'description' => 'get all related records corresponding to specified transaction id and record id',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'transactionid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a database transaction id',
                'example' => 'e4acc89d-6c75-f9c2-edc3-601044f6eafd',
                'required' => true
            ],
            'recordid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a bean id',
                'example' => 'cc21dd0c-9ee7-11eb-b1c9-00fffe0c4f07',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/admin/systrashcan/recover/{recordid}',
        'oldroute'    => '/systrashcan/recover/{id}',
        'class'       => SysTrashCanRecoveryController::class,
        'function'    => 'recoverTrashedRecords',
        'description' => 'recover specified trashed record and optionally its related records',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'recordid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a bean id',
                'example' => 'cc21dd0c-9ee7-11eb-b1c9-00fffe0c4f07',
                'required' => true
            ],
            'recoverrelated' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'number: 1 or 0',
                'example' => 1,
                'required' => true
            ]
        ]
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('systrashcan', '2.0', [], $routes);