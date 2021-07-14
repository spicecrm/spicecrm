<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['CompanyCode'] = [
    'table' => 'companycodes',
    'audited' => true,
    'fields' => [
        'registration' => [
            'name' => 'registration',
            'vname' => 'LBL_REGISTRATION',
            'type' => 'varchar',
            'len' => 80
        ],
        'vatid' => [
            'name' => 'vatid',
            'vname' => 'LBL_VATID',
            'type' => 'varchar',
            'len' => 40
        ],
        'company_address_street' =>
        [
            'name' => 'company_address_street',
            'vname' => 'LBL_COMPANY_ADDRESS_STREET',
            'type' => 'varchar',
            'len' => '150'
        ],
        'company_address_city' =>
        [
            'name' => 'company_address_city',
            'vname' => 'LBL_COMPANY_ADDRESS_CITY',
            'type' => 'varchar',
            'len' => '100'
        ],
        'company_address_state' =>
        [
            'name' => 'company_address_state',
            'vname' => 'LBL_COMPANY_ADDRESS_STATE',
            'type' => 'varchar',
            'len' => '100'
        ],
        'company_address_postalcode' =>
        [
            'name' => 'company_address_postalcode',
            'vname' => 'LBL_COMPANY_ADDRESS_POSTALCODE',
            'type' => 'varchar',
            'len' => '20'
        ],
        'company_address_country' =>
        [
            'name' => 'company_address_country',
            'vname' => 'LBL_COMPANY_ADDRESS_COUNTRY',
            'type' => 'varchar',
            'len' => 30
        ],
        'tel' => [
            'name' => 'tel',
            'vname' => 'LBL_TEL',
            'type' => 'varchar',
            'len' => 50
        ],
        'fax' => [
            'name' => 'fax',
            'vname' => 'LBL_FAX',
            'type' => 'varchar',
            'len' => 50
        ],
        'email' => [
            'name' => 'email',
            'vname' => 'LBL_EMAIL',
            'type' => 'varchar',
            'len' => 50
        ],
        'www' => [
            'name' => 'www',
            'vname' => 'LBL_WWW',
            'type' => 'varchar',
            'len' => 50
        ],
        'bank_name' => [
            'name' => 'bank_name',
            'vname' => 'LBL_BANK_NAME',
            'type' => 'varchar',
            'len' => 50
        ],
        'bank_bic' => [
            'name' => 'bank_bic',
            'vname' => 'LBL_BANK_BIC',
            'type' => 'varchar',
            'len' => 50
        ],
        'bank_iban' => [
            'name' => 'bank_iban',
            'vname' => 'LBL_BANK_IBAN',
            'type' => 'varchar',
            'len' => 50
        ],
        'header_from' => [
            'name' => 'header_from',
            'vname' => 'LBL_HEADER_FROM',
            'type' => 'varchar',
            'len' => 255
        ],
        'footer_1' => [
            'name' => 'footer_1',
            'vname' => 'LBL_FOOTER1',
            'type' => 'varchar',
            'len' => 255
        ],
        'footer_2' => [
            'name' => 'footer_2',
            'vname' => 'LBL_FOOTER2',
            'type' => 'varchar',
            'len' => 255
        ],
        'footer_3' => [
            'name' => 'footer_3',
            'vname' => 'LBL_FOOTER3',
            'type' => 'varchar',
            'len' => 255
        ],
        'companyfiscalperiods' => [
            'name' => 'companyfiscalperiods',
            'vname' => 'LBL_COMPANYFISCALPERIODS',
            'type' => 'link',
            'link_type' => 'one',
            'relationship' => 'cfperiods_companycodes',
            'source' => 'non-db',
            'coment' => 'Link to CompanyFiscalPeriods module'
        ],
        'companycode' => [
            'name' => 'companycode',
            'vname' => 'LBL_COMPANYCODE',
            'type' => 'varchar',
            'len' => 12
        ],
        'shops' => [
            'name' => 'shops',
            'type' => 'link',
            'vname' => 'LBL_SHOPS',
            'relationship' => 'companycode_shops',
            'rname' => 'name',
            'source' => 'non-db',
            'module' => 'Shops',
        ]
    ],
    'indices' => [
        ['name' => 'idx_companycodes_id_del', 'type' => 'index', 'fields' => ['id', 'deleted'],],
    ],
    'relationships' => [
        'companycodes_accountkpis' =>
            [
                'lhs_module' => 'CompanyCodes',
                'lhs_table' => 'companycodes',
                'lhs_key' => 'id',
                'rhs_module' => 'AccountKPIs',
                'rhs_table' => 'accountkpis',
                'rhs_key' => 'companycode_id',
                'relationship_type' => 'one-to-many',
            ],
        'companycode_shops' => [
            'name' => 'companycode_shops',
            'lhs_module' => 'CompanyCodes',
            'lhs_table' => 'companycodes',
            'lhs_key' => 'id',
            'rhs_module' => 'Shops',
            'rhs_table' => 'shops',
            'rhs_key' => 'companycode_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'optimistic_lock' => true,
];

VardefManager::createVardef('CompanyCodes', 'CompanyCode', ['default', 'assignable']);
global $dictionary; //COMPAT php7.1
$dictionary['CompanyCode']['fields']['name']['vname'] = 'LBL_COMPANYCODE';
