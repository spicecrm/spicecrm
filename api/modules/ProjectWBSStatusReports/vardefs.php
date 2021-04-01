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
$dictionary['ProjectWBSStatusReport'] = [
    'table' => 'projectwbsstatusreports',
    'fields' => [
        'date_end' => [
            'name' => 'date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'date'
        ],
        'level_of_completion' => [
            'name' => 'level_of_completion',
            'type' => 'int',
            'dbtype' => 'double',
            'validation' => ['type' => 'range', 'min' => 0, 'max' => 100],
            'vname' => 'LBL_LEVEL_OF_COMPLETION',
        ],
        'new_date_end' => [
            'name' => 'new_date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'date',
            'required' => true
        ],
        'projectwbs_id' => [
            'name' => 'projectwbs_id',
            'vname' => 'LBL_PROJECTWBS_ID',
            'type' => 'id',
        ],
        'projectwbs_name' => [
            'name' => 'projectwbs_name',
            'vname' => 'LBL_PROJECTWBS',
            'type' => 'relate',
            'source' => 'non-db',
            'rname' => 'name',
            'id_name' => 'projectwbs_id',
            'len' => '255',
            'module' => 'ProjectWBSs',
            'link' => 'projectwbss',
            'join_name' => 'projectwbss',
        ],
        'projectwbss' => [
            'name' => 'projectwbss',
            'vname' => 'LBL_PROJECTWBSS',
            'type' => 'link',
            'module' => 'ProjectWBSs',
            'relationship' => 'projectwbs_projectwbsstatusreports',
            'source' => 'non-db',
        ]
    ],
    'indices' => [
        ['name' => 'idx_projectwbsstatusreports_wbsid', 'type' => 'index', 'fields' => ['projectwbs_id']],
        ['name' => 'idx_projectwbsstatusreports_wbsdel', 'type' => 'index', 'fields' => ['projectwbs_id', 'deleted']]
    ]];

VardefManager::createVardef('ProjectWBSStatusReports', 'ProjectWBSStatusReport', ['default', 'assignable']);

$dictionary['ProjectWBSStatusReport']['fields']['name']['required'] = false;
$dictionary['ProjectWBSStatusReport']['fields']['description']['required'] = true;
