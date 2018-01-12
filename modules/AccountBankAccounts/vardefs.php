<?php
$dictionary['AccountBankAccount'] = array(
    'table' => 'accountbankaccounts',
    'fields' => array(
        'account_id' => array(
            'name' => 'account_id',
            'type' => 'id',
            'vname' => 'LBL_ACCOUNTS_ID'
        ),
        'account_name' => array(
            'source' => 'non-db',
            'name' => 'account_name',
            'vname' => 'LBL_ACCOUNTS_NAME',
            'type' => 'relate',
            'len' => '255',
            'id_name' => 'account_id',
            'module' => 'Accounts',
            'link' => 'accounts',
            'join_name' => 'accounts',
            'rname' => 'name'
        ),
        'accounts' => array(
            'name' => 'accounts',
            'module' => 'Accounts',
            'type' => 'link',
            'relationship' => 'accounts_bankaccounts',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS_BANKACCOUNTS_LINK',
        ),
        'accountnr' => array(
            'name' => 'accountnr',
            'type' => 'varchar',
            'len' => 50,
            'vname' => 'LBL_ACCOUNTNR'
        ),
        'swift' => array(
            'name' => 'swift',
            'type' => 'varchar',
            'len' => 20,
            'vname' => 'LBL_SWIFT'
        ),
        'street' => array(
            'name' => 'street',
            'type' => 'varchar',
            'len' => 50,
            'vname' => 'LBL_STREET'
        ),
        'postalcode' => array(
            'name' => 'postalcode',
            'type' => 'varchar',
            'len' => 10,
            'vname' => 'LBL_POSTALCODE'
        )
    ),
    'relationships' => array(
        'accounts_bankaccounts' => array(
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'AccountBankAccounts',
            'rhs_table' => 'accountbankaccounts',
            'rhs_key' => 'account_id',
            'relationship_type' => 'one-to-many'
        )
    ),
    'indices' => array(
        'id' => array('name' => 'accountbakaccounts_pk', 'type' => 'primary', 'fields' => array('id')),
        'accounts_accountbankaccounts_account_id' => array('name' => 'accounts_accountbankaccounts_account_id', 'type' => 'index', 'fields' => array('account_id'))
    ),
);

require_once('include/SugarObjects/VardefManager.php');
VardefManager::createVardef('AccountBankAccounts', 'AccountBankAccount', array('default', 'assignable'));