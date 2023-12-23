<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['OpportunityStage'] = [
    'table' => 'opportunitystages',
    'comment' => 'track opportunity stage changes',
    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'name',
            'dbType' => 'varchar',
            'len' => '50',
            'required' => false
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
        'amount_usdollar' => [ /**@deprecated**/
            'name' => 'amount_usdollar',
            'vname' => 'LBL_AMOUNT_USDOLLAR',
            'type' => 'currency',
            'dbType' => 'double',
            'disable_num_format' => true,
            'audited' => true
        ],
        'amount_systemcurrency' => [
            'name' => 'amount_systemcurrency',
            'vname' => 'LBL_AMOUNT_SYSTEMCURRENCY',
            'type' => 'currency',
            'dbType' => 'double',
            'disable_num_format' => true,
            'audited' => true
        ],
        'forecast' => [
            'name' => 'forecast',
            'vname' => 'LBL_FORECAST',
            'type' => 'bool'
        ],
        'budget' => [
            'name' => 'budget',
            'vname' => 'LBL_BUDGET',
            'type' => 'currency',
            'dbType' => 'double',
        ],
        'bestcase' => [
            'name' => 'bestcase',
            'vname' => 'LBL_BESTCASE',
            'type' => 'currency',
            'dbType' => 'double',
        ],
        'worstcase' => [
            'name' => 'worstcase',
            'vname' => 'LBL_WORSTCASE',
            'type' => 'currency',
            'dbType' => 'double',
        ],
        'currency_id' => [
            'name' => 'currency_id',
            'type' => 'id',
            'vname' => 'LBL_CURRENCY',
        ],
        'date_closed' => [
            'name' => 'date_closed',
            'vname' => 'LBL_DATE_CLOSED',
            'type' => 'date',
            'audited' => true
        ],
        'sales_stage' => [
            'name' => 'sales_stage',
            'vname' => 'LBL_SALES_STAGE',
            'type' => 'enum',
            'options' => 'sales_stage_dom',
            'len' => '255',
            'audited' => true,
        ],
        'probability' => [
            'name' => 'probability',
            'vname' => 'LBL_PROBABILITY',
            'type' => 'int',
            'dbtype' => 'double',
            'audited' => true,
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'opportunity_opportunitystages',
            'source' => 'non-db',
            'link_type' => 'one',
            'module' => 'Opportunities',
            'bean_name' => 'Opportunity',
            'vname' => 'LBL_OPPORTUNITY',
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_opp_id',
            'type' => 'index',
            'fields' => ['opportunity_id'],
        ]
    ],
    'relationships' => [
        'opportunity_opportunitystages' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'OpportunityStages',
            'rhs_table' => 'opportunitystages',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ]
    ]
    //This enables optimistic locking for Saves From EditView
, 'optimistic_locking' => true,
];
VardefManager::createVardef('OpportunityStages', 'OpportunityStage', ['default', 'assignable',
]);
