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
use SpiceCRM\modules\OrgCharts\api\controller\OrgChartsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('OrgCharts', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/OrgCharts/{id}/allOrgunits',
        'class' => OrgChartsController::class,
        'function' => 'getOrgUnits',
        'description' => 'returns all orgunits for a chart to display in the org chart',
        'options' => ['validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'Orgchart id',
                'type' => 'guid',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/module/OrgCharts/{id}/orgunit/{orgunitid}/{suborgunit}',
        'class' => OrgChartsController::class,
        'function' => 'addExistingOrgUnit',
        'description' => 'allocates an orgunit to the orgunit in the orgchart',
        'options' => ['validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'Orgchart id',
                'type' => 'guid',
                'required' => true
            ],
            'orgunitid' => [
                'in' => 'path',
                'description' => 'Orgunit id',
                'type' => 'guid',
                'required' => true
            ],
            'suborgunit' => [
                'in' => 'path',
                'description' => 'Orgunit id of the id to be allocated',
                'type' => 'guid',
                'required' => true
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);

