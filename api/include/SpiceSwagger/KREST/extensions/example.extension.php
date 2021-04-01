<?php
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceSwagger\KREST\controllers\ExampleKRESTController;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/example/size/{exampleString}',
        'class'       => ExampleKRESTController::class,
        'function'    => 'sizeExample',
        'description' => 'An example endpoint to highlight the supported functionality.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'                => 'path',
                'description'       => 'Just an example string',
                'type'              => 'string',
                'example'           => 'Lorem ipsum',
                'validationOptions' => [
                    'minSize' => 5,
                    'maxSize' => 15,
                ],
            ],
        ],
    ],
];

/**
 * register the extension
 */

$RESTManager->registerExtension(
    'example',
    '1.0',
    [],
    $routes
);
