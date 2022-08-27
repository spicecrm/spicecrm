<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Documents\api\controllers\DocumentsController;


/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('documents', '1.0');

$routes = [
    [
        'method' => 'post',
        'route' => '/module/Documents/{id}/revisionfrombase64',
        'oldroute' => '/module/Documents/{id}/revisionFromBase64',
        'class' => DocumentsController::class,
        'function' => 'revisionFromBase64',
        'description' => 'save new document revision',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the document',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'file' => [
                'in' => 'body',
                'description' => 'the encoded contents of the file',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'JVBERi0xLjMKMSAwIG9iago8PCAvV...',
            ],
            'file_name' => [
                'in' => 'body',
                'description' => 'name of the file',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'file.pdf',
            ],
            'file_mime_type' => [
                'in' => 'body',
                'description' => 'the type of file',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'application/pdf',
            ],
            'documentrevisionstatus' => [
                'in' => 'body',
                'description' => 'the revision status of the file',
                'type' => ValidationMiddleware::TYPE_ENUM,
                'example' => 'r',
            ],
        ]
    ],
];

$RESTManager->registerRoutes($routes);

