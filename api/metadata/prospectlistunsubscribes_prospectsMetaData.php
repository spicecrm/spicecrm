<?php

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['prospectlistunsubscribes_prospects'] = [
    'table' => 'prospectlistunsubscribes_prospects',
    'contenttype' => 'relationdata',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'prospectlistunsubscribe_id' => [
            'name' => 'prospectlistunsubscribe_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'related_id' => [
            'name' => 'related_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'related_type' => [
            'name' => 'related_type',
            'type' => 'varchar',
            'len' => '36'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'prospectlistunsubscribes_prospectspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_prospectlistunsubscribe_prospect',
            'type' => 'alternate_key',
            'fields' => ['prospectlistunsubscribe_id', 'related_id']
        ],
    ],
    'relationships' => [
        'prospectlistunsubscribes_contacts' => [
            'lhs_module' => 'ProspectListUnsubscribes',
            'lhs_table' => 'prospectlistunsubscribes',
            'lhs_key' => 'id',
            'rhs_module' => 'Contacts',
            'rhs_table' => 'contacts',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'prospectlistunsubscribes_prospects',
            'join_key_lhs' => 'prospectlistunsubscribe_id',
            'join_key_rhs' => 'related_id',
            'relationship_role_column' => 'related_type',
            'relationship_role_column_value' => 'Contacts'
        ],
    ]
];
