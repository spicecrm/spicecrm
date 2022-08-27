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

SpiceDictionaryHandler::getInstance()->dictionary['SystemTenant'] = [
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
        'initialized' => [
            'name'  => 'initialized',
            'vname' => 'LBL_INITIALIZED',
            'type'  => 'bool',
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
        'accept_data' => [
            'name' => 'accept_data',
            'type' => 'json',
            'vname' => 'LBL_ACCEPT_DATA'
        ],
        'wizard_completed' => [
            'name' => 'wizard_completed',
            'type' => 'bool',
            'vname' => 'LBL_WIZARD_COMPLETED',
            'default' => 0
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'vname' => 'LBL_USERS',
            'relationship' => 'systemtenant_users',
            'module' => 'Users',
            'source' => 'non-db'
        ],
        'deploymentpackages' => [
            'name'         => 'deploymentpackages',
            'vname'        => 'LBL_SYSTEMDEPLOYMENTPACKAGES',
            'type'         => 'link',
            'module'       => 'SystemDeploymentPackages',
            'source'       => 'non-db',
            'relationship' => 'tenants_deploymentpackages',
        ],
        'companycode_id' => [
            'name'  => 'companycode_id',
            'vname' => 'LBL_COMPANYCODE_ID',
            'type'  => 'id',
        ],
        'companycode' => [
            'name'         => 'companycode',
            'vname'        => 'LBL_COMPANYCODE',
            'relationship' => 'tenant_companycode',
            'type'         => 'link',
            'source'       => 'non-db',
        ],
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
        ],
        'tenant_companycode' => [
            'lhs_module'        => 'SystemTenant',
            'lhs_table'         => 'systemtenants',
            'lhs_key'           => 'id',
            'rhs_module'        => 'CompanyCode',
            'rhs_table'         => 'companycodes',
            'rhs_key'           => 'companycode_id',
            'relationship_type' => 'one-to-many',
        ],
    ]
];

VardefManager::createVardef('SystemTenants', 'SystemTenant', ['default', 'assignable']);
