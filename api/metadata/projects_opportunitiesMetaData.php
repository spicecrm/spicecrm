<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

$dictionary['projects_opportunities'] = [
    'table' => 'projects_opportunities',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'opportunity_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'project_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false],
    ],
    'indices' => [
        ['name' => 'projects_opportunities_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_proj_opp_proj', 'type' =>'index', 'fields'=> ['project_id']],
        ['name' => 'idx_proj_opp_opp', 'type' =>'index', 'fields'=> ['opportunity_id']],
        ['name' => 'projects_opportunities_alt', 'type'=>'alternate_key', 'fields'=> ['project_id','opportunity_id']],
    ],
    'relationships' => [
        'projects_opportunities' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Opportunities',
            'rhs_table' => 'opportunities',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_opportunities',
            'join_key_lhs' => 'project_id',
            'join_key_rhs' => 'opportunity_id',
        ],
    ],
];
