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

$dictionary['KReportGroupings'] = [
    'table' => 'kreportgroupings',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar'
        ],
        'description' => [
            'name' => 'description',
            'type' => 'text'
        ],
        'modulename' => [
            'name' => 'modulename',
            'type' => 'varchar',
        ],
        'fieldname' => [
            'name' => 'fieldname',
            'type' => 'varchar',
        ],
        'fieldtype' => [
            'name' => 'fieldtype',
            'type' => 'varchar',
        ],
        'mapping' => [
            'name' => 'mapping',
            'type' => 'text'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
	        'default' => 0,
        ],
    ],
    'indices' => [
        ['name' => 'kreportgroupingspk', 'type' => 'primary', 'fields' => ['id']],
    ],
];

