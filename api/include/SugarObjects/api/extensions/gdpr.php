<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\api\controllers\GdprController;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/gdpr/{module}/{id}',
        'oldroute'    => '/gdpr/{module}/{id}',
        'class'       => GdprController::class,
        'function'    => 'getGdprReleases',
        'description' => 'Get the GDPR Releases.',
        'options'     => ['noAuth' => false, 'adminOnly' => false]
    ], [
        'method'      => 'get',
        'route'       => '/common/gdpr/portalGDPRconsentText',
        'oldroute'    => '/gdpr/portalGDPRconsentText',
        'class'       => GdprController::class,
        'function'    => 'getPortalGDPRconsentText',
        'description' => 'Get the consent text that the user has agreed to.',
        'options'     => ['noAuth' => false, 'adminOnly' => false]
    ],[
        'method'      => 'post',
        'route'       => '/common/gdpr/portalGDPRconsent',
        'oldroute'    => '/gdpr/portalGDPRconsent',
        'class'       => GdprController::class,
        'function'    => 'setPortalGDPRconsent',
        'description' => 'Set the GDPR consent of the user and save the consent text the user has agreed.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'consentText'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The consent text that the user has agreed to.',
            ]
        ]
    ],
];

/**
 * register the Extension and register the routes
 */
RESTManager::getInstance()->registerExtension('gdpr', '2.0', [], $routes );
