<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['OpportunityRevenueLine'] = [
    'table' => 'opportunityrevenuelines',
    'comment' => 'Split Opportunity Revenue in recognition lines',
    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => 255,
            'required' => false,
        ],
        'revenue_date' => [
            'name' => 'revenue_date',
            'vname' => 'LBL_DATE',
            'type' => 'date',
            'required' => true
        ],
        'amount' => [
            'name' => 'amount',
            'vname' => 'LBL_AMOUNT',
            //'function'=>array('vname'=>'getCurrencyType'),
            'type' => 'currency',
            'dbType' => 'double',
            'comment' => 'Unconverted amount of the opportunity',
            'importable' => 'required',
            'duplicate_merge' => '1',
            'required' => true,
            'options' => 'numeric_range_search_dom',
            'enable_range_search' => true,
        ],
        'amount_usdollar' => [
            'name' => 'amount_usdollar',
            'vname' => 'LBL_AMOUNT_USDOLLAR',
            'type' => 'currency',
            'group' => 'amount',
            'dbType' => 'double',
            'disable_num_format' => true,
            'audited' => true
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'opportunity_opportunityrevenuelines',
            'source' => 'non-db',
            'link_type' => 'one',
            'module' => 'Opportunities',
            'bean_name' => 'Opportunity',
            'vname' => 'LBL_OPPORTUNITY',
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_opp_id',
            'type' => 'index',
            'fields' => ['opportunity_id'],
        ]
    ],
    'relationships' => [
        'opportunity_opportunityrevenuelines' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'OpportunityRevenueLines',
            'rhs_table' => 'opportunityrevenuelines',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ]
    ]
    //This enables optimistic locking for Saves From EditView
, 'optimistic_locking' => true,
];
VardefManager::createVardef('OpportunityRevenueLines', 'OpportunityRevenueLine', ['basic', 'assignable']);
