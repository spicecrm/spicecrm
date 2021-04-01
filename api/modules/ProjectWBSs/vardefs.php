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

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['ProjectWBS'] = [
    'table' => 'projectwbss',
    'fields' => [
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'date'
        ],
        'date_end' => [
            'name' => 'date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'date'
        ],
        'wbs_status' => [
            'name' => 'wbs_status',
            'type' => 'enum',
            'dbType' => 'int',
            'options' => 'wbs_status_dom',
            'vname' => 'LBL_STATUS',
            'default' => 0
        ],
        'is_billable' => [
            'name' => 'is_billable',
            'vname' => 'LBL_BILLABLE',
            'type' => 'bool',
            'default' => 1
        ],
        'planned_effort' => [
            'name' => 'planned_effort',
            'vname' => 'LBL_PLANNED_EFFORT',
            'source' => 'non-db',
            'type' => 'double'
        ],
        'consumed_effort' => [
            'name' => 'consumed_effort',
            'vname' => 'LBL_CONSUMED_EFFORT',
            'source' => 'non-db',
            'type' => 'double'
        ],
        'level_of_completion' => [
            'name' => 'level_of_completion',
            'type' => 'int',
            'dbtype' => 'double',
            'validation' => ['type' => 'range', 'min' => 0, 'max' => 100],
            'vname' => 'LBL_LEVEL_OF_COMPLETION',
        ],
        'project_id' => [
            'name' => 'project_id',
            'type' => 'id',
            'vname' => 'LBL_PROJECTS_ID'
        ],
        'project_name' => [
            'source' => 'non-db',
            'name' => 'project_name',
            'vname' => 'LBL_PROJECT',
            'type' => 'relate',
            'len' => '255',
            'id_name' => 'project_id',
            'module' => 'Projects',
            'link' => 'projects',
            'join_name' => 'projects',
            'rname' => 'name'
        ],
        'projects' => [
            'name' => 'projects',
            'type' => 'link',
            'module' => 'Projects',
            'relationship' => 'projects_projectwbss',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTS',
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'type' => 'id',
            'vname' => 'LBL_PARENT_ID'
        ],
        'parent_name' => [
            'source' => 'non-db',
            'name' => 'parent_name',
            'vname' => 'LBL_PARENT',
            'type' => 'relate',
            'len' => '255',
            'id_name' => 'parent_id',
            'module' => 'ProjectWBSs',
            'link' => 'members',
            'join_name' => 'parent',
            'rname' => 'name'
        ],
        'members' => [
            'name' => 'members',
            'type' => 'link',
            'module' => 'ProjectWBSs',
            'relationship' => 'member_projectwbs',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTWBS',
        ],
        'projectwbss' => [
            'name' => 'projectwbss',
            'type' => 'link',
            'module' => 'ProjectWBSs',
            'relationship' => 'member_projectwbs',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTWBSS',
        ],
        'projectplannedactivities' => [
            'name' => 'projectplannedactivities',
            'vname' => 'LBL_PROJECTPLANNEDACTIVITIES',
            'type' => 'link',
            'relationship' => 'projectwbs_projectplannedactivities',
            'module' => 'ProjectPlannedActivities',
            'source' => 'non-db',
//            'side' => 'right',
        ],
        'projectactivities' => [
            'name' => 'projectactivities',
            'vname' => 'LBL_PROJECTACTIVITIES',
            'type' => 'link',
            'module' => 'ProjectActivities',
            'relationship' => 'projectwbs_projectactivities',
            'source' => 'non-db',
            //'side' => 'right',
        ],
        'systemdeploymentcrs' => [
            'name' => 'systemdeploymentcrs',
            'vname' => 'LBL_SYSTEMDEPLOYMENTCRS',
            'type' => 'link',
            'module' => 'SystemDeploymentCRs',
            'relationship' => 'projectwbs_systemdeploymentcrs',
            'source' => 'non-db',
//            'side' => 'right',
        ],
        'scrumuserstories' => [
            'name' => 'scrumuserstories',
            'type' => 'link',
            'relationship' => 'projectwbs_scrumuserstories',
            'rname' => 'name',
            'source' => 'non-db',
            'module' => 'ScrumUserStories'
        ],
        'meetings' => [
            'name' => 'meetings',
            'type' => 'link',
            'module' => 'Meetings',
            'relationship' => 'projectwbss_meetings',
            'source' => 'non-db',
            'vname' => 'LBL_MEETINGS',
        ],
        'calls' => [
            'name' => 'calls',
            'type' => 'link',
            'module' => 'Calls',
            'relationship' => 'projectwbss_calls',
            'source' => 'non-db',
            'vname' => 'LBL_CALLS',
        ],
        'projectwbsstatusreports' => [
            'name' => 'projectwbsstatusreports',
            'vname' => 'LBL_PROJECTWBS_STATUS_REPORTS',
            'type' => 'link',
            'relationship' => 'projectwbs_projectwbsstatusreports',
            'source' => 'non-db',
            'module' => 'ProjectWBSStatusReports'
        ],
        'tasks' => [
            'name'         => 'tasks',
            'type'         => 'link',
            'relationship' => 'projectwbss_tasks',
            'module'       => 'Tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_TASKS',
        ],

    ],
    'relationships' => [
        'member_projectwbs' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectWBSs',
            'rhs_table' => 'projectwbss',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'

        ],
        'projectwbs_projectplannedactivities' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectPlannedActivities',
            'rhs_table' => 'projectplannedactivities',
            'rhs_key' => 'projectwbs_id',
            'relationship_type' => 'one-to-many'
        ],
        'projectwbs_projectactivities' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectActivities',
            'rhs_table' => 'projectactivities',
            'rhs_key' => 'projectwbs_id',
            'relationship_type' => 'one-to-many'
        ],
        'projectwbs_systemdeploymentcrs' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'SystemDeploymentCRs',
            'rhs_table' => 'systemdeploymentcrs',
            'rhs_key' => 'projectwbs_id',
            'relationship_type' => 'one-to-many'
        ],
        'projectwbss_meetings' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'Meetings',
            'rhs_table' => 'meetings',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'ProjectWBSs'
        ],
        'projectwbss_calls' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'Calls',
            'rhs_table' => 'calls',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'ProjectWBSs'
        ],
        'projectwbss_tasks' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'Tasks',
            'rhs_table' => 'tasks',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'ProjectWBSs'
        ],
        'projectwbss_notes' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'ProjectWBSs'
        ],
        'projectwbs_projectwbsstatusreports' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectWBSStatusReports',
            'rhs_table' => 'projectwbsstatusreports',
            'rhs_key' => 'projectwbs_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_projectwbss_project_id', 'type' => 'index', 'fields' => ['project_id']]
    ],
];

VardefManager::createVardef('ProjectWBSs', 'ProjectWBS', ['default', 'assignable','activities']);
