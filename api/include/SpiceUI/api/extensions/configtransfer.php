<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceUI\api\controllers\ConfigTransferController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

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
            ],
            'packages' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'A comma separated string of packages to be exported',
                'required' => false
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
            'keepAssignedUser' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'description' => 'Keep assigned user.'
            ],
            'keepEnteredModifiedInfo' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'description' => 'Keep entered/modified information.'
            ],
            'file' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BASE64,
                'description' => 'The configuration data to import, from the exported file.'
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/package/system/generate',
        'class'       => ConfigTransferController::class,
        'function'    => 'generateSystemPackage',
        'description' => 'generate system package and validate all entries',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/backup/list',
        'class'       => ConfigTransferController::class,
        'function'    => 'getBackupFiles',
        'description' => 'get all available backup files',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/backup/manage',
        'class'       => ConfigTransferController::class,
        'function'    => 'backupFileManage',
        'description' => 'display the content of the backup file',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'filePath' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'path of the file to be displayed',
                'required'    => true
            ],
            'action'   => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'type of action to be performed',
                'required'    => false
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/backup/delete',
        'class'       => ConfigTransferController::class,
        'function'    => 'deleteBackupFile',
        'description' => 'delete the selected backup file',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'filePath' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'path of the file to be deleted'
            ]
        ]
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('configtransfer', '2.0', ['export_system_package_enabled' => SpiceConfig::getInstance()->get('systemvardefs.create_system_file_enabled') == 1], $routes);