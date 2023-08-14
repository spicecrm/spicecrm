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

SpiceDictionaryHandler::getInstance()->dictionary['ServiceCalendar'] = [
    'table' => 'servicecalendars',
    'comment' => 'ServiceCalendars Module',
    'audited' => false,
    'unified_search' => false,
    'fields' => [
        'timezone' => [
            'name' => 'timezone',
            'vname' => 'LBL_TIMEZONE',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
            'comment' => 'the timezone for time entries for this calendar'
        ],
        'systemholidaycalendar_id' => [
            'name' => 'systemholidaycalendar_id',
            'vname' => 'LBL_SYSTEMHOLIDAYCALENDAR_ID',
            'type' => 'id',
            'required' => false,
            'comment' => 'the id of the ServiceCalendar'
        ],
        'systemholidaycalendar_name' => [
            'name' => 'systemholidaycalendar_name',
            'vname' => 'LBL_SYSTEMHOLIDAYCALENDAR',
            'type' => 'relate',
            'source' => 'non-db',
            'len' => '255',
            'id_name' => 'systemholidaycalendar_id',
            'module' => 'SystemHolidayCalendars',
            'link' => 'systemholidaycalendar',
            'join_name' => 'systemholidaycalendar',
        ],
        'servicecalendartimes' => [
            'vname' => 'LBL_SERVICECALENDARTIMES',
            'name' => 'servicecalendartimes',
            'type' => 'link',
            'module' => 'ServiceCalendarTimes',
            'relationship' => 'servicecalendar_servicecalendartimes',
            'source' => 'non-db'
        ],
        'systemholidaycalendar' => [
            'vname' => 'LBL_SYSTEMHOLIDAYCALENDAR',
            'name' => 'systemholidaycalendar',
            'type' => 'link',
            'module' => 'SystemHolidayCalendars',
            'relationship' => 'systemholidaycalendar_servicecalendars',
            'link_type' => 'one',
            'source' => 'non-db'
        ],
        'serviceticketsla' => [
            'vname' => 'LBL_SERVICETICKETSLA',
            'name' => 'serviceticketsla',
            'type' => 'link',
            'module' => 'ServiceTicketSLAs',
            'relationship' => 'servicecalendar_serviceticketslas',
            'link_type' => 'one',
            'source' => 'non-db'
        ],
        'servicecalendartimes' => [
            'name' => 'servicecalendartimes',
            'vname' => 'LBL_SERVICECALENDARTIMES',
            'type' => 'link',
            'module' => 'ServiceCalendarTimes',
            'relationship' => 'servicecalendar_servicecalendartimes',
            'link_type' => 'one',
            'source' => 'non-db'
        ]
    ],
    'relationships' => [
        'servicecalendar_serviceticketslas' => [
            'lhs_module' => 'ServiceCalendars',
            'lhs_table' => 'servicecalendars',
            'lhs_key' => 'id',
            'rhs_module' => 'ServiceTicketSLAs',
            'rhs_table' => 'serviceticketslas',
            'rhs_key' => 'servicecalendar_id',
            'relationship_type' => 'one-to-many'
        ]
    ]
];

VardefManager::createVardef('ServiceCalendars', 'ServiceCalendar', ['default']);
