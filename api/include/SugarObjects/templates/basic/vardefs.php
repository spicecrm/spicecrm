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

$vardefs = [
    'fields' => [
        'id' =>
            [
                'name' => 'id',
                'vname' => 'LBL_ID',
                'type' => 'id',
                'required' => true,
                'reportable' => true,
                'comment' => 'Unique identifier',
                'duplicate_merge' => 'disabled',
                'audited' => false
            ],
        'name' =>
            [
                'name' => 'name',
                'vname' => 'LBL_NAME',
                'type' => 'name',
                'link' => true, // bug 39288
                'dbType' => 'varchar',
                'len' => 255,
                'unified_search' => true,
                'full_text_search' => ['boost' => 3],
                'required' => true,
                'importable' => 'required',
                'duplicate_merge' => 'enabled',
                //'duplicate_merge_dom_value' => '3',
                'merge_filter' => 'selected',
            ],
        'date_entered' =>
            [
                'name' => 'date_entered',
                'vname' => 'LBL_DATE_ENTERED',
                'type' => 'datetime',
                'group' => 'created_by_name',
                'comment' => 'Date record created',
                'enable_range_search' => true,
                'options' => 'date_range_search_dom',
                'duplicate_merge' => 'disabled',
                'audited' => false
            ],
        'date_modified' =>
            [
                'name' => 'date_modified',
                'vname' => 'LBL_DATE_MODIFIED',
                'type' => 'datetime',
                'group' => 'modified_by_name',
                'comment' => 'Date record last modified',
                'enable_range_search' => true,
                'options' => 'date_range_search_dom',
                'duplicate_merge' => 'disabled',
                'audited' => false
            ],
        'date_indexed' =>
            [
                'name' => 'date_indexed',
                'vname' => 'LBL_DATE_INDEXED',
                'type' => 'datetime',
                'comment' => 'Date record last indexed',
                'enable_range_search' => true,
                'options' => 'date_range_search_dom',
                'duplicate_merge' => 'disabled',
                'audited' => false
            ],
        'modified_user_id' =>
            [
                'name' => 'modified_user_id',
                'rname' => 'user_name',
                'id_name' => 'modified_user_id',
                'vname' => 'LBL_MODIFIED_BY_ID',
                'type' => 'assigned_user_name',
                'table' => 'users',
                'isnull' => 'false',
                'group' => 'modified_by_name',
                'dbType' => 'id',
                'reportable' => true,
                'comment' => 'User who last modified record',
                'massupdate' => false,
                'duplicate_merge' => 'disabled',
                'audited' => false
            ],
        'modified_by_name' =>  [
                'name' => 'modified_by_name',
                'vname' => 'LBL_MODIFIED_BY',
                'type' => 'relate',
                'reportable' => false,
                'source' => 'non-db',
                'rname' => 'user_name',
                'table' => 'users',
                'id_name' => 'modified_user_id',
                'module' => 'Users',
                'link' => 'modified_user_link',
                'duplicate_merge' => 'disabled',
                'massupdate' => false,
                'audited' => false
        ],
        'created_by' =>            [
                'name' => 'created_by',
                'rname' => 'user_name',
                'id_name' => 'modified_user_id',
                'vname' => 'LBL_CREATED_BY',
                'type' => 'assigned_user_name',
                'table' => 'users',
                'isnull' => 'false',
                'dbType' => 'id',
                'group' => 'created_by_name',
                'comment' => 'User who created record',
                'massupdate' => false,
                'duplicate_merge' => 'disabled',
                'audited' => false
        ],
        'created_by_name' =>            [
                'name' => 'created_by_name',
                'vname' => 'LBL_CREATED_BY',
                'type' => 'relate',
                'reportable' => false,
                'link' => 'created_by_link',
                'rname' => 'user_name',
                'source' => 'non-db',
                'table' => 'users',
                'id_name' => 'created_by',
                'module' => 'Users',
                'importable' => 'false',
                'massupdate' => false,
                'duplicate_merge' => 'disabled'
        ],
        'description' =>
            [
                'name' => 'description',
                'vname' => 'LBL_DESCRIPTION',
                'type' => 'text',
                'comment' => 'Full text of the note'
            ],
        'deleted' =>
            [
                'name' => 'deleted',
                'vname' => 'LBL_DELETED',
                'type' => 'bool',
                'default' => '0',
                'reportable' => false,
                'comment' => 'Record deletion indicator',
                'duplicate_merge' => 'disabled',
                'audited' => false
            ],
        'tags' =>
            [
                'name' => 'tags',
                'vname' => 'LBL_TAGS',
                'type' => 'tags',
                'dbType' => 'text',
                'duplicate_merge' => 'disabled'
            ],

/////////////////RELATIONSHIP LINKS////////////////////////////
        'created_by_link' =>
            [
                'name' => 'created_by_link',
                'type' => 'link',
                'relationship' => (isset($table_name) ? $table_name : strtolower($module)). '_created_by',
                'vname' => 'LBL_CREATED_BY',
                'link_type' => 'one',
                'module' => 'Users',
                'bean_name' => 'User',
                'source' => 'non-db',
                'recover' => false,
                'duplicate_merge' => 'disabled'
            ],
        'modified_user_link' =>
            [
                'name' => 'modified_user_link',
                'type' => 'link',
                'relationship' => (isset($table_name) ? $table_name : strtolower($module)). '_modified_user',
                'vname' => 'LBL_MODIFIED_BY',
                'link_type' => 'one',
                'module' => 'Users',
                'bean_name' => 'User',
                'source' => 'non-db',
                'recover' => false,
                'duplicate_merge' => 'disabled'
            ],

    ],
    'indices' => [
        'id' => ['name' => (isset($table_name) ? $table_name : strtolower($module)). 'pk', 'type' => 'primary', 'fields' => ['id']],
    ],
    'relationships' => [
        (isset($table_name) ? $table_name : strtolower($module)). '_modified_user' =>
            ['lhs_module' => 'Users', 'lhs_table' => 'users', 'lhs_key' => 'id',
                'rhs_module' => $module, 'rhs_table' => (isset($table_name) ? $table_name : strtolower($module)), 'rhs_key' => 'modified_user_id',
                'relationship_type' => 'one-to-many']
    , (isset($table_name) ? $table_name : strtolower($module)). '_created_by' =>
            ['lhs_module' => 'Users', 'lhs_table' => 'users', 'lhs_key' => 'id',
                'rhs_module' => $module, 'rhs_table' => (isset($table_name) ? $table_name : strtolower($module)), 'rhs_key' => 'created_by',
                'relationship_type' => 'one-to-many']
    ],
];
