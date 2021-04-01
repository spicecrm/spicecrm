<?php

$dictionary['sysmailboxtransports'] = [
    'table' => 'sysmailboxtransports',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 16
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => 100
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'message_type' => [
            'name'     => 'message_type',
            'vname'    => 'LBL_MESSAGE_TYPE',
            'type'     => 'enum',
            'options'  => 'mailbox_message_types',
            'required' => true,
        ],
        'version' => [
            'name' => 'version',
            'type' => 'varchar',
            'len' => 16
        ],
        'package' => [
            'name' => 'package',
            'type' => 'varchar',
            'len' => 32
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysmailboxtransports',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['syscustommailboxtransports'] = [
    'table' => 'syscustommailboxtransports',
    'fields' => $dictionary['sysmailboxtransports']['fields'],
    'indices' => [
        [
            'name' => 'idx_syscustommailboxtransports',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
