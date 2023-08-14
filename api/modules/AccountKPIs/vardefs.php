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

SpiceDictionaryHandler::getInstance()->dictionary['AccountKPI'] = [
    'table' => 'accountkpis',
    'fields' => [
        'account_id' => [
            'name' => 'account_id',
            'type' => 'id',
            'vname' => 'LBL_ACCOUNT_ID'
        ],
        'account_name' => [
            'source' => 'non-db',
            'name' => 'account_name',
            'vname' => 'LBL_ACCOUNT',
            'type' => 'relate',
            'len' => '255',
            'id_name' => 'account_id',
            'module' => 'Accounts',
            'link' => 'accounts_link',
            'join_name' => 'accounts',
            'rname' => 'name'
        ],
        'accounts_link' => [
            'name' => 'accounts_link',
            'type' => 'link',
            'relationship' => 'accounts_accountkpis',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS',
        ],
        'companycode_id' => [
            'name' => 'companycode_id',
            'type' => 'varchar',
            'len' => 36,
            'vname' => 'LBL_COMPANYCODE_ID'
        ],
        'companycode_name' => [
            'source' => 'non-db',
            'name' => 'companycode_name',
            'vname' => 'LBL_COMPANYCODE',
            'type' => 'relate',
            'len' => '255',
            'id_name' => 'companycode_id',
            'module' => 'CompanyCodes',
            'link' => 'companycodes_link',
            'join_name' => 'companycodes',
            'rname' => 'name'
        ],
        'companycodes_link' => [
            'name' => 'companycodes_link',
            'type' => 'link',
            'relationship' => 'companycodes_accountkpis',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_COMPANYCODES',
        ],
        'year' => [
            'name' => 'year',
            'type' => 'int',
            'vname' => 'LBL_YEAR'
        ],
        'period' => [
            'name' => 'period',
            'type' => 'varchar',
            'vname' => 'LBL_PERIOD',
            'len' => 10
        ],
        'period_date' => [
            'name' => 'period_date',
            'type' => 'date',
            'vname' => 'LBL_PERIOD'
        ],
        'revenue' => [
            'name' => 'revenue',
            'vname' => 'LBL_REVENUE',
            'type' => 'currency',
            'dbType' => 'double',
            'required' => true,
            'options' => 'numeric_range_search_dom',
            'enable_range_search' => true,
        ],
        'quantity' => [
            'name' => 'quantity',
            'type' => 'int',
            'vname' => 'LBL_QUANTITY'
        ],
    ],
    'indices' => [
        'id' => ['name' => 'accountkpis_pk', 'type' => 'primary', 'fields' => ['id']],
        'accounts_accountkpis_account_id' => ['name' => 'accounts_accountkpis_account_id', 'type' => 'index', 'fields' => ['account_id']]
    ],
];

VardefManager::createVardef('AccountKPIs', 'AccountKPI', ['default', 'assignable']);
