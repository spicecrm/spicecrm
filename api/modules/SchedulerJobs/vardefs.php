<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 * 
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
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
 * 
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/


use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['SchedulerJob'] = [
    'table' => 'schedulerjobs',
	'fields' => [
		'date_time_start' => [
			'name' => 'date_time_start',
			'vname' => 'LBL_DATE_START',
			'type' => 'datetimecombo',
			'required' => true,
			'reportable' => false
        ],
		'date_time_end' => [
			'name' => 'date_time_end',
			'vname' => 'LBL_DATE_END',
			'type' => 'datetimecombo',
			'reportable' => false,
        ],
        'next_run_date' => [
            'name' => 'next_run_date',
            'vname' => 'LBL_NEXT_RUN_DATE',
            'type' => 'datetime'
        ],
        'last_run_date' => [
            'name' => 'last_run_date',
            'vname' => 'LBL_LAST_RUN_DATE',
            'type' => 'datetime'
        ],
        'last_run_resolution' => [
            'name' => 'last_run_resolution',
            'vname' => 'LBL_LAST_RUN_RESOLUTION',
            'type' => 'varchar',
            'len' => 20
        ],
        'last_run_message' => [
            'name' => 'last_run_message',
            'vname' => 'LBL_LAST_MESSAGE',
            'type' => 'text'
        ],
		'job_interval' => [
			'name' => 'job_interval',
			'vname' => 'LBL_INTERVAL',
			'type' => 'varchar',
			'len' => '100',
			'required' => true,
			'reportable' => false,
        ],
        'hold_on_failure' => [
            'name' => 'hold_on_failure',
            'vname' => 'LBL_HOLD_ON_FAILURE',
            'type' => 'bool',
            'default' => '0'
        ],
		'job_status' => [
			'name' => 'job_status',
			'vname' => 'LBL_STATUS',
			'type' => 'enum',
			'options' => 'job_status_dom',
			'len' => 100,
			'required' => false,
			'reportable' => false,
			'importable' => 'required',
            'default' => 'Inactive'
        ],
		'priority' => [
			'name' => 'priority',
			'vname' => 'LBL_PRIORITY',
			'type' => 'int',
			'len' => 4
        ],
        'process_id' => [
            'name' => 'process_id',
            'vname' => 'LBL_PROCESS_ID',
            'type' => 'varchar',
            'len' => 20
        ],
        'notify_user' => [
            'name' => 'notify_user',
            'vname' => 'LBL_NOTIFY_USER',
            'type' => 'bool',
            'default' => 0
        ],
		'jobtask_sequence' => [
			'name' => 'jobtask_sequence',
			'vname' => 'LBL_SEQUENCE',
			'type' => 'int',
			'len' => 4,
            'source' => 'non-db'
        ],
        'm2m_next_run_date' => [
            'name' => 'm2m_next_run_date',
            'vname' => 'LBL_NEXT_RUN_DATE',
            'type' => 'datetime',
            'source' => 'non-db'
        ],
		'schedulerjobtasks' => [
			'name'			=> 'schedulerjobtasks',
			'vname'			=> 'LBL_SCHEDULERJOBTASKS',
			'type'			=> 'link',
			'relationship'	=> 'schedulerjobs_schedulerjobtasks',
			'module'		=> 'SchedulerJobTasks',
			'source'		=> 'non-db',
            'sequence_field' => 'sequence',
            'rel_fields' => [
                'sequence' => [
                    'map' => 'jobtask_sequence'
                ],
                'next_run_date' => [
                    'map' => 'm2m_next_run_date'
                ]
            ]
        ]
    ],
	'indices' => [
            [
            'name' =>'schedulerjobs_idx_start',
            'type'=>'index',
            'fields' => [
                'date_time_start',
                'deleted'
            ]
        ],
    ],
	'relationships' => [
        'schedulerjobs_schedulerjobtasks' => [
            'lhs_module' => 'SchedulerJobs',
            'lhs_table' => 'schedulerjobs',
            'lhs_key' => 'id',
            'rhs_module' => 'SchedulerJobTasks',
            'rhs_table' => 'schedulerjobtasks',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'schedulerjobs_schedulerjobtasks',
            'join_key_lhs' => 'schedulerjob_id',
            'join_key_rhs' => 'schedulerjobtask_id'
        ]
    ]
];

VardefManager::createVardef('SchedulerJobs','SchedulerJob', ['default', 'assignable']);
