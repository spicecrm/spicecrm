<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\api\controllers\AdminController;
use SpiceCRM\modules\Administration\api\controllers\DictionaryController;
use SpiceCRM\modules\Administration\api\controllers\DictionaryManagerController;


$routes = [
    [
        'method' => 'get',
        'route' => '/dictionary/browser/{module}/nodes',
        'class' => DictionaryController::class,
        'function' => 'getNodes',
        'description' => 'builds an array with all the field nodes for specified module',
        'options' => ['adminOnly' => false, 'validate' => true],
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
        'options' => ['adminOnly' => false, 'validate' => true],
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
        'route' => '/dictionary/browser/relationshipFields/{module}/{link}',
        'class' => DictionaryController::class,
        'function' => 'getModuleRelationshipFields',
        'description' => 'get module relationship fields',
        'options' => ['adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Accounts',
                'required' => true
            ],
            'link' => [
                'in' => 'path',
                'description' => 'the name of the link',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'accounts_contacts',
                'required' => true
            ]
        ]

    ],
    [
        'method' => 'get',
        'route' => '/dictionary/browser/auditFields',
        'class' => DictionaryController::class,
        'function' => 'getAuditFields',
        'description' => 'get module relationship fields',
        'options' => ['adminOnly' => false, 'validate' => false],
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/browser/{module}/dbcolumns',
        'class' => AdminController::class,
        'function' => 'getDBColumns',
        'description' => 'get all columns from the module-table in the database allowed as admin',
        'options' => ['adminOnly' => true, 'validate' => true],
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
        'method' => 'post',
        'route' => '/admin/repair/dbcolumns',
        'oldroute' => '/repair/dbcolumns',
        'class' => AdminController::class,
        'function' => 'repairDBColumns',
        'description' => 'delete all the given columns in the database ',
        'options' => ['adminOnly' => true, 'validate' => true],
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
        'method'      => 'get',
        'route'       => '/admin/charset/database',
        'class'       => AdminController::class,
        'function'    => 'getDatabaseCharsetInfo',
        'description' => 'returns information on the charset and collation of a database and its tables',
        'options'     => ['adminOnly' => true, 'validate' => true],
        'parameters'  => [],
    ],
    [
        'method'      => 'post',
        'route'       => '/admin/convert/database',
        'class'       => AdminController::class,
        'function'    => 'convertDatabase',
        'description' => 'converts the DB charset and collation',
        'options'     => ['adminOnly' => true, 'validate' => true],
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
        'options'     => ['adminOnly' => true, 'validate' => true],
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
RESTManager::getInstance()->registerExtension('admindictionary', '2.0', [], $routes);