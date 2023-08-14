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
            'rhs_table' => 'orgcharts',
            'rhs_key' => 'orgunit_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_orgchart_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']]
    ]
];

VardefManager::createVardef('OrgCharts', 'OrgChart', ['default', 'assignable']);
