<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['opportunities_users'] = [
    'table' => 'opportunities_users',
    'contenttype'   => 'relationdata',
    'fields' => [
        [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'opportunity_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'user_role',
            'type' => 'varchar',
            'len' => '50'
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
            'name' => 'idx_opportunities_userspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_usr_opp_usr',
            'type' => 'index',
            'fields' => ['user_id']
        ],
        [
            'name' => 'idx_usr_opp_opp',
            'type' => 'index',
            'fields' => ['opportunity_id']
        ],
        [
            'name' => 'idx_opportunities_users',
            'type' => 'alternate_key',
            'fields' => ['opportunity_id', 'user_id']
        ]
    ],
    'relationships' => [
        'opportunities_users' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'opportunities_users',
            'join_key_lhs' => 'opportunity_id',
            'join_key_rhs' => 'user_id'
        ]
    ]
];
