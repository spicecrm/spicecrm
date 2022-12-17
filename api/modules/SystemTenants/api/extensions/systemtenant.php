<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\modules\SystemTenants\api\controllers\SystemTenantsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('systemtenants', '1.0');


$routes = [
    [
        'method' => 'post',
        'route' => '/module/SystemTenants/{id}/initialize',
        'oldroute' => '',
        'class' => SystemTenantsController::class,
        'function' => 'initialize',
        'description' => 'initializes a new tenant',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tenant',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SystemTenants/{id}/loaddemodata',
        'oldroute' => '',
        'class' => SystemTenantsController::class,
        'function' => 'loadDemoData',
        'description' => 'loads demo data for a tenant',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tenant',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696'
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SystemTenants/acceptlegalnotice',
        'oldroute' => '',
        'class' => SystemTenantsController::class,
        'function' => 'acceptLegalNotice',
        'description' => 'loads demo data for a tenant',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/module/SystemTenants/authenticationuser',
        'class' => SystemTenantsController::class,
        'function' => 'createAuthUser',
        'description' => 'loads demo data for a tenant',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'body',
                'description' => 'the id of the user to create auth entry for',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696'
            ],
            'tenantId' => [
                'in' => 'body',
                'description' => 'the id of the tenant',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696'
            ],
            'username' => [
                'in' => 'body',
                'description' => 'the username',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'spice.user'
            ],
            'password' => [
                'in' => 'body',
                'description' => 'the password of the user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '324534534634'
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
