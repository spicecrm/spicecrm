<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
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


/**
 * Core mailbox_processors table
 */
$dictionary['mailbox_processors'] = [
    'table'		=> 'mailbox_processors',
    'fields'	=> [
        'id' => [
            'name'			=> 'id',
            'type'			=> 'id',
            'vname'         => 'LBL_MAILBOX_PROCESSOR_ID',
            'required'		=> true,
        ],
        'mailbox_id' => [
            'name'			=> 'mailbox_id',
            'type'			=> 'id',
            'vname'         => 'LBL_MAILBOX_ID',
            'length'		=> 36,
            'required'		=> true,
        ],
        'file' => [
            'name'			=> 'file',
            'type'			=> 'varchar',
            'vname'         => 'LBL_FILE',
            'length'		=> 255,
            'required'		=> true,
        ],
        'class' => [
            'name'			=> 'class',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_CLASS',
            'required'		=> true,
        ],
        'method' => [
            'name'			=> 'method',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_METHOD',
            'required'		=> true,
        ],
        'priority' => [
            'name'			=> 'priority',
            'type'			=> 'int',
            'length'        => 8,
            'vname'         => 'LBL_PRIORITY',
            'required'		=> true,
        ],
        'stop_on_success' => [
            'name'			=> 'stop_on_success',
            'type'			=> 'bool',
            'default'       => 0,
            'vname'         => 'LBL_STOP_ON_SUCCESS',
        ],
    ],
    'indices' => [
        [
            'name'			=> 'mailbox_processorspk',
            'type'			=> 'primary',
            'fields'		=> ['id'],
        ],
    ],
];
