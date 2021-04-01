<?php



$dictionary ['SpiceACLModuleFields'] = [
    'table' => 'spiceaclmodulefields',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'required' => true,
            'reportable' => false],
        'sysmodule_id' => [
            'name' => 'sysmodule_id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => 60
        ],
        'fieldname' => [
            'name' => 'fieldname',
            'vname' => 'LBL_FIELDNAME',
            'type' => 'varchar',
            'len' => 60
        ],
        'relname' => [
            'name' => 'relname',
            'vname' => 'LBL_RELNAME',
            'type' => 'varchar',
            'comment' => 'if we find throuhg a relationship',
            'len' => 60
        ],
        'addjoin' => [
            'name' => 'addjoin',
            'vname' => 'LBL_ADDJOIN',
            'type' => 'text',
            'comment' => 'for custom coding iof we need to join fields'
        ],
        'addwhere' => [
            'name' => 'addwhere',
            'vname' => 'LBL_ADDWHERE',
            'type' => 'text',
            'comment' => 'for custom coding iof we need a custom where statement'
        ],
    ],
    'indices' => [
        [
            'name' => 'spiceaclmodulefields_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'spiceaclmodulefields_module',
            'type' => 'index',
            'fields' => ['sysmodule_id']
        ]
    ]
];


$dictionary ['SpiceACLStandardActions'] = [
    'table' => 'spiceaclstandardactions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
        'action' => [
            'name' => 'action',
            'vname' => 'LBL_ACTION',
            'type' => 'varchar',
            'len' => 50
        ],
        'displaysequence' => [
            'name' => 'displaysequence',
            'vname' => 'LBL_DISPLAYSEQUENCE',
            'type' => 'int'
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
            'name' => 'spiceaclstandardactions_pk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary ['SpiceACLModuleActions'] = [
    'table' => 'spiceaclmoduleactions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
        'sysmodule_id' => [
            'name' => 'sysmodule_id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
        'action' => [
            'name' => 'action',
            'vname' => 'LBL_ACTION',
            'type' => 'varchar',
            'len' => 50
        ],
        'shortcode' => [
            'name' => 'shortcode',
            'vname' => 'LBL_SHORTCODE',
            'type' => 'varchar',
            'len' => 50
        ],
        'standardaction' => [
            'name' => 'standardaction',
            'vname' => 'LBL_STANDARDACTION',
            'type' => 'varchar',
            'len' => 1
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclmoduleactions_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'spiceaclmoduleactions_acltype_id',
            'type' => 'index',
            'fields' => ['sysmodule_id']
        ]
    ]
];

$dictionary ['SpiceACLObjectActions'] = [
    'table' => 'spiceaclobjectactions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'spiceaclobject_id' => [
            'name' => 'spiceaclobject_id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
        'spiceaclaction_id' => [
            'name' => 'spiceaclaction_id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
    ],
    'indices' => [
        [
            'name' => 'spiceaclobjectactions_pk',
            'type' => 'unique',
            'fields' => ['spiceaclobject_id', 'spiceaclaction_id']
        ]
    ]
];

$dictionary['spiceaclobjectvalues'] = [
    'table' => 'spiceaclobjectvalues',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'char',
            'len' => 36,
        ],
        'spiceaclobject_id' => [
            'name' => 'spiceaclobject_id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
        'spiceaclmodulefield_id' => [
            'name' => 'spiceaclmodulefield_id',
            'vname' => 'LBL_SPICEACLTYPE',
            'type' => 'varchar',
            'len' => 60
        ],
        'operator' => [
            'name' => 'operator',
            'vname' => 'LBL_OPERATOR',
            'type' => 'varchar',
            'len' => 10
        ],
        'value1' => [
            'name' => 'value1',
            'vname' => 'LBL_VALUE1',
            'type' => 'text'
        ],
        'value2' => [
            'name' => 'value2',
            'vname' => 'LBL_VALUE2',
            'type' => 'text'
        ],
    ],
    'indices' => [
        [
            'name' => 'spiceaclobjectvalues_pk',
            'type' => 'unique',
            'fields' => ['spiceaclobject_id', 'spiceaclmodulefield_id']
        ]
    ]
];

$dictionary ['SpiceACLObjectsTerritoryElementValues'] = [
    'table' => 'spiceaclobjectsterritoryelementvalues',
    'fields' => [
        'spiceaclobject_id' => [
            'name' => 'spiceaclobject_id',
            'type' => 'id',
            'required' => true,
            'reportable' => false]
        ,
        'spiceaclterritoryelement_id' => [
            'name' => 'spiceaclterritoryelement_id',
            'required' => true,
            'type' => 'varchar',
            'len' => 60
        ],
        'value' => [
            'name' => 'value',
            'vname' => 'LBL_VALUE',
            'type' => 'text'
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclobjectsterritoryelementvalues_pk',
            'type' => 'unique',
            'fields' => ['spiceaclobject_id', 'spiceaclterritoryelement_id']
        ]
    ]
];

$dictionary ['SpiceACLObjectFields'] = [
    'table' => 'spiceaclobjectfields',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'char',
            'len' => 36,
        ],
        'spiceaclobject_id' => [
            'name' => 'spiceaclobject_id',
            'type' => 'id',
            'required' => true,
            'reportable' => false
        ],
        'field' => [
            'name' => 'field',
            'vname' => 'LBL_FIELD',
            'type' => 'varchar',
            'len' => 60
        ],
        'control' => [
            'name' => 'control',
            'vname' => 'LBL_CONTROL',
            'type' => 'varchar',
            'len' => 1
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclobjectfields_pk',
            'type' => 'unique',
            'fields' => ['spiceaclobject_id', 'field']
        ]
    ]
];

$dictionary['SpiceACLObjects_hash'] = [
    'table' => 'spiceaclobjects_hash',
    'fields' => [
        'hash_id' => [
            'name' => 'hash_id',
            'type' => 'char',
            'required' => true,
            'isnull' => false,
            'len' => '36'
        ],
        'spiceaclobject_id' => [
            'name' => 'spiceaclobject_id',
            'type' => 'char',
            'required' => true,
            'isnull' => false,
            'len' => '36'
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclobjects_hash_pk',
            'type' => 'unique',
            'fields' => ['hash_id', 'spiceaclobject_id']
        ],
        [
            'name' => 'spiceaclobjects_hash_aclobject_id',
            'type' => 'index',
            'fields' => ['spiceaclobject_id']
        ]
    ]
];
