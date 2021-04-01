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

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Campaign'] = ['audited' => true,
    'comment' => 'Campaigns are a series of operations undertaken to accomplish a purpose, usually acquiring leads',
    'table' => 'campaigns',
    'unified_search' => true,
    'full_text_search' => true,
    'fields' => [
//        'tracker_key' => array(
//            'name' => 'tracker_key',
//            'vname' => 'LBL_TRACKER_KEY',
//            'type' => 'int',
//            'required' => true,
//            'studio' => array('editview' => false),
//            'len' => '11',
//            'auto_increment' => true,
//            'comment' => 'The internal ID of the tracker used in a campaign; no longer used as of 4.2 (see campaign_trkrs)'
//        ),
//        'tracker_count' => array(
//            'name' => 'tracker_count',
//            'vname' => 'LBL_TRACKER_COUNT',
//            'type' => 'int',
//            'len' => '11',
//            'default' => '0',
//            'comment' => 'The number of accesses made to the tracker URL; no longer used as of 4.2 (see campaign_trkrs)'
//        ),
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'dbType' => 'varchar',
            'type' => 'name',
            'len' => '50',
            'comment' => 'The name of the campaign',
            'importable' => 'required',
            'required' => true,
            'unified_search' => true,
            'full_text_search' => ['boost' => 3],
        ],
        'refer_url' => [
            'name' => 'refer_url',
            'vname' => 'LBL_REFER_URL',
            'type' => 'varchar',
            'len' => '255',
            'default' => 'http://',
            'comment' => 'The URL referenced in the tracker URL; no longer used as of 4.2 (see campaign_trkrs)'
        ],
        'description' => ['name' => 'description', 'type' => 'none', 'comment' => 'inhertied but not used', 'source' => 'non-db'],
        'tracker_text' => [
            'name' => 'tracker_text',
            'vname' => 'LBL_TRACKER_TEXT',
            'type' => 'varchar',
            'len' => '255',
            'comment' => 'The text that appears in the tracker URL; no longer used as of 4.2 (see campaign_trkrs)'
        ],

        'start_date' => [
            'name' => 'start_date',
            'vname' => 'LBL_DATE_START',
            'type' => 'date',
            'audited' => true,
            'comment' => 'Starting date of the campaign',
            'validation' => ['type' => 'isbefore', 'compareto' => 'end_date'],
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
        ],
        'end_date' => [
            'name' => 'end_date',
            'vname' => 'LBL_DATE_END',
            'type' => 'date',
            'audited' => true,
            'comment' => 'Ending date of the campaign',
            'importable' => 'required',
            'required' => true,
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'campaign_status_dom',
            'len' => 100,
            'audited' => true,
            'comment' => 'Status of the campaign',
            'importable' => 'required',
            'required' => true,
        ],
        'impressions' => [
            'name' => 'impressions',
            'vname' => 'LBL_CAMPAIGN_IMPRESSIONS',
            'type' => 'int',
            'default' => 0,
            'reportable' => true,
            'comment' => 'Expected Click throughs manually entered by Campaign Manager'
        ],
        'currency_id' =>
            [
                'name' => 'currency_id',
                'vname' => 'LBL_CURRENCY',
                'type' => 'id',
                'group' => 'currency_id',
                'required' => false,
                'do_report' => false,
                'reportable' => false,
                'comment' => 'Currency in use for the campaign'
            ],
        'budget' => [
            'name' => 'budget',
            'vname' => 'LBL_BUDGET',
            'type' => 'currency',
            'dbType' => 'double',
            'comment' => 'Budgeted amount for the campaign'
        ],
        'expected_cost' => [
            'name' => 'expected_cost',
            'vname' => 'LBL_EXPECTED_COST',
            'type' => 'currency',
            'dbType' => 'double',
            'comment' => 'Expected cost of the campaign'
        ],
        'actual_cost' => [
            'name' => 'actual_cost',
            'vname' => 'LBL_ACTUAL_COST',
            'type' => 'currency',
            'dbType' => 'double',
            'comment' => 'Actual cost of the campaign'
        ],
        'expected_revenue' => [
            'name' => 'expected_revenue',
            'vname' => 'LBL_EXPECTED_REVENUE',
            'type' => 'currency',
            'dbType' => 'double',
            'comment' => 'Expected revenue stemming from the campaign'
        ],
        'campaign_type' => [
            'name' => 'campaign_type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'options' => 'campaign_type_dom',
            'len' => 100,
            'audited' => true,
            'comment' => 'The type of campaign',
            'importable' => 'required',
            'required' => false,
        ],
        'objective' => [
            'name' => 'objective',
            'vname' => 'LBL_OBJECTIVE',
            'type' => 'text',
            'comment' => 'The objective of the campaign'
        ],
        'content' => [
            'name' => 'content',
            'vname' => 'LBL_CONTENT',
            'type' => 'text',
            'comment' => 'The campaign description'
        ],
        'prospectlists' => [
            'name' => 'prospectlists',
            'vname' => 'LBL_PROSPECTLISTS',
            'type' => 'link',
            'relationship' => 'prospect_list_campaigns',
            'source' => 'non-db',
        ],
