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




use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['tenants_deploymentpackages'] = [
    'table'         => 'tenants_deploymentpackages',
    'fields'        => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'len'  => '36'
        ],
        'tenant_id' => [
            'name' => 'tenant_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        'deploymentpackage_id' => [
            'name' => 'deploymentpackage_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        'status' => [
            'name'    => 'status',
            'type'    => 'bool',
            'len'     => '25',
            'default' => '0',
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime',
        ],
        'deleted' => [
            'name'     => 'deleted',
            'type'     => 'bool',
            'len'      => '1',
            'default'  => '0',
            'required' => false,
        ],
    ],
    'indices'       => [
        [
            'name'   => 'tenants_deploymentpackagespk',
            'type'   => 'primary',
            'fields' => ['id'],
        ],
        [
            'name'   => 'idx_ten_dpk_ten',
            'type'   => 'index',
            'fields' => ['tenant_id'],
        ],
        [
            'name'   => 'idx_ten_dpk_dpk',
            'type'   => 'index',
            'fields' => ['deploymentpackage_id'],
        ],
        [
            'name'   => 'idx_tenant_deploymentpackage',
            'type'   => 'alternate_key',
            'fields' => ['tenant_id','deploymentpackage_id'],
        ],
    ],
    'relationships' => [
        'tenants_deploymentpackages' => [
            'lhs_module'		=> 'Tenants',
            'lhs_table'			=> 'tenants',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'SystemDeploymentPackages',
            'rhs_table'			=> 'systemdeploymentpackages',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'join_table'		=> 'tenants_deploymentpackages',
            'join_key_lhs'		=> 'tenant_id',
            'join_key_rhs'		=> 'deploymentpackage_id',
        ],
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['tenant_auth_users'] = [
    'table'         => 'tenant_auth_users',
    'fields'        => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'tenant_id' => [
            'name' => 'tenant_id',
            'type' => 'varchar',
            'len'  => '36'
        ],
        'username' => [
            'name' => 'username',
            'type' => 'varchar',
            'len'  => 150
        ],
        'user_hash' => [
            'name' => 'user_hash',
            'type' => 'varchar'
        ],
        'login_blocked' => [
            'name' => 'login_blocked',
            'type' => 'bool',
            'default' => '0',
        ],
        'login_blocked_until' => [
            'name' => 'login_blocked_until',
            'type' => 'datetime',
        ]
    ],
    'indices'       => [
        [
            'name'   => 'tenants_users_pk',
            'type'   => 'primary',
            'fields' => ['id'],
        ],
        [
            'name'   => 'idx_tenant_username',
            'type'   => 'index',
            'fields' => ['username']
        ],
    ]
];
