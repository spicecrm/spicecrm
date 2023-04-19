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
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['EventBlueprint'] = [
    'table' => 'eventblueprints',
    'comment' => 'Event Blueprints Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'datetimecombo',
            'dbType' => 'datetime',
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
            'validation' => [
                'type' => 'isbefore',
                'compareto' => 'date_end',
                'blank' => false
            ]
        ],
        'date_end' => [
            'name' => 'date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'datetimecombo',
            'dbType' => 'datetime',
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'event_status_dom',
        ],
        'category' => [
            'name' => 'category',
            'vname' => 'LBL_CATEGORY',
            'type' => 'enum',
            'options' => 'event_category_dom',
        ],
        'capacity_participants' => [
            'name' => 'capacity_participants',
            'vname' => 'LBL_CAPACITY_PARTICIPANTS',
            'type' => 'int'
        ],
        'capacity_meeting_room' => [
            'name' => 'capacity_meeting_room',
            'vname' => 'LBL_CAPACITY_MEETING_ROOM',
            'type' => 'varchar'
        ],
        'capacity_accommodation' => [
            'name' => 'capacity_accommodation',
            'vname' => 'LBL_CAPACITY_ACCOMMODATION',
            'type' => 'varchar'
        ],
        'url' => [
            'name' => 'url',
            'vname' => 'LBL_URL',
            'type' => 'varchar',
            'len' => 400,
        ],
        'location_type' => [
            'name' => 'location_type',
            'vname' => 'LBL_LOCATION_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'len' => 100,
        ],
        'location_id' => [
            'name' => 'location_id',
            'vname' => 'LBL_LOCATION_ID',
            'type' => 'id',
            'reportable' => false,
        ],
        'location_name' => [
            'name' => 'location_name',
            'type_name' => 'location_type',
            'id_name' => 'location_id',
            'vname' => 'LBL_LOCATION',
            'type' => 'parent',
            'source' => 'non-db'
        ],
        'location_accounts' => [
            'name' => 'location_accounts',
            'type' => 'link',
            'relationship' => 'account_eventblueprints',
            'module' => 'Accounts',
            'bean_name' => 'Account',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNT',
        ],
        'events' => [
            'name' => 'events',
            'type' => 'link',
            'relationship' => 'eventblueprint_events',
            'module' => 'Events',
            'bean_name' => 'Event',
            'source' => 'non-db',
            'vname' => 'LBL_EVENT',
        ],
    ],
    'relationships' => [
        'account_eventblueprints' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'EventBlueprints',
            'rhs_table' => 'eventblueprints',
            'rhs_key' => 'location_id',
            'relationship_role_column' => 'location_type',
            'relationship_role_column_value' => 'Accounts',
            'relationship_type' => 'one-to-many'
        ],
        'eventblueprint_events' => [
            'lhs_module' => 'EventBlueprints',
            'lhs_table' => 'eventblueprints',
            'lhs_key' => 'id',
            'rhs_module' => 'Events',
            'rhs_table' => 'events',
            'rhs_key' => 'eventblueprint_id',
            'relationship_type' => 'one-to-many'
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_event_location_del',
            'type' => 'index',
            'fields' => ['location_id', 'location_type', 'deleted']
        ]
    ]
];

VardefManager::createVardef('EventBlueprints', 'EventBlueprint', ['default', 'assignable']);
