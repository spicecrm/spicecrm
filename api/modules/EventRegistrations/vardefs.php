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

SpiceDictionaryHandler::getInstance()->dictionary['EventRegistration'] = [
    'table' => 'eventregistrations',
    'comment' => 'EventRegistrations Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
            'required' => false
        ],
        'registration_status' => [
            'name' => 'registration_status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'eventregistration_status_dom',
            'len' => 16,
            'comment' => 'registration state: registered|canceled|attended|notattended'
        ],
        'salutation' => [
            'name' => 'salutation',
            'type' => 'enum',
            'options' => 'salutation_dom',
            'massupdate' => false,
            'len' => 255,
            'vname' => 'LBL_SALUTATION',
        ],
        'first_name' => [
            'name' => 'first_name',
            'type' => 'varchar',
            'len' => 100,
            'vname' => 'LBL_FIRST_NAME',
        ],
        'last_name' => [
            'name' => 'last_name',
            'type' => 'varchar',
            'len' => 100,
            'vname' => 'LBL_LAST_NAME',
        ],
        'email' => [
            'name' => 'email',
            'type' => 'varchar',
            'len' => 100,
            'vname' => 'LBL_EMAIL'
        ],
        'phone_mobile' => [
            'name' => 'phone_mobile',
            'vname' => 'LBL_PHONE_MOBILE',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => 100,
            'unified_search' => true,
        ],
        'registration_source' => [
            'name' => 'registration_source',
            'type' => 'varchar',
            'len' => 255,
            'vname' => 'LBL_URL',
        ],
        'campaign_id' => [
            'name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN_ID',
            'type' => 'varchar',
            'len' => 36,
            'comment' => 'Campaign identifier',
            'reportable' => false,
        ],
        'campaign_name' => [
            'name' => 'campaign_name',
            'rname' => 'name',
            'id_name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN',
            'type' => 'relate',
            'table' => 'campaigns',
            'isnull' => 'true',
            'module' => 'Campaigns',
            'dbType' => 'varchar',
            'link' => 'campaigns',
            'len' => '255',
            'source' => 'non-db',
        ],
        'campaigns' => [
            'name' => 'campaigns',
            'vname' => 'LBL_CAMPAIGN_LINK',
            'type' => 'link',
            'relationship' => 'eventregistration_campaign_rel',
            'source' => 'non-db',
        ],
        'event_id' => [
            'name' => 'event_id',
            'vname' => 'LBL_EVENT_ID',
            'type' => 'varchar',
            'len' => 36,
            'reportable' => false,
            'required' => true,
        ],
        'event_name' => [
            'name' => 'event_name',
            'rname' => 'name',
            'id_name' => 'event_id',
            'vname' => 'LBL_EVENT',
            'type' => 'relate',
            'table' => 'events',
            'isnull' => 'true',
            'module' => 'Events',
            'dbType' => 'varchar',
            'link' => 'events',
            'len' => '255',
            'source' => 'non-db',
            'required' => true
        ],
        'events' => [
            'name' => 'events',
            'vname' => 'LBL_EVENTS',
            'type' => 'link',
            'relationship' => 'events_eventregistrations',
            'source' => 'non-db',
        ],
        'campaigntask_id' => [
            'name' => 'campaigntask_id',
            'vname' => 'LBL_CAMPAIGNtask_ID',
            'type' => 'varchar',
            'len' => 36,
            'comment' => 'Campaign identifier',
            'reportable' => false,
        ],
        'campaigntask_name' => [
            'name' => 'campaigntask_name',
            'rname' => 'name',
            'id_name' => 'campaigntask_id',
            'vname' => 'LBL_CAMPAIGNTASK',
            'type' => 'relate',
            'table' => 'campaigntasks',
            'isnull' => 'true',
            'module' => 'CampaignTasks',
            'dbType' => 'varchar',
            'link' => 'campaigntask_link',
            'len' => '255',
            'source' => 'non-db',
        ],
        'campaigntask_link' => [
            'name' => 'campaigntask_link',
            'vname' => 'LBL_CAMPAIGNtask_LINK',
            'type' => 'link',
            'relationship' => 'eventregistration_campaigntask_rel',
            'source' => 'non-db',
        ],
        'contact_id' => [
            'name' => 'contact_id',
            'vname' => 'LBL_CONTACT_ID',
            'type' => 'id',
            'comment' => 'Contact identifier',
            'reportable' => false,
            'required' => false,
        ],
        'contact_name' => [
            'name' => 'contact_name',
            'rname' => 'name',
            'id_name' => 'contact_id',
            'vname' => 'LBL_CONTACT',
            'type' => 'relate',
            'table' => 'contacts',
            'isnull' => 'true',
            'module' => 'Contacts',
            'dbType' => 'varchar',
            'link' => 'contact_link',
            'len' => '255',
            'source' => 'non-db',
            'required' => false,
        ],
        'contact_link' => [
            'name' => 'contact_link',
            'vname' => 'LBL_CONTACT_LINK',
            'type' => 'link',
            'relationship' => 'eventregistration_contact_rel',
            'source' => 'non-db',
        ]
    ],
    'relationships' => [
        'events_eventregistrations' => [
            'lhs_module' => 'Events',
            'lhs_table' => 'events',
            'lhs_key' => 'id',
            'rhs_module' => 'EventRegistrations',
            'rhs_table' => 'eventregistrations',
            'rhs_key' => 'event_id',
            'relationship_type' => 'one-to-many'
        ],
        'eventregistration_campaign_rel' => [
            'lhs_module' => 'Campaigns',
            'lhs_table' => 'campaigns',
            'lhs_key' => 'id',
            'rhs_module' => 'EventRegistrations',
            'rhs_table' => 'eventregistrations',
            'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'
        ],
        'eventregistration_campaigntask_rel' => [
            'lhs_module' => 'CampaignTasks',
            'lhs_table' => 'campaigntasks',
            'lhs_key' => 'id',
            'rhs_module' => 'EventRegistrations',
            'rhs_table' => 'eventregistrations',
            'rhs_key' => 'campaigntask_id',
            'relationship_type' => 'one-to-many'
        ],
        'eventregistration_contact_rel' => [
            'lhs_module' => 'Contacts',
            'lhs_table' => 'contacts',
            'lhs_key' => 'id',
            'rhs_module' => 'EventRegistrations',
            'rhs_table' => 'eventregistrations',
            'rhs_key' => 'contact_id',
            'relationship_type' => 'one-to-many'
        ],
    ],
    'indices' => [
        ['name' => 'idx_regcamp_id', 'type' => 'index', 'fields' => ['campaign_id']],
        ['name' => 'idx_regctid', 'type' => 'index', 'fields' => ['contact_id']],
        ['name' => 'idx_regcampctid', 'type' => 'index', 'fields' => ['campaign_id', 'contact_id', 'deleted']],
    ]
];

VardefManager::createVardef('EventRegistrations', 'EventRegistration', ['default', 'assignable']);
