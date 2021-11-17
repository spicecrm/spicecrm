<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['knowledgedocuments_knowledgedocuments'] = [
    'table' => 'knowledgedocuments_knowledgedocuments',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'],
        'kbl_id' => [
            'name' => 'kbl_id',
            'type' => 'varchar',
            'len' => '36'],
        'kbr_id' => [
            'name' => 'kbr_id',
            'type' => 'varchar',
            'len' => '36'],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'required' => false,
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'accounts_contactspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_kbl_id',
            'type' => 'index',
            'fields' => ['kbl_id']
        ],
        [
            'name' => 'idx_kbr_id',
            'type' => 'index',
            'fields' => ['kbr_id']
        ]

    ],
    'relationships' => [
        'knowledgedocuments_knowledgedocuments' => [
            'lhs_module' => 'KnowledgeDocuments',
            'lhs_table' => 'knowledgedocuments',
            'lhs_key' => 'id',
            'rhs_module' => 'KnowledgeDocuments',
            'rhs_table' => 'knowledgedocuments',
            'rhs_key' => 'id',
            'join_table' => 'knowledgedocuments_knowledgedocuments',
            'join_key_lhs' => 'kbl_id',
            'join_key_rhs' => 'kbr_id',
            'relationship_type' => 'many-to-many',
        ]
    ]
];
