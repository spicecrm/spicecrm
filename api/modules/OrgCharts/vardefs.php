<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['OrgChart'] = [
    'table' => 'orgcharts',
    'comment' => 'Orgcharts Module',
    'audited' => true,
    'fields' => [
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
            'required' => true,
            'audited' => true,
            'comment' => 'ID of the parent of this Unit',
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'required' => false,
            'group' => 'parent_name',
            'len' => 255,
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'parent_type' => 'record_type_display',
            'type_name' => 'parent_type',
            'id_name' => 'parent_id',
            'vname' => 'LBL_RELATED_TO',
            'type' => 'parent',
            'source' => 'non-db',
            'required' => true
        ],
        'orgunits' => [
            'name' => 'orgunits',
            'type' => 'link',
            'relationship' => 'orgchart_orgunits',
            'module' => 'OrgUnits',
            'bean_name' => 'OrgUnit',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_ORGUNITS'
        ],
        'orgchart_id' => [
            'name' => 'orgchart_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
            'required' => false,
            'audited' => true,
            'comment' => 'ID of the parent of this Unit',
        ],
        'orgchart_name' => [
            'name' => 'orgchart_name',
            'rname' => 'name',
            'id_name' => 'orgchart_id',
            'vname' => 'LBL_ORGCHART',
            'type' => 'relate',
            'isnull' => 'true',
            'module' => 'OrgCharts',
            'table' => 'orgcharts',
            'source' => 'non-db',
            'link' => 'orgchart'
        ],
        'orgcharts' => [
            'name' => 'orgcharts',
            'type' => 'link',
            'relationship' => 'orgchart_orgcharts',
            'module' => 'OrgCharts',
            'bean_name' => 'OrgChart',
            'source' => 'non-db',
            'vname' => 'LBL_ORGCHARTS',
        ],
        'orgchart' => [
            'name' => 'orgchart',
            'type' => 'link',
            'relationship' => 'orgchart_orgcharts',
            'module' => 'OrgCharts',
            'bean_name' => 'OrgChart',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_ORGCHART',
            'side' => 'right',
        ],
        'orgunit_id' => [
            'name' => 'orgunit_id',
            'vname' => 'LBL_ORGUNIT_ID',
            'type' => 'id',
            'comment' => 'ID of the parent orgunit of this Unit',
        ],
        'orgunit_name' => [
            'name' => 'orgunit_name',
            'rname' => 'name',
            'id_name' => 'orgunit_id',
            'vname' => 'LBL_ORGUNIT',
            'type' => 'relate',
            'module' => 'OrgUnits',
            'table' => 'orgunits',
            'source' => 'non-db',
            'link' => 'orgunit'
        ],
        'orgunit' => [
            'name' => 'orgunit',
            'type' => 'link',
            'relationship' => 'orgunit_orgcharts',
            'module' => 'OrgUnits',
            'bean_name' => 'OrgUnit',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_ORGUNITS'
        ]
    ],
    'relationships' => [
        'companycodes_orgcharts' => [
            'lhs_module' => 'CompanyCodes',
            'lhs_table' => 'companycodes',
            'lhs_key' => 'id',
            'rhs_module' => 'OrgCharts',
            'rhs_table' => 'orgcharts',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'CompanyCodes'
        ],
        'orgchart_orgcharts' => [
            'lhs_module' => 'OrgCharts', 'lhs_table' => 'orgcharts', 'lhs_key' => 'id',
            'rhs_module' => 'OrgCharts', 'rhs_table' => 'orgcharts', 'rhs_key' => 'orgchart_id',
            'relationship_type' => 'one-to-many'
        ],
        'orgchart_orgunits' => [
            'lhs_module' => 'OrgCharts',
            'lhs_table' => 'orgcharts',
            'lhs_key' => 'id',
            'rhs_module' => 'OrgUnits',
            'rhs_table' => 'orgunits',
            'rhs_key' => 'orgchart_id',
            'relationship_type' => 'one-to-many'
        ],
        'orgunit_orgcharts' => [
            'lhs_module' => 'OrgUnits',
            'lhs_table' => 'orgunits',
            'lhs_key' => 'id',
            'rhs_module' => 'OrgCharts',
            'rhs_table' => 'OrgCharts',
            'rhs_key' => 'orgunit_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_orgchart_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']]
    ]
];

VardefManager::createVardef('OrgCharts', 'OrgChart', ['default', 'assignable']);
