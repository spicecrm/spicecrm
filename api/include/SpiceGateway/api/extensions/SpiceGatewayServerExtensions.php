<?php
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceGateway\api\controllers\SpiceGatewayServerController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();
/**
 * register the Extension
 */
$RESTManager->registerExtension('gateway', '1.0');


$routes = [
    [
        'method' => 'post',
        'route' => '/channels/gateway/email/send',
        'class' => SpiceGatewayServerController::class,
        'function' => 'sendEmail',
        'description' => 'send email passed by a client system',
        'options' => ['validate' => true],
        'parameters' => [
            'recipients' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
            ],
            'subject' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
            ],
            'body' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
            ]
        ],
        'responses' => [
            '200' => [
                'description' => 'OK',
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ValidationMiddleware::TYPE_STRING,
                    ]
                ]
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/channels/gateway/sms/send',
        'class' => SpiceGatewayServerController::class,
        'function' => 'sendSMS',
        'description' => 'send sms passed by a client system',
        'options' => ['validate' => true],
        'parameters' => [
            'phoneNumber' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
            ],
            'message' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
            ]
        ],
        'responses' => [
            '200' => [
                'description' => 'OK',
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ValidationMiddleware::TYPE_STRING,
                    ]
                ]
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/channels/gateway/sms/template/send',
        'class' => SpiceGatewayServerController::class,
        'function' => 'sendTemplateTypeSMS',
        'description' => 'compile template by type and send sms content by a client system',
        'options' => ['validate' => true],
        'parameters' => [
            'phoneNumber' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
            ],
            'data' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
            ],
            'type' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'template type from enum'
            ],
            'language' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'template language from iso e.g. en_us'
            ]
        ],
        'responses' => [
            '200' => [
                'description' => 'OK',
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ValidationMiddleware::TYPE_STRING,
                    ]
                ]
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/channels/gateway/email/template/send',
        'class' => SpiceGatewayServerController::class,
        'function' => 'sendTemplateTypeEmail',
        'description' => 'compile template by type and send email content by a client system',
        'options' => ['validate' => true],
        'parameters' => [
            'recipients' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
            ],
            'data' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
            ],
            'type' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'template type from enum'
            ],
            'language' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'template language from iso e.g. en_us'
            ]
        ],
        'responses' => [
            '200' => [
                'description' => 'OK',
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ValidationMiddleware::TYPE_STRING,
                    ]
                ]
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);