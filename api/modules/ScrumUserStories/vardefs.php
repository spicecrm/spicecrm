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

//dictionary global variable => class name als key
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['ScrumUserStory'] = [
    'table' => 'scrumuserstories',
    'comment' => 'SCRUM User Stories Module',
    'audited' =>  true,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100',
            'vname' => 'LBL_NAME',
        ],
        'description'  => [
            'name' => 'description',
            'type' => 'text',
            'vname' => 'LBL_DESCRIPTION',
        ],
        'scrum_status'=> [
            'name' => 'scrum_status',
            'type' => 'enum',
            'options' => 'scrum_status_dom',
            'len' => 50,
            'vname' => 'LBL_STATUS',
        ],
        'level_of_complexity' => [
            'name' => 'level_of_complexity',
            'type' => 'int',
            'dbtype' => 'double',
            'validation' => ['type' => 'range', 'min' => 0, 'max' => 100],
            'vname' => 'LBL_LEVEL_OF_COMPLEXITY',
        ],
        'level_of_completion' => [
            'name' => 'level_of_completion',
            'type' => 'int',
            'dbtype' => 'double',
            'validation' => ['type' => 'range', 'min' => 0, 'max' => 100],
            'vname' => 'LBL_LEVEL_OF_COMPLETION',
        ],
        'ratio' => [
            'name' => 'ratio',
            'type' => 'int',
            'source' => 'non-db',
            'vname' => 'LBL_RATIO',
        ],
        'scrumepic_id' => [
            'name' => 'scrumepic_id',
            'vname' => 'LBL_SCRUM_EPIC',
            'type' => 'id',
            'required' => false
        ],
        'scrumepic_name' => [
            'name' => 'scrumepic_name',
            'rname' => 'name',
            'id_name' => 'scrumepic_id',
            'vname' => 'LBL_SCRUM_EPIC',
            'type' => 'relate',
            'link' => 'scrumepic',
            'isnull' => 'true',
            'table' => 'scrumepics',
            'module' => 'ScrumEpics',
            'source' => 'non-db',
        ],
        'scrumepic' => [
            'name' => 'scrumepic',
            'type' => 'link',
            'vname' => 'LBL_SCRUM_EPIC',
            'relationship' => 'scrumepic_scrumuserstories',
            'module' => 'ScrumEpics',
            'source' => 'non-db'
        ],
        'systemdeploymentcrs' => [
            'name' => 'systemdeploymentcrs',
            'type' => 'link',
            'relationship' => 'scrumuserstories_systemdeploymentcrs',
            'vname' => 'LBL_SYSTEMDEPLOYMENTCRS',
            'module' => 'SystemDeploymentCRs',
            'source' => 'non-db',
            'default' => false
        ],
        'projectwbs_id' => [
            'name' => 'projectwbs_id',
            'vname' => 'LBL_PROJECTWBS',
            'type' => 'id',
            'required' => false
        ],
        'projectwbs_name' => [
            'name' => 'projectwbs_name',
            'rname' => 'name',
            'id_name' => 'projectwbs_id',
            'vname' => 'LBL_PROJECTWBS',
            'type' => 'relate',
            'link' => 'projectwbs',
            'isnull' => 'true',
            'table' => 'projectwbss',
            'module' => 'ProjectWBSs',
            'source' => 'non-db',
        ],
        'projectwbs' => [
            'name' => 'projectwbs',
            'type' => 'link',
            'vname' => 'LBL_PROJECTWBS',
            'relationship' => 'projectwbs_scrumuserstories',
            'module' => 'ProjectWBSs',
            'source' => 'non-db'
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int',
            'len' => '11',
            'vname' => 'LBL_SEQUENCE',
        ],
    ],
    'relationships' => [
        'scrumepic_scrumuserstories' => [
            'rhs_module' => 'ScrumUserStories',
            'rhs_table' => 'scrumuserstories',
            'rhs_key' => 'scrumepic_id',
            'lhs_module' => 'ScrumEpics',
            'lhs_table' => 'scrumepics',
            'lhs_key' => 'id',
            'relationship_type' => 'one-to-many',
            'default' => true
        ],
        'projectwbs_scrumuserstories' => [
            'rhs_module' => 'ScrumUserStories',
            'rhs_table' => 'scrumuserstories',
            'rhs_key' => 'projectwbs_id',
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'relationship_type' => 'one-to-many',
            'default' => true
        ]
    ],

    'indices' => [
    ],
];
// default (Basic) fields & assignable (implements->assigned fields)
VardefManager::createVardef('ScrumUserStories', 'ScrumUserStory', ['default', 'assignable']);
