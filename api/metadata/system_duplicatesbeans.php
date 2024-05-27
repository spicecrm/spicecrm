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

SpiceDictionaryHandler::getInstance()->dictionary['sysduplicatesbeans'] = [
    'table' => 'sysduplicatesbeans',
    'comment' => 'table containing duplicate Bean IDs and their status',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
            'reportable' => true,
            'comment' => 'Unique identifier'
        ],
        'bean_type' => [
            'name' => 'bean_type',
            'type' => 'varchar',
            'len' => '50'
        ],
        'bean_id_right' => [
            'name' => 'bean_id_right',
            'type' => 'id',
            'comment' => 'parent Bean'
        ],
        'bean_id_left' => [
            'name' => 'bean_id_left',
            'type' => 'id',
            'comment' => 'duplicate Bean'
        ],
        'date_created' => [
            'name' => 'date_created',
            'type' => 'datetime'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'created_by' => [
            'name' => 'created_by',
            'type' => 'id',
        ],
        'modified_by' => [
            'name' => 'modified_by',
            'type' => 'id',
        ],
        'duplicate_status' => [
            'name' => 'duplicate_status',
            'type' => 'enum',
            'vname' => 'LBL_DUPLICATE_STATUS',
            'options' => 'duplicate_status_dom',
            'len' => '20',
            'comment' => 'status of the duplicate acceptance/check',
        ],
        'deleted' => [
            'name' => 'deleted',
            'vname' => 'LBL_DELETED',
            'type' => 'bool',
            'default' => 0
        ],
    ],
    'indices' => [
        ['name' => 'sysduplicatesbeanspk', 'type' => 'primary', 'fields' => ['id']],
    ],
];
