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

SpiceDictionaryHandler::getInstance()->dictionary['Tracker'] = [
    'table' => 'tracker',
    'fields' => [
        'id'=> [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'isnull' => 'false',
            'reportable'=>true,
        ],
	    'monitor_id'=> [
		    'name' => 'monitor_id',
		    'vname' => 'LBL_MONITOR_ID',
		    'type' => 'id',
		    'required'=>true,
		    'reportable'=>false,
        ],
        'user_id'=> [
            'name' => 'user_id',
            'vname' => 'LBL_USER_ID',
			'type' => 'varchar',
            'len' => '36',
            'isnull' => 'false',
        ],
        'module_name'=> [
            'name' => 'module_name',
            'vname' => 'LBL_MODULE_NAME',
            'type' => 'varchar',
            'len' => '255',
            'isnull' => 'false',
        ],
        'item_id'=> [
            'name' => 'item_id',
            'vname' => 'LBL_ITEM_ID',
            'type' => 'varchar',
            'len' => '36',
            'isnull' => 'false',
        ],
        'item_summary'=> [
            'name' => 'item_summary',
            'vname' => 'LBL_ITEM_SUMMARY',
            'type' => 'varchar',
            'len' => '255',
            'isnull' => 'false',
        ],
        'date_modified'=> [
            'name' => 'date_modified',
            'vname' => 'LBL_DATE_LAST_ACTION',
            'type' => 'datetime',
            'isnull' => 'false',
        ],
        'action'=> [
            'name' => 'action',
            'vname' => 'LBL_ACTION',
            'type' => 'varchar',
            'len' => '255',
            'isnull' => 'false',
        ],
        'session_id'=> [
            'name' => 'session_id',
            'vname' => 'LBL_SESSION_ID',
            'type' => 'varchar',
            'len' => '36',
            'isnull' => 'true',
        ],
        'visible'=> [
            'name' => 'visible',
            'vname' => 'LBL_VISIBLE',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
        ],
	    'deleted' => [
		    'name' => 'deleted',
		    'vname' => 'LBL_DELETED',
		    'type' => 'bool',
		    'default' => '0',
		    'reportable'=>false,
		    'comment' => 'Record deletion indicator'
        ],
		'assigned_user_link'=> [
		    'name' => 'assigned_user_link',
		    'type' => 'link',
		    'relationship' => 'tracker_user_id',
		    'vname' => 'LBL_ASSIGNED_TO',
		    'link_type' => 'one',
		    'module'=>'Users',
		    'bean_name'=>'User',
		    'source'=>'non-db',
        ],
		'monitor_id_link'=> [
		    'name' => 'monitor_id_link',
		    'type' => 'link',
		    'relationship' => 'tracker_monitor_id',
		    'vname' => 'LBL_MONITOR_ID',
		    'link_type' => 'one',
		    'module'=>'TrackerPerfs',
		    'bean_name'=>'TrackerPerf',
		    'source'=>'non-db',
        ],
    ],

    //indices
    'indices' => [
        [
            'name' => 'tracker_pk',
            'type' => 'primary',
            'fields' => [
                'id'
            ]
        ],
        [
            'name' => 'idx_tracker_iid',
            'type' => 'index',
            'fields' => [
                'item_id',
            ],
        ],
        [
            // shortened name to comply with Oracle length restriction
            'name' => 'idx_tracker_userid_vis_id',
            'type' => 'index',
            'fields' => [
                'user_id',
                'visible',
                'id',
            ],
        ],
        [
        	// shortened name to comply with Oracle length restriction
            'name' => 'idx_tracker_userid_itemid_vis',
            'type' => 'index',
            'fields' => [
                'user_id',
                'item_id',
                'visible'
            ],
        ],
        [
            'name' => 'idx_tracker_monitor_id',
            'type' => 'index',
            'fields' => [
                'monitor_id',
            ],
        ],
        [
            'name' => 'idx_tracker_date_modified',
            'type' => 'index',
            'fields' => [
                'date_modified',
            ],
        ],
    ],

    //relationships
 	'relationships' => [
	  'tracker_monitor_id' =>
		   [
				'lhs_module'=> 'TrackerPerfs', 'lhs_table'=> 'tracker_perf', 'lhs_key' => 'monitor_id',
		   		'rhs_module'=> 'Trackers', 'rhs_table'=> 'tracker', 'rhs_key' => 'monitor_id',
		   		'relationship_type'=>'one-to-one'
           ]
    ],
];
