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

SpiceDictionaryHandler::getInstance()->dictionary['SpiceImport'] = [
    'table' => 'spiceimports',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
            'reportable'=>true,
            'comment' => 'Unique identifier'
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '50',
            'importable' => 'required',
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'vname' => 'LBL_DATE_MODIFIED',
            'type' => 'datetime',
        ],
        'modified_user_id' => [
            'name' => 'modified_user_id',
            'rname' => 'user_name',
            'id_name' => 'modified_user_id',
            'vname' => 'LBL_MODIFIED_BY',
            'type' => 'assigned_user_name',
            'table' => 'modified_user_id_users',
            'isnull' => 'false',
            'dbType' => 'id',
            'reportable'=>true,
        ],
        'created_by' => [
            'name' => 'created_by',
            'rname' => 'user_name',
            'id_name' => 'created_by',
            'vname' => 'LBL_CREATED',
            'type' => 'assigned_user_name',
            'table' => 'created_by_users',
            'isnull' => false,
            'dbType' => 'id',
            'len' => 36,
        ],
        'description' => [
            'name' => 'description',
            'type' => 'text'
        ],
        'deleted' => [
            'name' => 'deleted',
            'vname' => 'LBL_DELETED',
            'type' => 'bool',
            'reportable'=>false,
            'comment' => 'Record deletion indicator'
        ],
        'tags' => [
            'name' => 'tags',
            'type' => 'text'
        ],
        'assigned_user_id' => [
            'name' => 'assigned_user_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'id',
            'required' => true,
            'reportable' => false,
        ],
        'status' => [
            'name' => 'status',
            'type' => 'enum',
            'options' => 'spiceimports_status_dom',
            'len' => 1,
            'vname' => 'LBL_STATUS',
            'comment' => 'possible values c|q|e'
        ],
        'statusdisplay' => [
            'name' => 'statusdisplay',
            'vname' => 'LBL_STATUSDISPLAY',
            'type' => 'varchar',
            'len' => 100,
            'source' => 'non-db',
            'reportable' => false,
            'comment' => 'field for Imports frontend display. Reflects status according to status and action'
        ],
        'data' => [
            'name' => 'data',
            'type' => 'text',
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
        ],

    ],
    'indices' => [
        'id' => ['name' => 'spiceimports_pk', 'type' => 'primary', 'fields' => ['id']],
    ]
];

VardefManager::createVardef('SpiceImports', 'SpiceImport', ['default', 'assignable']);
