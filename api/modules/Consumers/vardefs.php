<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Consumer'] = [
    'table' => 'consumers',
    'comment' => 'Consumers Module',
    'audited' => true,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
        'email_and_name1' => [
            'name' => 'email_and_name1',
            'rname' => 'email_and_name1',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'source' => 'non-db',
            'len' => '510',
            'importable' => 'false',
        ],
        // changed to enum on consumer evel
        'gdpr_marketing_agreement' => [
            'name' => 'gdpr_marketing_agreement',
            'vname' => 'LBL_GDPR_MARKETING_AGREEMENT',
            'type' => 'enum',
            'options' => 'gdpr_marketing_agreement_dom',
            'audited' => true
        ],
        'gdpr_marketing_source' => [
            'name' => 'gdpr_marketing_source',
            'vname' => 'LBL_GDPR_MARKETING_SOURCE',
            'type' => 'varchar',
            'len' => '100',
            'audited' => true
        ],
        'gdpr_data_source' => [
            'name' => 'gdpr_data_source',
            'vname' => 'LBL_GDPR_DATA_SOURCE',
            'type' => 'varchar',
            'len' => '100',
            'audited' => true
        ],
        'activity_accept_status' => [
            'name' => 'activity_accept_status',
            'type' => 'enum',
            'source' => 'non-db',
            'vname' => 'LBL_ACTIVITY_ACCEPT_STATUS',
            'options' => 'dom_meeting_accept_status',
            'comment' => 'non db field retirved from the relationship to the meeting call etc'
        ],
        'birthdate' => [
            'name' => 'birthdate',
            'vname' => 'LBL_BIRTHDATE',
            'massupdate' => false,
            'type' => 'date',
            'comment' => 'The birthdate of the consumer'
        ],
        'calls_participant' => [
            'name' => 'calls',
            'type' => 'link',
            'relationship' => 'calls_consumers',
            'source' => 'non-db',
            'module' => 'Calls',
            'vname' => 'LBL_CALLS',
        ],
        'meetings_participant' => [
            'name' => 'meetings',
            'type' => 'link',
            'relationship' => 'meetings_consumers',
            'source' => 'non-db',
            'vname' => 'LBL_MEETINGS',
        ],
        'notes_participant' => [
            'name' => 'notes',
            'type' => 'link',
            'relationship' => 'consumer_notes',
            'source' => 'non-db',
            'vname' => 'LBL_NOTES',
        ],
        'tasks_participant' => [
            'name' => 'tasks',
            'type' => 'link',
            'relationship' => 'consumer_tasks',
            'source' => 'non-db',
            'vname' => 'LBL_TASKS',
        ],
        'campaign_id' => [
            'name' => 'campaign_id',
            'comment' => 'Campaign that generated lead',
            'vname' => 'LBL_CAMPAIGN_ID',
            'rname' => 'id',
            'id_name' => 'campaign_id',
            'type' => 'id',
            'table' => 'campaigns',
            'isnull' => 'true',
            'module' => 'Campaigns',
            'massupdate' => false,
            'duplicate_merge' => 'disabled',
        ],
        'campaign_name' => [
            'name' => 'campaign_name',
            'rname' => 'name',
            'vname' => 'LBL_CAMPAIGN',
            'type' => 'relate',
            'link' => 'campaign_consumers',
            'isnull' => 'true',
            'reportable' => false,
            'source' => 'non-db',
            'table' => 'campaigns',
            'id_name' => 'campaign_id',
            'module' => 'Campaigns',
            'duplicate_merge' => 'disabled',
            'comment' => 'The first campaign name for Consumer (Meta-data only)',
        ],
        'campaigns' => [
            'name' => 'campaigns',
            'type' => 'link',
            'relationship' => 'consumer_campaign_log',
            'module' => 'CampaignLog',
            'bean_name' => 'CampaignLog',
            'source' => 'non-db',
            'vname' => 'LBL_CAMPAIGNLOG',
        ],
        'campaign_consumers' => [
            'name' => 'campaign_consumers',
            'type' => 'link',
            'vname' => 'LBL_CAMPAIGN_CONSUMER',
            'relationship' => 'campaign_consumers',
            'source' => 'non-db',
        ],
        'c_accept_status_fields' => [
            'name' => 'c_accept_status_fields',
            'rname' => 'id',
            'relationship_fields' => ['id' => 'accept_status_id', 'accept_status' => 'accept_status_name'],
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'type' => 'relate',
            'link' => 'calls',
            'link_type' => 'relationship_info',
            'source' => 'non-db',
            'importable' => 'false',
            'duplicate_merge' => 'disabled',
            'studio' => false,
        ],
        'm_accept_status_fields' => [
            'name' => 'm_accept_status_fields',
            'rname' => 'id',
            'relationship_fields' => ['id' => 'accept_status_id', 'accept_status' => 'accept_status_name'],
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'type' => 'relate',
            'link' => 'meetings',
            'link_type' => 'relationship_info',
            'source' => 'non-db',
            'importable' => 'false',
            'hideacl' => true,
            'duplicate_merge' => 'disabled',
            'studio' => false,
        ],
        'accept_status_id' => [
            'name' => 'accept_status_id',
            'type' => 'varchar',
            'source' => 'non-db',
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'studio' => ['listview' => false],
        ],
        'accept_status_name' => [
            'massupdate' => false,
            'name' => 'accept_status_name',
            'type' => 'enum',
            'studio' => 'false',
            'source' => 'non-db',
            'vname' => 'LBL_LIST_ACCEPT_STATUS',
            'options' => 'dom_meeting_accept_status',
            'importable' => 'false',
        ],
        'prospect_lists' => [
            'name' => 'prospect_lists',
            'type' => 'link',
            'relationship' => 'prospect_list_consumers',
            'module' => 'ProspectLists',
            'source' => 'non-db',
            'vname' => 'LBL_PROSPECT_LIST',
            'rel_fields' => [
                'quantity' => [
                    'map' => 'prospectlists_consumer_quantity'
                ]
            ]
        ],
        'ext_id' => [
            'name' => 'ext_id',
            'vname' => 'LBL_EXT_ID',
            'type' => 'varchar',
            'len' => 50
        ],
        'portal_user_id' => [
            'name' => 'portal_user_id',
            'vname' => 'LBL_PORTAL_USER_ID',
            'type' => 'varchar',
            'len' => 36
        ],
        'events_consumer_role' => [
            'name' => 'events_consumer_role',
            'vname' => 'LBL_ROLE',
            'type' => 'enum',
            'source' => 'non-db',
            'options' => 'events_consumer_roles_dom'
        ],
        'events' => [
            'name' => 'events',
            'type' => 'link',
            'relationship' => 'events_consumers',
            'module' => 'Events',
            'bean_name' => 'Event',
            'source' => 'non-db',
            'vname' => 'LBL_EVENT',
            'rel_fields' => [
                'consumer_role' => [
                    'map' => 'events_consumer_role'
                ]
            ]
        ],
        'prospectlists_consumer_quantity' => [
            'name' => 'prospectlists_consumer_quantity',
            'vname' => 'LBL_QUANTITY',
            'type' => 'varchar',
            'source' => 'non-db'
        ],
        'leads' => [
            'name' => 'leads',
            'type' => 'link',
            'relationship' => 'consumer_leads',
            'source' => 'non-db',
            'vname' => 'LBL_LEADS',
            'module' => 'Leads'
        ],
        'catalogorders' => [
            'name' => 'catalogorders',
            'type' => 'link',
            'module' => 'CatalogOrders',
            'relationship' => 'consumers_catalogorders',
            'source' => 'non-db'
        ],
        'inquiries' => [
            'name' => 'inquiries',
            'type' => 'link',
            'module' => 'Inquiries',
            'relationship' => 'consumer_inquiries',
            'source' => 'non-db'
        ]
    ],
    'relationships' => [
        'consumers_email_addresses' => [
            'lhs_module' => 'Consumers',
            'lhs_table' => 'consumers',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailAddresses',
            'rhs_table' => 'email_addresses',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'email_addr_bean_rel',
            'join_key_lhs' => 'bean_id',
            'join_key_rhs' => 'email_address_id',
            'relationship_role_column' => 'bean_module',
            'relationship_role_column_value' => 'Consumers'
        ],
        'consumers_email_addresses_primary' => [
            'lhs_module' => 'Consumers',
            'lhs_table' => 'consumers',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailAddresses',
            'rhs_table' => 'email_addresses',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'email_addr_bean_rel',
            'join_key_lhs' => 'bean_id',
            'join_key_rhs' => 'email_address_id',
            'relationship_role_column' => 'primary_address',
            'relationship_role_column_value' => '1'
        ],
        'consumer_campaign_log' => [
            'lhs_module' => 'Consumers',
            'lhs_table' => 'consumers',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignLog',
            'rhs_table' => 'campaign_log',
            'rhs_key' => 'target_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'target_type',
            'relationship_role_column_value' => 'Consumers'
        ],
        'consumer_leads' => [
            'lhs_module' => 'Consumers',
            'lhs_table' => 'consumers',
            'lhs_key' => 'id',
            'rhs_module' => 'Leads',
            'rhs_table' => 'leads',
            'rhs_key' => 'consumer_id',
            'relationship_type' => 'one-to-many'
        ],
        'consumer_letters' => [
            'lhs_module' => 'Consumers',
            'lhs_table' => 'consumers',
            'lhs_key' => 'id',
            'rhs_module' => 'Letters',
            'rhs_table' => 'letters',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Consumers'
        ],
    ],
    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,

    'indices' => [
        [
            'name' => 'idx_cons_last_first',
            'type' => 'index',
            'fields' => ['last_name', 'first_name', 'deleted']
        ],
        [
            'name' => 'idx_consumers_del_last',
            'type' => 'index',
            'fields' => ['deleted', 'last_name'],
        ]
    ]
];
//avoid PHP Fatal error:  Uncaught Error: Cannot use string offset as an array
global $dictionary;
if (file_exists('extensions/modules/SalesVouchers')){
    $dictionary['Consumer']['fields']['salesvouchers'] = [
        'name'         => 'salesvouchers',
        'type'         => 'link',
        'relationship' => 'consumer_salesvouchers',
        'module'       => 'SalesVouchers',
        'source'       => 'non-db',
        'vname'        => 'LBL_SALESVOUCHERS',
    ];
}
if (file_exists("modules/ServiceTickets")) {
    $dictionary['Consumer']['fields']['servicetickets'] = [
        'name' => 'servicetickets',
        'type' => 'link',
        'relationship' => 'servicetickets_consumers',
        'source' => 'non-db',
        'vname' => 'LBL_SERVICETICKETS',
        'module' => 'ServiceTickets',
        'default' => false
    ];
}

VardefManager::createVardef('Consumers', 'Consumer', ['default', 'assignable', 'activities', 'person']);
