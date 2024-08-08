<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Events\api\controllers\EventsController;

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
        'class'       => EventsController::class,
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
        [
            'method'      => 'get',
            'route'       => '/module/Events/{id}/bookings',
            'class'       => EventsController::class,
            'function'    => 'getCapacitiesWithSlots',
            'description' => 'get all EventCapacityTypes with the related EventCapacities and all its slots',
            'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
            'parameters'  => [],
        ],
        [
            'method'      => 'get',
            'route'       => '/module/Events/{id}/bookingtable',
            'class'       => EventsController::class,
            'function'    => 'getBookingTable_forEvent',
            'description' => 'get all EventCapacityTypes with the related EventCapacities and all its slots',
            'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
            'parameters'  => [],
        ],
        [
            'method'      => 'get',
            'route'       => '/module/EventCapacities/{id}/bookingtable',
            'class'       => EventsController::class,
            'function'    => 'getBookingTable_forCapacity',
            'description' => 'get EventCapacity and all its slots',
            'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
            'parameters'  => [],
        ],
        [
            'method'      => 'post',
            'route'       => '/module/EventBookings/{id}/booking',
            'class'       => EventsController::class,
            'function'    => 'saveEventBookingWithoutCapacity',
            'description' => 'Save EventBookings; check if still available; create consumer',
            'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
            'parameters'  => [
                'id'   => [
                    'in'          => 'path',
                    'type'        => ValidationMiddleware::TYPE_GUID,
                    'required'    => true,
                    'description' => 'The id of the booking',
                ],
                // bean in body
                ValidationMiddleware::ANONYMOUS_ARRAY => [
                    'in' => 'body',
                    'type' => ValidationMiddleware::TYPE_COMPLEX,
                    'description' => 'array with bean data',
                    'example' => '',
                    'required' => true
                ],
            ],
        ],
    ],
];

$RESTManager->registerRoutes($routes);