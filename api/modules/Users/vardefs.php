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
global $dictionary;
$dictionary['User'] = [
    'table' => 'users',
    'fields' => [

        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
        ],
        'user_name' => [
            'name' => 'user_name',
            'vname' => 'LBL_USER_NAME',
            'type' => 'user_name',
            'dbType' => 'varchar',
            'len' => '60',
            'importable' => 'required',
            'required' => true,
            'studio' => [
                'no_duplicate' => true,
                'editview' => false,
                'detailview' => true,
                'quickcreate' => false,
                'basic_search' => false,
                'advanced_search' => false,
            ],
        ],
        'user_hash' => [
            'name' => 'user_hash',
            'vname' => 'LBL_USER_HASH',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => false,
            'importable' => 'false',
            'sensitive' => true,
            'studio' => [
                'no_duplicate' => true,
                'listview' => false,
                'searchview' => false,
            ],
        ],
        'user_image' => [
            'name' => 'user_image',
            'vname' => 'LBL_USER_IMAGE',
            'type' => 'longtext'
        ],
        'system_generated_password' => [
            'name' => 'system_generated_password',
            'vname' => 'LBL_SYSTEM_GENERATED_PASSWORD',
            'type' => 'bool',
            'required' => false,
            'reportable' => false,
            'massupdate' => false,
            'studio' => [
                'listview' => false,
                'searchview' => false,
                'editview' => false,
                'quickcreate' => false,
            ],
        ],

        'pwd_last_changed' => [
            'name' => 'pwd_last_changed',
            'vname' => 'LBL_PSW_MODIFIED',
            'type' => 'datetime',
            'required' => false,
            'massupdate' => false,
            'studio' => ['formula' => false],
        ],
        /**
         * authenticate_id is used by authentication plugins so they may place a quick lookup key for looking up a given user after authenticating through the plugin
         */
        'authenticate_id' => [
            'name' => 'authenticate_id',
            'vname' => 'LBL_AUTHENTICATE_ID',
            'type' => 'varchar',
            'len' => '100',
            'reportable' => false,
            'importable' => 'false',
            'studio' => ['listview' => false, 'searchview' => false, 'related' => false],
        ],
        /**
         * sugar_login will force the user to use sugar authentication
         * regardless of what authentication the system is configured to use
         */
        'sugar_login' => [
            'name' => 'sugar_login',
            'vname' => 'LBL_SUGAR_LOGIN',
            'type' => 'bool',
            'default' => '1',
            'reportable' => false,
            'massupdate' => false,
            'importable' => false,
            'studio' => ['listview' => false, 'searchview' => false, 'formula' => false],
        ],
        'salutation' => [
            'name' => 'salutation',
            'vname' => 'LBL_SALUTATION',
            'type' => 'enum',
            'options' => 'salutation_dom',
            'massupdate' => false,
            'len' => '255',
            'comment' => 'Contact salutation (e.g., Mr, Ms)'
        ],
        'first_name' => [
            'name' => 'first_name',
            'vname' => 'LBL_FIRST_NAME',
            'dbType' => 'varchar',
            'type' => 'name',
            'len' => '30',
        ],
        'last_name' => [
            'name' => 'last_name',
            'vname' => 'LBL_LAST_NAME',
            'dbType' => 'varchar',
            'type' => 'name',
            'len' => '30',
            'importable' => 'required',
            'required' => true,
        ],
        'degree1' => [
            'name' => 'degree1',
            'vname' => 'LBL_DEGREE1',
            'type' => 'varchar',
            'len' => 50
        ],
        'degree2' => [
            'name' => 'degree2',
            'vname' => 'LBL_DEGREE2',
            'type' => 'varchar',
            'len' => 50
        ],
        'full_name' => [
            'name' => 'full_name',
            'rname' => 'full_name',
            'vname' => 'LBL_NAME',
            'type' => 'name',
            'fields' => [
                'first_name',
                'last_name'
            ],
            'source' => 'non-db',
            'sort_on' => 'last_name',
            'sort_on2' => 'first_name',
            'db_concat_fields' => [
                0 => 'first_name',
                1 => 'last_name'
            ],
            'len' => '510',
            'studio' => ['formula' => false],
        ],
        'account_user_role' => [
            'name' => 'account_user_role',
            'vname' => 'LBL_ROLE',
            'type' => 'enum',
            'source' => 'non-db',
            'options' => 'account_user_roles_dom'
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'accounts_users',
            'module' => 'Accounts',
            'bean_name' => 'Account',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS'
        ],
        'projects' => [
            'name' => 'projects',
            'type' => 'link',
            'relationship' => 'projects_users',
            'module' => 'Projects',
            'bean_name' => 'Project',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTS'
        ],
        'opportunity_role' => [
            'name' => 'opportunity_role',
            'type' => 'enum',
            'source' => 'non-db',
            'vname' => 'LBL_ROLE',
            'options' => 'opportunity_urelationship_type_dom',
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'opportunities_users',
            'source' => 'non-db',
            'module' => 'Opportunities',
            'bean_name' => 'Opportunity',
            'vname' => 'LBL_OPPORTUNITIES',
        ],
        'name' => [
            'name' => 'name',
            'rname' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'source' => 'non-db',
            'len' => '510',
            'db_concat_fields' => [
                0 => 'first_name',
                1 => 'last_name'
            ],
            'importable' => 'false',
        ],
        'is_admin' => [
            'name' => 'is_admin',
            'vname' => 'LBL_IS_ADMIN',
            'type' => 'bool',
            'default' => '0',
            'studio' => ['listview' => false, 'searchview' => false, 'related' => false],
        ],
        'is_dev' => [
            'name' => 'is_dev',
            'vname' => 'LBL_IS_DEVELOPER',
            'type' => 'bool',
            'default' => '0'
        ],
        'external_auth_only' => [
            'name' => 'external_auth_only',
            'vname' => 'LBL_EXT_AUTHENTICATE',
            'type' => 'bool',
            'reportable' => false,
            'massupdate' => false,
            'default' => '0',
            'studio' => ['listview' => false, 'searchview' => false, 'related' => false],
        ],
        'receive_notifications' => [
            'name' => 'receive_notifications',
            'vname' => 'LBL_RECEIVE_NOTIFICATIONS',
            'type' => 'bool',
            'massupdate' => false,
            'studio' => false,
        ],
        'description' => [
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'text',
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
            'required' => true,
            'studio' => [
                'editview' => false,
                'quickcreate' => false,
            ],
        ],
        'date_indexed' => [
            'name' => 'date_indexed',
            'vname' => 'LBL_DATE_INDEXED',
            'type' => 'datetime'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'vname' => 'LBL_DATE_MODIFIED',
            'type' => 'datetime',
            'required' => true,
            'studio' => [
                'editview' => false,
                'quickcreate' => false,
            ],
        ],
        'modified_user_id' => [
            'name' => 'modified_user_id',
            'rname' => 'user_name',
            'id_name' => 'modified_user_id',
            'vname' => 'LBL_MODIFIED_BY_ID',
            'type' => 'assigned_user_name',
            'table' => 'users',
            'isnull' => 'false',
            'dbType' => 'id',
        ],
        'modified_by_name' => [
            'name' => 'modified_by_name',
            'vname' => 'LBL_MODIFIED_BY',
            'type' => 'varchar',
            'source' => 'non-db',
            'studio' => false,
        ],
        'created_by' => [
            'name' => 'created_by',
            'rname' => 'user_name',
            'id_name' => 'modified_user_id',
            'vname' => 'LBL_ASSIGNED_TO',
            'type' => 'assigned_user_name',
            'table' => 'users',
            'isnull' => 'false',
            'dbType' => 'id',
            'studio' => false,
        ],
        'created_by_name' => [
            'name' => 'created_by_name',
            'vname' => 'LBL_CREATED_BY', //bug 48978
            'type' => 'varchar',
            'source' => 'non-db',
            'importable' => 'false',
        ],
        'title' => [
            'name' => 'title',
            'vname' => 'LBL_TITLE',
            'type' => 'varchar',
            'len' => '50',
        ],
        'department' => [
            'name' => 'department',
            'vname' => 'LBL_DEPARTMENT',
            'type' => 'varchar',
            'len' => '50',
        ],
        'phone_home' => [
            'name' => 'phone_home',
            'vname' => 'LBL_PHONE_HOME',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => '50',
        ],
        'phone_mobile' => [
            'name' => 'phone_mobile',
            'vname' => 'LBL_PHONE_MOBILE',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => '50',
        ],
        'phone_work' => [
            'name' => 'phone_work',
            'vname' => 'LBL_PHONE_WORK',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => '50',
        ],
        'phone_other' => [
            'name' => 'phone_other',
            'vname' => 'LBL_PHONE_OTHER',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => '50',
        ],
        'phone_fax' => [
            'name' => 'phone_fax',
            'vname' => 'LBL_FAX_PHONE',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => '50',
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'len' => 100,
            'options' => 'user_status_dom',
            'importable' => 'required',
            'required' => true,
        ],
        'address_street' => [
            'name' => 'address_street',
            'vname' => 'LBL_STREET',
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
        'address_country' => [
            'name' => 'address_country',
            'vname' => 'LBL_COUNTRY',
            'type' => 'varchar',
            'len' => 100,
        ],
        'address_postalcode' => [
            'name' => 'address_postalcode',
            'vname' => 'LBL_POSTALCODE',
            'type' => 'varchar',
            'len' => '20',
        ],
        'address_street_number' => [
            'name' => 'address_street_number',
            'vname' => 'LBL_STREET_NUMBER',
            'type' => 'varchar',
            'len' => '10',
        ],
        'address_street_number_suffix' => [
            'name' => 'address_street_number_suffix',
            'vname' => 'LBL_STREET_NUMBER_SUFFIX',
            'type' => 'varchar',
            'len' => '25',
            'comment' => 'additonal info to the street like Appartmnent, Floor, etc'
        ],
        // This is a fake field for the edit view
        'UserType' => [
            'name' => 'UserType',
            'vname' => 'LBL_USER_TYPE',
            'type' => 'enum',
            'len' => 50,
            'options' => 'user_type_dom',
            'source' => 'non-db',
            'import' => false,
            'reportable' => false,
            'studio' => ['formula' => false],
        ],
        'deleted' => [
            'name' => 'deleted',
            'vname' => 'LBL_DELETED',
            'type' => 'bool',
            'required' => false,
            'reportable' => false,
        ],
        'quota_carrying' => [
            'name' => 'quota_carrying',
            'vname' => 'LBL_QUOTA_CARRYING',
            'type' => 'bool',
            'required' => false
        ],
        'portal_only' => [
            'name' => 'portal_only',
            'vname' => 'LBL_PORTAL_ONLY_USER',
            'type' => 'bool',
            'massupdate' => false,
            'default' => '0',
            'studio' => ['listview' => false, 'searchview' => false, 'formula' => false],
        ],
        'show_on_employees' => [
            'name' => 'show_on_employees',
            'vname' => 'LBL_SHOW_ON_EMPLOYEES',
            'type' => 'bool',
            'massupdate' => true,
            'importable' => true,
            'default' => true,
            'studio' => ['formula' => false],
        ],
        'employee_status' => [
            'name' => 'employee_status',
            'vname' => 'LBL_EMPLOYEE_STATUS',
            'type' => 'varchar',
            'len' => 100,
        ],
        'messenger_id' => [
            'name' => 'messenger_id',
            'vname' => 'LBL_MESSENGER_ID',
            'type' => 'varchar',
            'len' => 100,
        ],
        'messenger_type' => [
            'name' => 'messenger_type',
            'vname' => 'LBL_MESSENGER_TYPE',
            'type' => 'enum',
            'options' => 'messenger_type_dom',
            'len' => 100,
        ],
        'calls' => [
            'name' => 'calls',
            'type' => 'link',
            'relationship' => 'calls_users',
            'source' => 'non-db',
            'vname' => 'LBL_CALLS'
        ],
        'meetings' => [
            'name' => 'meetings',
            'type' => 'link',
            'relationship' => 'meetings_users',
            'source' => 'non-db',
            'vname' => 'LBL_MEETINGS'
        ],
        'activity_accept_status' => [
            'name' => 'activity_accept_status',
            'type' => 'enum',
            'source' => 'non-db',
            'vname' => 'LBL_ACTIVITY_ACCEPT_STATUS',
            'options' => 'dom_meeting_accept_status',
            'comment' => 'non db field retrieved from the relationship to the meeting call etc'
        ],
        'activity_status_date_modified' => [
            'name' => 'activity_status_date_modified',
            'type' => 'datetime',
            'source' => 'non-db',
            'vname' => 'LBL_ACTIVITY_STATUS_DATE_MODFIFIED',
            'comment' => 'non db field retrieved from the relationship to the meeting call etc'
        ],
        'activity_required' => [
            'name' => 'activity_required',
            'type' => 'bool',
            'source' => 'non-db',
            'vname' => 'LBL_ACTIVITY_REQUIRED',
            'comment' => 'non db field retrieved from the relationship to the meeting call etc'
        ],
        // CR1000356
        'meeting_user_status_accept' => [
            'name'   => 'meeting_user_status_accept',
            'vname'  => 'LBL_USER_STATUS_ACCEPT',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'meetings_users_status_accept',
        ],
        'meeting_user_status_decline' => [
            'name'   => 'meeting_status_decline',
            'vname'  => 'LBL_USER_STATUS_DECLINE',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'meetings_users_status_decline',
        ],
        'meeting_user_status_tentative' => [
            'name'   => 'meeting_user_status_tentative',
            'vname'  => 'LBL_USER_STATUS_TENTATIVE',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'meetings_users_status_tentative',
        ],
        'call_user_status_accept' => [
            'name'   => 'call_user_status_accept',
            'vname'  => 'LBL_USER_STATUS_ACCEPT',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'calls_users_status_accept',
        ],
        'call_user_status_decline' => [
            'name'   => 'call_user_status_decline',
            'vname'  => 'LBL_USER_STATUS_DECLINE',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'calls_users_status_decline',
        ],
        'call_user_status_tentative' => [
            'name'   => 'call_user_status_tentative',
            'vname'  => 'LBL_USER_STATUS_TENTATIVE',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'calls_users_status_tentative',
        ],

        'tasks' => [
            'name' => 'tasks',
            'type' => 'link',
            'module' => 'Tasks',
            'relationship' => 'tasks_users',
            'source' => 'non-db',
            'vname' => 'LBL_TASKS'
        ],
        'contacts_sync' => [
            'name' => 'contacts_sync',
            'type' => 'link',
            'relationship' => 'contacts_users',
            'source' => 'non-db',
            'vname' => 'LBL_CONTACTS_SYNC',
            'reportable' => false,
        ],
        'reports_to_id' => [
            'name' => 'reports_to_id',
            'vname' => 'LBL_REPORTS_TO_ID',
            'type' => 'id',
            'required' => false,
        ],
        'reports_to_name' => [
            'name' => 'reports_to_name',
            'rname' => 'last_name',
            'id_name' => 'reports_to_id',
            'vname' => 'LBL_REPORTS_TO',
            'type' => 'relate',
            'isnull' => 'true',
            'module' => 'Users',
            'table' => 'users',
            'link' => 'reports_to_link',
            'reportable' => false,
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'side' => 'right',
        ],
        'reports_to_link' => [
            'name' => 'reports_to_link',
            'type' => 'link',
            'relationship' => 'user_direct_reports',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_REPORTS_TO',
        ],
        'reportees' => [
            'name' => 'reportees',
            'type' => 'link',
            'relationship' => 'user_direct_reports',
            'link_type' => 'many',
            'side' => 'left',
            'source' => 'non-db',
            'vname' => 'LBL_REPORTS_TO',
            'reportable' => false,
        ],
        'companycode_id' => [
            'name' => 'companycode_id',
            'vname' => 'LBL_COMPANYCODE',
            'type' => 'companies',
            'dbType' => 'id',
            'required' => false
        ],
        'companycode_name' => [
            'name' => 'companycode_name',
            'rname' => 'name',
            'id_name' => 'companycode_id',
            'vname' => 'LBL_COMPANY',
            'type' => 'relate',
            'link' => 'companycode',
            'isnull' => 'true',
            'table' => 'companycodes',
            'module' => 'CompanyCodes',
            'source' => 'non-db',
        ],
        'companycode' => [
            'name' => 'companycode',
            'type' => 'link',
            'vname' => 'LBL_COMPANYCODE',
            'relationship' => 'companycode_users',
            'source' => 'non-db',
            'module' => 'CompanyCodes',
        ],
        'costcenter_id' => [
            'name' => 'costcenter_id',
            'vname' => 'LBL_COSTCENTER',
            'type' => 'id',
            'required' => false
        ],
        'costcenter_name' => [
            'name' => 'costcenter_name',
            'rname' => 'name',
            'id_name' => 'costcenter_id',
            'vname' => 'LBL_COSTCENTER',
            'type' => 'relate',
            'link' => 'costcenter',
            'isnull' => 'true',
            'table' => 'costcenters',
            'module' => 'CostCenters',
            'source' => 'non-db',
        ],
        'costcenter' => [
            'name' => 'costcenter',
            'type' => 'link',
            'vname' => 'LBL_COSTCENTER',
            'relationship' => 'costcenter_users',
            'module' => 'CostCenters',
            'source' => 'non-db'
        ],
        'email1' => [
            'name' => 'email1',
            'vname' => 'LBL_EMAIL',
            'type' => 'varchar',
            'source' => 'non-db',
            'group' => 'email1',
            'merge_filter' => 'enabled',
            'required' => true,
        ],
        'email_addresses' => [
            'name' => 'email_addresses',
            'type' => 'link',
            'relationship' => 'users_email_addresses',
            'module' => 'EmailAddress',
            'bean_name' => 'EmailAddress',
            'source' => 'non-db',
            'vname' => 'LBL_EMAIL_ADDRESSES',
            'reportable' => false,
            'required' => false,
        ],
        'email_addresses_primary' => [
            'name' => 'email_addresses_primary',
            'type' => 'link',
            'relationship' => 'users_email_addresses_primary',
            'source' => 'non-db',
            'vname' => 'LBL_EMAIL_ADDRESS_PRIMARY',
            'duplicate_merge' => 'disabled',
            'required' => false,
        ],
        'email_signature' => [
            'vname' => 'LBL_EMAIL_SIGNATURE',
            'name' => 'email_signature',
            'type' => 'html',
        ],
        /* Virtual email fields so they will display on the main user page */
        'email_link_type' => [
            'name' => 'email_link_type',
            'vname' => 'LBL_EMAIL_LINK_TYPE',
            'type' => 'enum',
            'options' => 'dom_email_link_type',
            'importable' => false,
            'reportable' => false,
            'source' => 'non-db',
            'studio' => false,
        ],

        'aclroles' => [
            'name' => 'aclroles',
            'type' => 'link',
            'relationship' => 'acl_roles_users',
            'source' => 'non-db',
            'side' => 'right',
            'vname' => 'LBL_ROLES',
        ],
        'is_group' => [
            'name' => 'is_group',
            'vname' => 'LBL_GROUP_USER',
            'type' => 'bool',
            'massupdate' => false,
            'studio' => ['listview' => false, 'searchview' => false, 'formula' => false],
        ],
        /* to support Meetings SubPanels */
        'c_accept_status_fields' => [
            'name' => 'c_accept_status_fields',
            'rname' => 'id',
            'relationship_fields' => [
                'id' => 'accept_status_id',
                'accept_status' => 'accept_status_name'
            ],
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'type' => 'relate',
            'link' => 'calls',
            'link_type' => 'relationship_info',
            'source' => 'non-db',
            'importable' => 'false',
            'studio' => ['listview' => false, 'searchview' => false, 'formula' => false],
        ],
        'm_accept_status_fields' => [
            'name' => 'm_accept_status_fields',
            'rname' => 'id',
            'relationship_fields' => [
                'id' => 'accept_status_id',
                'accept_status' => 'accept_status_name'
            ],
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'type' => 'relate',
            'link' => 'meetings',
            'link_type' => 'relationship_info',
            'source' => 'non-db',
            'importable' => 'false',
            'studio' => ['listview' => false, 'searchview' => false, 'formula' => false],
        ],
        'accept_status_id' => [
            'name' => 'accept_status_id',
            'type' => 'varchar',
            'source' => 'non-db',
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'importable' => 'false',
            'studio' => ['listview' => false, 'searchview' => false, 'formula' => false],
        ],
        'accept_status_name' => [
            'name' => 'accept_status_name',
            'type' => 'enum',
            'source' => 'non-db',
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'options' => 'dom_meeting_accept_status',
            'massupdate' => false,
            'studio' => ['listview' => false, 'searchview' => false, 'formula' => false],
        ],
        'prospect_lists' => [
            'name' => 'prospect_lists',
            'type' => 'link',
            'relationship' => 'prospect_list_users',
            'module' => 'ProspectLists',
            'source' => 'non-db',
            'vname' => 'LBL_PROSPECT_LIST',
        ],
        'emails_users' => [
            'name' => 'emails_users',
            'type' => 'link',
            'relationship' => 'emails_users_rel',
            'module' => 'Emails',
            'source' => 'non-db',
            'vname' => 'LBL_EMAILS'
        ],
        'eapm' =>
            [
                'name' => 'eapm',
                'type' => 'link',
                'relationship' => 'eapm_assigned_user',
                'vname' => 'LBL_ASSIGNED_TO',
                'source' => 'non-db',
            ],
        'oauth_tokens' =>
            [
                'name' => 'oauth_tokens',
                'type' => 'link',
                'relationship' => 'oauthtokens_assigned_user',
                'vname' => 'LBL_OAUTH_TOKENS',
                'link_type' => 'one',
                'module' => 'OAuthTokens',
                'bean_name' => 'OAuthToken',
                'source' => 'non-db',
                'side' => 'left',
            ],
//        'project_resource' =>
//            array(
//                'name' => 'project_resource',
//                'type' => 'link',
//                'relationship' => 'projects_users_resources',
//                'source' => 'non-db',
//                'vname' => 'LBL_PROJECTS',
//            ),
        'userquotas' => [
            'name' => 'userquotas',
            'type' => 'link',
            'relationship' => 'users_userquotas',
            'source' => 'non-db',
            'vname' => 'LBL_USERQUOTAS',
        ],
        'inbound_processing_allowed' => [
            'name' => 'inbound_processing_allowed',
            'vname' => 'LBL_INBOUND_PROCESSING_ALLOWED',
            'type' => 'bool',
        ],
        //link to the users
        'mailboxes' => [
            'name' => 'mailboxes',
            'vname' => 'LBL_MAILBOXES',
            'module' => 'Mailboxes',
            'type' => 'link',
            'relationship' => 'mailboxes_users',
            'link_type' => 'one',
            'source' => 'non-db'
        ],
        'userabsences' => [
            'name' => 'userabsences',
            'rel_fields' => ['user_id' => ['type' => 'id']],
            'type' => 'link',
            'relationship' => 'users_userabsences',
            'source' => 'non-db',
            'module' => 'UserAbsences'
        ],
        'repabscences' => [
            'name' => 'repabscences',
            'rel_fields' => ['user_id' => ['type' => 'id']],
            'type' => 'link',
            'relationship' => 'representatives_userabsences',
            'source' => 'non-db',
            'module' => 'UserAbsences'
        ],
        // service orders many to many
        'serviceorders' => [
            'name' => 'serviceorders',
            'type' => 'link',
            'relationship' => 'serviceorders_users',
            'module' => 'ServiceOrders',
            'bean_name' => 'ServiceOrder',
            'source' => 'non-db',
            'vname' => 'LBL_SERVICEORDERS'
        ],
        'serviceorder_user_role' => [
            'name' => 'serviceorder_user_role',
            'vname' => 'LBL_ROLE',
            'type' => 'enum',
            'source' => 'non-db',
            'options' => 'serviceorder_user_role_dom'
        ],
        'systemtenant_id' => [
            'name' => 'systemtenant_id',
            'type' => 'varchar',
            'len' => 36,
            'required' => false,
            'vname' => 'LBL_SYSTEM_TENANT_ID',
        ],
        'systemtenant_name' => [
            'name' => 'systemtenant_name',
            'rname' => 'name',
            'id_name' => 'systemtenant_id',
            'link' => 'systemtenant',
            'vname' => 'LBL_SYSTEMTENANT',
            'type' => 'relate',
            'isnull' => 'true',
            'table' => 'systemtenants',
            'module' => 'SystemTenants',
            'source' => 'non-db',
        ],
        'systemtenant' => [
            'name' => 'systemtenant',
            'type' => 'link',
            'vname' => 'LBL_SYSTEMTENANT',
            'relationship' => 'systemtenant_users',
            'module' => 'SystemTenants',
            'source' => 'non-db'
        ],
        'qualifications' => [
            'name' => 'qualifications',
            'rel_fields' => [
                'qualification_start_date' => ['map' => 'bean_qualification_start_date'],
                'qualification_end_date' => ['map' => 'bean_qualification_end_date'],
            ],
            'type' => 'link',
            'relationship' => 'users_qualifications',
            'source' => 'non-db',
            'rname' => 'name',
            'module' => 'Qualifications'
        ],
        'shop_id' => [
            'name' => 'shop_id',
            'vname' => 'LBL_SHOP',
            'type' => 'varchar',
            'len' => 36,
            'required' => false
        ],
        'shop_name' => [
            'name' => 'shop_name',
            'rname' => 'name',
            'id_name' => 'shop_id',
            'vname' => 'LBL_SHOP',
            'type' => 'relate',
            'link' => 'shop',
            'isnull' => 'true',
            'table' => 'shops',
            'module' => 'Shops',
            'source' => 'non-db',
        ],

    ],
    'indices' => [
        [
            'name' => 'userspk',
            'type' => 'primary',
            'fields' => [
                'id'
            ]
        ],
        [
            'name' => 'idx_user_name',
            'type' => 'index',
            'fields' => [
                'user_name',
                'is_group',
                'status',
                'last_name',
                'first_name',
                'id'
            ]
        ]
    ],
    'relationships' => [
        'user_direct_reports' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'reports_to_id',
            'relationship_type' => 'one-to-many'
        ],
        'users_users_signatures' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'UserSignature',
            'rhs_table' => 'users_signatures',
            'rhs_key' => 'user_id',
            'relationship_type' => 'one-to-many'
        ],
        'users_email_addresses' => [
            'lhs_module' => "Users", 'lhs_table' => 'users', 'lhs_key' => 'id',
            'rhs_module' => 'EmailAddresses', 'rhs_table' => 'email_addresses', 'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'email_addr_bean_rel', 'join_key_lhs' => 'bean_id', 'join_key_rhs' => 'email_address_id',
            'relationship_role_column' => 'bean_module',
            'relationship_role_column_value' => "Users"
        ],
        'users_email_addresses_primary' => [
            'lhs_module' => "Users",
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailAddresses', 'rhs_table' => 'email_addresses', 'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'email_addr_bean_rel', 'join_key_lhs' => 'bean_id', 'join_key_rhs' => 'email_address_id',
            'relationship_role_column' => 'primary_address',
            'relationship_role_column_value' => '1'
        ],
        'users_userabsences' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'UserAbsences',
            'rhs_table' => 'userabsences',
            'rhs_key' => 'user_id',
            'relationship_type' => 'one-to-many'
        ],
        'representatives_userabsences' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'UserAbsences',
            'rhs_table' => 'userabsences',
            'rhs_key' => 'representative_id',
            'relationship_type' => 'one-to-many'
        ],
        'companycode_users' => [
            'lhs_module' => 'CompanyCodes',
            'lhs_table' => 'companycodes',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'companycode_id',
            'relationship_type' => 'one-to-many'
        ],
        'costcenter_users' => [
            'lhs_module' => 'CostCenters',
            'lhs_table' => 'costcenters',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'costcenter_id',
            'relationship_type' => 'one-to-many',
            'default' => true
        ],
        'shop_users' => [
            'lhs_module' => 'Shops',
            'lhs_table' => 'shops',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'shop_id',
            'relationship_type' => 'one-to-many'
        ],
    ]
];

