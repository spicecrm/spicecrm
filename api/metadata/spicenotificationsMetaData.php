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
global $dictionary;
$dictionary['spicenotifications'] = [
    'table'  => 'spicenotifications',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'len'  => '36',
        ],
        'bean_module' => [
            'name' => 'bean_module',
            'type' => 'varchar',
            'len'  => '50',
            'comment' => 'the module'
        ],
        'bean_id' => [
            'name' => 'bean_id',
            'type' => 'id',
            'len'  => '36',
            'comment' => 'the id of the bean'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id',
            'len'  => '36',
            'comment' => 'the id of the user that is being notified'
        ],
        'created_by' => [
            'name' => 'created_by',
            'type' => 'id',
            'len'  => '36',
            'comment' => 'the id of the user originating the notification'
        ],
        'notification_date' => [
            'name' => 'notification_date',
            'type' => 'datetime',
            'comment' => 'the date and time when the notification has been created'
        ],
        'notification_type' => [
            'name' => 'notification_type',
            'type' => 'varchar',
            'len'  => '24',
            'comment' => 'the type of notification'
        ],
        'notification_read' => [
            'name' => 'notification_read',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'indicates that the user has read the notification'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'delete indicatior'
        ]
    ],
    'indices' => [
        [
            'name'   => 'spicenotifications_pk',
            'type'   => 'primary',
            'fields' => ['id'],
        ],
    ],
];
