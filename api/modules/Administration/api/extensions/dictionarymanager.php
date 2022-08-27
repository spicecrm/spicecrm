<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Administration\api\controllers\DictionaryController;
use SpiceCRM\modules\Administration\api\controllers\AdminController;
use SpiceCRM\modules\Administration\api\controllers\DictionaryManagerController;


$routes = [
    [
        'method' => 'get',
        'route' => '/dictionary/list/{table}',
        'class' => DictionaryManagerController::class,
        'function' => 'getDictionaryFields',
        'description' => 'get the columns name for the table from the database',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'table' => [
                'in' => 'path',
                'description' => 'the name of the table to retrieve fields from',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/browser/{module}/nodes',
        'class' => DictionaryController::class,
        'function' => 'getNodes',
        'description' => 'builds an array with all the field nodes for specified module',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/browser/{module}/fields',
        'class' => DictionaryController::class,
        'function' => 'getFields',
        'description' => 'builds an array with all the fields defined for specified module',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Accounts',
                'required' => true
            ]
        ]

    ],
    [
        'method' => 'get',
        'route' => '/dictionary/browser/{module}/dbcolumns',
        'class' => AdminController::class,
        'function' => 'getDBColumns',
        'description' => 'get all columns from the module-table in the database allowed as admin',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'get column name for table used by specified module in the database',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/admin/repair/sql',
        'oldroute' => '/repair/sql',
        'class' => AdminController::class,
        'function' => 'buildSQLArray',
        'description' => 'building the query for a relationship repair',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/admin/repair/database',
        'oldroute' => '/repair/database',
        'class' => AdminController::class,
        'function' => 'repairAndRebuild',
        'description' => 'repairs and rebuilds the database',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'selectedqueries' => [
                'in' => 'body',
                'description' => 'the selected queries to be executed',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '[{"comment": "/* Table : accounts */",
                                "statement": "ALTER TABLE accounts   add COLUMN ticker_symbol varchar(10)  NULL   COMMENT;",
                                "md5": "e3b8c6e1834848a40867f9debbd794c4",
                                "selected": true}]',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/admin/repair/language',
        'oldroute' => '/repair/language',
        'class' => AdminController::class,
        'function' => 'repairLanguage',
        'description' => 'clears language cache and repairs the language extensions',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/admin/repair/cache',
        'oldroute' => '/repair/cache',
        'class' => AdminController::class,
        'function' => 'repairCache',
        'description' => 'clears the vardef cache, executes rebuilding of vardefs extensions and',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/admin/repair/dbcolumns',
        'oldroute' => '/repair/dbcolumns',
        'class' => AdminController::class,
        'function' => 'repairDBColumns',
        'description' => 'delete all the given columns in the database ',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'dbcolumns' => [
                'in' => 'body',
                'description' => 'the columns of the table',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => []
            ],
            'module' => [
                'in' => 'body',
                'description' => 'the module corresponding to the table',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts'
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/admin/repair/core',
        'oldroute' => '',
        'class' => AdminController::class,
        'function' => 'repairAndReloadCore',
        'description' => 'repairs the database and loads the core package',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/charset/database',
        'class'       => AdminController::class,
        'function'    => 'getDatabaseCharsetInfo',
        'description' => 'returns information on the charset and collation of a database and its tables',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [],
    ],
    [
        'method'      => 'post',
        'route'       => '/admin/convert/database',
        'class'       => AdminController::class,
        'function'    => 'convertDatabase',
        'description' => 'converts the DB charset and collation',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'charset' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'the target charset for the tables',
            ],
        ],
        'example'     => '{
                            "charset": "utf8mb4",
                            "collation": "utf8mb4_general_ci"
                        }',
    ],
    [
        'method'      => 'post',
        'route'       => '/admin/convert/tables',
        'class'       => AdminController::class,
        'function'    => 'convertTables',
        'description' => 'converts the charset of the given tables',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'tables' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'an array with the names of the tables to be converted',
            ],
            'charset' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'the target charset for the tables',
            ],
        ],
        'example'     => '{
                            "charset": "utf8mb4",
                            "collation": "utf8mb4_general_ci",
                            "tables": ["accounts", "contacts"]
                        }',
    ],
];

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance()->registerExtension('admindictionary', '2.0', [], $routes);