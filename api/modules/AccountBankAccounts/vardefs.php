<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
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
        ],
        'sepa_id' => [
            'name' => 'sepa_id',
            'type' => 'varchar',
            'len' => 50,
            'vname' => 'LBL_SEPA_ID'
        ],
        'sepa_valid_from' => [
            'name' => 'sepa_valid_from',
            'type' => 'datetime',
            'vname' => 'LBL_SEPA_VALID_FROM'
        ],
        'sepa_valid_to' => [
            'name' => 'sepa_valid_to',
            'type' => 'datetime',
            'vname' => 'LBL_SEPA_VALID_TO'
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
            'id_name' => 'companycode_id',
            'module' => 'CompanyCodes',
            'link' => 'companycodes',
            'rname' => 'name'
        ],
        'companycodes' => [
            'name' => 'companycodes',
            'type' => 'link',
            'module' => 'CompanyCodes',
            'relationship' => 'companycodes_bankaccounts',
            'source' => 'non-db',
            'vname' => 'LBL_COMPANYCODES',
        ],
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
        ],
        'companycodes_bankaccounts' =>
            [
                'lhs_module' => 'CompanyCodes',
                'lhs_table' => 'companycodes',
                'lhs_key' => 'id',
                'rhs_module' => 'AccountKPIs',
                'rhs_table' => 'accountkpis',
                'rhs_key' => 'companycode_id',
                'relationship_type' => 'one-to-many',
            ],
    ],
    'indices' => [
        'id' => ['name' => 'accountbakaccounts_pk', 'type' => 'primary', 'fields' => ['id']],
        'accounts_accountbankaccounts_account_id' => ['name' => 'accounts_accountbankaccounts_account_id', 'type' => 'index', 'fields' => ['account_id']]
    ],
];

VardefManager::createVardef('AccountBankAccounts', 'AccountBankAccount', ['default', 'assignable']);
