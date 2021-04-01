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
$dictionary['ldap_settings'] = [
    'table' => 'ldap_settings',
    'fields' => [
        'id' => [
            'name'     => 'id',
            'vname'    => 'LBL_ID',
            'type'     => 'id',
            'required' => true,
            'comment'  => 'Unique identifier',
        ],
        'date_entered' => [
            'name'     => 'date_entered',
            'vname'    => 'LBL_DATE_ENTERED',
            'type'     => 'datetime',
            'required' => true,
        ],
        'date_modified' => [
            'name'     => 'date_modified',
            'vname'    => 'LBL_DATE_MODIFIED',
            'type'     => 'datetime',
            'required' => true,
        ],
        'deleted' => [
            'name'       => 'deleted',
            'vname'      => 'LBL_DELETED',
            'type'       => 'bool',
            'required'   => false,
            'reportable' => false,
        ],
        'hostname' => [
            'name'     => 'hostname',
            'vname'    => 'LBL_HOSTNAME',
            'type'     => 'varchar',
            'len'      => 255,
            'required' => true,
        ],
        'port' => [
            'name'     => 'port',
            'vname'    => 'LBL_PORT',
            'type'     => 'varchar',
            'len'      => 5,
        ],
        'base_dn' => [
            'name'     => 'base_dn',
            'vname'    => 'LBL_BASE_DN',
            'type'     => 'varchar',
            'len'      => 50,
        ],
        'login_filter' => [
            'name'     => 'login_filter',
            'vname'    => 'LBL_LOGIN_FILTER',
            'type'     => 'varchar',
            'len'      => 50,
        ],
        'bind_attr' => [
            'name'     => 'bind_attr',
            'vname'    => 'LBL_BIND_ATTR',
            'type'     => 'varchar',
            'len'      => 50,
        ],
        'login_attr' => [
            'name'     => 'login_attr',
            'vname'    => 'LBL_LOGIN_ATTR',
            'type'     => 'varchar',
            'len'      => 50,
        ],
        'admin_user' => [
            'name'     => 'admin_user',
            'vname'    => 'LBL_ADMIN_USER',
            'type'     => 'varchar',
            'len'      => 50,
        ],
        'admin_password' => [
            'name'     => 'admin_password',
            'vname'    => 'LBL_ADMIN_PASSWORD',
            'type'     => 'varchar',
            'len'      => 255,
        ],
        'auto_create_users' => [
            'name'     => 'auto_create_users',
            'vname'    => 'LBL_AUTO_CREATE_USERS',
            'type'     => 'bool',
            'len'      => 1,
            'required' => false,
            'default'  => '0',
        ],
        'is_active' => [
            'name'     => 'is_active',
            'vname'    => 'LBL_IS_ACTIVE',
            'type'     => 'bool',
            'len'      => 1,
            'required' => false,
            'default'  => '0',
        ],
        'priority' => [
            'name'     => 'priority',
            'vname'    => 'LBL_PRIORITY',
            'type'     => 'varchar',
            'len'      => 3,
        ],
        'ldap_authentication' => [
            'name'    => 'ldap_authentication',
            'vname'   => 'LBL_LDAP_AUTHENTICATION',
            'type'    => 'bool',
            'comment' => '1 means LDAP auth is necessary, 0 means LDAP auth is not necessary',
        ],
        'ldap_username_attribute' => [
            'name'    => 'ldap_username_attribute',
            'vname'   => 'LDAP_USERNAME_ATTRIBUTE',
            'type'    => 'varchar',
            'len'     => 50,
            'comment' => '',
        ],
        'ldap_acl' => [
            'name'    => 'ldap_acl',
            'vname'   => 'LDAP_ACL',
            'type'    => 'bool',
            'comment' => 'defines whether the acl authorizations are controlled exclusively via ldap',
        ],
        'ldap_groups' => [
            'name'    => 'ldap_groups',
            'vname'   => 'LBL_LDAP_GROUPS',
            'type'    => 'text',
            'comment' => 'comma seperated list of ldap groups',
        ],
    ],
    'indices' => [
        [
            'name'   => 'ldap_settingspk',
            'type'   => 'primary',
            'fields' => ['id'],
        ]
    ],
];