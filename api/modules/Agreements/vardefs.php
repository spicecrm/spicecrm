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
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Agreement'] = [
    'table' => 'agreements',
    'fields' => [
        'valid_from' => [
            'name' => 'valid_from',
            'vname' => 'LBL_VALID_FROM',
            'type' => 'date',
            'comment' => 'Valid from'
        ],
        'valid_to' => [
            'name' => 'valid_to',
            'vname' => 'LBL_VALID_UNTIL',
            'type' => 'date',
            'comment' => 'Valid to'
        ],
        'account_id' => [
            'name' => 'account_id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'comment' => 'ID of related account'
        ],
        'account_name' => [
            'name' => 'account_name',
            'vname' => 'LBL_ACCOUNT',
            'type' => 'relate',
            'id_name' => 'account_id',
            'rname' => 'name',
            'link' => 'account',
            'module' => 'Accounts',
            'comment' => 'The name of the related account',
            'source' => 'non-db'
        ],
        'account' => [
            'name' => 'account',
            'vname' => 'LBL_ACCOUNT',
            'type' => 'link',
            'comment' => 'Links to Accounts Module',
            'module' => 'Accounts',
            'relationship' => 'account_agreements',
            'source' => 'non-db'
        ],
        'category_1' => [
            'name' => 'category_1',
            'vname' => 'LBL_CATEGORY1',
            'type' => 'varchar',
            'len' => 32,
            'comment' => 'Field for the agreement category tree'
        ],
        'category_2' => [
            'name' => 'category_2',
            'vname' => 'LBL_CATEGORY2',
            'type' => 'varchar',
            'len' => 32,
            'comment' => 'Field for the agreement category tree'
        ],
        'category_3' => [
            'name' => 'category_3',
            'vname' => 'LBL_CATEGORY3',
            'type' => 'varchar',
            'len' => 32,
            'comment' => 'Field for the agreement category tree'
        ],
        'category_4' => [
            'name' => 'category_4',
            'vname' => 'LBL_CATEGORY4',
            'type' => 'varchar',
            'len' => 32,
            'comment' => 'Field for the agreement category tree'
        ],
        'is_valid' => [
            'name' => 'is_valid',
            'vname' => 'LBL_VALID',
            'type' => 'bool',
            'source' => 'non-db',
            'comment' => 'Comparing the validation date of the agreement (valid from with today\'s date)'
        ]
    ],
    'relationships' => [
        'account_agreements' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'Agreements',
            'rhs_table' => 'agreements',
            'rhs_key' => 'account_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => []
];

VardefManager::createVardef('Agreements', 'Agreement', ['default', 'assignable']);
