<?php

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\VoiceOverIP\api\controllers\VoiceOverIPController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'post',
        'route' => '/channels/voice/telephonyGeneric/events/handle',
        'class' => VoiceOverIPController::class,
        'function' => 'handleEvent',
        'description' => 'Handles the incoming events from the phone system',
        'options' => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'body',
                'description' => 'the id of the call',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'channel' => [
                'in' => 'body',
                'description' => 'the channel of the call e.g. user extension',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '100',
                'required'    => true
            ],
            'state' => [
                'in' => 'body',
                'description' => 'the state of the call (PROCEEDING, RINGBACK, INCOMING, RINGING, CONNECTED, HANGUP)',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'RINGING',
                'required'    => true
            ],
            'callerNumber' => [
                'in' => 'body',
                'description' => 'the phone number of the call',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'RINGING',
                'required'    => true
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/channels/voice/telephonyGeneric/preferences',
        'class'       => VoiceOverIPController::class,
        'function'    => 'setPreferences',
        'description' => 'Sets the phone system preferences',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'userpass' => [
                'in'          => 'body',
                'required'    => true,
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'User password',
            ],
            'username' => [
                'in'          => 'body',
                'required'    => true,
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'Username',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/channels/voice/telephonyGeneric/preferences',
        'class'       => VoiceOverIPController::class,
        'function'    => 'getPreferences',
        'description' => 'Returns the phone system preferences',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension(
    'telephony',
    '1.0',
    [],
    $routes
);