<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['ProjectPlannedActivity'] = [
    'table' => 'projectplannedactivities',
    'comment' => 'ProjectPlannedActivities Module',
	'fields' => [
		'activity_type' => [
            'name' => 'activity_type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'options' => 'projects_activity_types_dom',
			'len' => 32
        ],
		'activity_level' => [
            'name' => 'activity_level',
            'vname' => 'LBL_LEVEL',
            'type' => 'enum',
            'options' => 'projects_activity_levels_dom',
			'len' => 32
        ],
		'effort' => [
			'name' => 'effort',
            'vname' => 'LBL_EFFORT',
            'type' => 'double',
			'len' => 6,
            'comment' => ' the total planned effort'
        ],
		'consumed' => [
			'name' => 'consumed',
            'vname' => 'LBL_CONSUMED',
            'type' => 'double',
            'source' => 'non-db',
			'len' => 6,
            'comment' => 'the total consumed effort'
        ],
		'ratio' => [
			'name' => 'ratio',
            'vname' => 'LBL_RATIO',
            'type' => 'int',
            'source' => 'non-db',
			'len' => 6,
            'comment' => 'the percentage consumed'
        ],
        'is_active' => [
            'name' =>  'is_active',
            'vname' => 'LBL_ACTIVE',
            'type' => 'bool',
            'comment' => 'planned activity is active'
        ],
        'date_start' => [
            'name' => 'date_start',
            'type' => 'date',
            'vname' => 'LBL_DATE_START',
            'required' => false
        ],
        'date_end' => [
            'name' => 'date_end',
            'type' => 'date',
            'vname' => 'LBL_DATE_END',
            'required' => false
        ],
        'projectwbs_id' => [
            'name' => 'projectwbs_id',
            'vname' => 'LBL_PROJECTWBS_ID',
            'type' => 'id',
        ],
        'projectwbs_name' => [
            'name' => 'projectwbs_name',
            'vname' => 'LBL_PROJECTWBS',
            'type' => 'relate',
            'source' => 'non-db',
            'len' => '255',
            'id_name' => 'projectwbs_id',
            'module' => 'ProjectWBSs',
            'link' => 'projectwbss',
            'join_name' => 'projectwbss',
            'rname' => 'name'
        ],
        'projectwbss' => [
            'name' => 'projectwbss',
            'vname' => 'LBL_PROJECTWBSS',
            'type' => 'link',
            'relationship' => 'projectwbs_projectplannedactivities',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
        ],
        'project_name' => [
            'name' => 'project_name',
            'vname' => 'LBL_PROJECT',
            'type' => 'name',
            'source' => 'non-db',
            'len' => '255',
            'comment' => 'related project name allocated over wbs element'
        ],

        'projectactivitytype_id' => [
            'name' => 'projectactivitytype_id',
            'vname' => 'LBL_PROJECTACTIVITYTYPE_ID',
            'type' => 'id',
        ],
        'projectactivitytype_name' => [
            'name' => 'projectactivitytype_name',
            'vname' => 'LBL_PROJECTACTIVITYTYPE',
            'type' => 'relate',
            'source' => 'non-db',
            'len' => '255',
            'id_name' => 'projectactivitytype_id',
            'module' => 'ProjectActivityTypes',
            'link' => 'projectactivitytype',
            'rname' => 'name',
        ],
        'projectactivitytype' => [
            'name' => 'projectactivitytype',
            'vname' => 'LBL_PROJECTACTIVITYTYPE',
            'type' => 'link',
            'relationship' => 'projectactivitytype_projectplannedactivities',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
        ],
        'projectactivities' => [
            'name' => 'projectactivities',
            'type' => 'link',
            'module' => 'ProjectActivities',
            'relationship' => 'projectplannedactivity_projectactivities',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTACTIVITIES',
        ],
    ],
	'relationships' => [
        'projectplannedactivity_projectactivities' => [
            'lhs_module' => 'ProjectPlannedActivities',
            'lhs_table' => 'projectplannedactivities',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectActivities',
            'rhs_table' => 'projectactivities',
            'rhs_key' => 'projectplannedactivity_id',
            'relationship_type' => 'one-to-many'
        ],
//        'projectplannedactivities_tasks' => [
//            'lhs_module' => 'ProjectPlannedActivities',
//            'lhs_table' => 'projectplannedactivities',
//            'lhs_key' => 'id',
//            'rhs_module' => 'Tasks',
//            'rhs_table' => 'tasks',
//            'rhs_key' => 'parent_id',
//            'relationship_type' => 'one-to-many',
//            'relationship_role_column' => 'parent_type',
//            'relationship_role_column_value' => 'ProjectPlannedActivities'
//        ],
    ],
	'indices' => [
        ['name' => 'idx_ppwbsid', 'type' => 'index', 'fields' => ['projectwbs_id']],
        ['name' => 'idx_ppwbsdel', 'type' => 'index', 'fields' => ['projectwbs_id', 'deleted']]
    ]
];

VardefManager::createVardef('ProjectPlannedActivities', 'ProjectPlannedActivity', ['default', 'assignable']);
