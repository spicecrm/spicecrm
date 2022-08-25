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
        'trackinglink_id' => [
            'name' => 'trackinglink_id',
            'vname' => 'LBL_TRACKINGLINK_ID',
            'type' => 'id'
        ],
        'trackinglink_name' => [
            'name' => 'trackinglink_name',
            'rname' => 'name',
            'id_name' => 'trackinglink_id',
            'vname' => 'LBL_TRACKINGLINK',
            'type' => 'relate',
            'table' => 'trackinglinks',
            'isnull' => 'true',
            'module' => 'TrackingLinks',
            'dbType' => 'varchar',
            'link' => 'trackinglinks',
            'len' => '255',
            'source' => 'non-db'
        ],
        'trackinglinks' => [
            'name' => 'trackinglinks',
            'type' => 'link',
            'relationship' => 'trackinglink_emailtrackingactions',
            'source' => 'non-db',
            'module' => 'TrackingLinks'
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
        'email_emailtrackingactions' => [
            'lhs_module' => 'Emails',
            'lhs_table' => 'emails',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailTrackingActions',
            'rhs_table' => 'emailtrackingactions',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ],
        'trackinglink_emailtrackingactions' => [
            'lhs_module' => 'TrackingLinks',
            'lhs_table' => 'trackinglinks',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailTrackingActions',
            'rhs_table' => 'emailtrackingactions',
            'rhs_key' => 'trackinglink_id',
            'relationship_type' => 'one-to-many'
        ],

    ],
    'indices' => [],

];

VardefManager::createVardef('EmailTrackingActions', 'EmailTrackingAction', ['default']);