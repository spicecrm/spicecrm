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

SpiceDictionaryHandler::getInstance()->dictionary['UserAbsence'] = [
    'table' => 'userabsences',
    'comment' => 'UserAbsences Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'required' => false,
        ],
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'date',
            'audited' => true,
            'required' => true,
        ],
        'date_end' => [
            'name' => 'date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'date',
            'audited' => true,
            'required' => true,
        ],
        'type' => [
            'name' => 'type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'required' => true,
            'reportable' => false,
            'options' => 'userabsences_type_dom',
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'required' => true,
            'default' => 'created',
            'options' => 'userabsences_status_dom',
        ],
        'user_id' => [
            'name' => 'user_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'id',
        ],
        'user_name' => [
            'name' => 'user_name',
            'rname' => 'name',
            'id_name' => 'user_id',
            'vname' => 'LBL_USER',
            'type' => 'relate',
            'table' => 'users',
            'module' => 'Users',
            'dbType' => 'varchar',
            'link' => 'users',
            'len' => 255,
            'source' => 'non-db'
        ],
        'users' => [
            'name' => 'users',
            'vname' => 'LBL_USERS',
            'type' => 'link',
            'relationship' => 'users_userabsences',
            'source' => 'non-db',
            'module' => 'Users'
        ],
        'representative_id' => [
            'name' => 'representative_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'id',
        ],
        'representative_name' => [
            'name' => 'representative_name',
            'rname' => 'name',
            'id_name' => 'representative_id',
            'vname' => 'LBL_REPRESENTATIVE',
            'type' => 'relate',
            'table' => 'users',
            'module' => 'Users',
            'dbType' => 'varchar',
            'link' => 'representative_link',
            'len' => 255,
            'source' => 'non-db'
        ],
        'representative_link' => [
            'name' => 'representative_link',
            'vname' => 'LBL_REPRESENTATIVE_DURING_ABSENCE',
            'type' => 'link',
            'relationship' => 'representatives_userabsences',
            'source' => 'non-db',
            'module' => 'Users'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_userabsences_userid',
            'type' => 'index',
            'fields' => ['user_id']
        ]
    ]
];

VardefManager::createVardef('UserAbsences', 'UserAbsence', ['default', 'assignable']);
