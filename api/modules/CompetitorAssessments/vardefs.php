<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['CompetitorAssessment'] = [
    'table' => 'competitorassessments',
    'comment' => 'Competitor Assessments Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,
    //THIS FLAG ENABLES OPTIMISTIC LOCKING FOR SAVES FROM EDITVIEW
    'optimistic_locking'=>true,

    'fields' => [
        'name' => [
            'name' => 'name',
            'vname'  => 'LBL_COMPETITOR',
            'type'  => 'varchar',
            'len' => 150,
            'audited'  => false,
            'required'  => true,
            'comment'  => 'competitor name',
        ],
        'products' => [
            'name' => 'products',
            'vname' => 'LBL_PRODUCTS',
            'type' => 'text',
            'required' => false,
            'audited' => false,
        ],
        'differentitation' => [
            'name' => 'differentitation',
            'vname' => 'LBL_DIFFERENTIATION',
            'type' => 'text',
            'required' => false,
            'audited' => false,
        ],
        'weaknesses' => [
            'name' => 'weaknesses',
            'vname' => 'LBL_WEAKNESSES',
            'type' => 'text',
            'required' => false,
            'audited' => false,
        ],
        'strengths' => [
            'name' => 'strengths',
            'vname' => 'LBL_STRENGTHS',
            'type' => 'text',
            'required' => false,
            'audited' => false,
        ],
        'competitive_threat' => [
            'name' => 'competitive_threat',
            'vname' => 'LBL_COMPETITIVE_THREAT',
            'type' => 'enum',
            'options' => 'competitive_threat_dom',
            'len' => 10,
            'required' => false,
            'audited' => false,
        ],
        'competitive_status' => [
            'name' => 'competitive_status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'competitive_status_dom',
            'len' => 10,
            'required' => false,
            'audited' => false,
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'vname'  => 'LBL_OPPORTUNITY_ID',
            'type'  => 'id',
            'audited'  => false,
            'required'  => true,
            'comment'  => '',
        ],
        'opportunity_name' => [
            'name'=>'opportunity_name',
            'rname'=>'name',
            'vname' => 'LBL_OPPORTUNITY',
            'type' => 'relate',
            'reportable'=>false,
            'source'=>'non-db',
            'table' => 'opportunities',
            'id_name' => 'opportunity_id',
            'link' => 'opportunities',
            'module'=>'Opportunities',
            'duplicate_merge'=>'disabled',
            'comment' => 'Name of related opportunity',
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'vname'=>'LBL_OPPORTUNITIES',
            'type' => 'link',
            'relationship' => 'competitorassessments_opportunities',
            'link_type'=>'one',
            'side'=>'right',
            'source'=>'non-db',
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_compass_opp',
            'type' => 'index',
            'fields' => ['opportunity_id'],
        ],
        [
            'name' => 'idx_compass_oppdel',
            'type' => 'index',
            'fields' => ['opportunity_id', 'deleted'],
        ],
    ],
    'relationships' => [
        'competitorassessments_opportunities' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'CompetitorAssessments',
            'rhs_table' => 'competitorassessments',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ],
    ]
];

VardefManager::createVardef('CompetitorAssessments', 'CompetitorAssessment', ['default', 'assignable']);
