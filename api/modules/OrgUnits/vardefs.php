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
        'employees' => [
            'name' => 'employees',
            'type' => 'link',
            'relationship' => 'orgunits_employees',
            'module' => 'Employees',
            'bean_name' => 'User',
            'source' => 'non-db',
            'vname' => 'LBL_EMPLYOEES',
        ],
        'hcmjoboffers' => [
            'name' => 'hcmjoboffers',
            'type' => 'link',
            'relationship' => 'orgunits_hcmjoboffers',
            'module' => 'HCMJobOffers',
            'bean_name' => 'HCMJobOffer',
            'source' => 'non-db',
            'vname' => 'LBL_HCMJOBOFFERS',
        ],
        'hcmjoboffers_id' => [
            'name' => 'hcmjoboffers_id',
            'vname' => 'LBL_HCMJOBOFFERS_ID',
            'type' => 'id',
        ],
        'hcmjoboffers_name' => [
            'name' => 'hcmjoboffers_name',
            'rname' => 'name',
            'id_name' => 'hcmjoboffers_id',
            'vname' => 'LBL_HCMJOBOFFERS',
            'type' => 'relate',
            'table' => 'hcmjoboffers',
            'module' => 'HCMJobOffers',
            'dbType' => 'varchar',
            'link' => 'hcmjoboffers',
            'len' => 255,
            'source' => 'non-db'
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
        ],
        'documents' => [
            'name' => 'documents',
            'type' => 'link',
            'relationship' => 'documents_orgunits',
            'source' => 'non-db',
            'module' => 'Documents',
            'vname' => 'LBL_DOCUMENTS',
        ],
        'employees' => [
            'name' => 'employees',
            'vname' => 'LBL_EMPLOYEES',
            'type' => 'link',
            'relationship' => 'orgunits_employees',
            'module' => 'Employees',
            'source' => 'non-db',
            'rel_fields' => [
                'is_primary_orgunit' => ['map' => 'is_primary_orgunit'],
                'employee_role' => ['map' => 'employee_role']
            ],
            'comment' => 'all the employees n this orgunit'
        ],
        'employeesasprimary' => [
            'name' => 'employeesasprimary',
            'type' => 'link',
            'relationship' => 'orgunits_employees_primary',
            'source' => 'non-db',
            'module' => 'Employees',
            'vname' => 'LBL_EMPLOYEES_PRIMARY',
            'comment' => 'employee having this orgunit as primary'
        ],
        'is_primary_orgunit' => [
            'name' => 'is_primary_orgunit',
            'vname' => 'LBL_PRIMARY',
            'type' => 'bool',
            'source' => 'non-db',
            'comment' => 'represents the value in orgunits_employees.is_primary_orgunit'
        ],
        'employee_role' => [
            'name' => 'employee_role',
            'vname' => 'LBL_ROLE',
            'type' => 'varchar',
            'source' => 'non-db',
            'comment' => 'represents the value in orgunits_employees.employee_role'
        ],

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
        'orgunits_employees' => [
            'lhs_module' => 'OrgUnits', 'lhs_table' => 'orgunits', 'lhs_key' => 'id',
            'rhs_module' => 'Employees', 'rhs_table' => 'employees', 'rhs_key' => 'orgunit_id',
            'relationship_type' => 'one-to-many'
        ],
    ],
    'indices' => [
        ['name' => 'idx_orgunit_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']],
        ['name' => 'idx_orgunit_parent_id', 'type' => 'index', 'fields' => ['parent_id', 'deleted']],
        ['name' => 'idx_orgunit_orgchart_id', 'type' => 'index', 'fields' => ['orgchart_id', 'deleted']]
    ]
];

if (file_exists("extensions/modules/ServiceQueues")) {
    SpiceDictionaryHandler::getInstance()->dictionary['OrgUnit']['fields']['servicequeues'] = [
        'name' => 'servicequeues',
        'type' => 'link',
        'relationship' => 'servicequeues_orgunits',
        'module' => 'ServiceQueues',
        'bean_name' => 'ServiceQueue',
        'source' => 'non-db',
        'vname' => 'LBL_SERVICE_QUEUES',
    ];
}
VardefManager::createVardef('OrgUnits', 'OrgUnit', ['default', 'assignable']);
