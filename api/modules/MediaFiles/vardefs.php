<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['MediaFile'] = [
    'table' => 'mediafiles',
    'comment' => 'Media Files: Images, Audios, Videos, …',
    'fields' => [
        'filetype' => [
            'name' => 'filetype',
            'vname' => 'LBL_FILETYPE',
            'type' => 'varchar',
            'len' => 100,
            'isnull' => false,
            'required' => false
        ],
        'alttext' => [
            'name' => 'alttext',
            'vname' => 'LBL_ALTTEXT',
            'type' => 'varchar',
            'len' => 255
        ],
        'copyright_owner' => [
            'name' => 'copyright_owner',
            'vname' => 'LBL_COPYRIGHT_OWNER',
            'type' => 'varchar',
            'len' => 255
        ],
        'copyright_license' => [
            'name' => 'copyright_license',
            'vname' => 'LBL_COPYRIGHT_LICENSE',
            'type' => 'varchar',
            'len' => 255
        ],
        'height' => [
            'name' => 'height',
            'vname' => 'LBL_HEIGHT',
            'type' => 'uint'
        ],
        'width' => [
            'name' => 'width',
            'vname' => 'LBL_WIDTH',
            'type' => 'uint'
        ],
        'filesize' => [
            'name' => 'filesize',
            'vname' => 'LBL_FILESIZE',
            'type' => 'ulong',
            'comment' => 'Filesize in KiloBytes'
        ],
        'cdn' => [
            'name' => 'cdn',
            'vname' => 'LBL_CDN',
            'type' => 'bool',
            'default' => 0
        ],
        'hash' => [
            'name' => 'hash',
            'vname' => 'LBL_HASH',
            'type' => 'varchar',
            'len' => 32,
            'isnull' => false,
            'required' => false
        ],
        'mediacategory_id' => [
            'name' => 'mediacategory_id',
            'vname' => 'LBL_MEDIACATEGORY_ID',
            'type' => 'id',
            'required' => false
        ],
        'mediacategory' => [
            'name' => 'mediacategory',
            'vname' => 'LBL_MEDIACATEGORY',
            'type' => 'link',
            'relationship' => 'mediacategory_mediafiles',
            'source' => 'non-db',
            'module' => 'MediaCategories'
        ],
        'mediacategory_name' => [
            'name' => 'mediacategory_name',
            'rname' => 'name',
            'id_name' => 'mediacategory_id',
            'vname' => 'LBL_MEDIACATEGORY',
            'join_name' => 'mediacategory',
            'type' => 'relate',
            'link' => 'mediacategory',
            'table' => 'mediacetegories',
            'isnull' => 'true',
            'module' => 'MediaCategories',
            'dbType' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
        ],
        'file' => [
            'name' => 'file',
            'vname' => 'LBL_FILE',
            'type' => 'text',
            # 'required' => true,
            'source' => 'non-db',
        ],
        'thumbnail' => [
            'name' => 'thumbnail',
            'vname' => 'LBL_THUMBNAIL',
            'type' => 'longtext'
        ],
    ],
    'relationships' => [
        'mediacategory_mediafiles' => [
            'lhs_module' => 'MediaCategories',
            'lhs_table' => 'mediacategories',
            'lhs_key' => 'id',
            'rhs_module' => 'MediaFiles',
            'rhs_table' => 'mediafiles',
            'rhs_key' => 'mediacategory_id',
            'relationship_type' => 'one-to-many',
        ]
    ],
    'indices' => [
        ['name' =>'idx_mediafiles_name', 'type' => 'index', 'fields' => ['name']],
        ['name' =>'idx_mediafiles_copyright_owner', 'type' => 'index', 'fields' => ['copyright_owner']],
        ['name' =>'idx_mediafiles_deleted', 'type' => 'index', 'fields' => ['deleted']],
        ['name' =>'idx_mediafiles_mediacategory', 'type' => 'index', 'fields' => ['mediacategory_id']]
    ]
];

VardefManager::createVardef('MediaFiles','MediaFile', ['default','assignable']);
