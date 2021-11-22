<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Dashboard'] = [
    'table' => 'dashboards',
    'audited' => true,
    'fields' =>
        [
            'global' => [
                'name' => 'global',
                'type' => 'bool',
                'vname' => 'LBL_GLOBAL'
            ],
            'dashboardcomponents' =>  [
                'name' => 'dashboardcomponents',
                'type' => 'link',
                'relationship' => 'dashboard_dashboardcomponents',
                'module' => 'DashboardComponents',
                'bean_name' => 'DashboardComponent',
                'source' => 'non-db',
                'vname' => 'LBL_DASHBOARDCOMPONENTS',
            ],
            'components' => [
                'name' => 'components',
                'type' => 'json',
                'vname' => 'LBL_COMPONENTS',
                'source' => 'non-db'
            ],
            'dashboardsets_dashboard_sequence' => [
                'name' => 'dashboardsets_dashboard_sequence',
                'vname' => 'LBL_SEQUENCE',
                'type' => 'integer',
                'source' => 'non-db'
            ],
            'dashboardsets' => [
                'name' => 'dashboardsets',
                'type' => 'link',
                'relationship' => 'dashboards_dashboardsets',
                'module' => 'DashboardSets',
                'source' => 'non-db',
                'vname' => 'LBL_DASHBOARDSETS',
                'rel_fields' => [
                    'dashboard_sequence' => [
                        'map' => 'dashboardsets_dashboard_sequence'
                    ]
                ]
            ],
        ],
    'relationships' => [
        'dashboard_dashboardcomponents' => [
            'lhs_module' => 'Dashboards',
            'lhs_table' => 'dashboards',
            'lhs_key' => 'id',
            'rhs_module' => 'DashboardComponents',
            'rhs_table' => 'dashboardcomponents',
            'rhs_key' => 'dashboard_id',
            'relationship_type' => 'one-to-many']

    ],

    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

VardefManager::createVardef('Dashboards', 'Dashboard', ['default', 'assignable']);
