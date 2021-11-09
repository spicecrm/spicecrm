<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Products\api\controllers\ProductController;

$routes = [
    [
        'method' => 'get',
        'oldroute' => '/products/{id}/productattributes/direct',
        'route' => '/module/Products/{id}/ProductAttributes/direct',
        'class' => ProductController::class,
        'function' => 'productGetValue',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
                'required' => true
            ],
            'searchparams' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => true,
                'required' => false
            ],
        ]
    ]
];

// register the Extension
RESTManager::getInstance()->registerExtension('productmanagement', '2.0', [], $routes);
