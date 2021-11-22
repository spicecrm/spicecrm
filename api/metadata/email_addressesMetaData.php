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

/**
 * Relationship table linking email addresses to an instance of a Sugar Email object
 */
$dictionary['emails_email_addr_rel'] = [
    'table' => 'emails_email_addr_rel',
    'comment' => 'Normalization of multi-address fields such as To:, CC:, BCC',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'required' => true,
            'comment' => 'GUID',
        ],
        'email_id' => [
            'name' => 'email_id',
            'type' => 'id',
            'required' => true,
            'comment' => 'Foriegn key to emails table NOT unique'
        ],
        'address_type' => [
            'name' => 'address_type',
            'type' => 'varchar',
            'len' => 4,
            'required' => true,
            'comment' => 'Type of entry, TO, CC, or BCC'
        ],
        'email_address_id' => [
            'name' => 'email_address_id',
            'type' => 'id',
            'required' => true,
            'comment' => 'Foriegn key to emails table NOT unique'
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'type' => 'varchar',
            'len' => '100',
            'comment' => 'the type of the bean the email address is linked to'
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'type' => 'varchar',
            'len' => '36',
            'comment' => 'the id of the bean the email address is linked to'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
        ]
    ],
    'indices' => [
        [
            'name' => 'emails_email_addr_relpk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_eearl_email_id',
            'type' => 'index',
            'fields' => ['email_id', 'address_type']
        ],
        [
            'name' => 'idx_eearl_address_id',
            'type' => 'index',
            'fields' => ['email_address_id']
        ],
        [
            'name' => 'idx_eearl_parent_type',
            'type' => 'index',
            'fields' => ['parent_type']
        ],
        [
            'name' => 'idx_eearl_parent_id',
            'type' => 'index',
            'fields' => ['parent_id']
        ],
        [
            'name' => 'idx_eearl_linkemailtoaddress',
            'type' => 'index',
            'fields' => ['email_id', 'email_address_id', 'address_type', 'deleted']
        ]
    ]
];

/**
 * Relationship table linking email addresses to various SugarBeans or type Person
 */
$dictionary['email_addr_bean_rel'] = [
    'table' => 'email_addr_bean_rel',
    'fields' => [
        'id' =>
            [
            'name' => 'id',
            'type' => 'id',
            'required' => true,
        ],
        'email_address_id' =>
            [
            'name' => 'email_address_id',
            'type' => 'id',
            'required' => true,
        ],
        'bean_id' =>
            [
            'name' => 'bean_id',
            'type' => 'id',
            'required' => true,
        ],
        'bean_module' =>
            [
            'name' => 'bean_module',
            'type' => 'varchar',
            'len' => 100,
            'required' => true,
        ],
        'primary_address' =>
            [
            'name' => 'primary_address',
            'type' => 'bool',
            'default' => '0',
        ],
        'reply_to_address' =>
            [
            'name' => 'reply_to_address',
            'type' => 'bool',
            'default' => '0',
        ],
        'date_modified' =>
            [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'opt_in_status' =>
            [
            'name' => 'opt_in_status',
            'type' => 'varchar',
            'len' => 24,
            'comment' => 'possible values opted_in, opted_out, pending'
        ],
        'deleted' =>
            [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
        ],
    ],
    'indices' => [
        [
            'name' => 'email_addr_bean_relpk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_email_addr_bean_rel_email_address_id',
            'type' => 'index',
            'fields' => ['email_address_id']
        ],
        [
            'name' => 'idx_email_addr_bean_rel_bean_id_module',
            'type' => 'index',
            'fields' => ['bean_id', 'bean_module'],
        ],
        [
            'name' => 'idx_email_addr_bean_rel_optinstatus_del',
            'type' => 'index',
            'fields' => ['opt_in_status', 'deleted'],
        ],
    ],
    'relationships' => [//Defined in Person/Company template vardefs
    ],
];


$dictionary['email_addr_bean_rel_audit'] = [
    'table' => 'email_addr_bean_rel_audit',
    'fields' => [
        'id'=> [
            'name' =>'id',
            'type' =>'id',
            'required'=>true
        ],
        'parent_id'=> [
            'name' =>'parent_id',
            'type' =>'id'
            ,'required'=>true
        ],
        'transaction_id'=> [
            'name' =>'transaction_id',
            'type' =>'varchar'
        ],
        'created_by'=> [
            'name' =>'created_by',
            'type' => 'id'
        ],
        'field_name'=> [
            'name' =>'field_name',
            'type' => 'varchar',
            'len' => 100
        ],
        'data_type'=> [
            'name' =>'data_type',
            'type' => 'varchar',
            'len' => 100
        ],
        'before_value'=> [
            'name' =>'before_value',
            'type' => 'varchar'
        ],
        'after_value'=> [
            'name' =>'after_value',
            'type' => 'varchar'
        ],
    ],
    'indices' => [
        //name will be re-constructed adding idx_ and table name as the prefix like 'idx_accounts_'
        ['name' => 'pk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'parent_id', 'type' => 'index', 'fields' => ['parent_id']],
        ['name' => 'field_name', 'type' => 'index', 'fields' => ['field_name']],
    ]
];
