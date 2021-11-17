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
$dictionary['Note'] = [
    'table' => 'notes',
    'comment' => 'Notes and Attachments',
    'fields' => [
        'file_mime_type' => [
            'name' => 'file_mime_type',
            'vname' => 'LBL_FILE_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'comment' => 'Attachment MIME type',
            'importable' => false
        ],
        'file_md5' => [
            'name' => 'file_md5',
            'vname' => 'LBL_FILE_MD5',
            'type' => 'char',
            'len' => '32',
            'comment' => 'Attachment MD5'
        ],
        'file_name' => [
            'name' => 'file_name',
            'vname' => 'LBL_FILENAME',
            'type' => 'file',
            'dbType' => 'varchar',
            'len' => '255',
            'comment' => 'File name associated with the note (attachment)'
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'group' => 'parent_name',
            'options' => 'parent_type_display',
            'len' => '255',
            'comment' => 'Sugar module the Note is associated with'
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
            'required' => false,
            'reportable' => true,
            'comment' => 'The ID of the Sugar item specified in parent_type'
        ],
        'contact_id' => [
            'name' => 'contact_id',
            'vname' => 'LBL_CONTACT_ID',
            'type' => 'id',
            'required' => false,
            'reportable' => false,
            'comment' => 'Contact ID note is associated with'
        ],
        'portal_flag' => [
            'name' => 'portal_flag',
            'vname' => 'LBL_PORTAL_FLAG',
            'type' => 'bool',
            'required' => false,
            'comment' => 'Portal flag indicator determines if note created via portal'
        ],
        'embed_flag' => [
            'name' => 'embed_flag',
            'vname' => 'LBL_EMBED_FLAG',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'Embed flag indicator determines if note embedded in email'
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'parent_type' => 'record_type_display',
            'type_name' => 'parent_type',
            'id_name' => 'parent_id', 'vname' => 'LBL_RELATED_TO',
            'type' => 'parent',
            'source' => 'non-db',
            'options' => 'record_type_display_notes',
        ],
        'contact_name' => [
            'name' => 'contact_name',
            'rname' => 'name',
            'id_name' => 'contact_id',
            'vname' => 'LBL_CONTACT',
            'table' => 'contacts',
            'type' => 'relate',
            'link' => 'contact',
            'join_name' => 'contacts',
            'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
            'isnull' => 'true',
            'module' => 'Contacts',
            'source' => 'non-db',
        ],
        'contact_phone' => [
            'name' => 'contact_phone',
            'vname' => 'LBL_PHONE',
            'type' => 'phone',
            'vname' => 'LBL_PHONE',
            'source' => 'non-db'
        ],
        'contact_email' => [
            'name' => 'contact_email',
            'type' => 'varchar',
            'vname' => 'LBL_EMAIL_ADDRESS',
            'source' => 'non-db',
            'studio' => false
        ],
        'account_id' => [
            'name' => 'account_id',
            'vname' => 'LBL_ACCOUNT_ID',
            'type' => 'id',
            'reportable' => false,
            'source' => 'non-db',
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'vname' => 'LBL_OPPORTUNITY_ID',
            'type' => 'id',
            'reportable' => false,
            'source' => 'non-db',
        ],
        'lead_id' => [
            'name' => 'lead_id',
            'vname' => 'LBL_LEAD_ID',
            'type' => 'id',
            'reportable' => false,
            'source' => 'non-db',
        ],

        'contact' => [
            'name' => 'contact',
            'type' => 'link',
            'relationship' => 'contact_notes',
            'vname' => 'LBL_LIST_CONTACT_NAME',
            'source' => 'non-db',
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'account_notes',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS',
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'opportunity_notes',
            'source' => 'non-db',
            'vname' => 'LBL_OPPORTUNITIES',
        ],
        'leads' => [
            'name' => 'leads',
            'type' => 'link',
            'relationship' => 'lead_notes',
            'source' => 'non-db',
            'vname' => 'LBL_LEADS',
        ],
        'emails' => [
            'name' => 'emails',
            'vname' => 'LBL_EMAILS',
            'type' => 'link',
            'relationship' => 'emails_notes_rel',
            'source' => 'non-db',
        ],
        'projects' => [
            'name' => 'projects',
            'type' => 'link',
            'relationship' => 'projects_notes',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECTS',
        ],
        'projectwbss' => [
            'name'         => 'projectwbss',
            'type'         => 'link',
            'relationship' => 'projectwbss_notes',
            'source'       => 'non-db',
            'vname'        => 'LBL_PROJECTWBSS',
        ],
        'meetings' => [
            'name' => 'meetings',
            'type' => 'link',
            'relationship' => 'meetings_notes',
            'source' => 'non-db',
            'vname' => 'LBL_MEETINGS',
        ],
        'calls' => [
            'name' => 'calls',
            'type' => 'link',
            'relationship' => 'calls_notes',
            'source' => 'non-db',
            'vname' => 'LBL_CALLS',
        ],
        'tasks' => [
            'name' => 'tasks',
            'type' => 'link',
            'relationship' => 'tasks_notes',
            'source' => 'non-db',
            'vname' => 'LBL_TASKS',
        ],
    ],
    'relationships' => [
        'notes_modified_user' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'modified_user_id',
            'relationship_type' => 'one-to-many'
        ],
        'notes_created_by' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'created_by',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_note_name', 'type' => 'index', 'fields' => ['name']],
        ['name' => 'idx_notes_parent', 'type' => 'index', 'fields' => ['parent_id', 'parent_type']],
        ['name' => 'idx_note_contact', 'type' => 'index', 'fields' => ['contact_id']],
        ['name' => 'idx_notes_assigned_del', 'type' => 'index', 'fields' => ['deleted', 'assigned_user_id']],
    ]
];

// CE version has not all modules...
//set global else error with PHP7.1: Uncaught Error: Cannot use string offset as an array
global $dictionary;
if (file_exists("modules/ServiceTickets")) {
    $dictionary['Note']['fields']['servicetickets'] = [
        'name' => 'servicetickets',
        'type' => 'link',
        'relationship' => 'servicetickets_notes',
        'module' => 'ServiceTickets',
        'bean_name' => 'ServiceTicket',
        'source' => 'non-db',
        'vname' => 'LBL_SERVICETICKET',
    ];
}
if (file_exists("extensions/modules/ServiceOrders")) {
    $dictionary['Note']['fields']['serviceorders'] = [
        'name' => 'serviceorders',
        'type' => 'link',
        'relationship' => 'serviceorders_notes',
        'module' => 'ServiceOrders',
        'bean_name' => 'ServiceOrder',
        'source' => 'non-db',
        'vname' => 'LBL_SERVICEORDER',
    ];
}

VardefManager::createVardef('Notes', 'Note', ['assignable', 'default']);
