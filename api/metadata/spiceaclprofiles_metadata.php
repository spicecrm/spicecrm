<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

$dictionary ['SpiceACLProfiles_SpiceACLObjects'] = [
    'table' => 'spiceaclprofiles_spiceaclobjects',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'spiceaclobject_id' => [
            'name' => 'spiceaclobject_id',
            'type' => 'id'
        ],
        'spiceaclprofile_id' => [
            'name' => 'spiceaclprofile_id',
            'type' => 'id'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => false
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclprofiles_spricaclobjects_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_spiceaclprofilesaclobjects_objid',
            'type' => 'index',
            'fields' => ['spiceaclobject_id']
        ],
        [
            'name' => 'idx_spiceaclprofilesaclobjects_profid',
            'type' => 'index',
            'fields' => ['spiceaclprofile_id']
        ]

    ],
    'relationships' => [
        'spiceaclprofiles_spiceaclobjects' => [
            'lhs_module' => 'SpiceACLProfiles',
            'lhs_table' => 'spiceaclprofiles',
            'lhs_key' => 'id',
            'rhs_module' => 'SpiceACLObjects',
            'rhs_table' => 'spiceaclobjects',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_contacts',
            'join_key_lhs' => 'spiceaclprofile_id',
            'join_key_rhs' => 'spiceaclobject_id'
        ]
    ]
];

$dictionary['spiceaclprofiles_users'] = [
    'table' => 'spiceaclprofiles_users',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id'
        ],
        'spiceaclprofile_id' => [
            'name' => 'spiceaclprofile_id',
            'type' => 'id'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclprofiles_users_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'spiceaclprofiles_users_userid',
            'type' => 'index',
            'fields' => ['user_id']
        ],
        [
            'name' => 'spiceaclprofiles_users_profileid',
            'type' => 'index',
            'fields' => ['user_id', 'spiceaclprofile_id']
        ]
    ],
    'relationships' => [
        'spiceaclprofiles_users' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'SpiceACLProfiles',
            'rhs_table' => 'spiceaclprofiles',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_contacts',
            'join_key_lhs' => 'user_id',
            'join_key_rhs' => 'spiceaclprofile_id',
        ]
    ]
];
