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
use SpiceCRM\modules\Currencies\api\controllers\CurrenciesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */

$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */

$RESTManager->registerExtension('currencies', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Currencies',
        'oldroute'    => '/currencies',
        'class'       => CurrenciesController::class,
        'function'    => 'getCurrencies',
        'description' => 'get available currencies',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Currencies/defaultcurrency',
        'oldroute'    => '/currencies/defaultcurrency',
        'class'       => CurrenciesController::class,
        'function'    => 'getDefaultCurrency',
        'description' => 'get default currency',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Currencies/add',
        'oldroute'    => '/currencies/add',
        'class'       => CurrenciesController::class,
        'function'    => 'addCurrency',
        'description' => 'adds a currency to currencies table',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'name'           => [
                'in'          => 'body',
                'description' => 'Name',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true
            ],
            'iso'           => [
                'in'          => 'body',
                'description' => 'ISO',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true
            ],
            'symbol'           => [
                'in'          => 'body',
                'description' => 'Symbol',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);