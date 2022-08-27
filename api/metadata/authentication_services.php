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
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['authentication_services'] = [
    'table' => 'authentication_services',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id'
        ],
        'issuer' => [
            'name' => 'issuer',
            'vname' => 'LBL_ISSUER',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'unique key to retrieve by'
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => 100,
        ],
        'icon' => [
            'name' => 'icon',
            'vname' => 'LBL_ICON',
            'type' => 'longtext',
        ],
        'class_name' => [
            'name' => 'class_name',
            'vname' => 'LBL_CLASS_NAME',
            'type' => 'varchar',
            'comment' => 'holds the class name of the authentication class'
        ],
        'sequence' => [
            'name' => 'sequence',
            'vname' => 'LBL_SEQUENCE',
            'type' => 'int',
            'len' => 2,
            'comment' => 'sort sequence of the buttons'
        ],
    ],
    'indices' => [
        [
            'name' => 'oauth_pk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['sysauthconfig'] = [
    'table' => 'sysauthconfig',
    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => 100,
        ],
        'issuer' => [
            'name' => 'issuer',
            'vname' => 'LBL_ISSUER',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'unique key to retrieve by'
        ],
        'config' => [
            'name' => 'config',
            'vname' => 'LBL_CONFIG',
            'type' => 'json',
            'dbtype' => 'text',
            'comment' => 'holds the configuration of the service'
        ]
    ]
];
