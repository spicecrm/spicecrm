<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['ProspectListFilter'] = [
    'table' => 'prospect_list_filters',
    'comment' => 'ProspectListFilters Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

	'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '50',
            'required' => true,
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'vname'=>'LBL_MODULE',
            'len' => 50
        ],
        'module_filter' => [
            'name' => 'module_filter',
            'vname'=>'LBL_MODULE_FILTER',
            'type' => 'id',
            'required' => true,
        ],
        'entry_count' => [
            'name' => 'entry_count',
            'type' => 'int',
            'source'=>'non-db',
            'vname'=>'LBL_LIST_ENTRIES',
        ],
        'prospectlist_id' => [
            'name' => 'prospectlist_id',
            'vname' => 'LBL_PROSPECT_LIST_ID',
            'type' => 'id',
        ],
        'prospectlist_name' => [
            'name' => 'prospectlist_name',
            'rname' => 'name',
            'id_name' => 'prospectlist_id',
            'vname' => 'LBL_PROSPECTLIST',
            'type' => 'relate',
            'table' => 'prospectlists',
            'isnull' => 'true',
            'module' => 'ProspectLists',
            'dbType' => 'varchar',
            'link' => 'prospectlists',
            'len' => 255,
            'source' => 'non-db'
        ],
        'prospectlists' => [
            'name' => 'prospectlists',
            'type' => 'link',
            'relationship' => 'prospectlists_prospect_list_filters',
            'source' => 'non-db',
            'module' => 'ProspectLists'
        ],
    ],
	'relationships' => [

    ],
	'indices' => [
        [
            'name' =>'idx_prospect_lists_filter_id',
            'type' =>'index',
            'fields'=> ['id']
        ],
    ]
];

VardefManager::createVardef('ProspectListFilters', 'ProspectListFilter', ['default', 'assignable']);
