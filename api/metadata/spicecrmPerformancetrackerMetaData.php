<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary["SpicePerformanceTracker"] = [
  'table' => 'spiceperformancetrackers',
  'fields' => 
  [
    'id' => 
    [
      'name' => 'id',
      'vname' => 'LBL_ID',
      'type' => 'id',
      'required' => true,
      'reportable' => true,
      'comment' => 'Unique identifier',
    ],
    'date_entered' => 
    [
      'name' => 'date_entered',
      'vname' => 'LBL_DATE_ENTERED',
      'type' => 'datetime',
      'group' => 'created_by_name',
      'comment' => 'Date record created',
      'enable_range_search' => true,
      'options' => 'date_range_search_dom',
    ],
    'created_by' => 
    [
      'name' => 'created_by',
      'rname' => 'user_name',
      'id_name' => 'modified_user_id',
      'vname' => 'LBL_CREATED',
      'type' => 'assigned_user_name',
      'table' => 'users',
      'isnull' => 'false',
      'dbType' => 'id',
      'group' => 'created_by_name',
      'comment' => 'User who created record',
      'massupdate' => false,
    ],
    'deleted' => 
    [
      'name' => 'deleted',
      'vname' => 'LBL_DELETED',
      'type' => 'bool',
      'default' => '0',
      'reportable' => false,
      'comment' => 'Record deletion indicator',
    ],
    'appresponsetime' => 
    [
      'name' => 'appresponsetime',
      'type' => 'double',
      'vname' => 'LBL_APPRESPONSE',
    ],
    'dbresponsetime' => 
    [
      'name' => 'dbresponsetime',
      'type' => 'double',
      'vname' => 'LBL_DBRESPONSE',
    ],
    'appserver' => 
    [
      'name' => 'appserver',
      'type' => 'varchar',
      'len' => '50',
      'vname' => 'LBL_APPSERVER',
    ],
    'originalurl' => 
    [
      'name' => 'originalurl',
      'type' => 'text',
      'vname' => 'LBL_ORIGINALURL',
    ],
    'phperror' => 
    [
      'name' => 'phperror',
      'type' => 'text',
      'vname' => 'LBL_PHPERROR',
    ],
    'phpbody' => 
    [
      'name' => 'phpbody',
      'type' => 'longtext',
      'vname' => 'LBL_PHPBODY',
    ]
  ],
  'indices' => 
  [
    'id' => 
    [
      'name' => 'sperformancetrackerspk',
      'type' => 'primary',
      'fields' => 
      [
        0 => 'id',
      ],
    ],
  ],
  'optimistic_locking' => true,
  'favorites' => true,
  'templates' => 
  [
    'basic' => 'basic',
  ],
  'custom_fields' => false,
  'related_calc_fields' => 
  [
  ],
 ];
