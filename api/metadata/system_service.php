<?php
$dictionary['sysservicecategories'] = [
    'table' => 'sysservicecategories',
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
        'servicequeue_id' =>  [
            'name' => 'servicequeue_id',
            'type' => 'id',
        ]
    ],
    'indices' => [
        [
            'name' => 'sysservicecategoriespk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysservicecategoriesparent',
            'type' => 'index',
            'fields' => ['parent_id']
        ],
        [
            'name' => 'idx_sysservicecategoriesqueue',
            'type' => 'index',
            'fields' => ['servicequeue_id']
        ],
    ]
];