// CR1000465 cleanup Email
//        'emailmarketing' => array(
//            'name' => 'emailmarketing',
//            'type' => 'link',
//            'relationship' => 'campaign_email_marketing',
//            'source' => 'non-db',
//        ),
//        'queueitems' => array(
//            'name' => 'queueitems',
//            'type' => 'link',
//            'relationship' => 'campaign_emailman',
//            'source' => 'non-db',
//        ),
        'log_entries' => [
            'name' => 'log_entries',
            'type' => 'link',
            'relationship' => 'campaign_campaignlog',
            'source' => 'non-db',
            'vname' => 'LBL_LOG_ENTRIES',
        ],
        'tracked_urls' => [
            'name' => 'tracked_urls',
            'type' => 'link',
            'relationship' => 'campaign_campaigntrakers',
            'source' => 'non-db',
            'vname' => 'LBL_TRACKED_URLS',
        ],
        'frequency' => [
            'name' => 'frequency',
            'vname' => 'LBL_FREQUENCY',
            'type' => 'enum',
            //'options' => 'campaign_status_dom',
            'len' => 100,
            'comment' => 'Frequency of the campaign',
            'options' => 'newsletter_frequency_dom',
            'len' => 100,
        ],
        'leads' => [
            'name' => 'leads',
            'type' => 'link',
            'relationship' => 'campaign_leads',
            'source' => 'non-db',
            'vname' => 'LBL_LEADS',
            'link_class' => 'ProspectLink',
            'link_file' => 'modules/Campaigns/ProspectLink.php'
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'campaign_opportunities',
            'source' => 'non-db',
            'vname' => 'LBL_OPPORTUNITIES',
        ],
        'contacts' => [
            'name' => 'contacts',
            'type' => 'link',
            'relationship' => 'campaign_contacts',
            'source' => 'non-db',
            'vname' => 'LBL_CONTACTS',
            'link_class' => 'ProspectLink',
            'link_file' => 'modules/Campaigns/ProspectLink.php'
        ],
        'consumers' => [
            'name' => 'consumers',
            'type' => 'link',
            'relationship' => 'campaign_consumers',
            'source' => 'non-db',
            'vname' => 'LBL_CONSUMERS',
            'link_class' => 'ProspectLink',
            'link_file' => 'modules/Campaigns/ProspectLink.php'
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'campaign_accounts',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS',
            'link_class' => 'ProspectLink',
            'link_file' => 'modules/Campaigns/ProspectLink.php'
        ],

        // non db fields for campaign log
        'activity_type' => [
            'name' => 'activity_type',
            'vname' => 'LBL_ACTIVITY',
            'type' => 'enum',
            'options' => 'campainglog_activity_type_dom',
            'len' => 100,
            'comment' => 'The activity that occurred (e.g., Viewed Message, Bounced, Opted out)',
            'source' => 'non-db'
        ],
        'activity_date' => [
            'name' => 'activity_date',
            'vname' => 'LBL_DATE',
            'type' => 'datetime',
            'comment' => 'The date the activity occurred',
            'source' => 'non-db'
        ],
        'eventregistrations' => [
            'name' => 'eventregistrations',
            'vname' => 'LBL_EVENTREGISTRATIONS',
            'type' => 'link',
            // 'relationship' => 'eventregistration_campaign_rel',
            'relationship' => 'eventregistration_campaign_rel',
            'module' => 'EventRegistrations',
            'source' => 'non-db',
        ],
        'mailrelais' => [
            'name' => 'mailrelais',
            'vname' => 'LBL_MAILRELAIS',
            'type' => 'mailrelais',
            'dbType' => 'varchar',
            'len' => 36
        ],
        'email_template_name' =>
            [
                'name' => 'email_template_name',
                'rname' => 'name',
                'id_name' => 'email_template_id',
                'vname' => 'LBL_EMAILTEMPLATE',
                'type' => 'relate',
                'table' => 'email_templates',
                'isnull' => 'true',
                'module' => 'EmailTemplates',
                'dbType' => 'varchar',
                'link' => 'emailtemplates',
                'len' => '255',
                'source' => 'non-db',
            ],
        'emailtemplates' => [
            'name' => 'emailtemplates',
            'type' => 'link',
            'relationship' => 'campaign_email_template',
            'source' => 'non-db',
            'module' => 'EmailTemaplates'
        ],
        'email_template_id' => [
            'name' => 'email_template_id',
            'vname' => 'LBL_MAILRELAIS',
            'dbType' => 'id',
            'type' => 'char',
            'len' => 36
        ],

        'mailbox_id' => [
            'name' => 'mailbox_id',
            'vname' => 'LBL_MAILBOX_ID',
            'type' => 'id',
        ],

        'mailbox_name' => [
            'name' => 'mailbox_name',
            'rname' => 'name',
            'id_name' => 'mailbox_id',
            'vname' => 'LBL_MAILBOXES_NAME',
            'join_name' => 'mailboxes_join',
            'type' => 'relate',
            'link' => 'mailbox',
            'table' => 'mailboxes',
            'isnull' => 'true',
            'module' => 'Mailboxes',
            'dbType' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
            'massupdate' => false,
        ],

        'mailbox' => [
            'name' => 'mailbox',
            'vname' => 'LBL_MAILBOX_LINK',
            'type' => 'link',
            'relationship' => 'campaigns_mailboxes_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ],
        'event_id' => [
            'name' => 'event_id',
            'vname' => 'LBL_EVENT_ID',
            'type' => 'id',
        ],

        'event_name' => [
            'name' => 'event_name',
            'rname' => 'name',
            'id_name' => 'event_id',
            'vname' => 'LBL_EVENT',
            'join_name' => 'events_join',
            'type' => 'relate',
            'link' => 'event',
            'table' => 'events',
            'isnull' => 'true',
            'module' => 'Events',
            'dbType' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
            'massupdate' => false,
        ],

        'event' => [
            'name' => 'event',
            'vname' => 'LBL_EVENT',
            'type' => 'link',
            'relationship' => 'events_campaigns',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ],
        'campaigntasks' => [
            'name' => 'campaigntasks',
            'type' => 'link',
            'relationship' => 'campaign_campaigntasks',
            'source' => 'non-db',
            'module' => 'CampaignTasks'
        ]
    ],
    'indices' => [
//        array(
//            'name' => 'camp_auto_tracker_key',
//            'type' => 'unique',
//            'fields' => array('tracker_key')
//        ),
        [
            'name' => 'idx_campaign_name',
            'type' => 'index',
            'fields' => ['name']
        ],
    ],

    'relationships' => [
        'campaigns_mailboxes_rel' => [
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'Campaigns',
            'rhs_table' => 'campaigns',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ],

        'campaign_accounts' => ['lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
            'rhs_module' => 'Accounts', 'rhs_table' => 'accounts', 'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'],

        'campaign_contacts' => ['lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
            'rhs_module' => 'Contacts', 'rhs_table' => 'contacts', 'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'],

        'campaign_consumers' => ['lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
            'rhs_module' => 'Consumers', 'rhs_table' => 'consumers', 'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'],

        'campaign_leads' => ['lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
            'rhs_module' => 'Leads', 'rhs_table' => 'leads', 'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'],

        'campaign_prospects' => ['lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
            'rhs_module' => 'Prospects', 'rhs_table' => 'prospects', 'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'],

        'campaign_opportunities' => ['lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
            'rhs_module' => 'Opportunities', 'rhs_table' => 'opportunities', 'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'],

// CR1000465 cleanup Email
//        'campaign_email_marketing' => array('lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
//            'rhs_module' => 'EmailMarketing', 'rhs_table' => 'email_marketing', 'rhs_key' => 'campaign_id',
//            'relationship_type' => 'one-to-many'),
//        'campaign_emailman' => array('lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
//            'rhs_module' => 'EmailMan', 'rhs_table' => 'emailman', 'rhs_key' => 'campaign_id',
//            'relationship_type' => 'one-to-many'),

        'campaign_campaignlog' => ['lhs_module' => 'Campaigns', 'lhs_table' => 'campaigns', 'lhs_key' => 'id',
            'rhs_module' => 'CampaignLog', 'rhs_table' => 'campaign_log', 'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'],

        'campaign_assigned_user' => ['lhs_module' => 'Users', 'lhs_table' => 'users', 'lhs_key' => 'id',
            'rhs_module' => 'Campaigns', 'rhs_table' => 'campaigns', 'rhs_key' => 'assigned_user_id',
            'relationship_type' => 'one-to-many'],

        'campaign_modified_user' => ['lhs_module' => 'Users', 'lhs_table' => 'users', 'lhs_key' => 'id',
            'rhs_module' => 'Campaigns', 'rhs_table' => 'campaigns', 'rhs_key' => 'modified_user_id',
            'relationship_type' => 'one-to-many'],
        'campaign_email_template' => ['lhs_module' => 'EmailTemplates', 'lhs_table' => 'email_templates', 'lhs_key' => 'id',
            'rhs_module' => 'Campaigns', 'rhs_table' => 'campaigns', 'rhs_key' => 'email_template_id',
            'relationship_type' => 'one-to-many'],
    ]
];
VardefManager::createVardef('Campaigns', 'Campaign', ['default', 'assignable',
]);

