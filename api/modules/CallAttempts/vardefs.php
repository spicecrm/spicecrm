<?php
use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['CallAttempt'] = [
    'table' => 'callattempts',
    'comment' => 'Call attempts Module',
    'audited' =>  true,
    'duplicate_merge' =>  false,
    'fields' => [
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_LIST_RELATED_TO_ID',
            'type'       => 'id',
            'comment'    => 'The ID of the parent  object identified by parent_type'
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'len'      => 255,
            'comment'  => 'The object to which the call is related',
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'source'      => 'non-db',
        ],
    ],
    'relationships' => [],
    'indices' => []
];

VardefManager::createVardef('CallAttempts', 'CallAttempt', ['default', 'assignable']);
