<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\SpiceTexts\api\controllers\SpiceTextController;

$routes = [
    [
        'method' => 'get',
        'route' => '/module/SpiceTexts/{parentType}/load',
        'class' => SpiceTextController::class,
        'function' => 'getSpiceTexts',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'parentType'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the module',
            ]
        ]
    ]
];

// register the Extension
RESTManager::getInstance()->registerExtension('spicetexts', '1.0', [], $routes);
