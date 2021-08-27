<?php

//dictionary global variable => class name als key
use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['ScrumEpic'] = [
    'table' => 'scrumepics',
    'comment' => 'SCRUM Epics Module',
    'audited' =>  true,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100',
            'vname' => 'LBL_NAME',
        ],
        'description'  => [
            'name' => 'description',
            'type' => 'text',
            'vname' => 'LBL_DESCRIPTION',
        ],
        'scrum_status'=> [
            'name' => 'scrum_status',
            'type' => 'enum',
            'options' => 'scrum_status_dom',
            'len' => 50,
            'vname' => 'LBL_STATUS',
        ],
        'has_stories'=> [
            'name' => 'has_stories',
            'type' => 'bool',
            'source' => 'non-db',
        ],
        'scrumtheme_id' => [
            'name' => 'scrumtheme_id',
            'vname' => 'LBL_SCRUM_THEME',
            'type' => 'id',
            'required' => false
        ],
        'scrumtheme_name' => [
            'name' => 'scrumtheme_name',
            'rname' => 'name',
            'id_name' => 'scrumtheme_id',
            'vname' => 'LBL_SCRUM_THEME',
            'type' => 'relate',
            'link' => 'scrumtheme',
            'isnull' => 'true',
            'table' => 'scrumthemes',
            'module' => 'ScrumThemes',
            'source' => 'non-db',
        ],
        'scrumtheme' => [
            'name' => 'scrumtheme',
            'type' => 'link',
            'vname' => 'LBL_SCRUM_THEME',
            'relationship' => 'scrumtheme_scrumepics',
            'module' => 'ScrumThemes',
            'source' => 'non-db'
        ],
        'scrumuserstories' => [
            'name' => 'scrumuserstories',
            'type' => 'link',
            'relationship' => 'scrumepic_scrumuserstories',
            'rname' => 'name',
            'source' => 'non-db',
            'module' => 'ScrumUserStories',
        ],
        'sequence' => [
            'name' => 'sequence',
            'type' => 'int',
            'len' => '11',
            'vname' => 'LBL_SEQUENCE',
        ],
    ],
    'relationships' => [
        'scrumtheme_scrumepics' => [
            'rhs_module' => 'ScrumEpics',
            'rhs_table' => 'scrumepics',
            'rhs_key' => 'scrumtheme_id',
            'lhs_module' => 'ScrumThemes',
            'lhs_table' => 'scrumthemes',
            'lhs_key' => 'id',
            'relationship_type' => 'one-to-many',
            'default' => true
        ]

    ],

    'indices' => [
    ],
];
// default (Basic) fields & assignable (implements->assigned fields)
VardefManager::createVardef('ScrumEpics', 'ScrumEpic', ['default', 'assignable']);


