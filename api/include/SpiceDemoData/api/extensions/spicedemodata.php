<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceDemoData\api\controllers\SpiceDemoDataController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'route'       => '/configuration/demodata',
        'oldroute'    => '/generadetdemodata',
        'class'       => SpiceDemoDataController::class,
        'function'    => 'generateB2B',
        'description' => 'create demo data in CRM for modules Accounts, Contacts, Leads & Opportunities',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/demodata/{module}',
        'oldroute'    => '/generadetdemodata/{module}',
        'class'       => SpiceDemoDataController::class,
        'function'    => 'generateForModule',
        'description' => 'create demo data in CRM for selected module (Accounts, Contacts, Leads or Consumers)',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'module name',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('demodata', '1.0', [], $routes);
