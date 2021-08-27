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
$dictionary['SystemTenant'] = [
    'table' => 'systemtenants',
    'comment' => 'SystemTenants Module',
    'fields' => [
        'db_name' => [
            'name' => 'db_name',
            'vname' => 'LBL_DB_NAME',
            'type' => 'varchar',
            'len' => 36,
            'comment' => 'Name of tenants database',
        ],
        'systemtenant_status' => [
            'name' => 'systemtenant_status',
            'vname' => 'LBL_STATUS',
            'type' => 'varchar',
            'len' => 5,
            'comment' => 'status of the tenant',
        ],
        'is_trial' => [
            'name' => 'is_trial',
            'vname' => 'LBL_IS_TRIAL',
            'type' => 'bool',
            'comment' => 'indicates that the tenant is a trial tenant',
        ],
        'valid_until' => [
            'name' => 'valid_until',
            'vname' => 'LBL_VALID_UNTIL',
            'type' => 'date',
            'comment' => 'indicates the expiry date of the current tenant',
        ],
        'limit_database' => [
            'name' => 'limit_database',
            'vname' => 'LBL_LIMIT_DATABASE',
            'type' => 'int',
            'comment' => 'the maximum database size limit in MB',
        ],
        'limit_uploads' => [
            'name' => 'limit_uploads',
            'vname' => 'LBL_LIMIT_UPLOADS',
            'type' => 'int',
            'comment' => 'the maximum upload files limit in MB',
        ],
        'limit_users' => [
            'name' => 'limit_users',
            'vname' => 'LBL_LIMIT_USERS',
            'type' => 'int',
            'comment' => 'the maximum number of users on the system',
        ],
        'limit_elastic' => [
            'name' => 'limit_elastic',
            'vname' => 'LBL_LIMIT_ELASTIC',
            'type' => 'int',
            'comment' => 'the maximum elastic indices size limit in MB',
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'vname' => 'LBL_USERS',
            'relationship' => 'systemtenant_users',
            'module' => 'Users',
            'source' => 'non-db'
        ]
    ],
    'indices' => [],
    'relationships' => [
        'systemtenant_users' => [
            'lhs_module' => 'SystemTenants',
            'lhs_table' => 'systemtenants',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'systemtenant_id',
            'relationship_type' => 'one-to-many'
        ]
    ]
];

VardefManager::createVardef('SystemTenants', 'SystemTenant', ['default', 'assignable']);
