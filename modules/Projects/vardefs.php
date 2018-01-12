<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
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


$dictionary['Project'] = array(
    'table' => 'projects',
    'unified_search' => true,
    'full_text_search' => true,
    'unified_search_default_enabled' => false,
    'comment' => 'Projects',
    'fields' => array(
        'estimated_start_date' => array(
            'name' => 'estimated_start_date',
            'vname' => 'LBL_DATE_START',
            'required' => true,
            'validation' => array('type' => 'isbefore', 'compareto' => 'estimated_end_date', 'blank' => true),
            'type' => 'date',
            'importable' => 'required',
            'enable_range_search' => true,
        ),
        'estimated_end_date' => array(
            'name' => 'estimated_end_date',
            'vname' => 'LBL_DATE_END',
            'required' => true,
            'type' => 'date',
            'importable' => 'required',
            'enable_range_search' => true,
        ),
        'status' => array(
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'project_status_dom',
        ),
        'priority' => array(
            'name' => 'priority',
            'vname' => 'LBL_PRIORITY',
            'type' => 'enum',
            'options' => 'projects_priority_options',
        ),
        'total_estimated_effort' => array(
            'name' => 'total_estimated_effort',
            'type' => 'int',
            'source' => 'non-db',
            'vname' => 'LBL_LIST_TOTAL_ESTIMATED_EFFORT',
        ),
        'total_actual_effort' => array(
            'name' => 'total_actual_effort',
            'type' => 'int',
            'source' => 'non-db',
            'vname' => 'LBL_LIST_TOTAL_ACTUAL_EFFORT',
        ),
        'accounts' => array(
            'name' => 'accounts',
            'type' => 'link',
            'module' => 'Accounts',
            'relationship' => 'projects_accounts',
            'source' => 'non-db',
            'ignore_role' => true,
            'vname' => 'LBL_ACCOUNTS',
        ),
        'account_name' => array(
            'name' => 'account_name',
            'rname' => 'name',
            'id_name' => 'account_id',
            'vname' => 'LBL_ACCOUNT_NAME',
            'join_name' => 'accounts',
            'type' => 'relate',
            'link' => 'accounts',
            'table' => 'accounts',
            'isnull' => 'true',
            'module' => 'Accounts',
            'dbType' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
        ),
        'account_id' => array(
            'name' => 'account_id',
            'rname' => 'id',
            'id_name' => 'account_id',
            'vname' => 'LBL_ACCOUNT_ID',
            'type' => 'relate',
            'table' => 'accounts',
            'isnull' => 'true',
            'module' => 'Accounts',
            'dbType' => 'id',
            'reportable' => false,
            'source' => 'non-db',
            'massupdate' => false,
            'duplicate_merge' => 'disabled',
            'hideacl' => true,
        ),
        'contacts' => array(
            'name' => 'contacts',
            'type' => 'link',
            'relationship' => 'projects_contacts',
            'source' => 'non-db',
            'ignore_role' => true,
            'vname' => 'LBL_CONTACTS',
        ),
        'opportunities' => array(
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'projects_opportunities',
            'source' => 'non-db',
            'ignore_role' => true,
            'vname' => 'LBL_OPPORTUNITIES',
        ),
        'notes' => array(
            'name' => 'notes',
            'type' => 'link',
            'relationship' => 'projects_notes',
            'source' => 'non-db',
            'vname' => 'LBL_NOTES',
        ),
        'tasks' => array(
            'name' => 'tasks',
            'type' => 'link',
            'relationship' => 'projects_tasks',
            'source' => 'non-db',
            'vname' => 'LBL_TASKS',
        ),
        'meetings' => array(
            'name' => 'meetings',
            'type' => 'link',
            'relationship' => 'projects_meetings',
            'source' => 'non-db',
            'vname' => 'LBL_MEETINGS',
        ),
        'calls' => array(
            'name' => 'calls',
            'type' => 'link',
            'relationship' => 'projects_calls',
            'source' => 'non-db',
            'vname' => 'LBL_CALLS',
            'join_name' => 'calls'
        ),
        'emails' => array(
            'name' => 'emails',
            'type' => 'link',
            'relationship' => 'emails_projects_rel',
            'source' => 'non-db',
            'vname' => 'LBL_EMAILS',
        ),
        'projecttasks' => array(
            'name' => 'projecttasks',
            'type' => 'link',
            'relationship' => 'projects_projecttasks',
            'source' => 'non-db',
            'vname' => 'LBL_PROJECT_TASKS',
        ),
        'cases' => array(
            'name' => 'cases',
            'type' => 'link',
            'relationship' => 'projects_cases',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_CASES',
        ),
        'bugs' => array(
            'name' => 'bugs',
            'type' => 'link',
            'relationship' => 'projects_bugs',
            'side' => 'right',
            'source' => 'non-db',
            'vname' => 'LBL_BUGS',
        ),

    ),
    'indices' => array(

    ),
    'relationships' => array(
        'projects_notes' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Projects'
        ),
        'projects_tasks' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Tasks',
            'rhs_table' => 'tasks',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Projects'
        ),
        'projects_meetings' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Meetings',
            'rhs_table' => 'meetings',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Projects'
        ),
        'projects_calls' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Calls',
            'rhs_table' => 'calls',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Projects'
        ),
        'projects_emails' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Emails',
            'rhs_table' => 'emails',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Projects'
        ),
        'projects_projecttasks' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectTasks',
            'rhs_table' => 'projecttasks',
            'rhs_key' => 'project_id',
            'relationship_type' => 'one-to-many'
        ),
        'projects_projectactivities' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectActivities',
            'rhs_table' => 'projectactivities',
            'rhs_key' => 'projectwbs_id',
            'relationship_type'=>'many-to-many',
            'join_table'=> 'projectwbss',
            'join_key_lhs'=>'project_id',
            'join_key_rhs'=>'id'
        ),
        'projects_assigned_user' => array(
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Projects',
            'rhs_table' => 'projects',
            'rhs_key' => 'assigned_user_id',
            'relationship_type' => 'one-to-many'
        ),
        'projects_modified_user' => array(
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Projects',
            'rhs_table' => 'projects',
            'rhs_key' => 'modified_user_id',
            'relationship_type' => 'one-to-many'
        ),
        'projects_created_by' => array(
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Projects',
            'rhs_table' => 'projects',
            'rhs_key' => 'created_by',
            'relationship_type' => 'one-to-many'
        ),
        'projects_projectwbss' => array(
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'ProjectWBSs',
            'rhs_table' => 'projectwbss',
            'rhs_key' => 'project_id',
            'relationship_type' => 'one-to-many'
        ),

    ),
);

