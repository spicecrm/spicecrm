<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['schedulerjobs_schedulerjobtasks'] = [
    'table' => 'schedulerjobs_schedulerjobtasks',
    'contenttype'   => 'relationdata',
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

SpiceDictionaryHandler::getInstance()->dictionary['SchedulerJobLog'] = [
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
