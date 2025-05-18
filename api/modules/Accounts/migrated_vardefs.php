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
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['Account'] = [
    'table' => 'accounts',
    'audited' => true,
    'unified_search' => true,
    'full_text_search' => true,
    'unified_search_default_enabled' => true,
    'duplicate_merge' => true,
    'comment' => 'Accounts are organizations or entities that are the target of selling, support, and marketing activities, or have already purchased products or services',
    'fields' => [
//        'parent_name' => [
//            'name' => 'parent_name',
//            'rname' => 'name',
//            'id_name' => 'parent_id',
//            'vname' => 'LBL_MEMBER_OF',
//            'type' => 'relate',
//            'isnull' => 'true',
//            'module' => 'Accounts',
//            'table' => 'accounts',
//            'source' => 'non-db',
//            'len' => 36,
//            'link' => 'member_of',
//            'unified_search' => false,
//            'importable' => 'true',
//        ],
//        'members' => [
//            'name' => 'members',
//            'type' => 'link',
//            'relationship' => 'member_accounts',
//            'module' => 'Accounts',
//            'bean_name' => 'Account',
//            'source' => 'non-db',
//            'vname' => 'LBL_MEMBERS',
//        ],
//        'member_of' => [
//            'name' => 'member_of',
//            'type' => 'link',
//            'relationship' => 'member_accounts',
//            'module' => 'Accounts',
//            'bean_name' => 'Account',
//            'link_type' => 'one',
//            'source' => 'non-db',
//            'vname' => 'LBL_MEMBER_OF',
//            'side' => 'right',
//        ],
    ],
    'relationships' => [
//        'member_accounts' => ['lhs_module' => 'Accounts', 'lhs_table' => 'accounts', 'lhs_key' => 'id',
//            'rhs_module' => 'Accounts', 'rhs_table' => 'accounts', 'rhs_key' => 'parent_id',
//            'relationship_type' => 'one-to-many'
//        ],
    ],
];




