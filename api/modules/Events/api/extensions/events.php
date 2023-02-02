<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Events\api\controllers\EventController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('events', '1.0');

$routes = [
[
    'method'      => 'post',
    'route'       => '/module/Events/{id}/registrations',
    'class'       => EventController::class,
    'function'    => 'createEventRegistrations',
    'description' => 'Will create event registration to corresponding event for each member in selected target lists',
    'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    'parameters'  => [
        'id'    => [
            'in'          => 'path',
            'description' => 'Event Registrations',
            'type'        => ValidationMiddleware::TYPE_GUID,
        ],
        'targetListIds'    => [
            'in'          => 'body',
            'description' => 'A list of prospectList Ids',
            'type'        => ValidationMiddleware::TYPE_ARRAY,
        ],
        'registrationData'    => [
            'in'          => 'body',
            'description' => 'Additional field values for the Event Registrations',
            'type'        => ValidationMiddleware::TYPE_ARRAY,
        ],
        'eventId'    => [
            'in'          => 'body',
            'description' => 'Event Id',
            'type'        => ValidationMiddleware::TYPE_GUID,
        ],
    ],
],
];

$RESTManager->registerRoutes($routes);