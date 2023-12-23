<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['UserQuota'] = [
    'table' => 'userquotas',
    'fields' => [
        'period' => [
            'name' => 'period',
            'type' => 'int'
        ],
        'year' => [
            'name' => 'year',
            'type' => 'int'
        ],
        'sales_quota' => [
            'name' => 'sales_quota',
            'type' => 'currency'
        ],
        'period_date' => [
            'name' => 'period_date',
            'type' => 'date'
        ],
        'user' => [
            'name' => 'user',
            'type' => 'link',
            'relationship' => 'users_userquotas',
            'source' => 'non-db',
            'vname' => 'LBL_USER',
        ]
    ],
    'relationships' => [
        'users_userquotas' =>
            [
                'lhs_module' => 'Users',
                'lhs_table' => 'users',
                'lhs_key' => 'id',
                'rhs_module' => 'UserQuotas',
                'rhs_table' => 'userquotas',
                'rhs_key' => 'assigned_user_id',
                'relationship_type' => 'one-to-many'
            ]
    ],
    'indices' => [
        [
            'name' => 'idx_userquotasuserid',
            'type' => 'index',
            'fields' => ['assigned_user_id']
        ]
    ]
];

VardefManager::createVardef('UserQuotas', 'UserQuota', ['default', 'assignable']);
