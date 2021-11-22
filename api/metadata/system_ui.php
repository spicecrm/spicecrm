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

$dictionary['systextids_modules'] = [
    'table' => 'systextids_modules',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'text_id' => [
            'name' => 'text_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_systextids_modules',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_systextids_modules_text_id',
            'type' => 'index',
            'fields' => ['text_id']]
    ]
];

$dictionary['syscustomtextids_modules'] = [
    'table' => 'syscustomtextids_modules',
    'audited' => true,
    'fields' => $dictionary['systextids_modules']['fields'],
    'indices' => [
        [
            'name' => 'idx_syscustomtextids_modules',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_syscustomtextids_modules_text_id',
            'type' => 'index',
            'fields' => ['text_id']
        ]
    ]
];
$dictionary['systextids'] = [
    'table' => 'systextids',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'text_id' => [
            'name' => 'text_id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 255
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => 255
        ],
        'text_type' => [
            'name' => 'text_type',
            'type' => 'varchar',
            'len' => '255'
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_systextids',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_systextids_text_id',
            'type' => 'index',
            'fields' => ['text_id']
        ]
    ]
];
$dictionary['syscustomtextids'] = [
    'table' => 'syscustomtextids',
    'audited' => true,
    'fields' => $dictionary['systextids']['fields'],
    'indices' => [
        [
            'name' => 'idx_syscustomtextids',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_syscustomtextids_text_id',
            'type' => 'index',
            'fields' => ['text_id']
        ]
    ]
];

