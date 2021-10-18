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
$dictionary['Meeting'] = [
    'table'                          => 'meetings',
    'unified_search'                 => true,
    'full_text_search'               => true,
    'unified_search_default_enabled' => true,
    'comment'                        => 'Meeting activities',
    'fields'                         => [
        'name' => [
            'name'             => 'name',
            'vname'            => 'LBL_SUBJECT',
            'required'         => true,
            'type'             => 'name',
            'dbType'           => 'varchar',
            'unified_search'   => true,
            'full_text_search' => ['boost' => 3],
            'len'              => '50',
            'comment'          => 'Meeting name',
            'importable'       => 'required',
        ],
        'accept_status' => [
            'name'   => 'accept_status',
            'vname'  => 'LBL_ACCEPT_STATUS',
            'type'   => 'varchar',
            'dbType' => 'varchar',
            'len'    => '20',
            'source' => 'non-db',
        ],

        // CR1000356
        'meeting_user_status_accept' => [
            'name'   => 'meeting_user_status_accept',
            'vname'  => 'LBL_USER_STATUS_ACCEPT',
            'type'   => 'link',
            'source' => 'non-db',
            'relationship' => 'meetings_users_status_accept',
            'default' => true,
            'module' => 'Users',
            'rel_fields' => [
                'accept_status' => [
                    'type' => 'enum',
                    'options' => 'dom_meeting_accept_status',
                    'map' => 'activity_accept_status'
                ]
            ]
        ],
        'meeting_user_status_decline' => [
            'name'   => 'meeting_user_status_decline',
            'vname'  => 'LBL_USER_STATUS_DECLINE',
            'type'   => 'link',
            'source' => 'non-db',
            'module' => 'Users',
            'relationship' => 'meetings_users_status_decline',
            'rel_fields' => [
                'accept_status' => [
                    'type' => 'enum',
                    'options' => 'dom_meeting_accept_status',
                    'map' => 'activity_accept_status'
                ]
            ]
        ],
        'meeting_user_status_tentative' => [
            'name'   => 'meeting_user_status_tentative',
            'vname'  => 'LBL_USER_STATUS_TENTATIVE',
            'type'   => 'link',
            'source' => 'non-db',
            'module' => 'Users',
            'relationship' => 'meetings_users_status_tentative',
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
            'type'   => 'varchar',
            'dbType' => 'varchar',
            'len'    => '20',
            'source' => 'non-db',
        ],
        'location' => [
            'name'    => 'location',
            'vname'   => 'LBL_LOCATION',
            'type'    => 'varchar',
            'len'     => '50',
            'comment' => 'Meeting location'
        ],
        'password' => [
            'name'    => 'password',
            'vname'   => 'LBL_PASSWORD',
            'type'    => 'varchar',
            'len'     => '50',
            'comment' => 'Meeting password',
            'studio'  => 'false',
        ],
        'join_url' => [
            'name'       => 'join_url',
            'vname'      => 'LBL_URL',
            'type'       => 'varchar',
            'len'        => '200',
            'comment'    => 'Join URL',
            'studio'     => 'false',
            'reportable' => false,
        ],
        'host_url' => [
            'name'       => 'host_url',
            'vname'      => 'LBL_HOST_URL',
            'type'       => 'varchar',
            'len'        => '400',
            'comment'    => 'Host URL',
            'studio'     => 'false',
            'reportable' => false,
        ],
        'displayed_url' => [
            'name'    => 'displayed_url',
            'vname'   => 'LBL_DISPLAYED_URL',
            'type'    => 'url',
            'len'     => '400',
            'comment' => 'Meeting URL',
            'studio'  => 'false',
        ],
        'creator' => [
            'name'    => 'creator',
            'vname'   => 'LBL_CREATOR',
            'type'    => 'varchar',
            'len'     => '50',
            'comment' => 'Meeting creator',
            'studio'  => 'false',
        ],
        'external_id' => [
            'name'    => 'external_id',
            'vname'   => 'LBL_EXTERNALID',
            'type'    => 'varchar',
            'len'     => 200,
            'comment' => 'Meeting ID for external app API',
            'studio'  => 'false',
        ],
        'external_data' => [
            'name'    => 'external_data',
            'vname'   => 'LBL_EXTERNALDATA',
            'type'    => 'text'
        ],
        'externalx_data' => [
            'name'    => 'externalx_data',
            'vname'   => 'LBL_EXTERNALDATA',
            'type'    => 'text'
        ],
        'duration_hours' => [
            'name'    => 'duration_hours',
            'vname'   => 'LBL_DURATION_HOURS',
            'type'    => 'int',
            'group'   => 'duration',
            'len'     => '3',
            'comment' => 'Duration (hours)',
            'studio'  => 'false',
            'source' => 'non-db' // CR1000436
        ],
        'duration_minutes' => [
            'name'    => 'duration_minutes',
            'vname'   => 'LBL_DURATION_MINUTES',
            'type'    => 'int',
            'group'   => 'duration',
            'len'     => '2',
            'comment' => 'Duration (minutes)',
            'studio'  => 'false',
            'source' => 'non-db' // CR1000436
        ],
        'date_start' => [
            'name'                => 'date_start',
            'vname'               => 'LBL_DATE_START',
            'type'                => 'datetimecombo',
            'dbType'              => 'datetime',
            'comment'             => 'Date of start of meeting',
            'required'            => true
        ],
        'date_end' => [
            'name'                => 'date_end',
            'vname'               => 'LBL_DATE_END',
            'type'                => 'datetimecombo',
            'dbType'              => 'datetime',
            'massupdate'          => false,
            'required'            => true,
            'comment'             => 'Date meeting ends',
        ],
        'parent_type' => [
            'name'    => 'parent_type',
            'vname'   => 'LBL_PARENT_TYPE',
            'type'    => 'parent_type',
            'dbType'  => 'varchar',
            'group'   => 'parent_name',
            'options' => 'parent_type_display',
            'len'     => 100,
            'comment' => 'Module meeting is associated with',
            'studio'  => ['searchview' => false],
        ],
        'status' => [
            'name'    => 'status',
            'vname'   => 'LBL_STATUS',
            'type'    => 'enum',
            'len'     => 100,
            'options' => 'meeting_status_dom',
            'comment' => 'Meeting status (ex: Planned, Held, Not held)',
            'default' => 'Planned',
        ],
        'type' => [
            'name'       => 'type',
            'vname'      => 'LBL_TYPE',
            'type'       => 'enum',
            'len'        => 255,
            'comment'    => 'Meeting type (ex: WebEx, Other)',
            'options'    => 'eapm_list',
            'default'    => 'Sugar',
            'massupdate' => false,
            'studio'     => 'false',
        ],
        'results' => [
            'name'  => 'results',
            'vname' => 'LBL_RESULTS',
            'type'  => 'text',
        ],
        'nextsteps' => [
            'name'  => 'nextsteps',
            'vname' => 'LBL_NEXT_STEPS',
            'type'  => 'text',
        ],
        // Bug 24170 - Added only to allow the sidequickcreate form to work correctly
        'direction' => [
            'name'       => 'direction',
            'vname'      => 'LBL_DIRECTION',
            'type'       => 'enum',
            'len'        => 100,
            'options'    => 'call_direction_dom',
            'comment'    => 'Indicates whether call is inbound or outbound',
            'source'     => 'non-db',
            'importable' => 'false',
            'massupdate' => false,
            'reportable' => false,
            'studio'     => 'false',
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_PARENT_ID',
            'type'       => 'id',
            'group'      => 'parent_name',
            'reportable' => false,
            'comment'    => 'ID of item indicated by parent_type',
            'studio'     => ['searchview' => false],
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
            'comment'    => 'When the Sugar Plug-in for Microsoft Outlook syncs an Outlook appointment, this is the Outlook appointment item ID'
        ],
        'sequence' => [
            'name'       => 'sequence',
            'vname'      => 'LBL_SEQUENCE',
            'type'       => 'int',
            'len'        => '11',
            'reportable' => false,
            'default'    => 0,
            'comment'    => 'Meeting update sequence for meetings as per iCalendar standards',
        ],
        'contact_name' => [
            'name'       => 'contact_name',
            'rname'      => 'name',
            'db_concat_fields' => [
                0 => 'first_name',
                1 => 'last_name',
            ],
            'id_name'    => 'contact_id',
            'massupdate' => false,
            'vname'      => 'LBL_CONTACT',
            'type'       => 'relate',
            'link'       => 'contacts',
            'table'      => 'contacts',
            'isnull'     => 'true',
            'module'     => 'Contacts',
            'join_name'  => 'contacts',
            'dbType'     => 'varchar',
            'source'     => 'non-db',
            'len'        => 36,
            'studio'     => 'false',
        ],
        'contacts' => [
            'name'         => 'contacts',
            'type'         => 'link',
            'relationship' => 'meetings_contacts',
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
            ],
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
        'users' => [
            'name'         => 'users',
            'type'         => 'link',
            'relationship' => 'meetings_users',
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
        'accounts' => [
            'name'         => 'accounts',
            'type'         => 'link',
            'relationship' => 'account_meetings',
            'source'       => 'non-db',
            'vname'        => 'LBL_ACCOUNT',
        ],
        'consumers' => [
            'name'         => 'consumers',
            'type'         => 'link',
            'relationship' => 'meetings_consumers',
            'module'       => 'Consumers',
            'source'       => 'non-db',
            'vname'        => 'LBL_CONSUMERS',
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
            ],
        ],
        'leads' => [
            'name'         => 'leads',
            'type'         => 'link',
            'relationship' => 'leads_meetings',
            'source'       => 'non-db',
            'vname'        => 'LBL_LEADS',
        ],
        'opportunity' => [
            'name'         => 'opportunity',
            'type'         => 'link',
            'relationship' => 'opportunity_meetings',
            'source'       => 'non-db',
            'vname'        => 'LBL_OPPORTUNITY',
        ],
        'notes' => [
            'name'         => 'notes',
            'type'         => 'link',
            'relationship' => 'meetings_notes',
            'module'       => 'Notes',
            'bean_name'    => 'Note',
            'source'       => 'non-db',
            'vname'        => 'LBL_NOTES',
        ],
        'tasks' => [
            'name'         => 'tasks',
            'type'         => 'link',
            'relationship' => 'meetings_tasks',
            'module'       => 'Tasks',
            'bean_name'    => 'Task',
            'source'       => 'non-db',
            'vname'        => 'LBL_TASKS',
        ],
        'contact_id' => [
            'name' => 'contact_id',
            'type' => 'id',
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
            'comment'    => 'Source of recurring meeting',
            'importable' => false,
            'massupdate' => false,
            'reportable' => false,
            'studio'     => false,
        ],
        'duration' => [
            'name'       => 'duration',
            'vname'      => 'LBL_DURATION',
            'type'       => 'enum',
            'options'    => 'duration_dom',
            'source'     => 'non-db',
            'comment'    => 'Duration handler dropdown',
            'massupdate' => false,
            'reportable' => false,
            'importable' => false,
        ],
    ],
    'relationships' => [
        'meetings_assigned_user' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Meetings',
            'rhs_table'         => 'meetings',
            'rhs_key'           => 'assigned_user_id',
            'relationship_type' => 'one-to-many',
        ],
        'meetings_modified_user' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Meetings',
            'rhs_table'         => 'meetings',
            'rhs_key'           => 'modified_user_id',
            'relationship_type' => 'one-to-many',
        ],
        'meetings_created_by' => [
            'lhs_module'        => 'Users',
            'lhs_table'         => 'users',
            'lhs_key'           => 'id',
            'rhs_module'        => 'Meetings',
            'rhs_table'         => 'meetings',
            'rhs_key'           => 'created_by',
            'relationship_type' => 'one-to-many',
        ],
        'meetings_notes' => [
            'lhs_module'                     => 'Meetings',
            'lhs_table'                      => 'meetings',
            'lhs_key'                        => 'id',
            'rhs_module'                     => 'Notes',
            'rhs_table'                      => 'notes',
            'rhs_key'                        => 'parent_id',
            'relationship_type'              => 'one-to-many',
            'relationship_role_column'       => 'parent_type',
            'relationship_role_column_value' => 'Meetings',
        ],
        'meetings_tasks' => [
            'lhs_module'                     => 'Meetings',
            'lhs_table'                      => 'meetings',
            'lhs_key'                        => 'id',
            'rhs_module'                     => 'Tasks',
            'rhs_table'                      => 'tasks',
            'rhs_key'                        => 'parent_id',
            'relationship_type'              => 'one-to-many',
            'relationship_role_column'       => 'parent_type',
            'relationship_role_column_value' => 'Meetings',
        ],
    ],
    'indices' => [
        [
            'name'   => 'idx_mtg_name',
            'type'   => 'index',
            'fields' => ['name'],
        ],
        [
            'name'   => 'idx_meet_par_del',
            'type'   => 'index',
            'fields' => ['parent_id', 'parent_type', 'deleted'],
        ],
        [
            'name'   => 'idx_meet_stat_del',
            'type'   => 'index',
            'fields' => ['assigned_user_id', 'status', 'deleted'],
        ],
        [
            'name'   => 'idx_meet_date_start',
            'type'   => 'index',
            'fields' => ['date_start'],
        ],
        [
            'name' => 'idx_meet_external_id',
            'type'   => 'index',
            'fields' => ['external_id'],
        ]
    ],
//This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

// CE version has not all modules...
//set global else error with PHP7.1: Uncaught Error: Cannot use string offset as an array
global $dictionary;
if (file_exists("modules/ServiceTickets")) {
    $dictionary['Meeting']['fields']['servicetickets'] = [
        'name'         => 'servicetickets',
        'type'         => 'link',
        'relationship' => 'servicetickets_meetings',
        'module'       => 'ServiceTickets',
        'bean_name'    => 'ServiceTicket',
        'source'       => 'non-db',
        'vname'        => 'LBL_SERVICETICKET',
    ];
}
if (file_exists("extensions/modules/ServiceOrders")) {
    $dictionary['Meeting']['fields']['serviceorders'] = [
        'name'         => 'serviceorders',
        'type'         => 'link',
        'relationship' => 'serviceorders_meetings',
        'module'       => 'ServiceOrders',
        'bean_name'    => 'ServiceOrder',
        'source'       => 'non-db',
        'vname'        => 'LBL_SERVICEORDER',
    ];
}

VardefManager::createVardef('Meetings', 'Meeting', ['default', 'assignable']);
