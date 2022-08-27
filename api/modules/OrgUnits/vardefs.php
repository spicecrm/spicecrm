<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['OrgUnit'] = [
    'table' => 'orgunits',
    'comment' => 'OrgUnits Module',
    'audited' => true,
    'fields' => [
        'orgchart_id' => [
            'name' => 'orgchart_id',
            'vname' => 'LBL_ORGCHART_ID',
            'type' => 'id',
            'required' => true,
            'audited' => true,
            'comment' => 'ID of the orgchart this unit belongs to',
        ],
        'orgchart_name' => [
            'name' => 'orgchart_name',
            'rname' => 'name',
            'id_name' => 'orgchart_id',
            'vname' => 'LBL_ORGCHART',
            'type' => 'relate',
            'module' => 'OrgCharts',
            'table' => 'orgcharts',
            'source' => 'non-db',
            'link' => 'orgchart'
        ],
        'orgchart' => [
            'name' => 'orgchart',
            'type' => 'link',
            'relationship' => 'orgchart_orgunits',
            'module' => 'OrgCharts',
            'bean_name' => 'OrgChart',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_ORGCHART'
        ],
        'orgcharts' => [
            'name' => 'orgcharts',
            'type' => 'link',
            'relationship' => 'orgunit_orgcharts',
            'module' => 'OrgCharts',
            'bean_name' => 'OrgCharts',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_ORGCHARTS'
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
            'required' => false,
            'audited' => true,
            'comment' => 'ID of the parent of this Unit',
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'rname' => 'name',
            'id_name' => 'parent_id',
            'vname' => 'LBL_MEMBER_OF',
            'type' => 'relate',
            'isnull' => 'true',
            'module' => 'OrgUnits',
            'table' => 'orgunits',
            'source' => 'non-db',
            'link' => 'member_of'
        ],
        'members' => [
            'name' => 'members',
            'type' => 'link',
            'relationship' => 'member_orgunits',
            'module' => 'OrgUnits',
            'bean_name' => 'OrgUnit',
            'source' => 'non-db',
            'vname' => 'LBL_MEMBERS',
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'orgunits_users',
            'module' => 'Users',
            'bean_name' => 'User',
            'source' => 'non-db',
            'vname' => 'LBL_USERS',
        ],
        'member_of' => [
            'name' => 'member_of',
            'type' => 'link',
            'relationship' => 'member_orgunits',
            'module' => 'OrgUnits',
            'bean_name' => 'OrgUnit',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_MEMBER_OF',
            'side' => 'right',
        ],
        'spiceaclprofiles' => [
            'name' => 'spiceaclprofiles',
            'type' => 'link',
            'relationship' => 'spiceaclprofiles_orgunits',
            'module' => 'SpiceACLProfiles',
            'bean_name' => 'SpiceACLProfile',
            'source' => 'non-db',
            'vname' => 'LBL_SPICEACLPROFILES'
        ]
    ],
    'relationships' => [
        'member_orgunits' => [
            'lhs_module' => 'OrgUnits', 'lhs_table' => 'orgunits', 'lhs_key' => 'id',
            'rhs_module' => 'OrgUnits', 'rhs_table' => 'orgunits', 'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ],
        'orgunits_users' => [
            'lhs_module' => 'OrgUnits', 'lhs_table' => 'orgunits', 'lhs_key' => 'id',
            'rhs_module' => 'Users', 'rhs_table' => 'users', 'rhs_key' => 'orgunit_id',
            'relationship_type' => 'one-to-many'
        ],
    ],
    'indices' => [
        ['name' => 'idx_orgunit_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']],
        ['name' => 'idx_orgunit_parent_id', 'type' => 'index', 'fields' => ['parent_id', 'deleted']],
        ['name' => 'idx_orgunit_orgchart_id', 'type' => 'index', 'fields' => ['orgchart_id', 'deleted']]
    ]
];

VardefManager::createVardef('OrgUnits', 'OrgUnit', ['default', 'assignable']);
