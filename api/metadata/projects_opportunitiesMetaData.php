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

$dictionary['projects_opportunities'] = [
    'table' => 'projects_opportunities',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'opportunity_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'project_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false],
    ],
    'indices' => [
        ['name' => 'projects_opportunities_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_proj_opp_proj', 'type' =>'index', 'fields'=> ['project_id']],
        ['name' => 'idx_proj_opp_opp', 'type' =>'index', 'fields'=> ['opportunity_id']],
        ['name' => 'projects_opportunities_alt', 'type'=>'alternate_key', 'fields'=> ['project_id','opportunity_id']],
    ],
    'relationships' => [
        'projects_opportunities' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Opportunities',
            'rhs_table' => 'opportunities',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_opportunities',
            'join_key_lhs' => 'project_id',
            'join_key_rhs' => 'opportunity_id',
        ],
    ],
];
