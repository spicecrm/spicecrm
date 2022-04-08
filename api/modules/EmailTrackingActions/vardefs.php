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
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required'=>true,
            'comment' => 'Unique identifier'
        ],
        'action' => [
            'name' => 'action',
            'type' => 'enum',
            'options' => 'tracking_actions_dom'
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
            'required' => true,
            'comment' => 'Date record created'
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_LIST_RELATED_TO_ID',
            'type'       => 'id',
            'required' => true,
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => true,
            'len'      => 255,
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'source'      => 'non-db',
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


    ],
    'relationships'=> [
        'campaigntask_emailtrackingactions' => [
            'lhs_module'=> 'CampaignTasks',
            'lhs_table'=> 'campaigntasks',
            'lhs_key' => 'id',
            'rhs_module'=> 'EmailTrackingActions',
            'rhs_table'=> 'emailtrackingactions',
            'rhs_key' => 'parent_id',
            'relationship_type'=>'one-to-many'
        ],
        'email_emailtrackingactions' => [
            'lhs_module'=> 'Emails',
            'lhs_table'=> 'emails',
            'lhs_key' => 'id',
            'rhs_module'=> 'EmailTrackingActions',
            'rhs_table'=> 'emailtrackingactions',
            'rhs_key' => 'parent_id',
            'relationship_type'=>'one-to-many'
        ]
    ],
    'indices' => [],

];
