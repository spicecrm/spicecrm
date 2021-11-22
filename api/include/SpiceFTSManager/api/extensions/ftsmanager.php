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
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceFTSManager\api\controllers\FTSManagerController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * routes
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/configuration/elastic/core/modules',
        'oldroute'    => '/ftsmanager/core/modules',
        'class'       => FTSManagerController::class,
        'function'    => 'getModules',
        'description' => 'get modules having fts config',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/elastic/core/index',
        'oldroute'    => '/ftsmanager/core/index',
        'class'       => FTSManagerController::class,
        'function'    => 'getIndex',
        'description' => 'get index',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/elastic/core/analyzers',
        'oldroute'    => '/ftsmanager/core/analyzers',
        'class'       => FTSManagerController::class,
        'function'    => 'getAnalyzers',
        'description' => 'get analyzers',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/elastic/core/initialize',
        'oldroute'    => '/ftsmanager/core/initialize',
        'class'       => FTSManagerController::class,
        'function'    => 'initialize',
        'description' => 'initialize all indexes for all modules. Existing indexes will be deleted first.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/elastic/{module}/fields',
        'oldroute'    => '/ftsmanager/{module}/fields',
        'class'       => FTSManagerController::class,
        'function'    => 'getFTSFields',
        'description' => 'get fts fields',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/elastic/{module}/settings',
        'oldroute'    => '/ftsmanager/{module}/settings',
        'class'       => FTSManagerController::class,
        'function'    => 'getFTSSettings',
        'description' => 'get fts settings for specific module',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/elastic/{module}',
        'oldroute'    => '/ftsmanager/{module}',
        'class'       => FTSManagerController::class,
        'function'    => 'deleteIndexSettings',
        'description' => 'delete fts settings for specific module',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/elastic/{module}',
        'oldroute'    => '/ftsmanager/{module}',
        'class'       => FTSManagerController::class,
        'function'    => 'setFTSFields',
        'description' => 'set fts fields config + fts index config for specific module',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => true
            ],
            'fields' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype' => ValidationMiddleware::TYPE_ARRAY,
                'description' => 'a array of fts fields and their settings',
                'example' => '[
                    {
                        "id": "9d730d91-788c-bfd2-bdba-c73a317019c9",
                        "fieldid": "9d730d91-788c-bfd2-bdba-c73a317019c9",
                        "fieldname": "name",
                        "indexfieldname": "name",
                        "name": "LBL_COMPETITOR",
                        "path": "root:CompetitorAssessments::field:name",
                        "indextype": "text",
                        "search": true,
                        "enablesort": true,
                        "analyzer": "spice_ngram_all"
                    },
                    {
                        "id": "96a76266-b441-adb9-aa9c-f62a54e1f6ae",
                        "fieldid": "96a76266-b441-adb9-aa9c-f62a54e1f6ae",
                        "fieldname": "account_name",
                        "indexfieldname": "account_name",
                        "name": "LBL_ACCOUNT",
                        "path": "root:CompetitorAssessments::link:CompetitorAssessments:opportunities::field:account_name",
                        "indextype": "text",
                        "search": true,
                        "analyzer": "spice_ngram_all"
                    }
                ]',
                'required' => true
            ],
            'settings' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'description' => 'an array of fts index settings',
                'example' => '[]',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/elastic/{module}/index',
        'oldroute'    => '/ftsmanager/{module}/index',
        'class'       => FTSManagerController::class,
        'function'    => 'index',
        'description' => 'index a number of records for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => true
            ],
            'resetIndexDates' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'description' => 'reset indexed date if set',
                'example' => true,
                'required' => false
            ],
            'bulkAmount' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'number of records to index',
                'example' => 100,
                'required' => false
            ],
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/elastic/{module}/index',
        'oldroute'    => '/ftsmanager/{module}/index',
        'class'       => FTSManagerController::class,
        'function'    => 'deleteIndex',
        'description' => 'delete index',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/elastic/{module}/index/reset',
        'oldroute'    => '/ftsmanager/{module}/index/reset',
        'class'       => FTSManagerController::class,
        'function'    => 'resetIndex',
        'description' => 'reset fts index for specfied module',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('adminftsmanager', '2.0', [], $routes);
