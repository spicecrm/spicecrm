<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Task'] = ['table' => 'tasks',
    'unified_search'   => true,
    'full_text_search' => true,
    'audited' => true,
    'fields' => [
        'name' => [
            'name'             => 'name',
            'vname'            => 'LBL_SUBJECT',
            'dbType'           => 'varchar',
            'type'             => 'name',
            'len'              => '200',
            'unified_search'   => true,
            'full_text_search' => [
                'boost' => 3,
            ],
            'importable'       => 'required',
            'required'         => 'true',
        ],
        'status' => [
            'name'     => 'status',
            'vname'    => 'LBL_STATUS',
            'type'     => 'enum',
            'options'  => 'task_status_dom',
            'len'      => 100,
            'required' => 'true',
            'default'  => 'Not Started',
        ],
        'date_due_flag' => [
            'name'    => 'date_due_flag',
            'vname'   => 'LBL_NO_DUE_DATE',
            'type'    => 'bool',
            'default' => 0,
        ],
        'date_due' => [
            'name'                => 'date_due',
            'vname'               => 'LBL_DATE_DUE',
            'type'                => 'datetimecombo',
            'dbType'              => 'datetime',
            'enable_range_search' => true,
            'options'             => 'date_range_search_dom',
            'required' => true
        ],
        'time_due' => [
            'name'       => 'time_due',
            'vname'      => 'LBL_DUE_TIME',
            'type'       => 'datetime',
            //'db_concat_fields'=> array(0=>'date_due'),
            'source'     => 'non-db',
            'importable' => 'false',
        ],
        'date_start_flag' => [
            'name'    => 'date_start_flag',
            'vname'   => 'LBL_NO_START_DATE',
            'type'    => 'bool',
            'default' => 0,
        ],
        'date_start' => [
            'name'                => 'date_start',
            'vname'               => 'LBL_DATE_START',
            'type'                => 'datetimecombo',
            'dbType'              => 'datetime',
            'validation'          => [
                'type'      => 'isbefore',
                'compareto' => 'date_due',
                'blank'     => false,
            ],
            'enable_range_search' => true,
            'options'             => 'date_range_search_dom',
        ],
        'external_id' => [
            'name'    => 'external_id',
            'vname'   => 'LBL_EXTERNALID',
            'type'    => 'varchar',
            'len'     => 160,
            'comment' => 'Task ID for external app API',
        ],
        'external_data' => [
            'name'    => 'external_data',
            'vname'   => 'LBL_EXTERNALDATA',
            'type'    => 'text'
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'len'      => '255',
            'comment'  => 'The Sugar object to which the call is related',
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'source'      => 'non-db',
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'type'       => 'id',
            'reportable' => false,
            'vname'      => 'LBL_PARENT_ID',
        ],
        'contact_id' => [
            'name'       => 'contact_id',
            'type'       => 'id',
            'reportable' => false,
            'vname'      => 'LBL_CONTACT_ID',
        ],
        'contact_name' => [
            'name'       => 'contact_name',
            'rname'      => 'name',
            'db_concat_fields' => [
                0 => 'first_name',
                1 => 'last_name',
            ],
            'source'     => 'non-db',
            'len'        => '510',
            'vname'      => 'LBL_CONTACT',
            'reportable' => false,
            'id_name'    => 'contact_id',
            'join_name'  => 'contacts',
            'type'       => 'relate',
            'module'     => 'Contacts',
            'link'       => 'contacts',
            'table'      => 'contacts',
        ],
        'contact_phone' => [
            'name'   => 'contact_phone',
            'type'   => 'phone',
            'source' => 'non-db',
            'vname'  => 'LBL_CONTACT_PHONE',
        ],
        'contact_email' => [
            'name'   => 'contact_email',
            'type'   => 'varchar',
            'vname'  => 'LBL_EMAIL_ADDRESS',
            'source' => 'non-db',
        ],
        'priority' => [
            'name'    => 'priority',
            'vname'   => 'LBL_PRIORITY',
            'type'    => 'enum',
            'options' => 'task_priority_dom',
            'len'     => 100,
        ],
        'worklog' => [
            'name'  => 'worklog',
            'vname' => 'LBL_WORKLOG',
            'type'  => 'text',
        ],
//        'checklist' => [
//            'name'  => 'checklist',
//            'vname' => 'LBL_CHECKLIST',
//            'type'  => 'checklist',
//            'dbtype'  => 'text',
//            'comment' => 'stores the checklist for the task to detail the task in more granular actions'
//        ],
        'contacts' => [
            'name'         => 'contacts',
            'type'         => 'link',
            'relationship' => 'contact_tasks',
            'source'       => 'non-db',
            'side'         => 'right',
            'vname'        => 'LBL_CONTACT',
        ],
        'accounts' => [
            'name'         => 'accounts',
            'type'         => 'link',
            'relationship' => 'account_tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_ACCOUNT',
        ],
        'consumers' => [
            'name'         => 'consumers',
            'type'         => 'link',
            'relationship' => 'consumers_tasks',
            'module'       => 'Consumers',
            'source'       => 'non-db',
            'vname'        => 'LBL_CONSUMERS',
        ],
        'employees' => [
            'name'         => 'employees',
            'type'         => 'link',
            'relationship' => 'employees_tasks',
            'module'       => 'Employees',
            'source'       => 'non-db',
            'vname'        => 'LBL_EMPLOYEES',
        ],
        'opportunities' => [
            'name'         => 'opportunities',
            'type'         => 'link',
            'relationship' => 'opportunity_tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_OPPORTUNITY',
        ],
        'calls' => [
            'name'         => 'calls',
            'type'         => 'link',
            'relationship' => 'calls_tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_CALLS',
        ],
        'meetings' => [
            'name'         => 'meetings',
            'type'         => 'link',
            'relationship' => 'meetings_tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_MEETINGS',
        ],
        'leads' => [
            'name'         => 'leads',
            'type'         => 'link',
            'relationship' => 'lead_tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_LEADS',
        ],
        'projects' => [
            'name'         => 'projects',
            'type'         => 'link',
            'relationship' => 'projects_tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_PROJECTS',
        ],
        'projectwbss' => [
            'name'         => 'projectwbss',
            'type'         => 'link',
            'relationship' => 'projectwbss_tasks',
            'source'       => 'non-db',
            'vname'        => 'LBL_PROJECTWBSS',
        ],
        'notes' => [
            'name'         => 'notes',
            'type'         => 'link',
            'relationship' => 'tasks_notes',
            'module'       => 'Notes',
            'bean_name'    => 'Note',
            'source'       => 'non-db',
            'vname'        => 'LBL_NOTES',
        ],
        'contact_parent' => [
            'name'         => 'contact_parent',
            'type'         => 'link',
            'relationship' => 'contact_tasks_parent',
            'source'       => 'non-db',
            'reportable'   => false
        ],
        'users' => [
            'name'         => 'users',
            'type'         => 'link',
            'relationship' => 'tasks_users',
            'source'       => 'non-db',
            'vname'        => 'LBL_USERS',
            'module'       => 'Users',
            'default'      => true
        ],
        'checklists' => [
            'name'         => 'checklists',
            'type'         => 'json',
            'dbtype'         => 'text',
            'vname'        => 'LBL_CHECKLISTS',
            'comment' => 'stores the checklist for the task to detail the task in more granular actions'
        ]
    ]
    ,
    'relationships' => [
        'tasks_notes' => [
            'lhs_module'        => 'Tasks',
            'lhs_table'         => 'tasks',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Notes',
            'rhs_table'         => 'notes',
            'rhs_key'           => 'parent_id',
            'relationship_type' => 'one-to-many',
        ],
        'tasks_assigned_user' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Tasks',
            'rhs_table'         => 'tasks',
            'rhs_key'           => 'assigned_user_id',
            'relationship_type' => 'one-to-many',
        ],
        'tasks_modified_user' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Tasks',
            'rhs_table'         => 'tasks',
            'rhs_key'           => 'modified_user_id',
            'relationship_type' => 'one-to-many',
        ],
        'tasks_created_by' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Tasks',
            'rhs_table'         => 'tasks',
            'rhs_key'           => 'created_by',
            'relationship_type' => 'one-to-many',
        ],
    ],
    'indices' => [
        [
            'name'   => 'idx_tsk_name',
            'type'   => 'index',
            'fields' => ['name'],
        ],
        [
            'name'   => 'idx_task_con_del',
            'type'   => 'index',
            'fields' => ['contact_id', 'deleted'],
        ],
        [
            'name'   => 'idx_task_par_del',
            'type'   => 'index',
            'fields' => ['parent_id', 'parent_type', 'deleted'],
        ],
        [
            'name'   => 'idx_task_assigned',
            'type'   => 'index',
            'fields' => ['assigned_user_id'],
        ],
        [
            'name'   => 'idx_task_status',
            'type'   => 'index',
            'fields' => ['status'],
        ],
        [
            'name'   => 'idx_task_assigned_del_status',
            'type'   => 'index',
            'fields' => ['assigned_user_id', 'deleted', 'status'],
        ], //for UI assistant
        [
            'name'   => 'idx_task_external_id',
            'type'   => 'index',
            'fields' => ['external_id'],
        ]
    ],

    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

