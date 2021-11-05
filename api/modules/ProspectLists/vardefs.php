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
$dictionary['ProspectList'] = [
    'table' => 'prospect_lists',
    'unified_search' => true,
    'full_text_search' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '50',
            'importable' => 'required',
            'unified_search' => true,
            'full_text_search' => ['boost' => 3],
        ],
        'list_type' => [
            'name' => 'list_type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'options' => 'prospect_list_type_dom',
            'len' => 100,
            'importable' => 'required',
            'required' => true
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
            'reportable' => true,
        ],
        'modified_by_name' => [
            'name' => 'modified_by_name',
            'vname' => 'LBL_MODIFIED_BY',
            'type' => 'relate',
            'reportable' => false,
            'source' => 'non-db',
            'table' => 'users',
            'id_name' => 'modified_user_id',
            'module' => 'Users',
            'duplicate_merge' => 'disabled',
        ],
        'created_by' => [
            'name' => 'created_by',
            'rname' => 'user_name',
            'id_name' => 'created_by',
            'vname' => 'LBL_CREATED',
            'type' => 'assigned_user_name',
            'table' => 'created_by_users',
            'isnull' => 'false',
            'dbType' => 'id'
        ],
        'created_by_name' => [
            'name' => 'created_by_name',
            'vname' => 'LBL_CREATED',
            'type' => 'relate',
            'reportable' => false,
            'source' => 'non-db',
            'table' => 'users',
            'id_name' => 'created_by',
            'module' => 'Users',
            'duplicate_merge' => 'disabled',
        ],
        'deleted' => [
            'name' => 'deleted',
            'vname' => 'LBL_CREATED_BY',
            'type' => 'bool',
            'required' => false,
            'reportable' => false,
        ],
        'description' => [
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'text',
        ],
        'domain_name' => [
            'name' => 'domain_name',
            'vname' => 'LBL_DOMAIN_NAME',
            'type' => 'varchar',
            'len' => '255',
        ],
        'entry_count' => [
            'name' => 'entry_count',
            'type' => 'int',
            'source' => 'non-db',
            'vname' => 'LBL_LIST_ENTRIES',
        ],
        'ext_id' => [
            'name' => 'ext_id',
            'vname' => 'LBL_EXT_ID',
            'type' => 'varchar',
            'len' => '50'
        ],
        'attribute_id' => [
            'name' => 'attribute_id',
            'type' => 'varchar',
            'len' => '50'
        ],
        'prospectlists_accounts_quantity' => [
            'name' => 'prospectlists_accounts_quantity',
            'vname' => 'LBL_QUANTITY',
            'type' => 'varchar',
            'source' => 'non-db'
        ],
        'prospectlists_contacts_quantity' => [
            'name' => 'prospectlists_contacts_quantity',
            'vname' => 'LBL_QUANTITY',
            'type' => 'varchar',
            'source' => 'non-db'
        ],
        'prospectlists_consumer_quantity' => [
            'name' => 'prospectlists_consumer_quantity',
            'vname' => 'LBL_QUANTITY',
            'type' => 'varchar',
            'source' => 'non-db'
        ],
        'prospects' => [
            'name' => 'prospects',
            'type' => 'link',
            'relationship' => 'prospect_list_prospects',
            'source' => 'non-db',
        ],
        'contacts' => [
            'name' => 'contacts',
            'type' => 'link',
            'vname' => 'LBL_CONTACTS',
            'relationship' => 'prospect_list_contacts',
            'source' => 'non-db',
            'rel_fields' => [
                'quantity' => [
                    'map' => 'prospectlists_contacts_quantity'
                ]
            ]
        ],
        'consumers' => [
            'name' => 'consumers',
            'type' => 'link',
            'vname' => 'LBL_CONSUMERS',
            'relationship' => 'prospect_list_consumers',
            'source' => 'non-db',
            'rel_fields' => [
                'quantity' => [
                    'map' => 'prospectlists_consumer_quantity'
                ]
            ]
        ],
        'leads' => [
            'name' => 'leads',
            'type' => 'link',
            'vname' => 'LBL_LEADS',
            'relationship' => 'prospect_list_leads',
            'source' => 'non-db',
        ],
        'accounts' => [
            'name' => 'accounts',
            'vname' => 'LBL_ACCOUNTS',
            'type' => 'link',
            'relationship' => 'prospect_list_accounts',
            'source' => 'non-db',
            'rel_fields' => [
                'quantity' => [
                    'map' => 'prospectlists_accounts_quantity'
                ]
            ]
        ],
        'campaigns' => [
            'name' => 'campaigns',
            'type' => 'link',
            'vname' => 'LBL_CAMPAIGNS',
            'relationship' => 'prospect_list_campaigns',
            'source' => 'non-db',
        ],
        'campaigntasks' => [
            'name' => 'campaigntasks',
            'type' => 'link',
            'vname' => 'LBL_CAMPAIGNTASKS',
            'relationship' => 'prospect_list_campaigntasks',
            'source' => 'non-db',
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'vname' => 'LBL_USERS',
            'relationship' => 'prospect_list_users',
            'source' => 'non-db',
        ],
// CR1000465 cleanup Email
//        'email_marketing' => array(
//            'name' => 'email_marketing',
//            'type' => 'link',
//            'relationship' => 'email_marketing_prospect_lists',
//            'source' => 'non-db',
//        ),
        'marketing_id' => [
            'name' => 'marketing_id',
            'vname' => 'LBL_MARKETING_ID',
            'type' => 'varchar',
            'len' => '36',
            'source' => 'non-db',
        ],
        'marketing_name' => [
            'name' => 'marketing_name',
            'vname' => 'LBL_MARKETING_NAME',
            'type' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
        ],
        'prospect_list_filters' => [
            'name' => 'prospect_list_filters',
            'type' => 'link',
            'relationship' => 'prospectlists_prospect_list_filters',
            'source' => 'non-db',
            'module' => 'ProspectListFilters'
        ],
        'emailschedules' => [
            'name' => 'emailschedules',
            'vname' => 'LBL_EMAIL_SCHEDULES',
            'type' => 'link',
            'relationship' => 'prospectlist_emailschedules',
            'source' => 'non-db',
            'module' => 'EmailSchedules'
        ],
    ],

    'indices' => [
        [
            'name' => 'idx_prospect_list_name',
            'type' => 'index',
            'fields' => ['name']
        ],
    ],
    'relationships' => [
        'prospectlists_assigned_user' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'prospectlists',
            'rhs_table' => 'prospect_lists',
            'rhs_key' => 'assigned_user_id',
            'relationship_type' => 'one-to-many'
        ],
        'prospectlists_prospect_list_filters' => [
            'lhs_module' => 'ProspectLists',
            'lhs_table' => 'prospectlists',
            'lhs_key' => 'id',
            'rhs_module' => 'ProspectListFilters',
            'rhs_table' => 'prospect_list_filters',
            'rhs_key' => 'prospectlist_id',
            'relationship_type' => 'one-to-many'
        ],

    ]
];

VardefManager::createVardef('ProspectLists', 'ProspectList', ['assignable', 'default']);
