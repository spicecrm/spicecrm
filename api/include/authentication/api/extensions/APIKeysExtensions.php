<?php

use SpiceCRM\includes\authentication\api\controllers\APIKeysController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;

$restManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'route' => '/authentication/apiKeys/{user_id}',
        'class' => APIKeysController::class,
        'function' => 'getUserKeys',
        'description' => 'get api keys',
        'options' => ['validate' => true],
        'parameters' => [
            'user_id' => [
                'in' => 'path',
                'description' => 'user id',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ],
        'responses' => [
            '200' => [
                'description' => 'API Keys list',
                'schema' => [
                    'type' => 'array',
                    'subtype' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => [
                                'type' => ValidationMiddleware::TYPE_GUID,
                                'description' => 'key id'
                            ],
                            'created_by_id' => [
                                'type' => ValidationMiddleware::TYPE_GUID,
                                'description' => 'created by id'
                            ],
                            'created_by_name' => [
                                'type' => ValidationMiddleware::TYPE_STRING,
                                'description' => 'created by name'
                            ],
                            'date_created' => [
                                'type' => ValidationMiddleware::TYPE_DATETIME,
                                'description' => 'date created'
                            ],
                            'expire_on' => [
                                'type' => ValidationMiddleware::TYPE_DATETIME,
                                'description' => 'valid until'
                            ],
                            'is_active' => [
                                'type' => ValidationMiddleware::TYPE_BOOL,
                                'description' => 'is active'
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/authentication/apiKeys/{key_id}',
        'class' => APIKeysController::class,
        'function' => 'generateKey',
        'description' => 'generate api key',
        'options' => ['validate' => true],
        'parameters' => [
            'key_id' => [
                'in' => 'path',
                'description' => 'key id',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'user_id' => [
                'in' => 'path',
                'description' => 'user id',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'expire_on' => [
                'in' => 'body',
                'description' => 'expire on',
                'type' => ValidationMiddleware::TYPE_DATETIME,
                'required' => false,
            ]
        ],
        'responses' => [
            '200' => [
                'description' => 'API Keys list',
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => [
                            'type' => ValidationMiddleware::TYPE_GUID,
                            'description' => 'key id'
                        ],
                        'created_by_id' => [
                            'type' => ValidationMiddleware::TYPE_GUID,
                            'description' => 'created by id'
                        ],
                        'created_by_name' => [
                            'type' => ValidationMiddleware::TYPE_STRING,
                            'description' => 'created by name'
                        ],
                        'date_created' => [
                            'type' => ValidationMiddleware::TYPE_DATETIME,
                            'description' => 'date created'
                        ],
                        'expire_on' => [
                            'type' => ValidationMiddleware::TYPE_DATETIME,
                            'description' => 'expire on'
                        ],
                        'is_active' => [
                            'type' => ValidationMiddleware::TYPE_BOOL,
                            'description' => 'is active'
                        ]
                    ]
                ]
            ]

        ]
    ],
    [
        'method' => 'delete',
        'route' => '/authentication/apiKeys/{key_id}',
        'class' => APIKeysController::class,
        'function' => 'deleteKey',
        'description' => 'delete api key',
        'options' => ['validate' => true],
        'parameters' => [
            'key_id' => [
                'in' => 'path',
                'description' => 'key id',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ],
        'responses' => [
            '204' => [
                'description' => 'Key was successfully deleted'
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/authentication/apiKeys/{key_id}/activate',
        'class' => APIKeysController::class,
        'function' => 'activateKey',
        'description' => 'activate api key',
        'options' => ['validate' => true],
        'parameters' => [
            'key_id' => [
                'in' => 'path',
                'description' => 'key id',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ],
        'responses' => [
            '204' => [
                'description' => 'Key was successfully activated'
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/authentication/apiKeys/{key_id}/deactivate',
        'class' => APIKeysController::class,
        'function' => 'deactivateKey',
        'description' => 'deactivate api key',
        'options' => ['validate' => true],
        'parameters' => [
            'key_id' => [
                'in' => 'path',
                'description' => 'key id',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ],
        'responses' => [
            '204' => [
                'description' => 'Key was successfully deactivated'
            ]
        ]
    ]
];

$restManager->registerExtension('apiKeys', '1.0', [], $routes);