// CE version has not all modules...
//set global else error with PHP7.1: Uncaught Error: Cannot use string offset as an array
if (file_exists("modules/ServiceTickets")) {
    SpiceDictionaryHandler::getInstance()->dictionary['Task']['fields']['servicetickets'] = [
        'name'         => 'servicetickets',
        'type'         => 'link',
        'relationship' => 'servicetickets_tasks',
        'module'       => 'ServiceTickets',
        'bean_name'    => 'ServiceTicket',
        'source'       => 'non-db',
        'vname'        => 'LBL_SERVICETICKET',
    ];
}
if (file_exists("extensions/modules/ServiceOrders")) {
    SpiceDictionaryHandler::getInstance()->dictionary['Task']['fields']['serviceorders'] = [
        'name'         => 'serviceorders',
        'type'         => 'link',
        'relationship' => 'serviceorders_tasks',
        'module'       => 'ServiceOrders',
        'bean_name'    => 'ServiceOrder',
        'source'       => 'non-db',
        'vname'        => 'LBL_SERVICEORDER',
    ];
}
if (file_exists("extensions/modules/ProcurementDocs")) {
    SpiceDictionaryHandler::getInstance()->dictionary['Task']['fields']['procurementdocs'] = [
        'name'         => 'procurementdocs',
        'type'         => 'link',
        'relationship' => 'procurementdocs_tasks',
        'source'       => 'non-db',
        'vname'        => 'LBL_PROCUREMENTDOCS',
    ];
}

VardefManager::createVardef('Tasks', 'Task', ['default', 'assignable']);
