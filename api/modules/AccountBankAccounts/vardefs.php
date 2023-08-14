<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 *
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
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
 *
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/

use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['AccountBankAccount'] = [
    'table' => 'accountbankaccounts',
    'fields' => [
        'account_id' => [
            'name' => 'account_id',
            'type' => 'id',
            'vname' => 'LBL_ACCOUNTS_ID'
        ],
        'account_name' => [
            'source' => 'non-db',
            'name' => 'account_name',
            'vname' => 'LBL_ACCOUNT',
            'type' => 'relate',
            'len' => '255',
            'id_name' => 'account_id',
            'module' => 'Accounts',
            'link' => 'accounts',
            'join_name' => 'accounts',
            'rname' => 'name'
        ],
        'accounts' => [
            'name' => 'accounts',
            'module' => 'Accounts',
            'type' => 'link',
            'relationship' => 'accounts_bankaccounts',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS',
        ],
        'accountnr' => [
            'name' => 'accountnr',
            'type' => 'varchar',
            'len' => 50,
            'vname' => 'LBL_BANKACCOUNTNUMBER'
        ],
        'swift' => [
            'name' => 'swift',
            'type' => 'varchar',
            'len' => 20,
            'vname' => 'LBL_SWIFT'
        ],
        'street' => [
            'name' => 'street',
            'type' => 'varchar',
            'len' => 50,
            'vname' => 'LBL_STREET'
        ],
        'postalcode' => [
            'name' => 'postalcode',
            'type' => 'varchar',
            'len' => 10,
            'vname' => 'LBL_POSTALCODE'
        ]
    ],
    'relationships' => [
        'accounts_bankaccounts' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'AccountBankAccounts',
            'rhs_table' => 'accountbankaccounts',
            'rhs_key' => 'account_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        'id' => ['name' => 'accountbakaccounts_pk', 'type' => 'primary', 'fields' => ['id']],
        'accounts_accountbankaccounts_account_id' => ['name' => 'accounts_accountbankaccounts_account_id', 'type' => 'index', 'fields' => ['account_id']]
    ],
];

VardefManager::createVardef('AccountBankAccounts', 'AccountBankAccount', ['default', 'assignable']);