// CE version has not all projects modules...
if(is_file('modules/ProjectMilestones/ProjectMilestone.php')) {
    $dictionary['Project']['fields']['projectmilestones'] = array(
        'name' => 'projectmilestones',
        'vname' => 'LBL_PROJECTS_PROJECTMILESTONES_LINK',
        'type' => 'link',
        'relationship' => 'projects_projectmilestones',
        'source' => 'non-db',
        'side' => 'right',
    );
}
if(is_file('modules/ProjectActivities/ProjectActivity.php')) {
    $dictionary['Project']['fields']['projectactivities'] = array(
        'name' => 'projectactivities',
        'vname' => 'LBL_PROJECTS_PROJECTACTIVITIES_LINK',
        'type' => 'link',
        'relationship' => 'projects_projectactivities',
        'source'=>'non-db',
        'module' => 'ProjectActivities',
        'side' => 'right',
    );
}
if(is_file('modules/ProjectWBSs/ProjectWBS.php')) {
    $dictionary['Project']['fields']['projectwbss'] = array(
        'name' => 'projectwbss',
        'vname' => 'LBL_PROJECTS_PROJECTWBSS_LINK',
        'type' => 'link',
        'relationship' => 'projects_projectwbss',
        'source'=>'non-db',
        'side' => 'right',
        'module' => 'ProjectWBSs'
    );
}
if(is_file('modules/Products/Product.php')) {
    $dictionary['Project']['fields']['products'] = array(
        'name' => 'products',
        'vname' => 'LBL_PRODUCTS',
        'type' => 'link',
        'relationship' => 'projects_products',
        'side' => 'right',
        'source' => 'non-db',
    );
}

if ($GLOBALS['sugar_flavor'] != 'CE')
    VardefManager::createVardef('Projects', 'Project', array('default', 'assignable', 'team_security'));
else
    VardefManager::createVardef('Projects', 'Project', array('default', 'assignable'));