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

SpiceDictionaryHandler::getInstance()->dictionary['Address'] = [
    'table' => 'addresses',
    'audited' => true,
    'unified_search' => true,
    'fields' => [
        'address_attn' => [
            'name' => 'address_attn',
            'vname' => 'LBL_ADDRESS_ATTN',
            'type' => 'varchar',
            'len' => '150'
        ],
        'address_street' => [
            'name' => 'address_street',
            'vname' => 'LBL_STREET',
            'type' => 'varchar',
            'len' => '150'
        ],
        'address_street_2' => [
            'name' => 'address_street_2',
            'vname' => 'LBL_STREET_2',
            'type' => 'varchar',
            'len' => '150',
        ],
        'address_street_3' => [
            'name' => 'address_street_3',
            'vname' => 'LBL_STREET_3',
            'type' => 'varchar',
            'len' => '150',
        ],
        'address_street_4' => [
            'name' => 'address_street_4',
            'vname' => 'LBL_STREET_4',
            'type' => 'varchar',
            'len' => '150',
        ],
        'address_city' => [
            'name' => 'address_city',
            'vname' => 'LBL_CITY',
            'type' => 'varchar',
            'len' => '100',
        ],
        'address_state' => [
            'name' => 'address_state',
            'vname' => 'LBL_STATE',
            'type' => 'varchar',
            'len' => '100',
        ],
        'address_postalcode' => [
            'name' => 'address_postalcode',
            'vname' => 'LBL_POSTALCODE',
            'type' => 'varchar',
            'len' => '20',
        ],
        'address_country' => [
            'name' => 'address_country',
            'vname' => 'LBL_COUNTRY',
            'type' => 'varchar',
        ],
        'address_latitude' => [
            'name' => 'address_latitude',
            'vname' => 'LBL_LATITUDE',
            'type' => 'double',
        ],
        'address_longitude' => [
            'name' => 'address_longitude',
            'vname' => 'LBL_LONGITUDE',
            'type' => 'double',
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ACCOUNT_ID',
            'type' => 'id',
            'required' => false,
            'reportable' => false,
            'audited' => true,
            'comment' => 'Account ID of the parent of this account',
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'required' => false,
            'len' => 255,
            'comment' => 'The parent module to which the call is related',
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'type_name' => 'parent_type',
            'id_name' => 'parent_id',
            'vname' => 'LBL_LIST_RELATED_TO',
            'type' => 'parent',
            'source' => 'non-db',
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'account_addresses',
            'module' => 'Accounts',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNT'
        ],
        'contacts' => [
            'name' => 'contacts',
            'type' => 'link',
            'relationship' => 'contact_addresses',
            'source' => 'non-db',
            'vname' => 'LBL_CONTACTS',
            'module' => 'Contacts'
        ]

    ],
    'relationships' => [
        'account_addresses' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'Addresses',
            'rhs_table' => 'addresses',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Accounts'
        ],
        'contact_addresses' => [
            'lhs_module' => 'Contacts',
            'lhs_table' => 'contacts',
            'lhs_key' => 'id',
            'rhs_module' => 'Addresses',
            'rhs_table' => 'addresses',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Contacts'
        ]
    ],
    'indices' => [
        ['name' => 'idx_addresses_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']],
        ['name' => 'idx_addresses_parentid_del', 'type' => 'index', 'fields' => ['parent_id', 'deleted']]
    ],
    'optimistic_locking' => true,
];

VardefManager::createVardef('Addresses', 'Address', ['default', 'assignable', 'basic']);

// name is not required
//set global else error with PHP7.1: Uncaught Error: Cannot use string offset as an array
SpiceDictionaryHandler::getInstance()->dictionary['Address']['fields']['name']['required'] = false;
