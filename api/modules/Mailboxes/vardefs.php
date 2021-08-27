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
$dictionary['Mailbox'] = [
    'table' => 'mailboxes',
    'audited' => false,
    'unified_search' => true,
    'full_text_search' => true,
    'unified_search_default_enabled' => true,
    'duplicate_merge' => false,

    'fields' => [
        'transport' => [
            'name' => 'transport',
            'vname' => 'LBL_TRANSPORT',
            'type' => 'mailboxtransport',
            'dbtype' => 'varchar',
            'len' => 15,
            //'options' => 'mailboxes_transport_dom',
            'comment' => 'Mailbox transport method'
        ],
        'inbound_comm' => [
            'name' => 'inbound_comm',
            'vname' => 'LBL_INBOUND_COMM',
            'type' => 'bool',
            'comment' => 'Inbound communication permitted flag',
        ],
        'outbound_comm' => [
            'name' => 'outbound_comm',
            'vname' => 'LBL_OUTBOUND_COMM',
            'type' => 'enum',
            'len' => 15,
            'options' => 'mailboxes_outbound_comm',
            'comment' => 'Outbound communication type'
        ],
        'last_checked' => [
            'name' => 'last_checked',
            'vname' => 'LBL_LAST_CHECKED',
            'type' => 'datetime',
            'audited' => false,
            'comment' => 'Date when the emails were fetched the last time',
        ],
        'settings' => [
            'name' => 'settings',
            'vname' => 'LBL_SETTINGS',
            'type' => 'json',
            'dbType' => 'text',
            'comment' => 'JSON containing all the mailbox settings',
        ],
        'mailbox_header' => [
            'name' => 'mailbox_header',
            'vname' => 'LBL_HEADER',
            'type' => 'html',
            'dbType' => 'text',
            'comment' => 'A header that will be added to all emails sent from a mailbox',
        ],
        'mailbox_footer' => [
            'name' => 'mailbox_footer',
            'vname' => 'LBL_FOOTER',
            'type' => 'html',
            'dbType' => 'text',
            'comment' => 'A footer that will be added to all emails sent from a mailbox',
        ],
        'is_default' => [
            'name' => 'is_default',
            'vname' => 'LBL_DEFAULT_MAILBOX',
            'type' => 'bool',
            'comment' => 'System default mailbox flag',
        ],
        'active' => [
            'name' => 'active',
            'vname' => 'LBL_ACTIVE',
            'type' => 'bool',
            'default' => true,
            'comment' => 'Mailbox active flag',
        ],
        'hidden' => [
            'name' => 'hidden',
            'vname' => 'LBL_HIDDEN',
            'type' => 'bool',
            'default' => false,
            'comment' => 'Mailbox hidden flag',
        ],
        'catch_all_address' => [
            'name' => 'catch_all_address',
            'vname' => 'LBL_CATCH_ALL_ADDRESS',
            'type' => 'varchar',
            'comment' => 'Catch All address for debugging',
        ],
        'emails' => [
            'name' => 'emails',
            'vname' => 'LBL_EMAILS_LINK',
            'type' => 'link',
            'relationship' => 'mailboxes_emails_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
            'module' => 'Emails',
            'bean_name' => 'Email',
        ],
        'sysmailrelais_id' => [
            'name' => 'sysmailrelais_id',
            'vname' => 'LBL_SYSMAILRELAIS_ID',
            'type' => 'varchar',
            'comment' => 'FK to SYSMAILRELAIS',
        ],
        'actionset' => [
            'name' => 'actionset',
            'vname' => 'LBL_ACTIONSET',
            'type' => 'actionset',
            'dbtype' => 'varchar',
            'len' => '36'
        ],
        'stylesheet' => [
            'name' => 'stylesheet',
            'vname' => 'LBL_STYLESHEET',
            'type' => 'id',
            'len' => '36',
        ],
        //link to the campaigns
        'campaigns' => [
            'name' => 'campaigns',
            'vname' => 'LBL_CAMPAIGNS_LINK',
            'type' => 'link',
            'relationship' => 'campaigns_mailboxes_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ],
        //link to the users
        'users' => [
            'name' => 'users',
            'vname' => 'LBL_USERS',
            'module' => 'Users',
            'type' => 'link',
            'relationship' => 'mailboxes_users',
            'link_type' => 'one',
            'source' => 'non-db'
        ],
        'mailbox_processors' => [
            'name' => 'mailbox_processors',
            'source' => 'non-db',
        ],
        'mailboxprocessors' => [
            'name' => 'mailboxprocessors',
            'type' => 'link',
            'module' => 'MailboxProcessors',
            'relationship' => 'mailboxes_mailbox_processors',
            'source' => 'non-db',
            'default' => true,
        ],
        'log_level' => [
            'name' => 'log_level',
            'vname' => 'LBL_LOG_LEVEL',
            'type' => 'enum',
            'len' => 1,
            'options' => 'mailboxes_log_levels',
        ],
        'email_signature' => [
            'vname' => 'LBL_EMAIL_SIGNATURE',
            'name' => 'email_signature',
            'type' => 'html',
        ],
    ],
    'relationships' => [
        'mailboxes_emails_rel' => [
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'Emails',
            'rhs_table' => 'emails',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ],
        'campaigns_mailboxes_rel' => [
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'Campaigns',
            'rhs_table' => 'campaigns',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ],
        'users' => [
            'vname' => 'LBL_USERS',
            'name' => 'users',
            'type' => 'link',
            'module' => 'Users',
            'bean_name' => 'User',
            'relationship' => 'mailboxes_users',
            'source' => 'non-db'
        ],
        'mailboxes_mailbox_processors' => [
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'MailboxProcessors',
            'rhs_table' => 'mailbox_processors',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many'
        ],

    ],
    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

VardefManager::createVardef('Mailboxes', 'Mailbox', ['default', 'assignable']);
