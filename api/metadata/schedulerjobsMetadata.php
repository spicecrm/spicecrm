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

$dictionary['schedulerjobs_schedulerjobtasks'] = [
    'table' => 'schedulerjobs_schedulerjobtasks',
	'fields' => [
		'id' => [
			'name' => 'id',
			'vname' => 'LBL_ID',
			'type' => 'id'
        ],
		'deleted' => [
			'name' => 'deleted',
			'vname' => 'LBL_DELETED',
			'type' => 'bool',
			'default' => '0'
        ],
		'date_modified' => [
			'name' => 'date_modified',
			'vname' => 'LBL_DATE_MODIFIED',
			'type' => 'datetime'
        ],
		'schedulerjob_id' => [
			'name' => 'schedulerjob_id',
			'vname' => 'LBL_JOB_ID',
			'type' => 'id'
        ],
		'schedulerjobtask_id' => [
			'name' => 'schedulerjobtask_id',
			'vname' => 'LBL_JOBTASK_ID',
			'type' => 'id'
        ],
        'sequence' => [
            'name' => 'sequence',
            'vname' => 'LBL_SEQUENCE',
            'type' => 'int',
            'len' => 4
        ],
        'next_run_date' => [
            'name' => 'next_run_date',
            'vname' => 'LBL_NEXT_RUN_DATE',
            'type' => 'datetime'
        ]
    ],
	'indices' => [
        [
            'name' => 'schedulerjob_schedulerjobtasks_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'schedulerjob_schedulerjobtasks_alt',
            'type' => 'alternate_key',
            'fields' => ['schedulerjob_id', 'schedulerjobtask_id', 'sequence']
        ]
    ],
];

$dictionary['SchedulerJobLog'] = [
    'table' => 'schedulerjob_log',
    'comment' => 'Scheduler Job tasks execution log',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id'
        ],
        'schedulerjob_id' => [
            'name' => 'schedulerjob_id',
            'vname' => 'LBL_SCHEDULERJOB_ID',
            'type' => 'id'
        ],
        'schedulerjobtask_id' => [
            'name' => 'schedulerjobtask_id',
            'vname' => 'LBL_SCHEDULERJOBTASK_ID',
            'type' => 'id'
        ],
        'executed_on' => [
            'name' => 'executed_on',
            'vname' => 'LBL_EXECUTED_ON',
            'type' => 'datetime'
        ],
        'resolution' => [
            'name' => 'resolution',
            'vname' => 'LBL_RESOLUTION',
            'type' => 'varchar',
            'len' => 25
            ],
        'message' => [
            'name' => 'message',
            'vname' => 'LBL_MESSAGE',
            'type' => 'text'
        ]
    ],
    'indices' => [
        [
            'name' =>'schedulerjob_log_idx_job_resolution_executed_on',
            'type'=>'index',
            'fields' => [
                'schedulerjobtask_id',
                'schedulerjob_id',
                'resolution',
                'executed_on'
            ]
        ],
        [
            'name' =>'schedulerjob_log_idx_job',
            'type'=>'index',
            'fields' => [
                'schedulerjob_id'
            ]
        ],
        [
            'name' =>'schedulerjob_log_idx_jobtask',
            'type'=>'index',
            'fields' => [
                'schedulerjobtask_id'
            ]
        ]
    ],
];