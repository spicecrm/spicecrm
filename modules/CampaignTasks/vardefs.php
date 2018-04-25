<?php

if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$dictionary['CampaignTask'] = array(
    'table' => 'campaigntasks',
    'comment' => 'CampaignTasks Module',
    'audited' => true,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => array(
        'start_date' => array(
            'name' => 'start_date',
            'vname' => 'LBL_DATE_START',
            'type' => 'date',
            'audited' => true
        ),
        'end_date' => array(
            'name' => 'end_date',
            'vname' => 'LBL_DATE_END',
            'type' => 'date',
            'audited' => true
        ),
        'status' => array(
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'campaign_status_dom',
            'len' => 100,
            'audited' => true,
            'required' => true
        ),
        'campaigntask_type' => array(
            'name' => 'campaigntask_type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'options' => 'campaigntask_type_dom',
            'len' => 100,
            'audited' => true,
            'required' => true
        ),
        'campaign_id' => [
            'name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN_ID',
            'type' => 'id'
        ],
        'campaign_name' => [
            'name' => 'campaign_name',
            'rname' => 'name',
            'id_name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN',
            'type' => 'relate',
            'table' => 'campaigns',
            'isnull' => 'true',
            'module' => 'Campaigns',
            'dbType' => 'varchar',
            'link' => 'campaigns',
            'len' => '255',
            'source' => 'non-db'
        ],
        'campaigns' => array(
            'name' => 'campaigns',
            'type' => 'link',
            'relationship' => 'campaign_campaigntasks',
            'source' => 'non-db',
            'module' => 'Campaigns'
        ),
        'objective' => array(
            'name' => 'objective',
            'vname' => 'LBL_OBJECTIVE',
            'type' => 'text'
        ),
        'content' => array(
            'name' => 'content',
            'vname' => 'LBL_CONTENT',
            'type' => 'text'
        ),
        'prospectlists' => array(
            'name' => 'prospectlists',
            'type' => 'link',
            'relationship' => 'prospect_list_campaigntasks',
            'source' => 'non-db'
        ),
        'log_entries' => array(
            'name' => 'log_entries',
            'type' => 'link',
            'relationship' => 'campaigntask_campaignlog',
            'source' => 'non-db',
            'module' => 'CampaignLog',
            'vname' => 'LBL_LOG_ENTRIES',
        ),
    ),
    'relationships' => array(
        'campaign_campaigntasks' => [
            'lhs_module' => 'Campaigns',
            'lhs_table' => 'campaigns',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignTasks',
            'rhs_table' => 'campaigntasks',
            'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'
        ],
        'campaigntask_campaignlog' =>
            array (
                'lhs_module' => 'CampaignTasks',
                'lhs_table' => 'campaigntasks',
                'lhs_key' => 'id',
                'rhs_module' => 'CampaignLog',
                'rhs_table' => 'campaign_log',
                'rhs_key' => 'campaigntask_id',
                'relationship_type' => 'one-to-many',
            ),
    ),
    'indices' => array()
);

VardefManager::createVardef('CampaignTasks', 'CampaignTask', array('default', 'assignable'));
