<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['MediaFile'] = [
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
