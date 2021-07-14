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
use SpiceCRM\includes\SpiceDuns\api\controllers\SpiceDunsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * routes
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/SpiceDuns',
        'oldroute'    => '/SpiceDuns',
        'class'       => SpiceDunsController::class,
        'function'    => 'getDuns',
        'description' => 'Sends a search request to the DUNS provider API defined in config settings. Credentials shall be provded by the provider you contracted with. The response will contain company addresses.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [
            'name' => [
                'in' => 'query',
                'description' => 'company name',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'twentyreasons GmbH',
                'required' => false
            ],
            'city' => [
                'in' => 'query',
                'description' => 'city name',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Vienna',
                'required' => false
            ],
            'postalcode' => [
                'in' => 'query',
                'description' => 'postal code',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '1100',
                'required' => false
            ],
            'street' => [
                'in' => 'query',
                'description' => 'street name',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Wienerbergcity 11',
                'required' => false
            ],
            'country' => [
                'in' => 'query',
                'description' => 'mostly ISO code for country name. Will depend on DUNS provider.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'AT',
                'required' => false
            ],
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('duns', '1.0', [], $routes);
