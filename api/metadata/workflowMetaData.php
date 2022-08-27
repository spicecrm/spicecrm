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


use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;


SpiceDictionaryHandler::getInstance()->dictionary['workflowtasktypes'] = [
    'table' => 'workflowtasktypes',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 16
        ],
        'handler_class' => [
            'name' => 'handler_class',
            'type' => 'varchar'
        ],
        'admin_component' => [
            'name' => 'admin_component',
            'type' => 'varchar',
            'len' => 100
        ],
        'frontend_component' => [
            'name' => 'frontend_component',
            'type' => 'varchar',
            'len' => 100
        ],
        'type' => [
            'name' => 'type',
            'type' => 'enum',
            'options' => 'workflowtasktypes_type_enum',
            'default' => 'regular'
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'enum',
            'options' => 'workflowtasktypes_icon_enum'
        ],
        'assignable' => [
            'name' => 'assignable',
            'type' => 'bool',
            'default' => true,
            'comment' => 'if tasks of this type can be assigned to users'
        ],
        'has_timing' => [
            'name' => 'has_timing',
            'type' => 'bool',
            'default' => true,
            'comment' => 'if tasks of this type can set timing'
        ],
        'typedefaults' => [
            'name' => 'typedefaults',
            'type' => 'json',
            'comment' => 'any defaults for this tasktype'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
        ],
        'version' => [
            'name' => 'version',
            'type' => 'varchar',
            'len' => 16
        ],
        'package' => [
            'name' => 'package',
            'type' => 'varchar',
            'len' => 32
        ]
    ],
    'indices' => [
        [
            'name' => 'workflowtasktypespk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_workflowtasktypes_deleted',
            'type' => 'index',
            'fields' => ['deleted']
        ]
    ]
];