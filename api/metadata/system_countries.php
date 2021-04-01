<?php

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
