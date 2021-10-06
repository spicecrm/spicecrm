<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Letters\api\controllers\LettersController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('emails', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/Letters/{id}/marksent/{template_id}',
        'class' => LettersController::class,
        'function' => 'markAsSent',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'attachmentId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'The attachment ID',
            ],
        ],
    ],
];

$RESTManager->registerRoutes($routes);
