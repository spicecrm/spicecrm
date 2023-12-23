<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Users\api\controllers\UsersImageController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('userimages', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Users/{id}/image',
        'class'       => UsersImageController::class,
        'function'    => 'SaveImageData',
        'description' => 'Saves the Image',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'ID of the user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'example' => '40109eab-ddc0-01fb-3a85-b3f3f87cfa1c'
            ],
            'imagedata' => [
                'in' => 'body',
                'description' => 'String for the image',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => ''
            ],
            ]
    ],
];

$RESTManager->registerRoutes($routes);

