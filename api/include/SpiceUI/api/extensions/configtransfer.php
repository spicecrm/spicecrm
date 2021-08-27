<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceUI\api\controllers\ConfigTransferController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/configuration/transfer/tablenames',
        'class'       => ConfigTransferController::class,
        'function'    => 'getSelectableTablenames',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/transfer/export',
        'class'       => ConfigTransferController::class,
        'function'    => 'exportFromTables',
        'description' => 'Export configuration data from the tables.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'selectedTables' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'List of the names of the tables to export.'
            ],
            'additionalTables' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'List of names of additional tables to export. A comma separated string.'
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/transfer/import',
        'class'       => ConfigTransferController::class,
        'function'    => 'importToTables',
        'description' => 'Import configuration data to the tables.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'ignoreUnknownTables' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'description' => 'Ignore table data for tables that are unknown in the CRM.'
            ],
            'file' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BASE64,
                'description' => 'The configuration data to import, from the exported file.'
            ]
        ]
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('configtransfer', '2.0', [], $routes);