//set global else error with PHP7.1: Uncaught Error: Cannot use string offset as an array
global $dictionary;
if (file_exists('modules/ServiceQueues/ServiceQueue.php')) {
    $dictionary['User']['fields']['servicequeues'] = [
        'vname' => 'LBL_SERVICEQUEUES',
        'name' => 'servicequeues',
        'type' => 'link',
        'module' => 'ServiceQueues',
        'bean_name' => 'ServiceQueue',
        'relationship' => 'servicequeues_users',
        'source' => 'non-db'
    ];

}
// CR1000333
if (file_exists('modules/SystemDeploymentReleases/SystemDeploymentRelease.php')) {
    $dictionary['User']['fields']['systemdeploymentreleases'] = [
        'vname' => 'LBL_SYSTEMDEPLOYMENTRELEASES',
        'name' => 'systemdeploymentreleases',
        'type' => 'link',
        'module' => 'SystemDeploymentReleases',
        'bean_name' => 'SystemDeploymentRelease',
        'relationship' => 'systemdeploymentreleases_users',
        'source' => 'non-db'
    ];
}
if (file_exists('modules/SystemDeploymentCRs/SystemDeploymentCR.php')) {
    $dictionary['User']['fields']['cr_user_role'] = [
        'vname' => 'LBL_ROLE',
        'name' => 'cr_user_role',
        'type' => 'multienum',
        'options' => 'cruser_role_dom',
        'source' => 'non-db',
        'comment' => 'representation of user_role column in join table systemdeploymentcrs_users'
    ];
    $dictionary['User']['fields']['systemdeploymentcrs'] = [
        'name' => 'systemdeploymentcrs',
        'type' => 'link',
        'relationship' => 'systemdeploymentcrs_users',
        'source' => 'non-db',
        'vname' => 'LBL_SYSTEMDEPLOYMENTCRS',
        'module' => 'SystemDeploymentCRs',
        'default' => false,
        'comment' => '',
    ];

}
if (is_file("modules/ServiceTickets/ServiceTicket.php")) {
    $dictionary['User']['fields']['servicetickets'] = [
        'name' => 'servicetickets',
        'type' => 'link',
        'relationship' => 'servicetickets_users',
        'source' => 'non-db',
        'vname' => 'LBL_SERVICETICKETS',
        'module' => 'ServiceTickets',
        'default' => false
    ];
}
// Not sure we need this at all.... commented for now
//if (is_file("modules/ServiceEquipments/ServiceEquipment.php")) {
//    $dictionary['User']['fields']['serviceequipments'] = array(
//        'name' => 'serviceequipments',
//        'type' => 'link',
//        'relationship' => 'serviceequipments_users',
//        'source' => 'non-db',
//        'vname' => 'LBL_SERVICEEQUIPMENTS',
//        'module' => 'ServiceEquipments',
//        'default' => false
//    );
//}
if (is_file("modules/Shops/Shop.php")) {
    $dictionary['User']['fields']['shops'] = [
        'name' => 'shops',
        'type' => 'link',
        'vname' => 'LBL_SHOP',
        'relationship' => 'shop_users',
        'rname' => 'name',
        'source' => 'non-db',
        'module' => 'Shops'
    ];
}


