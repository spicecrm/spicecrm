<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['EmailTrackingLink'] = [
    'table' => 'emailtrackinglinks',
    'comment' => 'a Module to store the tracking links sent in an email',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'event' => [
            'name' => 'event',
            'type' => 'varchar',
            'len' => 36,
        ],
        'url' => [
            'name' => 'url',
            'vname' => 'LBL_URL',
            'type' => 'varchar',
            'len' => 255
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
            'required' => true,
            'comment' => 'Date record created'
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
        'campaigntasks' => [
            'vname' => 'LBL_CAMPAIGNTASKS',
            'name' => 'campaigntasks',
            'type' => 'link',
            'module' => 'CampaignTask',
            'relationship' => 'campaigntask_emailtrackinglinks',
            'source' => 'non-db'
        ],
        'emails' => [
            'vname' => 'LBL_EMAILS',
            'name' => 'emails',
            'type' => 'link',
            'module' => 'Emails',
            'relationship' => 'emails_emailtrackinglinks',
            'source' => 'non-db'
        ],
        'emailtrackingactions' => [
            'name' => 'emailtrackingactions',
            'type' => 'link',
            'module' => 'EmailTrackingActions',
            'relationship' => 'emailtrackinglink_emailtrackingactions',
            'source' => 'non-db'
        ],


    ],
    'relationships' => [
        'campaigntask_emailtrackinglinks' => [
            'lhs_module' => 'CampaignTasks',
            'lhs_table' => 'campaigntasks',
            'lhs_key' => 'id',
            'rhs_module' => 'EmailTrackingLinks',
            'rhs_table' => 'emailtrackinglinks',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [],

];

VardefManager::createVardef('EmailTrackingLinks', 'EmailTrackingLink', ['default', 'assignable']);