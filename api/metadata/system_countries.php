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

$dictionary['syscountries'] = [
    'table' => 'syscountries',
    'comment' => 'holds a list fo all countries for selecttion and translation',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'cc' => [
            'name' => 'cc',
            'type' => 'varchar',
            'len' => 2,
            'comment' => 'the 2 digit country code according to ISO3166'
        ],
        'e164' => [
            'name' => 'e164',
            'type' => 'varchar',
            'len' => 3,
            'comment' => 'the e164 country code for the country'
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => 50,
            'comment' => 'the name of the label for language dependent display of the country name'
        ],
        'addressformat' => [
            'name' => 'addressformat',
            'type' => 'varchar',
            'len' => 250,
            'comment' => 'the format of the address like {street}, {postalcode} {city}, {statename}, {countryname}'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syscountries',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['syscountrystates'] = [
    'table' => 'syscountrystates',
    'comment' => 'holds states per country - subdivision according to ISO3166-2',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'cc' => [
            'name' => 'cc',
            'type' => 'varchar',
            'len' => 2,
            'comment' => 'the 2 digit country code according to ISO3166'
        ],
        'sc' => [
            'name' => 'sc',
            'type' => 'varchar',
            'len' => 5,
            'comment' => 'the subdivison code used internally - used for SAP Integration as SAP uses different values'
        ],
        'iso3166' => [
            'name' => 'iso3166',
            'type' => 'varchar',
            'len' => 5,
            'comment' => 'the subdivison code according to ISO3166'
        ],
        'google_aa' => [
            'name' => 'google_aa',
            'type' => 'varchar',
            'len' => 50,
            'comment' => 'the subdivison code according to Google which is not necessarily conforming'
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => 50,
            'comment' => 'the name of the label for language dependent display of the state/subdivision name'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syscountrystates',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
