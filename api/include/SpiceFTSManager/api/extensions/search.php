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
use SpiceCRM\includes\SpiceFTSManager\api\controllers\SearchController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * routes
 */
$routes = [
    [
        'method' => 'post',
        'route' => '/search',
        'class' => SearchController::class,
        'function' => 'search',
        'description' => 'process the search',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters' => [
            'searchterm' => [
                'in' => 'body',
                'description' => 'a searchterm to search by',
                'type' => ValidationMiddleware::TYPE_STRING,
            ],
            'modules' => [
                'in' => 'body',
                'description' => 'a comma separated list of modules to search in',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Contacts,Accounts',
                'required' => true
            ],
            'records' => [
                'in' => 'body',
                'description' => 'the number of records to return',
                'type' => ValidationMiddleware::TYPE_STRING,
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/search/phonenumber',
        'class' => SearchController::class,
        'function' => 'searchPhone',
        'description' => 'process search based on a phonenumber sent in request or body',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters' => [
            'searchterm' => [
                'in' => 'query', // or body
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a search term',
                'example' => '12124353045',
                'required' => false
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/search/export',
        'class' => SearchController::class,
        'function' => 'export',
        'description' => 'process the export for an fts request',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
];

/**
 * register the Extension
 */
$ftsConfig = SpiceConfig::getInstance()->config['fts'];
$RESTManager->registerExtension('search', '1.0', ['min_ngram' => $ftsConfig['min_ngram'], 'max_ngram' => $ftsConfig['max_ngram']], $routes);
