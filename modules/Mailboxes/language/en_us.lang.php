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

/*********************************************************************************
 * Description:  Defines the English language pack for the base application.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/

$mod_strings = array(
    //=> panels
    'LBL_MAINDATA' => 'Main Data',
    'LBL_IMAP_POP3' => 'IMAP POP3 protocol',
    'LBL_SMTP' => 'SMTP protocol',
    'LBL_PANEL_ASSIGNMENT' => 'Other',

//=> menu
    'LBL_MODULE_NAME' => 'Mailboxes',
    'LBL_MODULE_ID' => 'Mailbox ID',
    'LNK_NEW_MAILBOX' => 'Create Mailboxes',
    'LNK_MAILBOX_LIST' => 'View Mailboxes',
    'LNK_IMPORT_MAILBOXES' => 'Import Mailboxes',

//=> fields
    'LBL_NAME' => 'Name',
    'LBL_DESCRIPTION' => 'Description',
    'LBL_MAILBOX' => 'Mailbox',
    'LBL_TITLE' => 'Title',
    'LBL_RELAIS' => 'Relais',
    'LBL_EMAILS_SUBPANEL_TITLE' => 'Emails',

    // common email protocol fields
    'LBL_HOST' => 'Host',
    'LBL_PORT' => 'Port',
    'LBL_USERNAME' => 'Username',
    'LBL_PASSWORD' => 'Password',

    // IMAP/POP3 protocol fields
    'LBL_HOST_IMAP_POP3' => 'IMAP/POP3 host',
    'LBL_PORT_IMAP_POP3' => 'IMAP/POP3 port',
    'LBL_USERNAME_IMAP_POP3' => 'IMAP/POP3 username',
    'LBL_PASSWORD_IMAP_POP3' => 'IMAP/POP3 password',
    'LBL_PROTOCOL_TYPE' => 'Protocol:',
    'LBL_ENCRYPTION' => 'Encryption: ',
    'LBL_IMAP_INBOX_DIR' => 'Imap directory',
    'LBL_CAMPAIGNs' => 'Campaigns',

    // SMTP fields
    'LBL_HOST_SMTP' => 'SMTP host',
    'LBL_PORT_SMTP' => 'SMTP port',
    'LBL_USERNAME_SMTP' => 'SMTP username',
    'LBL_PASSWORD_SMTP' => 'SMTP password',
    'LBL_AUTH_TYPE' => 'Authentication type',
    'LBL_AUTH_ENABLED' => 'Authentication',
    'LBL_DEBUG' => 'Debug information',

//    'LBL_CONTACT_INFORMATION' => 'Contact information',


//=> links
    'LBL_TEST_CONN_SMTP_BUTTON' => 'Test SMTP',
    'LBL_TEST_CONN_IMAP_POP3_BUTTON' => 'Test IMAP / POP3',
    'LBL_SEND_EMAIL_BUTTON' => 'Send email',
    'LBL_SEND_EMAIL_DIALOG' => 'Send an email to...',
    'LBL_IMAP_DIR' => 'Choose IMAP directory...',

//=> subpanels
    'LBL_CAMPAIGNS_SUBPANEL_TITLE' => 'Campaigns',


//=> test email strings
    'EMAIL_SUBJECT' => 'Test email',
    'EMAIL_BODY' => 'This is a body of a test email.'

);
