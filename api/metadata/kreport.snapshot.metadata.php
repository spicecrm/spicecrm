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

$dictionary['KReportSnapshots'] = [
    'table' => 'kreportsnapshots',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
        ],
        'report_id' => [
            'name' => 'report_id',
            'type' => 'id',
        ],
        'snapshotdate' => [
            'name' => 'snapshotdate',
            'type' => 'datetime',
        ],
        'snapshotquery' => [
            'name' => 'snapshotquery',
            'type' => 'text',
        ],
        'data' => [
            'name' => 'data',
            'type' => 'longblob'
        ],
    ],
    'indices' => [
        ['name' => 'kreportsnapshotspk', 'type' => 'primary', 'fields' => ['id']]
    ],
];

$dictionary['KReportSnapshotsData'] = [
    'table' => 'kreportsnapshotsdata',
    'fields' => [
        /* 	   'id' => array(
          'name' => 'id',
          'type' => 'id',
          ), */
        'snapshot_id' => [
            'name' => 'snapshot_id',
            'type' => 'id',
            'required' => true,
            'isnull' => false,
        ],
        'record_id' => [
            'name' => 'record_id',
            'type' => 'double',
            // bug #525 fixed MSSQL erro in installation
            'required' => true,
            'isnull' => false,
        ],
        'data' => [
            'name' => 'data',
            'type' => 'blob',
        ],
    ],
    'indices' => [
        ['name' => 'kreportsnapshotsdatapk', 'type' => 'primary', 'fields' => ['snapshot_id', 'record_id']]
    ],
];
