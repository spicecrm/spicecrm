<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['spicefavorites'] = [
    'table' => 'spicefavorites',
    'fields' => [
        'beanid' => [
            'name' => 'beanid',
            'type' => 'varchar',
            'len' => 36
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'bean' => [
            'name' => 'bean',
            'type' => 'varchar',
            'len' => '36',
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'type' => 'datetime'
        ]
    ],
    'indices' => [
        'spicefavorites_idx' => ['name' => 'spicefavorites_idx',
            'type' => 'unique',
            'fields' => ['beanid', 'user_id'],
        ],
        'spicefavorites_usr_idx' => ['name' => 'spicefavorites_usr_idx',
            'type' => 'index',
            'fields' => ['user_id'],
        ],
        'spicefavorites_bean_idx' => ['name' => 'spicefavorites_bean_idx',
            'type' => 'index',
            'fields' => ['user_id', 'bean'],
        ],
    ],

];

SpiceDictionaryHandler::getInstance()->dictionary['spicereminders'] = [
    'table' => 'spicereminders',
    'fields' => [
        'user_id' =>
            ['name' => 'user_id',
                'type' => 'varchar',
                'len' => '36'
            ],
        'bean' =>
            ['name' => 'bean',
                'type' => 'varchar',
                'len' => '36',
            ],
        'bean_id' =>
            ['name' => 'bean_id',
                'type' => 'varchar',
                'len' => '36',
            ],
        'reminder_date' =>
            ['name' => 'reminder_date',
                'type' => 'date'
            ]
    ],
    'indices' => [
        'spicereminders_idx' => [
            'name' => 'spicereminders_idx',
            'type' => 'unique',
            'fields' => ['user_id', 'bean_id'],
        ]
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['spicenotes'] = [
    'table' => 'spicenotes',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => 36
        ],
        'bean_type' => [
            'name' => 'bean_type',
            'type' => 'varchar',
            'len' => 100
        ],
        'bean_id' => [
            'name' => 'bean_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'trdate' => [
            'name' => 'trdate',
            'type' => 'datetime'
        ],
        'trglobal' => [
            'name' => 'trglobal',
            'type' => 'bool'
        ],
        'text' => [
            'name' => 'text',
            'type' => 'text'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool'
        ],
    ],
    'indices' => [
        'spicenotes_idx' => ['name' => 'spicenotes_idx',
            'type' => 'unique',
            'fields' => ['id'],
        ],
        'spicenotes_usr_idx' => ['name' => 'spicenotes_usr_idx',
            'type' => 'index',
            'fields' => ['user_id'],
        ],
        'spicenotes_usrbean_idx' => ['name' => 'spicenotes_usrbean_idx',
            'type' => 'index',
            'fields' => ['bean_type', 'bean_id'],
        ],
        'spicenotes_selection_idx' => ['name' => 'spicenotes_selection_idx',
            'type' => 'index',
            'fields' => ['bean_type', 'bean_id', 'user_id', 'deleted'],
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['spiceattachments'] = [
    'table' => 'spiceattachments',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => 36,
        ],
        'bean_type' => [
            'name' => 'bean_type',
            'type' => 'varchar',
            'len' => 100,
        ],
        'bean_id' => [
            'name' => 'bean_id',
            'type' => 'varchar',
            'len' => 36,
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => 36,
        ],
        'trdate' => [
            'name' => 'trdate',
            'type' => 'datetime',
        ],
        'filename' => [
            'name' => 'filename',
            'type' => 'varchar',
            'len' => 150,
        ],
        'display_name' => [
            'name' => 'display_name',
            'type' => 'varchar'
        ],
        'filesize' => [
            'name' => 'filesize',
            'type' => 'ulong',
        ],
        'filemd5' => [
            'name' => 'filemd5',
            'type' => 'varchar',
            'len' => 32,
        ],
        'file_mime_type' => [
            'name' => 'file_mime_type',
            'type' => 'varchar',
            'len' => 150,
        ],
        'text' => [
            'name' => 'text',
            'type' => 'text',
        ],
        'category_ids' => [
            'name' => 'category_ids',
            'type' => 'varchar',
        ],
        'thumbnail' => [
            'name' => 'thumbnail',
            'type' => 'text',
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
        ],
        'external_id' => [
            'name' => 'external_id',
            'type' => 'varchar',
            'len' => 200,
        ],
    ],
    'indices' => [
        [
            'name' => 'tqn_idx2',
            'type' => 'unique',
            'fields' => ['id'],
        ],
        [
            'name' => 'tatusr_idx',
            'type' => 'index',
            'fields' => ['user_id'],
        ],
        [
            'name' => 'tatusrbean_idx',
            'type' => 'index',
            'fields' => ['bean_type', 'bean_id', 'trdate'],
        ],
        [
            'name' => 'spiceattachments_idx_beanid',
            'type' => 'index',
            'fields' => ['bean_id'],
        ],
        [
            'name' => 'tatselection_idx',
            'type' => 'index',
            'fields' => ['bean_type', 'bean_id', 'deleted'],
        ],
        [
            'name' => 'tatmd5_idx',
            'type' => 'index',
            'fields' => ['filemd5', 'deleted'],
        ],
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['spiceattachments_categories'] = [
    'table' => 'spiceattachments_categories',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100,
        ],
        'is_system' => [
            'name' => 'is_system',
            'type' => 'bool',
            'default' => 0
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceattchments_categories_idx',
            'type' => 'unique',
            'fields' => ['id'],
        ],
        [
            'name' => 'idx_spiceattachments_categories_system',
            'type' => 'index',
            'fields' => ['is_system'],
        ]
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['spiceurls'] = [
    'table' => 'spiceurls',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => 36,
        ],
        'bean_type' => [
            'name' => 'bean_type',
            'type' => 'varchar',
            'len' => 100,
        ],
        'bean_id' => [
            'name' => 'bean_id',
            'type' => 'varchar',
            'len' => 36,
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => 36,
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'type' => 'datetime',
        ],
        'url' => [
            'name' => 'url',
            'type' => 'text'
        ],
        'url_name' => [
            'name' => 'url_name',
            'type' => 'varchar',
            'len' => 150
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0
        ],
        'description' => [
            'name' => 'description',
            'type' => 'text'
        ],
    ],
    'indices' => [],
];
