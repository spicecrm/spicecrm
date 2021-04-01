<?php

$dictionary['syststatusnetworks'] = [
    'table' => 'syststatusnetworks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'domain' => [
            'name' => 'domain',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_from' => [
            'name' => 'status_from',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_to' => [
            'name' => 'status_to',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_priority' => [
            'name' => 'status_priority',
            'type' => 'int'
        ],
        'action_label' => [
            'name' => 'action_label',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_component' => [
            'name' => 'status_component',
            'type' => 'varchar',
            'len' => 100
        ],
        'prompt_label' => [
            'name' => 'prompt_label',
            'type' => 'varchar',
            'len' => 100
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syststatusnetworks',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
