<?php
$dictionary['sysselecttree_fields'] = [
    'table' => 'sysselecttree_fields',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
        ],
        'keyname' => [
            'name' => 'keyname',
            'type' => 'varchar',
            'len' => 32
        ],
        'selectable' => [
            'name' => 'selectable',
            'type' => 'bool',
        ],
        'favorite' => [
            'name' => 'favorite',
            'type' => 'bool'
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'type' => 'id',
            'comment' => 'id of a record located in this table'
        ],
        'tree' => [
            'name' => 'tree',
            'type' => 'id'
        ],
    ],
    'indices' => [
        [
            'name' => 'sysselecttree_fieldspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysselecttree_fieldsparent',
            'type' => 'index',
            'fields' => ['parent_id']
        ],
        [
            'name' => 'idx_sysselecttree_fieldstree',
            'type' => 'index',
            'fields' => ['tree']
        ],
    ]
];


$dictionary['sysselecttree_tree'] = [
    'table' => 'sysselecttree_tree',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
        ]
    ],
    'indices' => [
        [
            'name' => 'sysselecttree_treepk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];