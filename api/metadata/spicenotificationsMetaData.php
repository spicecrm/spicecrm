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
        'additional_infos' => [
            'name'    => 'additional_infos',
            'type'    => 'json',
            'dbType'  => 'text',
            'comment' => 'a json that holds the additional infos required for the notification text'
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
