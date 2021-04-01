<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['AccountKPI'] = [
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
