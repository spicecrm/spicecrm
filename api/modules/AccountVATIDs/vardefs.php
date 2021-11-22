<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['AccountVATID'] = [
    'table' => 'accountvatids',
    'comment' => 'AccountVATIDs Module',
    'audited' => true,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
        'vat_id' => [
            'name' => 'vat_id',
            'type' => 'varchar',
            'len' => '100',
            'vname' => 'LBL_VATID',
        ],
        'vatid_status' => [
            'name' => 'vatid_status',
            'type' => 'varchar',
            'len' => '100',
            'vname' => 'LBL_STATUS',
        ],
        'verification_details' => [
            'name' => 'verification_details',
            'type' => 'text',
            'vname' => 'LBL_VERIFICATION_DETAILS',
        ],
        'country' => [
            'name' => 'country',
            'type' => 'enum',
            'options' => 'vat_country_dom',
            'vname' => 'LBL_COUNTRY',
        ],
        'account_id' => [
            'name' => 'account_id',
            'vname' => 'LBL_ACCOUNT',
            'type' => 'id',
            'required' => false
        ],
        'account_name' => [
            'name' => 'account_name',
            'rname' => 'name',
            'id_name' => 'account_id',
            'vname' => 'LBL_ACCOUNT',
            'type' => 'relate',
            'link' => 'account',
            'isnull' => 'true',
            'table' => 'accounts',
            'module' => 'Accounts',
            'source' => 'non-db',
        ],
        'account' => [
            'name' => 'account',
            'type' => 'link',
            'vname' => 'LBL_ACCOUNT',
            'relationship' => 'account_accountvatids',
            'module' => 'Accounts',
            'source' => 'non-db'
        ],

    ],
    'relationships' => [],

    'indices' => [],

];

VardefManager::createVardef('AccountVATIDs', 'AccountVATID', ['default', 'assignable']);
