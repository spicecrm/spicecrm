<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['prospect_list_campaigntasks'] = [
    'table' => 'prospect_list_campaigntasks',
    'contenttype'   => 'relationdata',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36',
        ],
        'prospect_list_id' => [
            'name' => 'prospect_list_id',
            'type' => 'varchar',
            'len' => '36',
        ],
        'campaigntask_id' => [
            'name' => 'campaigntask_id',
            'type' => 'varchar',
            'len' => '36',
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'prospect_list_campaigntaksspk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ],
    'relationships' => [
        'prospect_list_campaigntasks' => [
            'lhs_module' => 'ProspectLists',
            'lhs_table' => 'prospect_lists',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignTasks',
            'rhs_table' => 'campaigntasks',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'prospect_list_campaigntasks',
            'join_key_lhs' => 'prospect_list_id',
            'join_key_rhs' => 'campaigntask_id'
        ]
    ]
];
