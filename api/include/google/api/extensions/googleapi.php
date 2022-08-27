<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\google\api\controllers\GoogleApiController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/channels/groupware/gsuite/places/search/{term}/{locationBias}',
        'oldroute'    => '/googleapi/places/search/{term}/{locationbias}',
        'class'       => GoogleApiController::class,
        'function'    => 'search',
        'description' => 'start a search',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'term'         => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'Search term',
            ],
            'locationBias' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'Location bias',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/channels/groupware/gsuite/places/autocomplete/{term}',
        'oldroute'    => '/googleapi/places/autocomplete/{term}',
        'class'       => GoogleApiController::class,
        'function'    => 'autocomplete',
        'description' => 'get the autocompletion',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'term' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'Auto completion term',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/channels/groupware/gsuite/places/{placeId}',
        'oldroute'    => '/googleapi/places/{placeid}',
        'class'       => GoogleApiController::class,
        'function'    => 'getPlaceDetails',
        'description' => 'get the details of a place',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'placeId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'Google place ID',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension(
    'google_api',
    '1.0',
    ['key' => SpiceConfig::getInstance()->config['googleapi']['mapskey']? 'xxx' : ''],
    $routes
);
