<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

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
        'description' => 'buildind the query for a relationship repair',
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
                                "statement": "ALTER TABLE accounts   add COLUMN `ticker_symbol` varchar(10)  NULL   COMMENT;",
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
        'route' => '/admin/repair/aclroles',
        'oldroute' => '/repair/aclroles',
        'class' => AdminController::class,
        'function' => 'repairACLRoles',
        'description' => 'repairs ACL Roles',
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