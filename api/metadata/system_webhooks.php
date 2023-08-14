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

SpiceDictionaryHandler::getInstance()->dictionary['syswebhooks'] = [
    'table' => 'syswebhooks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 50
        ],
        'event' => [
            'name' => 'event',
            'type' => 'varchar',
            'len' => 50
        ],
        'url' => [
            'name' => 'url',
            'type' => 'varchar',
            'len' => 100
        ],
        'active' => [
            'name' => 'active',
            'type' => 'bool',
            'default' => 0
        ],
        'send_data' => [
            'name' => 'send_data',
            'type' => 'bool',
            'default' => 0
        ],
        'modulefilter_id' => [
            'name' => 'modulefilter_id',
            'type' => 'id'
        ],
        'fieldset_id' => [
            'name' => 'fieldset_id',
            'type' => 'id',

        ],
        'ssl_verifypeer' => [
            'name' => 'ssl_verifypeer',
            'type' => 'bool',
            'default' => 1

        ],
        'ssl_verifyhost' => [
            'name' => 'ssl_verifyhost',
            'type' => 'bool',
            'default' => 1

        ],
        'custom_headers' => [
            'name' => 'custom_headers',
            'type' => 'json',
            'dbtype' => 'longtext'
        ]
    ],
    'indices' => [
        [
            'name' => 'webhookspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_webhooks_module',
            'type' => 'index',
            'fields' => ['module']
        ]
    ]
];
