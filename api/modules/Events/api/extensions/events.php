<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\EventRegistrations\api\controllers\EventRegistrationsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('eventregistrations', '1.0');

$routes = [
[
    'method'      => 'post',
    'route'       => '/module/Events/{id}/registrations',
    'class'       => EventController::class,
    'function'    => 'setEventRegistrations',
    'description' => '',
    'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    'parameters'  => [
        'id'    => [
            'in'          => 'path',
            'description' => 'Event Registrations',
            'type'        => ValidationMiddleware::TYPE_GUID,
        ],
        'listData'    => [
            'in'          => 'body',
            'description' => 'Event Registrations',
            'type'        => ValidationMiddleware::TYPE_ARRAY,
        ],
        'registrationData'    => [
            'in'          => 'body',
            'description' => 'Event Registrations',
            'type'        => ValidationMiddleware::TYPE_ARRAY,
        ],
    ],
],
];

$RESTManager->registerRoutes($routes);