$dictionary['sysuipackagerepositories'] = [
    'table' => 'sysuipackagerepositories',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'url' => [
            'name' => 'url',
            'type' => 'varchar',
            'len' => 100
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_sysuipackagerepositories',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];


$dictionary['sysuiloadtasks'] = [
    'table' => 'sysuiloadtasks',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'display' => [
            'name' => 'display',
            'type' => 'varchar',
            'len' => 100
        ],
        'phase' => [
            'name' => 'phase',
            'type' => 'varchar',
            'len' => 10
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'varchar',
            'len' => 10
        ],
        'route' => [
            'name' => 'route',
            'type' => 'varchar',
            'len' => 100
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
            'name' => 'idx_sysuiloadtasks',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuiloadtaskitems'] = [
    'table' => 'sysuiloadtaskitems',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'sysuiloadtasks_id' => [
            'name' => 'sysuiloadtasks_id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'method' => [
            'name' => 'method',
            'type' => 'varchar',
            'len' => 150
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
            'name' => 'idx_sysuiloadtaskitems',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];


$dictionary['sysuicustomloadtasks'] = [
    'table' => 'sysuicustomloadtasks',
    'audited' => true,
    'fields' => $dictionary['sysuiloadtasks']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomloadtasks',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];


$dictionary['sysuicustomloadtaskitems'] = [
    'table' => 'sysuicustomloadtaskitems',
    'audited' => true,
    'fields' => $dictionary['sysuiloadtaskitems']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomloadtaskitems',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicalendarcolorconditions'] = [
    'table' => 'sysuicalendarcolorconditions',
    'audited' => true,
    'fields' =>
        [
            'id' => [
                'name' => 'id',
                'type' => 'id'
            ],
            'module' => [
                'name' => 'module',
                'type' => 'varchar',
                'len' => 100
            ],
            'priority' => [
                'name' => 'priority',
                'type' => 'int',
                'default' => 0,
            ],
            'module_filter' => [
                'name' => 'module_filter',
                'type' => 'varchar',
                'len' => 50
            ],
            'color_hex_code' => [
                'name' => 'color_hex_code',
                'type' => 'varchar',
                'len' => 7
            ],
            'category' => [
                'name' => 'category',
                'type' => 'varchar',
                'len' => 55
            ],
        ],
    'indices' => [
        [
            'name' => 'sysuicalendarcolorconditionspk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicalendars'] = [
    'table' => 'sysuicalendars',
    'audited' => true,
    'fields' =>
        [
            'id' => [
                'name' => 'id',
                'type' => 'id'
            ],
            'name' => [
                'name' => 'name',
                'type' => 'varchar',
                'len' => 100
            ],
            'icon' => [
                'name' => 'icon',
                'type' => 'varchar',
                'len' => 50
            ],
            'is_default' => [
                'name' => 'is_default',
                'type' => 'int',
                'len' => 1
            ],
        ],
    'indices' => [
        [
            'name' => 'sysuicalendarspk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicalendaritems'] = [
    'table' => 'sysuicalendaritems',
    'fields' =>
        [
            'id' => [
                'name' => 'id',
                'type' => 'id'
            ],
            'name' => [
                'name' => 'name',
                'type' => 'varchar',
                'len' => 100
            ],
            'module' => [
                'name' => 'module',
                'type' => 'varchar',
                'len' => 50
            ],
            'type' => [
                'name' => 'type',
                'vname' => 'LBL_TYPE',
                'type' => 'enum',
                'len' => 100,
                'options' => 'calendar_type_dom',
                'importable' => 'required',
                'required' => true,
            ],
            'field_date_start' => [
                'name' => 'field_date_start',
                'type' => 'varchar',
            ],
            'field_date_end' => [
                'name' => 'field_date_end',
                'type' => 'varchar',
            ],
            'field_event' => [
                'name' => 'field_event',
                'type' => 'varchar',
                'len' => 50
            ],
            'module_filter' => [
                'name' => 'module_filter',
                'type' => 'id'
            ],
            'calendar_id' => [
                'name' => 'calendar_id',
                'type' => 'id'
            ],
            'owner' => [
                'name' => 'owner',
                'type' => 'id'
            ],
        ],
    'indices' => [
        [
            'name' => 'idx_sysuicalendaritems',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuicalendaritems_owner',
            'type' => 'index',
            'fields' => ['owner']]
    ]
];
$dictionary['sysuicustomcalendaritems'] = [
    'table' => 'sysuicustomcalendaritems',
    'fields' => $dictionary['sysuicalendaritems']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomcalendaritems',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuicustomcalendaritems_owner',
            'type' => 'index',
            'fields' => ['owner']]
    ]
];

$dictionary['sysuimodulerepository'] = [
    'table' => 'sysuimodulerepository',
    'changerequests' => [
        'active' => true,
        'name' => 'module'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'path' => [
            'name' => 'path',
            'type' => 'varchar',
            'len' => 500
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
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
            'name' => 'idx_sysuimodulerepository',
            'type' => 'primary',
            'fields' => ['id']],
    ]
];

$dictionary['sysuicustommodulerepository'] = [
    'table' => 'sysuicustommodulerepository',
    'fields' => $dictionary['sysuimodulerepository']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustommodulerepository',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuiobjectrepository'] = [
    'table' => 'sysuiobjectrepository',
    'changerequests' => [
        'active' => true,
        'name' => 'object'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'object' => [
            'name' => 'object',
            'type' => 'varchar',
            'len' => 100
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 36
        ],
        'path' => [
            'name' => 'path',
            'type' => 'varchar',
            'len' => 500
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'deprecated' => [
            'name' => 'deprecated',
            'type' => 'bool',
            'default' => 0
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuiobjectrepository',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicustomobjectrepository'] = [
    'table' => 'sysuicustomobjectrepository',
    'fields' => $dictionary['sysuiobjectrepository']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomobjectrepository',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicomponentsets'] = [
    'table' => 'sysuicomponentsets',
    'changerequests' => [
        'active' => true,
        'name' => 'name'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
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
            'name' => 'idx_sysuicomponentsets',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicustomcomponentsets'] = [
    'table' => 'sysuicustomcomponentsets',
    'fields' => $dictionary['sysuicomponentsets']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomcomponentsets',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicomponentsetscomponents'] = [
    'table' => 'sysuicomponentsetscomponents',
    'changerequests' => [
        'active' => true,
        'name' => 'component'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'componentset_id' => [
            'name' => 'componentset_id',
            'type' => 'id'
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int'
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuicomponentsetscomponents',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuicomponentsetscomponents_setid',
            'type' => 'index',
            'fields' => ['componentset_id']]
    ]
];

$dictionary['sysuicustomcomponentsetscomponents'] = [
    'table' => 'sysuicustomcomponentsetscomponents',
    'fields' => $dictionary['sysuicomponentsetscomponents']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomcomponentsetscomponents',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuicustomcomponentsetscomponents_setid',
            'type' => 'index',
            'fields' => ['componentset_id']]
    ]
];

$dictionary['sysuifieldsets'] = [
    'table' => 'sysuifieldsets',
    'changerequests' => [
        'active' => true,
        'name' => 'module'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
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
            'name' => 'idx_sysuifieldsets',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicustomfieldsets'] = [
    'table' => 'sysuicustomfieldsets',
    'fields' => $dictionary['sysuifieldsets']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomfieldsets',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuifieldsetsitems'] = [
    'table' => 'sysuifieldsetsitems',
    'changerequests' => [
        'active' => true,
        'name' => 'field'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'fieldset_id' => [
            'name' => 'fieldset_id',
            'type' => 'id'
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int'
        ],
        'field' => [
            'name' => 'field',
            'type' => 'varchar',
            'len' => 100
        ],
        'fieldset' => [
            'name' => 'fieldset',
            'type' => 'varchar',
            'len' => 36
        ],
        'fieldconfig' => [
            'name' => 'fieldconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuifieldsetsitems',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuifieldsetsitems_setid',
            'type' => 'index',
            'fields' => ['fieldset_id']]
    ]
];

$dictionary['sysuicustomfieldsetsitems'] = [
    'table' => 'sysuicustomfieldsetsitems',
    'fields' => $dictionary['sysuifieldsetsitems']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomfieldsetsitems',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuicustomfieldsetsitems_setid',
            'type' => 'index',
            'fields' => ['fieldset_id']]
    ]
];

$dictionary['sysuiactionsets'] = [
    'table' => 'sysuiactionsets',
    'changerequests' => [
        'active' => true,
        'name' => 'name'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
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
            'name' => 'idx_sysuiactionsets',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicustomactionsets'] = [
    'table' => 'sysuicustomactionsets',
    'fields' => $dictionary['sysuiactionsets']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomactionsets',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuiactionsetitems'] = [
    'table' => 'sysuiactionsetitems',
    'changerequests' => [
        'active' => true,
        'name' => 'action'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'actionset_id' => [
            'name' => 'actionset_id',
            'type' => 'id'
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int'
        ],
        'action' => [
            'name' => 'action',
            'type' => 'varchar',
            'len' => 100
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'actionconfig' => [
            'name' => 'actionconfig',
            'type' => 'shorttext',
            'len' => 2000
        ],
        'singlebutton' => [
            'name' => 'singlebutton',
            'type' => 'bool',
            'default' => 0
        ],
        'requiredmodelstate' => [
            'name' => 'requiredmodelstate',
            'type' => 'varchar',
            'len' => 30
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
            'name' => 'idx_sysuiactionsetitems',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicustomactionsetitems'] = [
    'table' => 'sysuicustomactionsetitems',
    'fields' => $dictionary['sysuiactionsetitems']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomactionsetitems',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuiroutes'] = [
    'table' => 'sysuiroutes',
    'changerequests' => [
        'active' => true,
        'name' => 'path'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'path' => [
            'name' => 'path',
            'type' => 'varchar',
            'len' => 255
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'redirectto' => [
            'name' => 'redirectto',
            'type' => 'varchar',
            'len' => 100
        ],
        'pathmatch' => [
            'name' => 'pathmatch',
            'type' => 'varchar',
            'len' => 4
        ],
        'loginrequired' => [
            'name' => 'loginrequired',
            'type' => 'int',
            'len' => 1
        ],
        'target' => [
            'name' => 'target',
            'type' => 'varchar',
            'len' => 1,
            'comment' => 'the target for the tab in tabbed browsing, an be M for main, N for New or C for current'
        ],
        'subtabs' => [
            'name' => 'subtabs',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'set to true to allow subtabs on this route'
        ],
        'referencepath' => [
            'name' => 'referencepath',
            'type' => 'varchar',
            'len' => 255,
            'comment' => 'a path that is then treated as one and the view is rendered in that window if one exists'
        ],
        'aclaction' => [
            'name' => 'aclaction',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'the acl action to be checked when navigating to the route'
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
            'name' => 'idx_sysuiroutes',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicustomroutes'] = [
    'table' => 'sysuicustomroutes',
    'fields' => $dictionary['sysuiroutes']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomroutes',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];


$dictionary['sysmodules'] = [
    'table' => 'sysmodules',
    'changerequests' => [
        'active' => true,
        'name' => 'module'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'module_label' => [
            'name' => 'module_label',
            'type' => 'varchar',
            'len' => 100
        ],
        'singular' => [
            'name' => 'singular',
            'type' => 'varchar',
            'len' => 100
        ],
        'singular_label' => [
            'name' => 'singular_label',
            'type' => 'varchar',
            'len' => 100
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'varchar',
            'len' => 100
        ],
        'track' => [
            'name' => 'track',
            'type' => 'int',
            'len' => 1
        ],
        'favorites' => [
            'name' => 'favorites',
            'type' => 'int',
            'len' => 1
        ],
        'duplicatecheck' => [
            'name' => 'duplicatecheck',
            'type' => 'int',
            'len' => 1
        ],
        'actionset' => [
            'name' => 'actionset',
            'type' => 'varchar',
            'len' => 36
        ],
        'bean' => [
            'name' => 'bean',
            'type' => 'varchar',
        ],
        'beanfile' => [
            'name' => 'beanfile',
            'type' => 'varchar',
        ],
        'beantable' => [
            'name' => 'beantable',
            'type' => 'varchar',
            'comment' => 'deprecated. See sysdictionarydefinition_id'
        ],
        'sysdictionarydefinition_id' => [
            'name' => 'sysdictionarydefinition_id',
            'type' => 'id',
        ],
        'visible' => [
            'name' => 'visible',
            'type' => 'bool',
        ],
        'visibleaclaction' => [
            'name' => 'visibleaclaction',
            'type' => 'varchar',
            'len' => 30
        ],
        'tagging' => [
            'name' => 'tagging',
            'type' => 'bool',
            'default' => 0
        ],
        'acl' => [
            'name' => 'acl',
            'type' => 'bool',
            'default' => 1
        ],
        'acl_multipleusers' => [
            'name' => 'acl_multipleusers',
            'type' => 'bool',
            'default' => 0
        ],
        'workflow' => [
            'name' => 'workflow',
            'type' => 'bool',
            'default' => 0
        ],
        'reassignable' => [
            'name' => 'reassignable',
            'type' => 'bool',
            'default' => 0
        ],
        'reassign_modulefilter_id' => [
            'name' => 'reassign_modulefilter_id',
            'type' => 'id',
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
            'name' => 'sysmodulespk',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysmodules',
            'type' => 'index',
            'fields' => ['module']],
        [
            'name' => 'idx_sysmodules_reassign',
            'type' => 'index',
            'fields' => ['reassignable']],
        [
            'name' => 'idx_sysmodules_singular',
            'type' => 'index',
            'fields' => ['singular']],
        [
            'name' => 'idx_sysmodules_sysdictionarydef',
            'type' => 'index',
            'fields' => ['sysdictionarydefinition_id']],
    ]
];

$dictionary['syscustommodules'] = [
    'table' => 'syscustommodules',
    'fields' => $dictionary['sysmodules']['fields'],
    'indices' => [
        [
            'name' => 'idx_syscustommodules',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_syscustommodules_module',
            'type' => 'index',
            'fields' => ['module']],
        [
            'name' => 'idx_syscustommodules_reassign',
            'type' => 'index',
            'fields' => ['reassignable']],
        [
            'name' => 'idx_syscustommodules_singular',
            'type' => 'index',
            'fields' => ['singular']],
        [
            'name' => 'idx_syscustommodules_sysdictionarydef',
            'type' => 'index',
            'fields' => ['sysdictionarydefinition_id']],
    ]
];

$dictionary['sysmodulemenus'] = [
    'table' => 'sysmodulemenus',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'menuitem' => [
            'name' => 'menuitem',
            'type' => 'varchar',
            'len' => 100
        ],
        'action' => [
            'name' => 'action',
            'type' => 'varchar',
            'len' => 100
        ],
        'route' => [
            'name' => 'route',
            'type' => 'varchar',
            'len' => 100
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
            'name' => 'idx_sysmodulemenus',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysmodule_module',
            'type' => 'index',
            'fields' => ['module']
        ]
    ]
];

$dictionary['sysuicomponentdefaultconf'] = [
    'table' => 'sysuicomponentdefaultconf',
    'changerequests' => [
        'active' => true,
        'name' => 'component'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'role_id' => [
            'name' => 'role_id',
            'type' => 'id'
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuicomponentdefaultconf',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicustomcomponentdefaultconf'] = [
    'table' => 'sysuicustomcomponentdefaultconf',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'role_id' => [
            'name' => 'role_id',
            'type' => 'id'
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuicustomcomponentdefaultconf',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicomponentmoduleconf'] = [
    'table' => 'sysuicomponentmoduleconf',
    'changerequests' => [
        'active' => true,
        'name' => ['module', 'component']
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'role_id' => [
            'name' => 'role_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuicomponentmoduleconf',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuicomponentmoduleconf_module',
            'type' => 'index',
            'fields' => ['module']]
    ]
];

$dictionary['sysuicustomcomponentmoduleconf'] = [
    'table' => 'sysuicustomcomponentmoduleconf',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'role_id' => [
            'name' => 'role_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuicustomcomponentmoduleconf',
            'type' => 'primary',
            'fields' => ['id']],
        [
            'name' => 'idx_sysuicustomcomponentmoduleconf_module',
            'type' => 'index',
            'fields' => ['module']]
    ]
];

$dictionary['sysmodulelists'] = [
    'table' => 'sysmodulelists',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'created_by_id' => [
            'name' => 'created_by_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'listcomponent' => [
            'name' => 'listcomponent',
            'type' => 'varchar',
            'len' => 100
        ],
        'global' => [
            'name' => 'global',
            'type' => 'int',
            'len' => 1
        ],
        'basefilter' => [
            'name' => 'basefilter',
            'type' => 'varchar',
            'len' => 3,
            'default' => 'all'
        ],
        'fielddefs' => [
            'name' => 'fielddefs',
            'type' => 'text'
        ],
        'filterdefs' => [
            'name' => 'filterdefs',
            'type' => 'text'
        ],
        'aggregates' => [
            'name' => 'aggregates',
            'type' => 'text'
        ],
        'sortfields' => [
            'name' => 'sortfields',
            'type' => 'text'
        ],
        'date_last_used' => [
            'name' => 'date_last_used',
            'type' => 'datetime'
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
            'name' => 'idx_sysmodulelists',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];


$dictionary['sysuidashboarddashlets'] = [
    'table' => 'sysuidashboarddashlets',
    'changerequests' => [
        'active' => true,
        'name' => 'name'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
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
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'varchar',
            'len' => 100
        ],
        'acl_action' => [
            'name' => 'acl_action',
            'type' => 'varchar',
            'len' => 30
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuidashboarddashlets',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicustomdashboarddashlets'] = [
    'table' => 'sysuicustomdashboarddashlets',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
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
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'varchar',
            'len' => 100
        ],
        'acl_action' => [
            'name' => 'acl_action',
            'type' => 'varchar',
            'len' => 30
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
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
            'name' => 'idx_sysuicustomdashboarddashlets',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuiroles'] = [
    'table' => 'sysuiroles',
    'changerequests' => [
        'active' => true,
        'name' => 'name'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'identifier' => [
            'name' => 'identifier',
            'type' => 'varchar',
            'len' => '3'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100'
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => '100'
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'varchar',
            'len' => '50'
        ],
        'systemdefault' => [
            'name' => 'systemdefault',
            'type' => 'bool'
        ],
        'portaldefault' => [
            'name' => 'portaldefault',
            'type' => 'bool'
        ],
        'showsearch' => [
            'name' => 'showsearch',
            'type' => 'bool',
            'default' => 1
        ],
        'showfavorites' => [
            'name' => 'showfavorites',
            'type' => 'bool',
            'default' => 1
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
        ],
        'default_dashboard' => [
            'name' => 'default_dashboard',
            'type' => 'id'
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
            'name' => 'idx_sysuiroles',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuicustomroles'] = [
    'table' => 'sysuicustomroles',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'identifier' => [
            'name' => 'identifier',
            'type' => 'varchar',
            'len' => '3'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100'
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => '100'
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'varchar',
            'len' => '50'
        ],
        'systemdefault' => [
            'name' => 'systemdefault',
            'type' => 'bool'
        ],
        'portaldefault' => [
            'name' => 'portaldefault',
            'type' => 'bool'
        ],
        'showsearch' => [
            'name' => 'showsearch',
            'type' => 'bool',
            'default' => 1
        ],
        'showfavorites' => [
            'name' => 'showfavorites',
            'type' => 'bool',
            'default' => 1
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
        ],
        'default_dashboard' => [
            'name' => 'default_dashboard',
            'type' => 'id'
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
            'name' => 'idx_sysuicustomroles',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysuiuserroles'] = [
    'table' => 'sysuiuserroles',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id'
        ],
        'sysuirole_id' => [
            'name' => 'sysuirole_id',
            'type' => 'id'
        ],
        'defaultrole' => [
            'name' => 'defaultrole',
            'type' => 'int',
            'len' => 1,
            'default' => 0
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysuiuserroles',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysuiuserroles_userid',
            'type' => 'index',
            'fields' => ['user_id']
        ]
    ]
];

$dictionary['sysuirolemodules'] = [
    'table' => 'sysuirolemodules',
    'changerequests' => [
        'active' => true,
        'name' => ['sysuirole_id', 'module']
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'sysuirole_id' => [
            'name' => 'sysuirole_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'sequence' => [
            'name' => 'sequence',
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
            'name' => 'idx_sysuirolemodules',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysuirolemodules_roleid',
            'type' => 'index',
            'fields' => ['sysuirole_id']
        ]
    ]
];

$dictionary['sysuicustomrolemodules'] = [
    'table' => 'sysuicustomrolemodules',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'sysuirole_id' => [
            'name' => 'sysuirole_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'sequence' => [
            'name' => 'sequence',
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
            'name' => 'idx_sysuicustomrolemodules',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysuicustomrolemodules_roleid',
            'type' => 'index',
            'fields' => ['sysuirole_id']
        ]
    ]
];

$dictionary['sysuiadmingroups'] = [
    'table' => 'sysuiadmingroups',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => 50
        ],
        'sequence' => [
            'name' => 'sequence',
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
            'name' => 'idx_sysuiadmingroups',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicustomadmingroups'] = [
    'table' => 'sysuicustomadmingroups',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'label' => [
            'name' => 'label',
            'type' => 'varchar',
            'len' => 50
        ],
        'sequence' => [
            'name' => 'sequence',
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
            'name' => 'idx_sysuicustomadmingroups',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuiadmincomponents'] = [
    'table' => 'sysuiadmincomponents',
    'changerequests' => [
        'active' => true,
        'name' => ['admingroup', 'adminaction']
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'admingroup' => [
            'name' => 'admingroup',
            'type' => 'varchar',
            'len' => 100
        ],
        'adminaction' => [
            'name' => 'adminaction',
            'type' => 'varchar',
            'len' => 100
        ],
        // darf nicht nur label heißen...
        'admin_label' => [
            'name' => 'admin_label',
            'type' => 'varchar',
            'len' => 40
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int'
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'varchar',
            'len' => 50
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
            'name' => 'idx_sysuiadmincomponents',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicustomadmincomponents'] = [
    'table' => 'sysuicustomadmincomponents',
    'changerequests' => [
        'active' => true,
        'name' => ['admingroup', 'adminaction']
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'admingroup' => [
            'name' => 'admingroup',
            'type' => 'varchar',
            'len' => 100
        ],
        'adminaction' => [
            'name' => 'adminaction',
            'type' => 'varchar',
            'len' => 100
        ],
        // darf nicht nur label heißen...
        'admin_label' => [
            'name' => 'admin_label',
            'type' => 'varchar',
            'len' => 40
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int'
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'varchar',
            'len' => 50
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
            'name' => 'idx_sysuicustomadmincomponents',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];


$dictionary['sysuifieldtypemapping'] = [
    'table' => 'sysuifieldtypemapping',
    'changerequests' => [
        'active' => true,
        'name' => 'fieldtype'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'fieldtype' => [
            'name' => 'fieldtype',
            'type' => 'varchar',
            'len' => 100
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
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
            'name' => 'idx_sysuifieldtypemapping',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];


$dictionary['sysuicustomfieldtypemapping'] = [
    'table' => 'sysuicustomfieldtypemapping',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'fieldtype' => [
            'name' => 'fieldtype',
            'type' => 'varchar',
            'len' => 100
        ],
        'component' => [
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
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
            'name' => 'idx_sysuicustomfieldtypemapping',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];


$dictionary['sysuicopyrules'] = [
    'table' => 'sysuicopyrules',
    'changerequests' => [
        'active' => true,
        'name' => ['frommodule', 'tomodule', 'tofield']
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'frommodule' => [
            'name' => 'frommodule',
            'type' => 'varchar',
            'len' => 50
        ],
        'fromfield' => [
            'name' => 'fromfield',
            'type' => 'varchar',
            'len' => 50
        ],
        'tomodule' => [
            'name' => 'tomodule',
            'type' => 'varchar',
            'len' => 50
        ],
        'tofield' => [
            'name' => 'tofield',
            'type' => 'varchar',
            'len' => 50
        ],
        'fixedvalue' => [
            'name' => 'fixedvalue',
            'type' => 'varchar',
            'len' => 100
        ],
        'calculatedvalue' => [
            'name' => 'calculatedvalue',
            'type' => 'varchar',
            'len' => 100
        ],
        'params' => [
            'name' => 'params',
            'type' => 'json',
            'dbtype' => 'shorttext',
            'len' => 1000
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
            'name' => 'idx_sysuicopyrules',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysuicustomcopyrules'] = [
    'table' => 'sysuicustomcopyrules',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'frommodule' => [
            'name' => 'frommodule',
            'type' => 'varchar',
            'len' => 50
        ],
        'fromfield' => [
            'name' => 'fromfield',
            'type' => 'varchar',
            'len' => 50
        ],
        'tomodule' => [
            'name' => 'tomodule',
            'type' => 'varchar',
            'len' => 50
        ],
        'tofield' => [
            'name' => 'tofield',
            'type' => 'varchar',
            'len' => 50
        ],
        'fixedvalue' => [
            'name' => 'fixedvalue',
            'type' => 'varchar',
            'len' => 100
        ],
        'calculatedvalue' => [
            'name' => 'calculatedvalue',
            'type' => 'varchar',
            'len' => 100
        ],
        'params' => [
            'name' => 'params',
            'type' => 'json',
            'dbtype' => 'shorttext',
            'len' => 1000
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
            'name' => 'idx_sysuicustomcopyrules',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['spiceimportlogs'] = [
    'table' => 'spiceimportlogs',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'import_id' => [
            'name' => 'import_id',
            'type' => 'id'
        ],
        'msg' => [
            'name' => 'msg',
            'type' => 'varchar'
        ],
        'data' => [
            'name' => 'data',
            'type' => 'text'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_spiceimportlogs',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

/**
 * VALIDATIONs
 */


$dictionary['sysuimodelvalidations'] = [
    'table' => 'sysuimodelvalidations',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100,
            'required' => true,
        ],
        'onevents' => [
            'name' => 'onevents',
            'type' => 'varchar',
            'len' => 100,
        ],
        'active' => [
            'name' => 'active',
            'type' => 'bool',
            'default' => 1,
        ],
        'logicoperator' => [
            'name' => 'logicoperator',
            'type' => 'enum',
            'options' => 'logicoperators_dom',
            'len' => 3,
        ],
        'priority' => [
            'name' => 'priority',
            'type' => 'int',
            'default' => 0,
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'isnull' => false,
        ],
    ],
    'indices' => [
        [
            'name' => 'prm_sysuimodelvalidations',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ],
];

$dictionary['sysuimodelvalidationconditions'] = [
    'table' => 'sysuimodelvalidationconditions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'sysuimodelvalidation_id' => [
            'name' => 'sysuimodelvalidation_id',
            'type' => 'id',
            'required' => true,
        ],
        'fieldname' => [
            'name' => 'fieldname',
            'type' => 'varchar',
            'required' => true,
            'len' => 255,
        ],
        'comparator' => [
            'name' => 'comparator',
            'type' => 'enum',
            'options' => 'comparators_dom',
            'default' => 'equal',
            'len' => 20,
        ],
        'valuations' => [
            'name' => 'valuations',
            'type' => 'varchar',
            'required' => true,
        ],
        'onchange' => [
            'name' => 'onchange',
            'type' => 'bool'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'isnull' => false,
        ],
    ],
    'indices' => [
        [
            'name' => 'prm_sysuimodvalcon',
            'type' => 'primary',
            'fields' => ['id'],
        ],
    ],
];

$dictionary['sysuimodelvalidationactions'] = [
    'table' => 'sysuimodelvalidationactions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'sysuimodelvalidation_id' => [
            'name' => 'sysuimodelvalidation_id',
            'type' => 'id'
        ],
        'fieldname' => [
            'name' => 'fieldname',
            'type' => 'varchar',
            'len' => 255,
            'required' => true,
        ],
        'action' => [
            'name' => 'action',
            'type' => 'varchar',
            'len' => 20,
            'required' => true,
        ],
        'params' => [
            'name' => 'params',
            'type' => 'varchar'
        ],
        'priority' => [
            'name' => 'priority',
            'type' => 'int',
            'default' => 0,
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'isnull' => false,
        ],
    ],
    'indices' => [
        [
            'name' => 'prm_sysuimodvalact',
            'type' => 'primary',
            'fields' => ['id'],
        ],
    ],
];

$dictionary['sysmailrelais'] = [
    'table' => 'sysmailrelais',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
        ],
        'service' => [
            'name' => 'service',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
        ],
        'api_key' => [
            'name' => 'api_key',
            'type' => 'varchar'
        ],
        'username' => [
            'name' => 'username',
            'type' => 'varchar'
        ],
        'password' => [
            'name' => 'password',
            'type' => 'varchar'
        ],
        'from_email' => [
            'name' => 'from_email',
            'type' => 'varchar'
        ],
        'from_name' => [
            'name' => 'from_name',
            'type' => 'varchar'
        ],

    ],
    'indices' => [
        [
            'name' => 'idx_sysmailrelais',
            'type' => 'primary',
            'fields' => ['id'],
        ]
    ],
];

$dictionary['sysuilibs'] = [
    'table' => 'sysuilibs',
    'changerequests' => [
        'active' => true,
        'name' => 'name'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
        ],
        'src' => [
            'name' => 'src',
            'type' => 'varchar',
        ],
        'rank' => [
            'name' => 'rank',
            'type' => 'int',
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
            'name' => 'idx_sysuiapis',
            'type' => 'primary',
            'fields' => ['id'],
        ]
    ],
];

$dictionary['sysuicustomlibs'] = [
    'table' => 'sysuicustomlibs',
    'fields' => $dictionary['sysuilibs']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustomlibs',
            'type' => 'primary',
            'fields' => ['id'],
        ]
    ],
];


/**
 * managing model states
 */
$dictionary['sysuimodelstates'] = [
    'table' => 'sysuimodelstates',
    'changerequests' => [
        'active' => true,
        'name' => 'modelstate'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 50,
        ],
        'modelstate' => [
            'name' => 'modelstate',
            'type' => 'varchar',
            'len' => 50,
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysuimodelstates',
            'type' => 'primary',
            'fields' => ['id'],
        ]
    ],
];

$dictionary['sysuicustommodelstates'] = [
    'table' => 'sysuicustommodelstates',
    'fields' => $dictionary['sysuimodelstates']['fields'],
    'indices' => [
        [
            'name' => 'idx_sysuicustommodelstates',
            'type' => 'primary',
            'fields' => ['id'],
        ]
    ],
];

$dictionary['sysuihtmlstylesheets'] = [
    'table' => 'sysuihtmlstylesheets',
    'changerequests' => [
        'active' => true,
        'name' => 'name'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'csscode' => [
            'name' => 'csscode',
            'type' => 'text'
        ],
        'inactive' => [
            'name' => 'inactive',
            'type' => 'bool',
            'default' => false
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
            'name' => 'idx_sysuihtmlstylesheets_prim',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysuihtmlstylesheets_2',
            'type' => 'index',
            'fields' => ['id', 'inactive']
        ],
    ]
];

$dictionary['sysuihtmlformats'] = [
    'table' => 'sysuihtmlformats',
    'changerequests' => [
        'active' => true,
        'name' => 'name'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'inline' => [
            'name' => 'inline',
            'type' => 'varchar',
            'len' => 30
        ],
        'block' => [
            'name' => 'block',
            'type' => 'varchar',
            'len' => 30
        ],
        'classes' => [
            'name' => 'classes',
            'type' => 'varchar',
            'len' => 100
        ],
        'styles' => [
            'name' => 'styles',
            'type' => 'text'
        ],
        'wrapper' => [
            'name' => 'wrapper',
            'type' => 'bool',
            'default' => false
        ],
        'stylesheet_id' => [
            'name' => 'stylesheet_id',
            'type' => 'id'
        ],
        'inactive' => [
            'name' => 'inactive',
            'type' => 'bool',
            'default' => false
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
            'name' => 'idx_sysuihtmlformats',
            'type' => 'primary',
            'fields' => ['id']
        ],
    ]
];
$dictionary['sysdialogmail_fieldmapping'] = [
    'table' => 'sysdialogmail_fieldmapping',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255
        ],
        'spice' => [
            'name' => 'spice',
            'type' => 'varchar',
            'len' => 255
        ],
        'dialogmail' => [
            'name' => 'dialogmail',
            'type' => 'varchar',
            'len' => 255
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysdialogmail_fieldmapping',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['syscleverreach_fieldmapping'] = [
    'table' => 'syscleverreach_fieldmapping',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255
        ],
        'spice' => [
            'name' => 'spice',
            'type' => 'varchar',
            'len' => 255
        ],
        'cleverreach' => [
            'name' => 'cleverreach',
            'type' => 'varchar',
            'len' => 255
        ],
        'crtype' => [
            'name' => 'crtype',
            'type' => 'varchar',
            'len' => 255
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syscleverreach_fieldmapping',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['sysmailchimp_fieldmapping'] = [
    'table' => 'sysmailchimp_fieldmapping',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255
        ],
        'spice' => [
            'name' => 'spice',
            'type' => 'varchar',
            'len' => 255
        ],
        'mailchimp' => [
            'name' => 'mailchimp',
            'type' => 'varchar',
            'len' => 255
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysmailchimp_fieldmapping',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysevalanche_fieldmapping'] = [
    'table' => 'sysevalanche_fieldmapping',
    'audited' => true,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255
        ],
        'spice' => [
            'name' => 'spice',
            'type' => 'varchar',
            'len' => 255
        ],
        'evalanche' => [
            'name' => 'evalanche',
            'type' => 'varchar',
            'len' => 255
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysevalanche_fieldmapping',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
