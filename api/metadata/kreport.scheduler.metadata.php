<?php
/* * *******************************************************************************
 * This file is part of KReporter. KReporter is an enhancement developed
 * by Christian Knoll. All rights are (c) 2012 by Christian Knoll
 *
 * This Version of the KReporter is licensed software and may only be used in
 * alignment with the License Agreement received with this Software.
 * This Software is copyrighted and may not be further distributed without
 * witten consent of Christian Knoll
 *
 * You can contact us at info@kreporter.org
 * ****************************************************************************** */

$dictionary['kreportschedulers'] = [
	'table' => 'kreportschedulers',
        'fields' => [
           'id' => [
                  'name' => 'id',
                  'type' => 'id',
           ],
           'report_id' => [
	          'name' => 'report_id',
	          'type' => 'id',
           ],
	   'job_id' => [
	          'name' => 'job_id',
	          'type' => 'id',
       ],
	   'timestamp' => [
	   	  'name' => 'timestamp',
	          'type' => 'datetime'
       ],
            'status' => [
                'name' => 'status', 
                'type' => 'char', 
                'len' => 1
            ]
        ],
   	'indices' => [
        ['name' => 'kreportschedulerspk', 'type' => 'primary', 'fields' => ['id']]
    ]
];
