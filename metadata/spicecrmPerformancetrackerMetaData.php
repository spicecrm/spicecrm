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

 $dictionary["SpicePerformanceTracker"]=array (
  'table' => 'spiceperformancetrackers',
  'fields' => 
  array (
    'id' => 
    array (
      'name' => 'id',
      'vname' => 'LBL_ID',
      'type' => 'id',
      'required' => true,
      'reportable' => true,
      'comment' => 'Unique identifier',
    ),
    'date_entered' => 
    array (
      'name' => 'date_entered',
      'vname' => 'LBL_DATE_ENTERED',
      'type' => 'datetime',
      'group' => 'created_by_name',
      'comment' => 'Date record created',
      'enable_range_search' => true,
      'options' => 'date_range_search_dom',
    ),
    'created_by' => 
    array (
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
    ),
    'deleted' => 
    array (
      'name' => 'deleted',
      'vname' => 'LBL_DELETED',
      'type' => 'bool',
      'default' => '0',
      'reportable' => false,
      'comment' => 'Record deletion indicator',
    ),
    'appresponsetime' => 
    array (
      'name' => 'appresponsetime',
      'type' => 'double',
      'vname' => 'LBL_APPRESPONSE',
    ),
    'dbresponsetime' => 
    array (
      'name' => 'dbresponsetime',
      'type' => 'double',
      'vname' => 'LBL_DBRESPONSE',
    ),
    'appserver' => 
    array (
      'name' => 'appserver',
      'type' => 'varchar',
      'len' => '50',
      'vname' => 'LBL_APPSERVER',
    ),
    'originalurl' => 
    array (
      'name' => 'originalurl',
      'type' => 'text',
      'vname' => 'LBL_ORIGINALURL',
    ),
    'phperror' => 
    array (
      'name' => 'phperror',
      'type' => 'text',
      'vname' => 'LBL_PHPERROR',
    ),
    'phpbody' => 
    array (
      'name' => 'phpbody',
      'type' => 'longtext',
      'vname' => 'LBL_PHPBODY',
    )
  ),
  'indices' => 
  array (
    'id' => 
    array (
      'name' => 'sperformancetrackerspk',
      'type' => 'primary',
      'fields' => 
      array (
        0 => 'id',
      ),
    ),
  ),
  'optimistic_locking' => true,
  'favorites' => true,
  'templates' => 
  array (
    'basic' => 'basic',
  ),
  'custom_fields' => false,
  'related_calc_fields' => 
  array (
  ),
);