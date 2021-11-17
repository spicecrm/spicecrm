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

/*********************************************************************************

 * Description:
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc. All Rights
 * Reserved. Contributor(s): ______________________________________..
 *********************************************************************************/

/**
 * Stub class to allow Link class easily use SugarEmailAddress
 */

use SpiceCRM\includes\SugarObjects\VardefManager;

global $dictionary;

/**
 * Core email_address table
 */
$dictionary['EmailAddress'] = [
    'table' => 'email_addresses',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'vname' => 'LBL_EMAIL_ADDRESS_ID',
            'required' => true,
        ],
        'email_address' => [
            'name' => 'email_address',
            'type' => 'varchar',
            'vname' => 'LBL_EMAIL_ADDRESS',
            'length' => 100,
            'required' => true,
        ],
        'email_address_caps' => [
            'name' => 'email_address_caps',
            'type' => 'varchar',
            'vname' => 'LBL_EMAIL_ADDRESS_CAPS',
            'length' => 100,
            'required' => true,
            'reportable' => false,
        ],
        'invalid_email' => [
            'name' => 'invalid_email',
            'type' => 'bool',
            'default' => 0,
            'vname' => 'LBL_INVALID_EMAIL',
        ],
        'opt_out' => [
            'name' => 'opt_out',
            'type' => 'bool',
            'default' => 0,
            'vname' => 'LBL_OPT_OUT',
        ],
        'date_created' => [
            'name' => 'date_created',
            'type' => 'datetime',
            'vname' => 'LBL_DATE_CREATE',
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime',
            'vname' => 'LBL_DATE_MODIFIED',
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'vname' => 'LBL_DELETED',
        ],
        'primary_address' => [
            'name' => 'primary_address',
            'type' => 'bool',
            'source' => 'non-db',
            'vname' => 'LBL_PRIMARY_ADDRESS'
        ],
        'opt_in_status' => [
            'name' => 'opt_in_status',
            'type' => 'varchar',
            'source' => 'non-db',
            'comment' => 'possible values opted_in, opted_out, pending'
        ],
    ],
    'indices' => [
        [
            'name' => 'edremail_adssespk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_ea_caps_opt_out_invalid',
            'type' => 'index',
            'fields' => ['email_address_caps', 'opt_out', 'invalid_email']
        ],
        [
            'name' => 'idx_ea_opt_out_invalid',
            'type' => 'index',
            'fields' => ['email_address', 'opt_out', 'invalid_email']
        ],
    ],
];

VardefManager::createVardef('EmailAddresses', 'EmailAddress', []);

if(file_exists('custom/metadata/email_addressesMetaData.php')) {
  include('custom/metadata/email_addressesMetaData.php');
} else {
  include('metadata/email_addressesMetaData.php');
}

if(file_exists('custom/metadata/emails_beansMetaData.php')) {
  include('custom/metadata/emails_beansMetaData.php');
} else {
  include('metadata/emails_beansMetaData.php');
}
