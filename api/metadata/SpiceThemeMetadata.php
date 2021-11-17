<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

$dictionary['spicefavorites'] = [
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
 		['name'			=> 'tfr_idx',
				'type'			=> 'unique',
				'fields'		=> ['beanid', 'user_id'],
        ],
 		['name'			=> 'tsrusr_idx',
				'type'			=> 'index',
				'fields'		=> ['user_id'],
        ],
		['name'			=> 'tsrusrbean_idx',
				'type'			=> 'index',
				'fields'		=> ['user_id', 'bean'],
        ],
    ],

];
$dictionary['spicereminders'] = [
	'table'=> 'spicereminders',
	'fields'=> [
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
 		['name'			=> 'tsr_idx',
				'type'			=> 'unique',
				'fields'		=> ['user_id', 'bean_id'],
        ]
    ],
];

$dictionary['spicenotes'] = [
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
				['name'			=> 'tqn_idx',
						'type'			=> 'unique',
						'fields'		=> ['id'],
                ],
				['name'			=> 'tqnusr_idx',
						'type'			=> 'index',
						'fields'		=> ['user_id'],
                ],
				['name'			=> 'tqnusrbean_idx',
						'type'			=> 'index',
						'fields'		=> ['bean_type', 'bean_id'],
                ],
				['name'			=> 'tqnselection_idx',
						'type'			=> 'index',
						'fields'		=> ['bean_type', 'bean_id', 'user_id', 'deleted'],
                ],
        ],

];

$dictionary['spiceattachments'] = [
	'table'  => 'spiceattachments',
	'fields' => [
		'id' => [
			'name' => 'id',
			'type' => 'varchar',
			'len'  => 36,
		],
		'bean_type' => [
			'name' => 'bean_type',
			'type' => 'varchar',
			'len'  => 100,
		],
		'bean_id' => [
			'name' => 'bean_id',
			'type' => 'varchar',
			'len'  => 36,
		],
		'user_id' => [
			'name' => 'user_id',
			'type' => 'varchar',
			'len'  => 36,
		],
		'trdate' => [
			'name' => 'trdate',
			'type' => 'datetime',
		],
		'filename' => [
			'name' => 'filename',
			'type' => 'varchar',
			'len'  => 150,
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
            'len'  => 32,
		],
		'file_mime_type' => [
			'name' => 'file_mime_type',
			'type' => 'varchar',
			'len'  => 150,
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
            'len'  => 200,
        ],
	],
	'indices' => [
		[
		    'name'	 => 'tqn_idx2',
			'type'	 => 'unique',
			'fields' => ['id'],
		],
		[
		    'name'	 => 'tatusr_idx',
			'type'	 => 'index',
			'fields' => ['user_id'],
		],
		[
		    'name'	 => 'tatusrbean_idx',
			'type'	 => 'index',
			'fields' => ['bean_type', 'bean_id', 'trdate'],
		],
		[
		    'name'	 => 'tatselection_idx',
			'type'	 => 'index',
			'fields' => ['bean_type', 'bean_id', 'deleted'],
		],
		[
		    'name'	 => 'tatmd5_idx',
			'type'	 => 'index',
			'fields' => ['filemd5', 'deleted'],
		],
	],
];

$dictionary['spiceattachments_categories'] = [
	'table'  => 'spiceattachments_categories',
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
            'len'  => 100,
        ],
        'is_system' => [
            'name' => 'is_system',
            'type' => 'bool'
        ]
	],
	'indices' => [
		[
		    'name'	 => 'spiceattchments_categories_idx',
			'type'	 => 'unique',
			'fields' => ['id'],
		]
	],
];
