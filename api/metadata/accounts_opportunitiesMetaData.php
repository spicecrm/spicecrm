<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['accounts_opportunities'] = [
    'table' => 'accounts_opportunities',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'account_id' => [
            'name' => 'account_id',
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
            'name' => 'accounts_opportunitiespk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_account_opportunity',
            'type' => 'alternate_key',
            'fields' => ['account_id', 'opportunity_id']
        ],
        [
            'name' => 'idx_oppid_del_accid',
            'type' => 'index',
            'fields' => ['opportunity_id', 'deleted', 'account_id']
        ]
    ],
    'relationships' => [
        'accounts_opportunities' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'Opportunities',
            'rhs_table' => 'opportunities',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'accounts_opportunities',
            'join_key_lhs' => 'account_id',
            'join_key_rhs' => 'opportunity_id']
    ]
];


