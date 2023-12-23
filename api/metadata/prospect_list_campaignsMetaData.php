<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['prospect_list_campaigns'] = [

	'table' => 'prospect_list_campaigns',
    'contenttype'   => 'relationdata',
	'fields' => [
		[
			'name' => 'id',
			'type' => 'varchar',
			'len' => '36',
        ],
		[
			'name' => 'prospect_list_id',
			'type' => 'varchar',
			'len' => '36',
        ],
		[
			'name' => 'campaign_id',
			'type' => 'varchar',
			'len' => '36',
        ],
       ['name' => 'date_modified','type' => 'datetime'],
		[
			'name' => 'deleted',
			'type' => 'bool',
			'len' => '1',
			'default' => '0'
        ],

    ],
	
	'indices' => [
		[
			'name' => 'prospect_list_campaignspk',
			'type' => 'primary',
			'fields' => ['id']
        ],
		[
			'name' => 'idx_pro_id',
			'type' => 'index',
			'fields' => ['prospect_list_id']
        ],
		[
			'name' => 'idx_cam_id',
			'type' => 'index',
			'fields' => ['campaign_id']
        ],
		[
			'name' => 'idx_prospect_list_campaigns', 
			'type'=>'alternate_key', 
			'fields'=> ['prospect_list_id','campaign_id']
        ],
    ],

 	'relationships' => [
		'prospect_list_campaigns' => ['lhs_module'=> 'ProspectLists', 'lhs_table'=> 'prospect_lists', 'lhs_key' => 'id',
		'rhs_module'=> 'Campaigns', 'rhs_table'=> 'campaigns', 'rhs_key' => 'id',
		'relationship_type'=>'many-to-many',
		'join_table'=> 'prospect_list_campaigns', 'join_key_lhs'=>'prospect_list_id', 'join_key_rhs'=>'campaign_id']
    ]
];
