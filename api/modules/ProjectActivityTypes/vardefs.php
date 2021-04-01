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
$dictionary['ProjectActivityType'] = [
    'table' => 'projectactivitytypes',
    'comment' => 'ProjectActivityTypes Module for billing purpose',
    'audited' => false,
    'fields' => [

        'project_id' => [
            'name' => 'project_id',
            'vname' => 'LBL_PROJECT_ID',
            'type' => 'id'
        ],
        'project_name' => [
            'name' => 'project_name',
            'vname' => 'LBL_PROJECT',
            'type' => 'relate',
            'source' => 'non-db',
            'link' => 'projects',
            'id_name' => 'project_id',
            'rname' => 'name',
            'module' => 'Projects',
            'join_name' => 'projects',
        ],
        'projects' => [
            'name' => 'projects',
            'vname' => 'LBL_PROJECTS',
            'relationship' => 'projectactivitytype_projects',
            'source' => 'non-db',
            'module' => 'Projects'
        ],
        'projectplannedactivities' => [
            'name' => 'projectplannedactivities',
            'vname' => 'LBL_PROJECTPLANNEDACTIVITIES',
            'type' => 'link',
            'relationship' => 'projectactivitytype_projectplannedactivities',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'module' => 'ProjectPlannedActivities'
        ],
        'projectactivities' => [
            'name' => 'projectactivities',
            'vname' => 'LBL_PROJECTACTIVITIES',
            'type' => 'link',
            'relationship' => 'projectactivitytype_projectactivities',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'module' => 'ProjectActivities'
        ]
    ],
    'relationships' => [
        'projectactivitytype_projects' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectActivityTypes',
            'rhs_table' => 'projectactivitytypes',
            'rhs_key' => 'project_id',
            'relationship_type' => 'one-to-many'
        ],
        'projectactivitytype_projectplannedactivities' => [
            'lhs_module' => 'ProjectActivityTypes',
            'lhs_table' => 'projectactivitytypes',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectPlannedActivities',
            'rhs_table' => 'projectplannedactivities',
            'rhs_key' => 'projectactivitytype_id',
            'relationship_type' => 'one-to-many'
        ],
        'projectactivitytype_projectactivities' => [
            'lhs_module' => 'ProjectActivityTypes',
            'lhs_table' => 'projectactivitytypes',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectPlannedActivities',
            'rhs_table' => 'projectplannedactivities',
            'rhs_key' => 'projectactivitytype_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_projectactivitytypes_projectiddel', 'type' => 'index', 'fields' => ['project_id', 'deleted']]
    ]
];

VardefManager::createVardef('ProjectActivityTypes', 'ProjectActivityType', ['default', 'assignable']);
