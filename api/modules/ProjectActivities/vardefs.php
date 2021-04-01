<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['ProjectActivity'] = [
    'table' => 'projectactivities',
    'comment' => 'ProjectActivities Module',
    'audited' => true,
    'fields' => [
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'datetime'
        ],
        'date_end' => [
            'name' => 'date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'datetime'
        ],
        'duration_hours' => [
            'name' => 'duration_hours',
            'vname' => 'LBL_DURATION_HOURS',
            'type' => 'int',
            'len' => '2',
            'source' => 'non-db'
        ],
        'duration_minutes' => [
            'name' => 'duration_minutes',
            'vname' => 'LBL_DURATION_MINUTES',
            'type' => 'int',
            'len' => '2',
            'source' => 'non-db'
        ],
        // @deprecated: projectwbs link
        // keep a while until transition to new relationship projectplannedactivity is completed
        'projectwbs_id' => [
            'name' => 'projectwbs_id',
            'vname' => 'LBL_PROJECTWBS_ID',
            'type' => 'id',
        ],
        'projectwbs_name' => [
            'source' => 'non-db',
            'name' => 'projectwbs_name',
            'vname' => 'LBL_PROJECTWBS',
            'type' => 'relate',
            'rname' => 'name',
            'id_name' => 'projectwbs_id',
            'len' => '255',
            'module' => 'ProjectWBSs',
            'link' => 'projectwbss',
            'join_name' => 'projectwbss',
        ],
        'projectwbss' => [
            'name' => 'projectwbss',
            'type' => 'link',
            'module' => 'ProjectWBSs',
            'relationship' => 'projectwbss_projectactivities',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTWBSS',
        ],
//        'project_name' => [
//            'name' => 'project_name',
//            'vname' => 'LBL_PROJECT',
//            'type' => 'varchar',
//            'source' => 'non-db',
//            'comment' => 'set in fill_in_additional_detail_fields'
//        ],
//        'project_id' => [
//            'name' => 'project_id',
//            'vname' => 'LBL_PROJECT_ID',
//            'type' => 'varchar',
//            'source' => 'non-db',
//            'comment' => 'set in fill_in_additional_detail_fields'
//        ],
        //-- end deprecated
        'projectplannedactivity_id' => [
            'name' => 'projectplannedactivity_id',
            'vname' => 'LBL_PROJECTPLANNEDACTIVITY_ID',
            'type' => 'id',
            'comment' => 'id of related planned activity'
        ],
        'projectplannedactivity_name' => [
            'source' => 'non-db',
            'name' => 'projectplannedactivity_name',
            'vname' => 'LBL_PROJECTPLANNEDACTIVITY',
            'type' => 'relate',
            'rname' => 'name',
            'id_name' => 'projectplannedactivity_id',
            'len' => '255',
            'module' => 'ProjectPlannedActivities',
            'link' => 'projectplannedactivity',
            'join_name' => 'projectplannedactivities',
        ],
        'projectplannedactivity' => [
            'name' => 'projectplannedactivity',
            'type' => 'link',
            'module' => 'ProjectPlannedActivities',
            'relationship' => 'projectplannedactivity_projectactivities',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTPLANNEDACTIVITIES',
        ],
        'activity_type' => [
            'name' => 'activity_type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'required' => false,
            'options' => 'projects_activity_types_dom',
            'len' => 32
        ],
        'activity_level' => [
            'name' => 'activity_level',
            'vname' => 'LBL_LEVEL',
            'type' => 'enum',
            'required' => false,
            'options' => 'projects_activity_levels_dom',
            'len' => 32
        ],
        'activity_status' => [
            'name' => 'activity_status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'required' => true,
            'options' => 'projects_activity_status_dom',
            'default' => 'created',
            'len' => 10
        ],
        'activity_start' => [
            'name' => 'activity_start',
            'vname' => 'LBL_START',
            'type' => 'datetime',
        ],
        'activity_end' => [
            'name' => 'activity_end',
            'vname' => 'LBL_END',
            'type' => 'datetime',
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
            'rname' => 'name'
        ],
        'projectactivitytype' => [
            'name' => 'projectactivitytype',
            'vname' => 'LBL_PROJECTACTIVITYTYPE',
            'type' => 'link',
            'relationship' => 'projectactivitytype_projectactivities',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
        ],
        'projectplannedactivity_summary' => [
            'name' => 'projectplannedactivity_summary',
            'type' => 'name',
            'source' => 'non-db'
        ]
    ],
    'relationships' => [
        // @deprecated: projectwbs link
        // keep a while until transition to new relationship projectplannedactivity is completed
        'projectwbss_projectactivities' => [
            'lhs_module' => 'ProjectWBSs',
            'lhs_table' => 'projectwbss',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectActivities',
            'rhs_table' => 'projectactivities',
            'rhs_key' => 'projectwbs_id',
            'relationship_type' => 'one-to-many'
        ],
        //--end deprecated
    ],
    'indices' => [
        ['name' => 'idx_pwbsid', 'type' => 'index', 'fields' => ['projectwbs_id']],
        ['name' => 'idx_pwbsdel', 'type' => 'index', 'fields' => ['projectwbs_id', 'deleted']],
        ['name' => 'idx_pwbsdel', 'type' => 'index', 'fields' => ['projectplannedactivity_id', 'deleted']]
    ]
];

VardefManager::createVardef('ProjectActivities', 'ProjectActivity', ['default', 'assignable']);
