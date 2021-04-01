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
$dictionary['ProjectMilestone'] = [
    'table' => 'projectmilestones',
    'comment' => 'Projectmilestones Module',
    'audited' =>  true,
	
	'fields' => [
        'date_due' => [
            'name' => 'date_due',
            'vname' => 'LBL_DUE_DATE',
            'type' => 'date',
        ],
        'project_id' => [
            'name' => 'project_id',
            'vname' => 'LBL_PROJECT_ID',
            'type' => 'id',
        ],
        'project_name' => [
            'name' => 'project_name',
            'vname' => 'LBL_PROJECT',
            'type' => 'relate',
            'len' => '255',
            'source' => 'non-db',
            'id_name' => 'project_id',
            'module' => 'Projects',
            'link' => 'projects',
            'join_name' => 'projects',
            'rname' => 'name'
        ],
        'projects' => [
            'name' => 'projects',
            'vname' => 'LBL_PROJECTS',
            'type' => 'link',
            'relationship' => 'projects_projectmilestones',
            'source' => 'non-db',
            'module' => 'Projects'
        ],
    ],
	'relationships' => [
	    'projects_projectmilestones' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectMilestones',
            'rhs_table' => 'projectmilestones',
            'rhs_key' => 'project_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
	'indices' => [
        [
            'name' =>'idx_projectmilestones_projectid_del',
            'type' =>'index',
            'fields'=> ['project_id', 'deleted']
        ],
    ]
];

VardefManager::createVardef('ProjectMilestones', 'ProjectMilestone', ['default', 'assignable']);
