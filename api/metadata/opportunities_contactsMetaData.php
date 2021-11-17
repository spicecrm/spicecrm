<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['opportunities_contacts'] = [
    'table' => 'opportunities_contacts',
    'fields' => [
        [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'contact_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'opportunity_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'contact_role',
            'type' => 'varchar',
            'len' => '50'
        ],
        [
            'name' => 'propensity_to_buy',
            'type' => 'enum',
            'options' => 'opportunity_relationship_buying_center_dom',
            'len' => '2'
        ],
        [
            'name' => 'level_of_support',
            'type' => 'enum',
            'options' => 'opportunity_relationship_buying_center_dom',
            'len' => '2'
        ],
        [
            'name' => 'level_of_influence',
            'type' => 'enum',
            'options' => 'opportunity_relationship_buying_center_dom',
            'len' => '2'
        ],
        [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        ]
    ],
    'indices' => [
        [
            'name' => 'opportunities_contactspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_con_opp_con',
            'type' => 'index',
            'fields' => ['contact_id']
        ],
        [
            'name' => 'idx_con_opp_opp',
            'type' => 'index',
            'fields' => ['opportunity_id']
        ],
        [
            'name' => 'idx_opportunities_contacts',
            'type' => 'alternate_key',
            'fields' => ['opportunity_id', 'contact_id']
        ]
    ],
    'relationships' => [
        'opportunities_contacts' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'Contacts',
            'rhs_table' => 'contacts',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'opportunities_contacts',
            'join_key_lhs' => 'opportunity_id',
            'join_key_rhs' => 'contact_id'
        ]
    ]
];
