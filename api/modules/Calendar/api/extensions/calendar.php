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
        'oldroute'    => '/calendar/calendars',
        'class'       => CalendarController::class,
        'function'    => 'KRESTGetCalendar',
        'description' => 'gets a calendar',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/other/{calendarId}',
        'oldroute'    => '/calendar/other/{calendarid}',
        'class'       => CalendarController::class,
        'function'    => 'KRESTGetOtherCalendars',
        'description' => 'get other calendars depending on an id',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'calendarId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the calendar',
            ],
            'start'      => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'Start date',
            ],
            'end'        => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'End date',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/{userId}',
        'oldroute'    => '/calendar/{user}',
        'class'       => CalendarController::class,
        'function'    => 'getUserCalendar',
        'description' => 'gets a calender dependent on the user ',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'userId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the user',
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
            'users'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'list of users',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/users/{userId}',
        'oldroute'    => '/calendar/users/{user}',
        'class'       => CalendarController::class,
        'function'    => 'getUsersCalendar',
        'description' => 'get all calendars assigned to an user',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'userId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the user',
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
            'users'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('calendar', '1.0', [], $routes);
