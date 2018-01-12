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

$dictionary['Mailbox'] = array('table' => 'mailboxes', 'audited' => true,

    'unified_search' => true,
    'full_text_search' => true,
    'unified_search_default_enabled' => true,
    'duplicate_merge' => false,

    'fields' => array(

        // general Mailbox fields
        'name' => array(
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'comment' => 'Mailbox name'
        ),
        'description' => array(
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'varchar',
            'comment' => 'Mailbox description'
        ),

        // IMAP / POP3 fields
        'imap_pop3_host' => array(
            'name' => 'imap_pop3_host',
            'vname' => 'LBL_HOST_IMAP_POP3',
            'type' => 'varchar',
            'comment' => 'imap / pop3 host',
        ),
        'imap_pop3_port' => array(
            'name' => 'imap_pop3_port',
            'vname' => 'LBL_PORT_IMAP_POP3',
            'type' => 'int',
            'comment' => 'imap / pop3 port',
        ),
        'imap_pop3_data_valid' => array(
            'name' => 'imap_pop3_data_valid',
            'vname' => 'LBL_IPDV',
            'type' => 'bool',
            'value' => 'false',
            'hidden' => 'true',
            'comment' => 'imap_pop3_data_valid validation'
        ),
        'imap_pop3_protocol_type' => array(
            'name' => 'imap_pop3_protocol_type',
            'vname' => 'LBL_PROTOCOL_TYPE',
            'type' => 'enum',
            'options' => 'mailboxes_imap_pop3_protocol_dom',
            'comment' => 'imap_pop_dropdown_to_choose'
        ),
        'imap_pop3_encryption' => array(
            'name' => 'imap_pop3_encryption',
            'vname' => 'LBL_ENCRYPTION',
            'type' => 'enum',
            'options' => 'mailboxes_imap_pop3_encryption_dom',
            'comment' => 'imap_pop_encryption_set'
        ),
        'imap_pop3_username' => array(
            'name' => 'imap_pop3_username',
            'vname' => 'LBL_USERNAME_IMAP_POP3',
            'type' => 'varchar',
            'comment' => 'username',
        ),
        'imap_pop3_password' => array(
            'name' => 'imap_pop3_password',
            'vname' => 'LBL_PASSWORD_IMAP_POP3',
            'type' => 'varchar',
            'comment' => 'password',
        ),

        // SMTP fields
        'smtp_host' => array(
            'name' => 'smtp_host',
            'vname' => 'LBL_HOST_SMTP',
            'type' => 'varchar',
            'comment' => 'smtp host',
        ),
        'smtp_port' => array(
            'name' => 'smtp_port',
            'vname' => 'LBL_PORT_SMTP',
            'type' => 'int',
            'comment' => 'smtp port',
            'default' => 25,
        ),
        'smtp_debug' => array(
            'name' => 'smtp_debug',
            'vname' => 'LBL_DEBUG',
            'type' => 'int',
            'comment' => 'smtp debug information',
            'default' => 0,
        ),
        'smtp_auth' => array(
            'name' => 'smtp_auth',
            'vname' => 'LBL_AUTH_ENABLED',
            'type' => 'bool',
            'comment' => 'smtp authentication enabled',
            'default' => 0,
        ),
        'smtp_username' => array(
            'name' => 'smtp_username',
            'vname' => 'LBL_USERNAME_SMTP',
            'type' => 'varchar',
            'comment' => 'username',
        ),
        'smtp_password' => array(
            'name' => 'smtp_password',
            'vname' => 'LBL_PASSWORD_SMTP',
            'type' => 'varchar',
            'comment' => 'password',
        ),
        'smtp_auth_type' => array(
            'name' => 'smtp_auth_type',
            'vname' => 'LBL_AUTH_TYPE',
            'type' => 'enum',
            'options' => 'smtp_authentication_types',
            'comment' => 'authentication type'
        ),
        'imap_inbox_dir' => array(
            'name' => 'imap_inbox_dir',
            'vname' => 'LBL_IMAP_INBOX_DIR',
            'value' => 'No Files',
            'type' => 'text',
            'comment' => 'imap_inbox_dir popup window to choose directory of imap'
        ),
        'emails' => array(
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
        ),
        'sysmailrelais_id' => array(
            'name' => 'sysmailrelais_id',
            'vname' => 'LBL_SYSMAILRELAIS_ID',
            'type' => 'varchar',
            'comment' => 'FK to SYSMAILRELAIS',
        ),
        //link to the campaigns
        'campaigns' => array(
            'name' => 'campaigns',
            'vname' => 'LBL_CAMPAIGNS_LINK',
            'type' => 'link',
            'relationship' => 'campaigns_mailboxes_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ),
    ),
    'relationships' => array(
        'mailboxes_emails_rel' => array(
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'Emails',
            'rhs_table' => 'emails',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ),
        'campaigns_mailboxes_rel' => array(
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'Campaigns',
            'rhs_table' => 'campaigns',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ),
    ),

    'indices' => array(),

    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
);

VardefManager::createVardef('Mailboxes', 'Mailbox', array('default', 'assignable'));
