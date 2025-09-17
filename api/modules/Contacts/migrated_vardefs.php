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
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Contact'] = [
    'table' => 'contacts',
    'audited' => true,
    'fields' =>
        [
//            'account_name' => [
//                'name' => 'account_name',
//                'rname' => 'name',
//                'id_name' => 'account_id',
//                'vname' => 'LBL_ACCOUNT_NAME',
//                'join_name' => 'accounts',
//                'type' => 'relate',
//                'link' => 'accounts',
//                'table' => 'accounts',
//                'isnull' => 'true',
//                'module' => 'Accounts',
//                'dbType' => 'varchar',
//                'len' => '255',
//                'source' => 'non-db',
//                'unified_search' => false,
//            ],
//            'account_id' => [
//                'name' => 'account_id',
//                'rname' => 'id',
//                'id_name' => 'account_id',
//                'vname' => 'LBL_ACCOUNT_ID',
//                'type' => 'varchar',
//                'link' => 'accounts',
//                'table' => 'accounts',
//                'isnull' => 'true',
//                'module' => 'Accounts',
//                'dbType' => 'id',
//                'reportable' => false,
//                'source' => 'non-db',
//                'duplicate_merge' => false,
//                'hideacl' => true,
//            ]
        ],
    'indices' => [
        [
            'name' => 'idx_cont_last_first',
            'type' => 'index',
            'fields' => ['last_name', 'first_name', 'deleted']
        ],
        [
            'name' => 'idx_contacts_del_last',
            'type' => 'index',
            'fields' => ['deleted', 'last_name'],
        ],
        [
            'name' => 'idx_cont_del_reports',
            'type' => 'index',
            'fields' => ['deleted', 'reports_to_id', 'last_name']
        ],
        [
            'name' => 'idx_reports_to_id',
            'type' => 'index',
            'fields' => ['reports_to_id'],
        ],
        [
            'name' => 'idx_del_id_user',
            'type' => 'index',
            'fields' => ['deleted', 'id', 'assigned_user_id'],
        ],
        [
            'name' => 'idx_cont_assigned',
            'type' => 'index',
            'fields' => ['assigned_user_id']
        ],
        [
            'name' => 'idx__cont__portal_user_id__del',
            'type' => 'index',
            'fields' => ['portal_user_id','deleted']
        ]
    ],
//    'relationships' => [
//        'contact_direct_reports' => ['lhs_module' => 'Contacts',
//            'lhs_table' => 'contacts',
//            'lhs_key' => 'id',
//            'rhs_module' => 'Contacts',
//            'rhs_table' => 'contacts',
//            'rhs_key' => 'reports_to_id',
//            'relationship_type' => 'one-to-many'],
//    ]
];

// CE version has not all modules...
//set global else error with PHP7.1: Uncaught Error: Cannot use string offset as an array
//if (file_exists("extensions/modules/SalesDocs")) {
//    SpiceDictionaryHandler::getInstance()->dictionary['Contact']['fields']['salesdocsop'] = [
//        'name' => 'salesdocsop',
//        'type' => 'link',
//        'vname' => 'LBL_SALESDOCSOP',
//        'relationship' => 'salesdocs_contactsop',
//        'module' => 'SalesDocs',
//        'source' => 'non-db',
//    ];
//    SpiceDictionaryHandler::getInstance()->dictionary['Contact']['fields']['salesdocsrp'] = [
//        'name' => 'salesdocsrp',
//        'type' => 'link',
//        'vname' => 'LBL_SALESDOCSRP',
//        'relationship' => 'salesdocs_contactsrp',
//        'module' => 'SalesDocs',
//        'source' => 'non-db',
//    ];
//    SpiceDictionaryHandler::getInstance()->dictionary['Contact']['fields']['salesdocs'] = [
//        'name' => 'salesdocs',
//        'type' => 'link',
//        'vname' => 'LBL_SALESDOCS',
//        'relationship' => 'salesdocs_contacts',
//        'module' => 'SalesDocs',
//        'source' => 'non-db',
//    ];
//}

//if (file_exists("extensions/modules/ProcurementDocs")) {
//    SpiceDictionaryHandler::getInstance()->dictionary['Contact']['fields']['procurementdoc'] = [
//        'name' => 'procurementdoc',
//        'type' => 'link',
//        'vname' => 'LBL_PROCUREMENTDOCS',
//        'relationship' => 'procurementdocs_contacts',
//        'module' => 'ProcurementDocs',
//        'source' => 'non-db'
//    ];
//}

//if (file_exists("extensions/modules/ContactsOnlineProfiles")) {
//    SpiceDictionaryHandler::getInstance()->dictionary['Contact']['fields']['contactsonlineprofiles'] = [
//        'name' => 'contactsonlineprofiles',
//        'type' => 'link',
//        'vname' => 'LBL_CONTACTSONLINEPROFILES',
//        'relationship' => 'contact_contactonlineprofiles',
//        'module' => 'ContactsOnlineProfiles',
//        'source' => 'non-db',
//    ];
//}
//if (file_exists("extensions/modules/ContactCCDetails")) {
//    SpiceDictionaryHandler::getInstance()->dictionary['Contact']['fields']['contactccdetails'] = [
//        'name' => 'contactccdetails',
//        'vname' => 'LBL_CONTACTCCDETAILS',
//        'type' => 'link',
//        'relationship' => 'contacts_contactccdetails',
//        'link_type' => 'one',
//        'source' => 'non-db',
//        'duplicate_merge' => false,
//        'default' => true, //UI: load related beans on contact load. module property required!
//        'module' => 'ContactCCDetails'
//    ];
//}
//if (file_exists("extensions/modules/ServiceOrders")) {
//    SpiceDictionaryHandler::getInstance()->dictionary['Contact']['fields']['serviceorders'] = [
//        'name' => 'serviceorders',
//        'type' => 'link',
//        'relationship' => 'serviceorders_contacts',
//        'source' => 'non-db',
//        'vname' => 'LBL_SERVICEORDERS',
//        'module' => 'ServiceOrders',
//        'default' => false
//    ];
//}