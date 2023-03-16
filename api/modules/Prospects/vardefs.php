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

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Prospect'] = [

    'table' => 'prospects',
    'unified_search' => true,
    'fields' => [
        'is_converted' =>
            [
                'name' => 'is_converted',
                'vname' => 'LBL_CONVERTED',
                'type' => 'bool',
            ],
	  'birthdate' =>
	  [
	    'name' => 'birthdate',
	    'vname' => 'LBL_BIRTHDATE',
	    'type' => 'date',
      ],
	  'do_not_call' =>
	  [
	    'name' => 'do_not_call',
	    'vname' => 'LBL_DO_NOT_CALL',
	    'type'=>'bool',
	    'default' =>'0',
      ],
	  'lead_id' =>
	  [
		'name' => 'lead_id',
		'type' => 'id',
		'reportable'=>false,
		'vname'=>'LBL_LEAD_ID',
      ],
	  'account_name' =>
	  [
    	'name' => 'account_name',
    	'vname' => 'LBL_ACCOUNT_NAME',
    	'type' => 'varchar',
    	'len' => '150',
      ],
     'campaign_id' =>
      [
            'name' => 'campaign_id',
        'comment' => 'Campaign that generated lead',
        'vname'=>'LBL_CAMPAIGN_ID',
        'rname' => 'id',
        'id_name' => 'campaign_id',
        'type' => 'id',
        'table' => 'campaigns',
        'isnull' => 'true',
        'module' => 'Campaigns',
        //'dbType' => 'char',
        'reportable'=>false,
        'duplicate_merge' => false,
      ],
	  'campaigns' =>
	  [
  		'name' => 'campaigns',
    	'type' => 'link',
    	'relationship' => 'prospect_campaign_log',
    	'module'=>'CampaignLog',
    	'bean_name'=>'CampaignLog',
    	'source'=>'non-db',
		'vname'=>'LBL_CAMPAIGNLOG',
      ],
      'prospect_lists' =>
      [
        'name' => 'prospect_lists',
        'type' => 'link',
        'relationship' => 'prospect_list_prospects',
        'module'=>'ProspectLists',
        'source'=>'non-db',
        'vname'=>'LBL_PROSPECT_LIST',
      ],
      'calls' =>
		[
			'name' => 'calls',
			'type' => 'link',
			'relationship' => 'prospect_calls',
			'source' => 'non-db',
			'vname' => 'LBL_CALLS',
        ],
      'meetings'=>
		[
			'name' => 'meetings',
			'type' => 'link',
			'relationship' => 'prospect_meetings',
			'source' => 'non-db',
			'vname' => 'LBL_MEETINGS',
        ],
      'notes'=>
		[
			'name' => 'notes',
			'type' => 'link',
			'relationship' => 'prospect_notes',
			'source' => 'non-db',
			'vname' => 'LBL_NOTES',
        ],
      'tasks'=>
		[
			'name' => 'tasks',
			'type' => 'link',
			'relationship' => 'prospect_tasks',
			'source' => 'non-db',
			'vname' => 'LBL_TASKS',
        ],
      'emails'=>
		[
			'name' => 'emails',
			'type' => 'link',
			'relationship' => 'emails_prospects_rel',
			'source' => 'non-db',
			'vname' => 'LBL_EMAILS',
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
            'reportable' => false,
            'comment' => 'ID of item indicated by parent_type',
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'type_name' => 'parent_type',
            'id_name' => 'parent_id',
            'vname' => 'LBL_RELATED_TO',
            'type' => 'parent',
            'source' => 'non-db',
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'accounts_prospects',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS',
        ],
        'contacts' => [
            'name' => 'contacts',
            'type' => 'link',
            'relationship' => 'contacts_prospects',
            'source' => 'non-db',
            'vname' => 'LBL_CONTACTS',
            'module' => 'Contacts',
            'default' => true,
        ],
        'leads' => [
            'name' => 'leads',
            'type' => 'link',
            'relationship' => 'leads_prospects',
            'source' => 'non-db',
            'vname' => 'LBL_LEADS',
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'len' => 100,
        ],
        // Used for non-primary mail import
        'email_addresses_non_primary' =>
            [
                'name' => 'email_addresses_non_primary',
                'type' => 'email',
                'source' => 'non-db',
                'vname' => 'LBL_EMAIL_NON_PRIMARY',
                'reportable' => false,
            ],
    ],

    'indices' =>
        [
//				array(
//						'name' => 'prospect_auto_tracker_key' ,
//						'type'=>'index' ,
//						'fields'=>array('tracker_key')
//				),
            ['name' => 'idx_prospects_last_first',
                'type' => 'index',
                'fields' => [
                    'last_name',
                    'first_name',
                    'deleted'
                ]
            ],
            [
                'name' => 'idx_prospecs_del_last',
                'type' => 'index',
                'fields' => [
                    'last_name',
                    'deleted'
                ]
            ],
            ['name' => 'idx_prospects_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']],
            ['name' => 'idx_prospects_assigned', 'type' => 'index', 'fields' => ['assigned_user_id']],

        ],

    'relationships' => [
        'prospect_tasks' => [
            'lhs_module' => 'Prospects',
            'lhs_table' => 'prospects',
            'lhs_key' => 'id',
            'rhs_module' => 'Tasks',
            'rhs_table' => 'tasks',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Prospects'
        ],
        'prospect_notes' => [
            'lhs_module' => 'Prospects',
            'lhs_table' => 'prospects',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Prospects'
        ],
        'prospect_meetings' => [
            'lhs_module' => 'Prospects',
            'lhs_table' => 'prospects',
            'lhs_key' => 'id',
            'rhs_module' => 'Meetings',
            'rhs_table' => 'meetings',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Prospects'
        ],
        'prospect_calls' => [
            'lhs_module' => 'Prospects',
            'lhs_table' => 'prospects',
            'lhs_key' => 'id',
            'rhs_module' => 'Calls',
            'rhs_table' => 'calls',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Prospects'
        ],
        'prospect_emails' => [
            'lhs_module' => 'Prospects',
            'lhs_table' => 'prospects',
            'lhs_key' => 'id',
            'rhs_module' => 'Emails',
            'rhs_table' => 'emails',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Prospects'
        ],
        'prospect_campaign_log' => [
            'lhs_module' => 'Prospects',
            'lhs_table' => 'prospects',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignLog',
            'rhs_table' => 'campaign_log',
            'rhs_key' => 'target_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'target_type',
            'relationship_role_column_value' => 'Prospects'
        ],
        'accounts_prospects' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'Prospects',
            'rhs_table' => 'prospects',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Accounts'
        ],
        'contacts_prospects' =>
            [
            'lhs_module' => 'Contacts',
            'lhs_table' => 'contacts',
            'lhs_key' => 'id',
            'rhs_module' => 'Prospects',
            'rhs_table' => 'prospects',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Contacts'
            ],
        'leads_prospects' =>
            [
            'lhs_module' => 'Leads',
            'lhs_table' => 'leads',
            'lhs_key' => 'id',
            'rhs_module' => 'Prospects',
            'rhs_table' => 'prospects',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Leads'
            ],
    ]
];
VardefManager::createVardef('Prospects','Prospect', ['default', 'assignable',
'person']);

