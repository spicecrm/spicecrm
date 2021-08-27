<?php
use SpiceCRM\includes\SpiceInstaller\REST\controllers\SpiceInstallerController;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;


$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/install/sysinfo',
        'class'       => SpiceInstallerController::class,
        'function'    => 'getSysInfo',
        'description' => 'check on url rewrite',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/install/check',
        'class'       => SpiceInstallerController::class,
        'function'    => 'checkSystem',
        'description' => 'get an array of systemrequirements and their status',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/install/checkreference',
        'class'       => SpiceInstallerController::class,
        'function'    => 'checkReference',
        'description' => 'check if reference database is accessible',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/install/getlanguages',
        'class'       => SpiceInstallerController::class,
        'function'    => 'getLanguages',
        'description' => 'get config data from reference database',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/install/checkdb',
        'class'       => SpiceInstallerController::class,
        'function'    => 'checkDB',
        'description' => 'get config data for database',
        'options'     => ['noAuth' => true, 'true' => false],
        'parameters'  => [
            'db_type' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the database type mysql|mssql|oci8',
                'example' => 'mysql',
                'required' => true,
            ],
            'db_manager' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the name of the class to to create a database instance in CRM',
                'example' => 'mysql',
                'required' => true,
            ],
            'db_host_name' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the host name where to find database or the IP address',
                'example' => 'localhost',
                'required' => true,
            ],
            'db_port' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the port to access database. Default is 3306',
                'example' => '3307',
                'required' => true,
            ],
            'db_user_name' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the user name for database connection',
                'example' => '3307',
                'required' => true,
            ],
            'db_password' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the user password for database connection',
                'example' => '3307',
                'required' => true,
            ],
            'db_name' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the database name',
                'example' => 'spicecrm',
                'required' => true,
            ],
            'db_schema' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the database schema to use in oci',
                'example' => '',
                'required' => false,
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/install/checkfts',
        'class'       => SpiceInstallerController::class,
        'function'    => 'checkFTS',
        'description' => 'check connection to elactic server',
        'options'     => ['noAuth' => true, 'true' => false],
        'parameters'  => [
            'protocol' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the protocol used to access server http|https',
                'example' => 'http',
                'required' => true,
            ],
            'server' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the name of the class to to create a database instance in CRM',
                'example' => 'localhost',
                'required' => true,
            ],
            'port' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the port to access elatic server',
                'example' => '9200',
                'required' => true,
            ],
            'prefix' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the prefix to set in index names',
                'example' => 'spicecrm_',
                'required' => true,
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/install/process',
        'class'       => SpiceInstallerController::class,
        'function'    => 'install',
        'description' => 'run installation process',
        'options'     => ['noAuth' => true, 'true' => false],
    ],
];

$RESTManager->registerExtension('spiceinstaller', '1.0', [], $routes);
