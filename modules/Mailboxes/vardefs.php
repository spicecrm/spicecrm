<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
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

$dictionary['Mailbox'] = [
    'table'                          => 'mailboxes',
    'audited'                        => true,
    'unified_search'                 => true,
    'full_text_search'               => true,
    'unified_search_default_enabled' => true,
    'duplicate_merge'                => false,

    'fields' => [

        // general Mailbox fields
        'name' => [
            'name'    => 'name',
            'vname'   => 'LBL_NAME',
            'type'    => 'varchar',
            'comment' => 'Mailbox name'
        ],
        'description' => [
            'name'    => 'description',
            'vname'   => 'LBL_DESCRIPTION',
            'type'    => 'varchar',
            'comment' => 'Mailbox description'
        ],
        'transport' => [
            'name'    => 'transport',
            'vname'   => 'LBL_TRANSPORT',
            'type'    => 'enum',
            'len'     => 15,
            'options' => 'mailboxes_transport_dom',
            'comment' => 'Mailbox transport method'
        ],
        'inbound_comm' => [
            'name'    => 'inbound_comm',
            'vname'   => 'LBL_INBOUND_COMM',
            'type'    => 'bool',
            'comment' => 'Inbound communication permitted flag',
        ],
        'outbound_comm' => [
            'name'    => 'outbound_comm',
            'vname'   => 'LBL_OUTBOUND_COMM',
            'type'    => 'enum',
            'len'     => 15,
            'options' => 'mailboxes_outbound_comm',
            'comment' => 'Outbound communication type'
        ],
        'last_message' => [
            'name'    => 'last_message',
            'vname'   => 'LBL_LAST_MESSAGE',
            'type'    => 'varchar',
            'length'  => 255,
            'comment' => 'ID of the last downloaded email'
        ],
        // IMAP / POP3 fields
        'imap_pop3_host' => [
            'name'    => 'imap_pop3_host',
            'vname'   => 'LBL_HOST',
            'type'    => 'varchar',
            'comment' => 'imap / pop3 host',
        ],
        'imap_pop3_port' => [
            'name'    => 'imap_pop3_port',
            'vname'   => 'LBL_PORT',
            'type'    => 'int',
            'comment' => 'imap / pop3 port',
        ],
        'imap_pop3_data_valid' => [
            'name'    => 'imap_pop3_data_valid',
            'vname'   => 'LBL_IPDV',
            'type'    => 'bool',
            'value'   => 'false',
            'hidden'  => 'true',
            'comment' => 'imap_pop3_data_valid validation'
        ],
        'imap_pop3_protocol_type' => [
            'name'    => 'imap_pop3_protocol_type',
            'vname'   => 'LBL_PROTOCOL',
            'type'    => 'enum',
            'options' => 'mailboxes_imap_pop3_protocol_dom',
            'comment' => 'imap_pop_dropdown_to_choose'
        ],
        'imap_pop3_encryption' => [
            'name'    => 'imap_pop3_encryption',
            'vname'   => 'LBL_ENCRYPTION',
            'type'    => 'enum',
            'options' => 'mailboxes_imap_pop3_encryption_dom',
            'comment' => 'imap_pop_encryption_set'
        ],
        'imap_pop3_username' => [
            'name'    => 'imap_pop3_username',
            'vname'   => 'LBL_USER_NAME',
            'type'    => 'varchar',
            'comment' => 'username',
        ],
        'imap_pop3_password' => [
            'name'    => 'imap_pop3_password',
            'vname'   => 'LBL_PASSWORD',
            'type'    => 'varchar',
            'comment' => 'password',
        ],
        'imap_inbox_dir' => [
            'name'    => 'imap_inbox_dir',
            'vname'   => 'LBL_INBOX_DIR',
            'value'   => 'No Files',
            'type'    => 'enum',
            'comment' => 'imap_inbox_dir popup window to choose directory of imap'
        ],
        'imap_sent_dir' => [
            'name'    => 'imap_sent_dir',
            'vname'   => 'LBL_IMAP_SENT_DIR',
            'type'    => 'enum',
            'comment' => 'imap_sent_dir popup window to choose directory of imap'
        ],
        'imap_trash_dir' => [
            'name'    => 'imap_trash_dir',
            'vname'   => 'LBL_IMAP_TRASH_DIR',
            'type'    => 'enum',
            'comment' => 'imap_trash_dir popup window to choose directory of imap'
        ],

        // SMTP fields
        'smtp_host' => [
            'name'    => 'smtp_host',
            'vname'   => 'LBL_HOST',
            'type'    => 'varchar',
            'comment' => 'smtp host',
        ],
        'smtp_port' => [
            'name'    => 'smtp_port',
            'vname'   => 'LBL_PORT',
            'type'    => 'int',
            'comment' => 'smtp port',
            'default' => 25,
        ],
        'smtp_auth' => [
            'name'    => 'smtp_auth',
            'vname'   => 'LBL_AUTH_ENABLED',
            'type'    => 'bool',
            'comment' => 'smtp authentication enabled',
            'default' => 0,
        ],
        'smtp_encryption' => [
            'name'    => 'smtp_encryption',
            'vname'   => 'LBL_ENCRYPTION',
            'type'    => 'enum',
            'options' => 'mailboxes_smtp_encryption_dom',
            'comment' => 'smtp_encryption_set'
        ],
        'smtp_verify_peer' => [
            'name'    => 'smtp_verify_peer',
            'vname'   => 'LBL_VERIFY_PEER',
            'type'    => 'bool',
            'comment' => 'smtp verify peer',
            'default' => 0,
        ],
        'smtp_verify_peer_name' => [
            'name'    => 'smtp_verify_peer_name',
            'vname'   => 'LBL_VERIFY_PEER_NAME',
            'type'    => 'bool',
            'comment' => 'smtp verify peer name',
            'default' => 0,
        ],
        'smtp_allow_self_signed' => [
            'name'    => 'smtp_allow_self_signed',
            'vname'   => 'LBL_ALLOW_SELF_SIGNED',
            'type'    => 'bool',
            'comment' => 'smtp allow self signed',
            'default' => 1,
        ],
        'emails' => [
            'name'            => 'emails',
            'vname'           => 'LBL_EMAILS_LINK',
            'type'            => 'link',
            'relationship'    => 'mailboxes_emails_rel',
            'link_type'       => 'one',
            'source'          => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate'      => false,
            'module'          => 'Emails',
            'bean_name'       => 'Email',
        ],
        'sysmailrelais_id' => [
            'name'    => 'sysmailrelais_id',
            'vname'   => 'LBL_SYSMAILRELAIS_ID',
            'type'    => 'varchar',
            'comment' => 'FK to SYSMAILRELAIS',
        ],
        //link to the campaigns
        'campaigns' => [
            'name'            => 'campaigns',
            'vname'           => 'LBL_CAMPAIGNS_LINK',
            'type'            => 'link',
            'relationship'    => 'campaigns_mailboxes_rel',
            'link_type'       => 'one',
            'source'          => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate'      => false,
        ],
    ],
    'relationships' => [
        'mailboxes_emails_rel' => [
            'lhs_module'        => 'Mailboxes',
            'lhs_table'         => 'mailboxes',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Emails',
            'rhs_table'         => 'emails',
            'rhs_key'           => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ],
        'campaigns_mailboxes_rel' => [
            'lhs_module'        => 'Mailboxes',
            'lhs_table'         => 'mailboxes',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Campaigns',
            'rhs_table'         => 'campaigns',
            'rhs_key'           => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ],
    ],

    'indices' => [],

    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

VardefManager::createVardef('Mailboxes', 'Mailbox', ['default', 'assignable']);
