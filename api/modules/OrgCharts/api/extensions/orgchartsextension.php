<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

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

