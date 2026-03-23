<?php

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Leads\api\controllers\LeadGenerateController;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceSwagger\OpenApiResponse;

$restManager = RESTManager::getInstance();
$openApi = new OpenApiResponse();

$routes = [
    [
        'method' => 'post',
        'route' => '/module/Leads/generateai/{promptId}',
        'class' => LeadGenerateController::class,
        'function' => 'generateLeadByAIPrompt',
        'description' => 'generate lead by AI prompt',
        'options' => ['validate' => true],
        'parameters' => [
            'promptId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'filename' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'file' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'mime' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING
            ]
        ],
        'responses' => $openApi->json("Created lead id")->object(
            $openApi->property('id', ValidationMiddleware::TYPE_GUID, 'Lead id')
        )
    ]
];

$restManager->registerExtension('leadgenerate', '1.0', [], $routes);
