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

global $dictionary;
$dictionary['spicebeanguides'] = [
    'table' => 'spicebeanguides',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => '50'
        ],
        'status_field' => [
            'name' => 'status_field',
            'type' => 'varchar',
            'len' => '36'
        ],
        'build_language' => [
            'name' => 'build_language',
            'type' => 'shorttext',
            'len' => 1000
        ]
    ],
    'indices' => [
        ['name' => 'spicebeanguides_pk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_spicebeanguides_module', 'type' => 'index', 'fields' => ['module']],
    ]
];
$dictionary['spicebeancustomguides'] = [
    'table' => 'spicebeancustomguides',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'char',
            'len' => '36'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => '50'
        ],
        'status_field' => [
            'name' => 'status_field',
            'type' => 'varchar',
            'len' => '36'
        ],
        'build_language' => [
            'name' => 'build_language',
            'type' => 'shorttext',
            'len' => 1000
        ]
    ],
    'indices' => [
        ['name' => 'spicebeancustomguides_pk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_spicebeancustomguides_module', 'type' => 'index', 'fields' => ['module']],
    ]
];
$dictionary['spicebeanguidestages'] = [
    'table' => 'spicebeanguidestages',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'spicebeanguide_id' => [
            'name' => 'spicebeanguide_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'stage' => [
            'name' => 'stage',
            'type' => 'varchar',
            'len' => '36'
        ],
        'secondary_stage' => [
            'name' => 'secondary_stage',
            'type' => 'varchar',
            'len' => '36'
        ],
        'stage_sequence' => [
            'name' => 'stage_sequence',
            'type' => 'int'
        ],
        'stage_bucket' => [
            'name' => 'stage_bucket',
            'type' => 'varchar',
            'len' => 50
        ],
        'stage_color' => [
            'name' => 'stage_color',
            'type' => 'varchar',
            'len' => '6'
        ],
        'stage_add_data' => [
            'name' => 'stage_add_data',
            'type' => 'shorttext',
            'len' => 1000
        ],
        'stage_label' => [
            'name' => 'stage_label',
            'type' => 'varchar',
            'len' => 50
        ],
        'stage_componentset' => [
            'name' => 'stage_componentset',
            'type' => 'varchar',
            'len' => 36
        ],
        'not_in_kanban' => [
            'name' => 'not_in_kanban',
            'type' => 'bool'
        ],
        'spicebeanguide_status' => [
            'name' => 'spicebeanguide_status',
            'type' => 'varchar',
            'len' => 4,
            'comment' => 'vlaues are empty, won or lost, this influences the setup of the complete beanguide'
        ]
    ],
   'indices' => [
        ['name' => 'spicebeanguidestages_pk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_spicebeanguidestages_guideid', 'type' => 'index', 'fields' => ['spicebeanguide_id']],
   ]
];

$dictionary['spicebeanguidestages_texts'] = [
    'table' => 'spicebeanguidestages_texts',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'stage_id' => [
            'name' => 'stage_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'language' => [
            'name' => 'language',
            'type' => 'varchar',
            'len' => '5'
        ],
        'stage_name' => [
            'name' => 'stage_name',
            'type' => 'varchar',
            'len' => '25'
        ],
        'stage_secondaryname' => [
            'name' => 'stage_secondaryname',
            'type' => 'varchar',
            'len' => '25'
        ],
        'stage_description' => [
            'name' => 'stage_description',
            'type' => 'text'
        ]
    ],
    'indices' => [
        ['name' => 'spicebeanguidestages_texts_pk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_spicebeanguidestagestexts_stageid', 'type' => 'index', 'fields' => ['stage_id']],
    ]
];

$dictionary['spicebeanguidestages_checks'] = [
    'table' => 'spicebeanguidestages_checks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'spicebeanguide_id' => [
            'name' => 'spicebeanguide_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'stage_id' => [
            'name' => 'stage_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'check_sequence' => [
            'name' => 'check_sequence',
            'type' => 'int'
        ],
        'check_include' => [
            'name' => 'check_include',
            'type' => 'varchar',
            'len' => '150'
        ],
        'check_class' => [
            'name' => 'check_class',
            'type' => 'varchar',
            'len' => '80'
        ],
        'check_method' => [
            'name' => 'check_method',
            'type' => 'varchar',
            'len' => 255
        ],
        'check_label' => [
            'name' => 'check_label',
            'type' => 'varchar',
            'len' => 50
        ]
    ],
    'indices' => [
        ['name' => 'spicebeanguidestages_checks_pk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_spicebeanguidestageschecks_stageid', 'type' => 'index', 'fields' => ['stage_id']],
        ['name' => 'idx_spicebeanguidestageschecks_guideid', 'type' => 'index', 'fields' => ['spicebeanguide_id']],
    ]
];

$dictionary['spicebeanguidestages_check_texts'] = [
    'table' => 'spicebeanguidestages_check_texts',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'stage_check_id' => [
            'name' => 'stage_check_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'language' => [
            'name' => 'language',
            'type' => 'varchar',
            'len' => '5'
        ],
        'text' => [
            'name' => 'text',
            'type' => 'varchar',
            'len' => '50'
        ]
    ],
    'indices' => [
        ['name' => 'spicebeanguidestages_check_texts_pk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_spicebeanguidestageschecktexts_stagecheckid', 'type' => 'index', 'fields' => ['stage_check_id']],
    ]
];
