<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['EmailTrackingAction'] = [
    'table' => 'emailtrackingactions',
    'comment' => 'a Module to record the tracking actions of an email',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'action' => [
            'name' => 'action',
            'type' => 'enum',
            'options' => 'tracking_actions_dom'
        ],
        'ip_address' => [
            'name' => 'ip_address',
            'vname' => 'LBL_IP_ADDRESS',
            'type' => 'varchar',
            'len' => 15
        ],
        'user_agent' => [
            'name' => 'user_agent',
            'vname' => 'LBL_USER_AGENT',
            'type' => 'varchar',
            'len' => 255
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_LIST_RELATED_TO_ID',
            'type' => 'id',
            'required' => true,
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'required' => true,
            'len' => 255,
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'type_name' => 'parent_type',
            'id_name' => 'parent_id',
            'vname' => 'LBL_RELATED_TO',
            'type' => 'parent',
            'source' => 'non-db',
        ],
        'event' => [
            'name' => 'event',
            'type' => 'varchar',
            'len' => 36,
        ],
        'campaigntasks' => [
            'vname' => 'LBL_CAMPAIGNTASKS',
            'name' => 'campaigntasks',
            'type' => 'link',
            'module' => 'CampaignTask',
            'relationship' => 'campaigntask_emailtrackingactions',
            'source' => 'non-db'
        ],
        'emails' => [
            'vname' => 'LBL_EMAILS',
            'name' => 'emails',
            'type' => 'link',
            'module' => 'Email',
            'relationship' => 'email_emailtrackingactions',
            'source' => 'non-db'
        ],
        'emailtrackinglink_id' => [
            'name' => 'emailtrackinglink_id',
            'vname' => 'LBL_TRACKINGLINK_ID',
            'type' => 'id'
        ],
        'emailtrackinglink_name' => [
            'name' => 'emailtrackinglink_name',
            'rname' => 'name',
            'id_name' => 'emailtrackinglink_id',
            'vname' => 'LBL_TRACKINGLINK',
            'type' => 'relate',
            'table' => 'emailtrackinglinks',
            'isnull' => 'true',
            'module' => 'EmailTrackingLinks',
            'dbType' => 'varchar',
            'link' => 'emailtrackinglinks',
            'len' => '255',
            'source' => 'non-db'
        ],
        'emailtrackinglinks' => [
            'name' => 'emailtrackinglinks',
            'type' => 'link',
            'relationship' => 'emailtrackinglink_emailtrackingactions',
            'source' => 'non-db',
            'module' => 'EmailTrackingLinks'
        ],
        'campaign_log' => [
            'name' => 'campaign_log',
            'type' => 'link',
            'relationship' => 'campaign_log_emailtrackingactions',
            'source' => 'non-db',
            'module' => 'CampaignLog'
        ],
    ],
    'relationships' => [
        'campaigntask_emailtrackingactions' => [
            'lhs_module' => 'CampaignTasks',
            'lhs_table' => 'campaigntasks',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailTrackingActions',
            'rhs_table' => 'emailtrackingactions',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ],
        'campaign_log_emailtrackingactions' => [
            'lhs_module' => 'CampaignLog',
            'lhs_table' => 'campaign_log',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailTrackingActions',
            'rhs_table' => 'emailtrackingactions',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ],
        'email_emailtrackingactions' => [
            'lhs_module' => 'Emails',
            'lhs_table' => 'emails',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailTrackingActions',
            'rhs_table' => 'emailtrackingactions',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ],
        'emailtrackinglink_emailtrackingactions' => [
            'lhs_module' => 'EmailTrackingLinks',
            'lhs_table' => 'emailtrackinglinks',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailTrackingActions',
            'rhs_table' => 'emailtrackingactions',
            'rhs_key' => 'emailtrackinglink_id',
            'relationship_type' => 'one-to-many'
        ],

    ],
    'indices' => [],

];

VardefManager::createVardef('EmailTrackingActions', 'EmailTrackingAction', ['default']);