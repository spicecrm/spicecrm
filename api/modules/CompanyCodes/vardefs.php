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

SpiceDictionaryHandler::getInstance()->dictionary['CompanyCode'] = [
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
            'vname' => 'LBL_VAT_NR',
            'type' => 'varchar',
            'len' => 40
        ],
        'company_address_street' =>
            [
                'name' => 'company_address_street',
                'vname' => 'LBL_STREET',
                'type' => 'varchar',
                'len' => '150'
            ],
        'company_address_street_number' => [
            'name' => 'company_address_street_number',
            'vname' => 'LBL_STREET_NUMBER',
            'type' => 'varchar',
            'len' => 10
        ],
        'company_address_street_number_suffix' => [
            'name' => 'company_address_street_number_suffix',
            'vname' => 'LBL_STREET_NUMBER_SUFFIX',
            'type' => 'varchar',
            'len' => 25,
            'comment' => 'additonal info to the street like Appartmnent, Floor, etc'
        ],
        'company_address_attn' => [
            'name' => 'company_address_attn',
            'vname' => 'LBL_ATTN',
            'type' => 'varchar',
            'len' => '150',
            'comment' => 'additonal attention field for the address',
            'merge_filter' => 'enabled',
        ],
        'company_address_city' =>
            [
                'name' => 'company_address_city',
                'vname' => 'LBL_CITY',
                'type' => 'varchar',
                'len' => '100'
            ],
        'company_address_state' =>
            [
                'name' => 'company_address_state',
                'vname' => 'LBL_STATE',
                'type' => 'varchar',
                'len' => '100'
            ],
        'company_address_district' => [
            'name' => 'company_address_district',
            'vname' => 'LBL_DISTRICT',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'The district used for the billing address',
        ],
        'company_address_postalcode' =>
            [
                'name' => 'company_address_postalcode',
                'vname' => 'LBL_POSTALCODE',
                'type' => 'varchar',
                'len' => '20'
            ],
        'company_address_country' =>
            [
                'name' => 'company_address_country',
                'vname' => 'LBL_COUNTRY',
                'type' => 'varchar',
                'len' => 30
            ],
        'tel' => [
            'name' => 'tel',
            'vname' => 'LBL_PHONE_NUMBER',
            'type' => 'varchar',
            'len' => 50
        ],
        'fax' => [
            'name' => 'fax',
            'vname' => 'LBL_PHONE_FAX',
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
            'vname' => 'LBL_WEBSITE',
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
            'vname' => 'LBL_BIC',
            'type' => 'varchar',
            'len' => 50
        ],
        'bank_iban' => [
            'name' => 'bank_iban',
            'vname' => 'LBL_IBAN',
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
            'comment' => 'Link to CompanyFiscalPeriods module'
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
        ],
        // CR1000674
        'currency_id' => [
            'name' => 'currency_id',
            'type' => 'id',
            'vname' => 'LBL_CURRENCY',
            'reportable' => false,
            'comment' => 'ID of currency used'
        ],
        'currency_name' => [
            'name' => 'currency_name',
            'rname' => 'name',
            'id_name' => 'currency_id',
            'vname' => 'LBL_CURRENCY',
            'type' => 'relate',
            'isnull' => 'true',
            'table' => 'currencies',
            'module' => 'Currencies',
            'source' => 'non-db',
            'comment' => 'Currency'
        ],
        'currency_symbol' => [
            'name' => 'currency_symbol',
            'rname' => 'symbol',
            'id_name' => 'currency_id',
            'vname' => 'LBL_CURRENCY_SYMBOL',
            'type' => 'relate',
            'isnull' => 'true',
            'table' => 'currencies',
            'module' => 'Currencies',
            'source' => 'non-db',
            'comment' => 'Currency symbole'
        ],
    ],
    'indices' => [
        ['name' => 'idx_companycodes_id_del', 'type' => 'index', 'fields' => ['id', 'deleted'],],
        ['name' => 'idx_companycodes_currency_del', 'type' => 'index', 'fields' => ['currency_id', 'deleted'],],
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

if (file_exists('extensions/modules/OrgCharts/vardefs.php')) {
    SpiceDictionaryHandler::getInstance()->dictionary['CompanyCode']['fields']['orgcharts'] = [
        'name' => 'orgcharts',
        'type' => 'link',
        'vname' => 'LBL_ORGCHARTS',
        'relationship' => 'companycodes_orgcharts',
        'module' => 'OrgCharts',
        'source' => 'non-db'
    ];
}

VardefManager::createVardef('CompanyCodes', 'CompanyCode', ['default', 'assignable']);
