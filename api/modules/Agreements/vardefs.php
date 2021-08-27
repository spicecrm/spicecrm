<?php

use SpiceCRM\includes\SugarObjects\VardefManager;

global $dictionary;

$dictionary['Agreement'] = [
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