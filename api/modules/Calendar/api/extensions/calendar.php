<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Calendar\api\controllers\CalendarController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/modules',
        'oldroute'    => '/calendar/modules',
        'class'       => CalendarController::class,
        'function'    => 'getCalendarModules',
        'description' => 'gets the modules setup for calendar',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/calendars',
        'class'       => CalendarController::class,
        'function'    => 'getOtherCalendars',
        'description' => 'get all other calendars',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/{calendarId}/user/{userId}',
        'oldroute'    => '/calendar/{user}',
        'class'       => CalendarController::class,
        'function'    => 'getUserCalendarEvents',
        'description' => 'gets a calender dependent on the user ',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'userId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the user',
            ],
            'calendarId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'GUID of the calendar or owner for the owner calendar',
            ],
            'start'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'Start date',
            ],
            'end'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'End date',
            ],
            'searchTerm'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'Search Term',
            ],
            'users'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'list of users',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('calendar', '1.0', [], $routes);
