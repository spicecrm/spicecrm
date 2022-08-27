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

SpiceDictionaryHandler::getInstance()->dictionary['ScrumEpic'] = [
    'table' => 'scrumepics',
    'comment' => 'SCRUM Epics Module',
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
        'has_stories'=> [
            'name' => 'has_stories',
            'type' => 'bool',
            'source' => 'non-db',
        ],
        'scrumtheme_id' => [
            'name' => 'scrumtheme_id',
            'vname' => 'LBL_SCRUM_THEME',
            'type' => 'id',
            'required' => false
        ],
        'scrumtheme_name' => [
            'name' => 'scrumtheme_name',
            'rname' => 'name',
            'id_name' => 'scrumtheme_id',
            'vname' => 'LBL_SCRUM_THEME',
            'type' => 'relate',
            'link' => 'scrumtheme',
            'isnull' => 'true',
            'table' => 'scrumthemes',
            'module' => 'ScrumThemes',
            'source' => 'non-db',
        ],
        'scrumtheme' => [
            'name' => 'scrumtheme',
            'type' => 'link',
            'vname' => 'LBL_SCRUM_THEME',
            'relationship' => 'scrumtheme_scrumepics',
            'module' => 'ScrumThemes',
            'source' => 'non-db'
        ],
        'scrumuserstories' => [
            'name' => 'scrumuserstories',
            'type' => 'link',
            'relationship' => 'scrumepic_scrumuserstories',
            'rname' => 'name',
            'source' => 'non-db',
            'module' => 'ScrumUserStories',
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int',
            'len' => '11',
            'vname' => 'LBL_SEQUENCE',
        ],
    ],
    'relationships' => [
        'scrumtheme_scrumepics' => [
            'rhs_module' => 'ScrumEpics',
            'rhs_table' => 'scrumepics',
            'rhs_key' => 'scrumtheme_id',
            'lhs_module' => 'ScrumThemes',
            'lhs_table' => 'scrumthemes',
            'lhs_key' => 'id',
            'relationship_type' => 'one-to-many',
            'default' => true
        ]

    ],

    'indices' => [
    ],
];
// default (Basic) fields & assignable (implements->assigned fields)
VardefManager::createVardef('ScrumEpics', 'ScrumEpic', ['default', 'assignable']);
