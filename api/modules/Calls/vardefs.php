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
$dictionary['Call'] = [
    'table'                          => 'calls',
    'comment'                        => 'A Call is an activity representing a phone call',
    'unified_search'                 => true,
    'full_text_search'               => true,
    'unified_search_default_enabled' => true,
    'fields'                         => [
        'name' => [
            'name'             => 'name',
            'vname'            => 'LBL_SUBJECT',
            'dbType'           => 'varchar',
            'type'             => 'name',
            'len'              => '50',
            'comment'          => 'Brief description of the call',
            'unified_search'   => true,
            'full_text_search' => ['boost' => 3],
            'required'         => true,
            'importable'       => 'required',
        ],
        'duration_hours' => [
            'name'     => 'duration_hours',
            'vname'    => 'LBL_DURATION_HOURS',
            'type'     => 'int',
            'len'      => '2',
            'comment'  => 'Call duration, hours portion',
            'required' => false,
            'default'  => 0,
            'source' => 'non-db' // CR1000436
        ],
        'duration_minutes' => [
            'name'       => 'duration_minutes',
            'vname'      => 'LBL_DURATION_MINUTES',
            'type'       => 'int',
            'len'        => '2',
            'comment'    => 'Call duration, minutes portion',
            'source' => 'non-db' // CR1000436
        ],
        'date_start' => [
            'name'                => 'date_start',
            'vname'               => 'LBL_DATE_START',
            'type'                => 'datetimecombo',
            'dbType'              => 'datetime',
            'comment'             => 'Date in which call is schedule to (or did) start',
            'importable'          => 'required',
            'required'            => true
        ],
        'date_end' => [
            'name'                => 'date_end',
            'vname'               => 'LBL_DATE_END',
            'type'                => 'datetimecombo',
            'dbType'              => 'datetime',
            'massupdate'          => false,
            'comment'             => 'Date is which call is scheduled to (or did) end'
        ],
        'external_id' => [
            'name'    => 'external_id',
            'vname'   => 'LBL_EXTERNALID',
            'type'    => 'varchar',
            'len'     => 160,
            'comment' => 'Call ID for external app API',
            'studio'  => 'false',
        ],
        'external_data' => [
            'name'    => 'external_data',
            'vname'   => 'LBL_EXTERNALDATA',
            'type'    => 'text'
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'group'    => 'parent_name',
            'options'  => 'parent_type_display',
            'len'      => 255,
            'comment'  => 'The Sugar object to which the call is related',
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'parent_type' => 'record_type_display',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'group'       => 'parent_name',
            'source'      => 'non-db',
            'options'     => 'parent_type_display',
        ],
        'status' => [
            'name'       => 'status',
            'vname'      => 'LBL_STATUS',
            'type'       => 'enum',
            'len'        => 100,
            'options'    => 'call_status_dom',
            'comment'    => 'The status of the call (Held, Not Held, etc.)',
            'required'   => true,
            'importable' => 'required',
            'default'    => 'Planned'
        ],
        'direction' => [
            'name'    => 'direction',
            'vname'   => 'LBL_DIRECTION',
            'type'    => 'enum',
            'len'     => 100,
            'options' => 'call_direction_dom',
            'comment' => 'Indicates whether call is inbound or outbound',
        ],
        'gdpr_data_agreement' => [
            'name'    => 'gdpr_data_agreement',
            'vname'   => 'LBL_GDPR_DATA_AGREEMENT',
            'type'    => 'bool',
            'default' => false,
        ],
        'gdpr_marketing_agreement' => [
            'name'    => 'gdpr_marketing_agreement',
            'vname'   => 'LBL_GDPR_MARKETING_AGREEMENT',
            'type'    => 'bool',
            'default' => false,
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_LIST_RELATED_TO_ID',
            'type'       => 'id',
            'group'      => 'parent_name',
            'reportable' => false,
            'comment'    => 'The ID of the parent Sugar object identified by parent_type'
        ],
        'reminder_time' => [
            'name'       => 'reminder_time',
            'vname'      => 'LBL_REMINDER_TIME',
            'type'       => 'activityreminder',
            'dbType'     => 'int',
            'default'    => -1,
            'comment'    => 'Specifies when a reminder alert should be issued; -1 means no alert; otherwise the number of seconds prior to the start',
        ],
        'email_reminder_time' => [
            'name'       => 'email_reminder_time',
            'vname'      => 'LBL_EMAIL_REMINDER_TIME',
            'type'       => 'activityreminder',
            'dbType'     => 'int',
            'default'    => -1,
            'comment'    => 'Specifies when a email reminder alert should be issued; -1 means no alert; otherwise the number of seconds prior to the start',
        ],
        'email_reminder_sent' => [
            'name'       => 'email_reminder_sent',
            'vname'      => 'LBL_EMAIL_REMINDER_SENT',
            'default'    => 0,
            'type'       => 'bool',
            'comment'    => 'Whether email reminder is already sent',
            'massupdate' => false,
        ],
        'outlook_id' => [
            'name'       => 'outlook_id',
            'vname'      => 'LBL_OUTLOOK_ID',
            'type'       => 'varchar',
            'len'        => '255',
            'reportable' => false,
            'comment'    => 'When the Sugar Plug-in for Microsoft Outlook syncs an Outlook appointment, this is the Outlook appointment item ID',
        ],
        'accept_status' => [
            'name'   => 'accept_status',
            'vname'  => 'LBL_ACCEPT_STATUS',
            'dbType' => 'varchar',
            'type'   => 'varchar',
            'len'    => '20',
            'source' => 'non-db',
        ],

        // CR1000356
        'call_user_status_accept' => [
            'name'   => 'call_user_status_accept',
            'vname'  => 'LBL_USER_STATUS_ACCEPT',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'calls_users_status_accept',
            'default' => true,
            'module' => 'Calls',
            'rel_fields' => [
                'accept_status' => [
                    'type' => 'enum',
                    'options' => 'dom_meeting_accept_status',
                    'map' => 'activity_accept_status'
                ]
            ]
        ],
        'call_user_status_decline' => [
            'name'   => 'call_user_status_decline',
            'vname'  => 'LBL_USER_STATUS_DECLINE',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'calls_users_status_decline',
            'module' => 'Calls',
            'rel_fields' => [
                'accept_status' => [
                    'type' => 'enum',
                    'options' => 'dom_meeting_accept_status',
                    'map' => 'activity_accept_status'
                ]
            ]
        ],
        'call_user_status_tentative' => [
            'name'   => 'call_user_status_tentative',
            'vname'  => 'LBL_USER_STATUS_TENTATIVE',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'calls_users_status_tentative',
            'module' => 'Calls',
            'rel_fields' => [
                'accept_status' => [
                    'type' => 'enum',
                    'options' => 'dom_meeting_accept_status',
                    'map' => 'activity_accept_status'
                ]
            ]
        ],

        //bug 39559
        'set_accept_links' => [
            'name'   => 'accept_status',
            'vname'  => 'LBL_ACCEPT_LINK',
            'dbType' => 'varchar',
            'type'   => 'varchar',
            'len'    => '20',
            'source' => 'non-db',
        ],
        'contact_name' => [
            'name'             => 'contact_name',
            'rname'            => 'name',
            'db_concat_fields' => [
                0 => 'salutation',
                0 => 'degree1',
                2 => 'first_name',
                3 => 'last_name',
                3 => 'degree2'
            ],
            'id_name'          => 'contact_id',
            'massupdate'       => false,
            'vname'            => 'LBL_CONTACT',
            'type'             => 'relate',
            'link'             => 'contacts',
            'table'            => 'contacts',
            'isnull'           => 'true',
            'module'           => 'Contacts',
            'join_name'        => 'contacts',
            'dbType'           => 'varchar',
            'source'           => 'non-db',
            'len'              => 36,
            'importable'       => 'false',
            'studio'           => [
                'required' => false,
                'listview' => true,
                'visible'  => false,
            ],
        ],
        'opportunities' => [
            'name'         => 'opportunities',
            'type'         => 'link',
            'relationship' => 'opportunity_calls',
            'source'       => 'non-db',
            'link_type'    => 'one',
            'vname'        => 'LBL_OPPORTUNITY',
        ],
        'leads' => [
            'name'         => 'leads',
            'type'         => 'link',
            'relationship' => 'calls_leads',
            'source'       => 'non-db',
            'vname'        => 'LBL_LEADS',
        ],
        // Bug #42619 Missed back-relation from Project module
        'project' => [ //@deprecated project. Use projects
            'name'         => 'project',
            'type'         => 'link',
            'relationship' => 'projects_calls',
            'source'       => 'non-db',
            'vname'        => 'LBL_PROJECTS_DEPRECATED',
        ],
        'projects' => [
            'name'         => 'projects',
            'type'         => 'link',
            'relationship' => 'projects_calls',
            'source'       => 'non-db',
            'vname'        => 'LBL_PROJECTS',
        ],
        'accounts' => [
            'name'         => 'accounts',
            'type'         => 'link',
            'relationship' => 'account_calls',
            'module'       => 'Accounts',
            'bean_name'    => 'Account',
            'source'       => 'non-db',
            'vname'        => 'LBL_ACCOUNT',
        ],
        'consumers' => [
            'name'         => 'consumers',
            'type'         => 'link',
            'relationship' => 'consumers_calls',
            'module'       => 'Consumers',
            'source'       => 'non-db',
            'vname'        => 'LBL_CONSUMERS',
        ],
        'contacts' => [
            'name'         => 'contacts',
            'type'         => 'link',
            'relationship' => 'calls_contacts',
            'source'       => 'non-db',
            'vname'        => 'LBL_CONTACTS',
            'module'       => 'Contacts',
            'default'      => true,
            'rel_fields' => [
                'accept_status' => [
                    'type' => 'enum',
                    'options' => 'dom_meeting_accept_status',
                    'map' => 'activity_accept_status'
                ],
                'date_modified' => [
                    'type' => 'datetime',
                    'map' => 'activity_status_date_modified'
                ]
            ]
        ],
        'users' => [
            'name'         => 'users',
            'type'         => 'link',
            'relationship' => 'calls_users',
            'source'       => 'non-db',
            'vname'        => 'LBL_USERS',
            'module'       => 'Users',
            'default'      => true,
            'rel_fields' => [
                'accept_status' => [
                    'type' => 'enum',
                    'options' => 'dom_meeting_accept_status',
                    'map' => 'activity_accept_status'
                ],
                'date_modified' => [
                    'type' => 'datetime',
                    'map' => 'activity_status_date_modified'
                ],
                'required' => [
                    'type' => 'bool',
                    'map' => 'activity_required'
                ]
            ]
        ],
        'notes' => [
            'name'         => 'notes',
            'type'         => 'link',
            'relationship' => 'calls_notes',
            'module'       => 'Notes',
            'bean_name'    => 'Note',
            'source'       => 'non-db',
            'vname'        => 'LBL_NOTES',
        ],
        'created_by_link' => [
            'name'         => 'created_by_link',
            'type'         => 'link',
            'relationship' => 'calls_created_by',
            'vname'        => 'LBL_CREATED_BY_USER',
            'link_type'    => 'one',
            'module'       => 'Users',
            'bean_name'    => 'User',
            'source'       => 'non-db',
        ],
        'modified_user_link' => [
            'name'         => 'modified_user_link',
            'type'         => 'link',
            'relationship' => 'calls_modified_user',
            'vname'        => 'LBL_MODIFIED_BY_USER',
            'link_type'    => 'one',
            'module'       => 'Users',
            'bean_name'    => 'User',
            'source'       => 'non-db',
        ],
        'assigned_user_link' => [
            'name'         => 'assigned_user_link',
            'type'         => 'link',
            'relationship' => 'calls_assigned_user',
            'vname'        => 'LBL_ASSIGNED_TO',
            'link_type'    => 'one',
            'module'       => 'Users',
            'bean_name'    => 'User',
            'source'       => 'non-db',
        ],
        'contact_id' => [
            'name'   => 'contact_id',
            'type'   => 'id',
            'source' => 'non-db',
        ],
        'repeat_type' => [
            'name'       => 'repeat_type',
            'vname'      => 'LBL_REPEAT_TYPE',
            'type'       => 'enum',
            'len'        => 36,
            'options'    => 'repeat_type_dom',
            'comment'    => 'Type of recurrence',
            'importable' => 'false',
            'massupdate' => false,
            'reportable' => false,
            'studio'     => 'false',
        ],
        'repeat_interval' => [
            'name'       => 'repeat_interval',
            'vname'      => 'LBL_REPEAT_INTERVAL',
            'type'       => 'int',
            'len'        => 3,
            'default'    => 1,
            'comment'    => 'Interval of recurrence',
            'importable' => 'false',
            'massupdate' => false,
            'reportable' => false,
            'studio'     => 'false',
        ],
        'repeat_dow' => [
            'name'       => 'repeat_dow',
            'vname'      => 'LBL_REPEAT_DOW',
            'type'       => 'varchar',
            'len'        => 7,
            'comment'    => 'Days of week in recurrence',
            'importable' => 'false',
            'massupdate' => false,
            'reportable' => false,
            'studio'     => 'false',
        ],
        'repeat_until' => [
            'name'       => 'repeat_until',
            'vname'      => 'LBL_REPEAT_UNTIL',
            'type'       => 'date',
            'comment'    => 'Repeat until specified date',
            'importable' => 'false',
            'massupdate' => false,
            'reportable' => false,
            'studio'     => 'false',
        ],
        'repeat_count' => [
            'name'       => 'repeat_count',
            'vname'      => 'LBL_REPEAT_COUNT',
            'type'       => 'int',
            'len'        => 7,
            'comment'    => 'Number of recurrence',
            'importable' => 'false',
            'massupdate' => false,
            'reportable' => false,
            'studio'     => 'false',
        ],
        'repeat_parent_id' => [
            'name'       => 'repeat_parent_id',
            'vname'      => 'LBL_REPEAT_PARENT_ID',
            'type'       => 'id',
            'len'        => 36,
            'comment'    => 'Id of the first element of recurring records',
            'importable' => 'false',
            'massupdate' => false,
            'reportable' => false,
            'studio'     => 'false',
        ],
        'recurring_source' => [
            'name'       => 'recurring_source',
            'vname'      => 'LBL_RECURRING_SOURCE',
            'type'       => 'varchar',
            'len'        => 36,
            'comment'    => 'Source of recurring call',
            'importable' => false,
            'massupdate' => false,
            'reportable' => false,
            'studio'     => false,
        ],
        'campaigntask_id' => [
            'name'  => 'campaigntask_id',
            'vname' => 'LBL_CAMPAIGNTASK_ID',
            'type'  => 'char',
            'len'   => 36
        ],
        'campaigntask_name' => [
            'name'    => 'campaigntask_name',
            'rname'   => 'name',
            'id_name' => 'campaigntask_id',
            'vname'   => 'LBL_CAMPAIGNTASK',
            'type'    => 'relate',
            'table'   => 'campaigntasks',
            'isnull'  => 'true',
            'module'  => 'CampaignTasks',
            'dbType'  => 'varchar',
            'link'    => 'campaigntasks',
            'len'     => '255',
            'source'  => 'non-db',
        ],
        'campaigntasks' => [
            'name'         => 'campaigntasks',
            'type'         => 'link',
            'relationship' => 'calls_campaigntasks',
            'source'       => 'non-db',
            'module'       => 'Campaigntasks',
        ],
        'tasks' => [
            'name'         => 'tasks',
            'type'         => 'link',
            'relationship' => 'calls_tasks',
            'source'       => 'non-db',
            'module'       => 'Tasks',
        ]
    ],
    'indices' => [
        [
            'name'   => 'idx_call_name',
            'type'   => 'index',
            'fields' => ['name'],
        ],
        [
            'name'   => 'idx_status',
            'type'   => 'index',
            'fields' => ['status'],
        ],
        [
            'name'   => 'idx_calls_date_start',
            'type'   => 'index',
            'fields' => ['date_start'],
        ],
        [
            'name'   => 'idx_calls_par_del',
            'type'   => 'index',
            'fields' => ['parent_id', 'parent_type', 'deleted'],
        ],
        [
            'name'   => 'idx_calls_assigned_del',
            'type'   => 'index',
            'fields' => ['deleted', 'assigned_user_id'],
        ],
        [
            'name'   => 'idx_calls_assigned_del_status', //for UI assistant
            'type'   => 'index',
            'fields' => ['assigned_user_id', 'deleted', 'status'],
        ],
        [
            'name' => 'idx_calls_external_id',
            'type'   => 'index',
            'fields' => ['external_id'],
        ]

    ],
    'relationships' => [
        'calls_assigned_user' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Calls',
            'rhs_table'         => 'calls',
            'rhs_key'           => 'assigned_user_id',
            'relationship_type' => 'one-to-many'
        ],
        'calls_modified_user' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Calls',
            'rhs_table'         => 'calls',
            'rhs_key'           => 'modified_user_id',
            'relationship_type' => 'one-to-many'
        ],
        'calls_created_by' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Calls',
            'rhs_table'         => 'calls',
            'rhs_key'           => 'created_by',
            'relationship_type' => 'one-to-many'
        ],
        'calls_notes' => [
            'lhs_module'                     => 'Calls',
            'lhs_table'                      => 'calls',
            'lhs_key'                        => 'id',
            'rhs_module'                     => 'Notes',
            'rhs_table'                      => 'notes',
            'rhs_key'                        => 'parent_id',
            'relationship_type'              => 'one-to-many',
            'relationship_role_column'       => 'parent_type',
            'relationship_role_column_value' => 'Calls',
        ],
        'calls_tasks' => [
            'lhs_module'                     => 'Calls',
            'lhs_table'                      => 'calls',
            'lhs_key'                        => 'id',
            'rhs_module'                     => 'Tasks',
            'rhs_table'                      => 'tasks',
            'rhs_key'                        => 'parent_id',
            'relationship_type'              => 'one-to-many',
            'relationship_role_column'       => 'parent_type',
            'relationship_role_column_value' => 'Calls',
        ],
        'calls_campaigntasks' => [
            'rhs_module'        => 'Calls',
            'rhs_table'         => 'calls',
            'rhs_key'           => 'campaigntask_id',
            'lhs_module'        => 'CampaignTasks',
            'lhs_table'         => 'campaigntasks',
            'lhs_key'           => 'id',
            'relationship_type' => 'one-to-many'
        ],
    ],
//This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

// CE version has not all modules...
//set global else error with PHP7.1: Uncaught Error: Cannot use string offset as an array
global $dictionary;
if (file_exists("modules/ServiceTickets")) {
    $dictionary['Call']['fields']['servicetickets'] = [
        'name'         => 'servicetickets',
        'type'         => 'link',
        'relationship' => 'servicetickets_calls',
        'module'       => 'ServiceTickets',
        'bean_name'    => 'ServiceTicket',
        'source'       => 'non-db',
        'vname'        => 'LBL_SERVICETICKET',
    ];
}
if (file_exists("extensions/modules/ServiceOrders")) {
    $dictionary['Call']['fields']['serviceorders'] = [
        'name'         => 'serviceorders',
        'type'         => 'link',
        'relationship' => 'serviceorders_calls',
        'module'       => 'ServiceOrders',
        'bean_name'    => 'ServiceOrder',
        'source'       => 'non-db',
        'vname'        => 'LBL_SERVICEORDER',
    ];
}

VardefManager::createVardef('Calls', 'Call', ['default', 'assignable']);
