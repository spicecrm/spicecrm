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
        'method' => 'post',
        'route' => '/module/Letters/{id}/marksent/{template_id}',
        'class' => LettersController::class,
        'function' => 'markAsSent',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'the id of the letter',
            ],
            'template_id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'the id of the template',
            ]
        ],
    ],
];

$RESTManager->registerRoutes($routes);
