<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['prospect_lists_prospects'] = [

	'table' => 'prospect_lists_prospects',
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
			'name' => 'related_id',
			'type' => 'varchar',
			'len' => '36',
        ],
		[
			'name' => 'related_type',
			'type' => 'varchar',
			'len' => '25',  //valid values are Prospect, Contact, Lead, User
        ],
		[
			'name' => 'quantity',
			'type' => 'varchar',
			'len' => '25',
			'default' => '0'
        ],
        [
			'name' => 'date_modified',
			'type' => 'datetime'
        ],
		[
			'name' => 'deleted',
			'type' => 'bool',
			'len' => '1',
			'default' => '0'
        ],
    ],

	'indices' => [
		[
			'name' => 'prospect_lists_prospectspk',
			'type' => 'primary',
			'fields' => ['id']
        ],
		[
			'name' => 'idx_plp_pro_id',
			'type' => 'index',
			'fields' => ['prospect_list_id']
        ],
		[
			'name' => 'idx_plp_rel_id',
			'type' => 'alternate_key',
			'fields' => ['related_id',
								'related_type',
								'prospect_list_id'
            ]
        ],
    ],

 	'relationships' => [
		'prospect_list_contacts' => ['lhs_module'=> 'ProspectLists',
											'lhs_table'=> 'prospect_lists',
											'lhs_key' => 'id',
											'rhs_module'=> 'Contacts',
											'rhs_table'=> 'contacts',
											'rhs_key' => 'id',
											'relationship_type'=>'many-to-many',
											'join_table'=> 'prospect_lists_prospects',
											'join_key_lhs'=>'prospect_list_id',
											'join_key_rhs'=>'related_id',
											'relationship_role_column'=>'related_type',
											'relationship_role_column_value'=>'Contacts'
        ],

		'prospect_list_prospects' => ['lhs_module'=> 'ProspectLists',
											'lhs_table'=> 'prospect_lists',
											'lhs_key' => 'id',
											'rhs_module'=> 'Prospects',
											'rhs_table'=> 'prospects',
											'rhs_key' => 'id',
											'relationship_type'=>'many-to-many',
											'join_table'=> 'prospect_lists_prospects',
											'join_key_lhs'=>'prospect_list_id',
											'join_key_rhs'=>'related_id',
											'relationship_role_column'=>'related_type',
											'relationship_role_column_value'=>'Prospects'
        ],

		'prospect_list_leads' => ['lhs_module'=> 'ProspectLists',
										'lhs_table'=> 'prospect_lists',
										'lhs_key' => 'id',
										'rhs_module'=> 'Leads',
										'rhs_table'=> 'leads',
										'rhs_key' => 'id',
										'relationship_type'=>'many-to-many',
										'join_table'=> 'prospect_lists_prospects',
										'join_key_lhs'=>'prospect_list_id',
										'join_key_rhs'=>'related_id',
										'relationship_role_column'=>'related_type',
										'relationship_role_column_value'=>'Leads',
        ],

		'prospect_list_users' => ['lhs_module'=> 'ProspectLists',
										'lhs_table'=> 'prospect_lists',
										'lhs_key' => 'id',
										'rhs_module'=> 'Users',
										'rhs_table'=> 'users',
										'rhs_key' => 'id',
										'relationship_type'=>'many-to-many',
										'join_table'=> 'prospect_lists_prospects',
										'join_key_lhs'=>'prospect_list_id',
										'join_key_rhs'=>'related_id',
										'relationship_role_column'=>'related_type',
										'relationship_role_column_value'=>'Users',
        ],

		'prospect_list_accounts' => ['lhs_module'=> 'ProspectLists',
											'lhs_table'=> 'prospect_lists',
											'lhs_key' => 'id',
											'rhs_module'=> 'Accounts',
											'rhs_table'=> 'accounts',
											'rhs_key' => 'id',
											'relationship_type'=>'many-to-many',
											'join_table'=> 'prospect_lists_prospects',
											'join_key_lhs'=>'prospect_list_id',
											'join_key_rhs'=>'related_id',
											'relationship_role_column'=>'related_type',
											'relationship_role_column_value'=>'Accounts',
        ],
		'prospect_list_consumers' => ['lhs_module'=> 'ProspectLists',
											'lhs_table'=> 'prospect_lists',
											'lhs_key' => 'id',
											'rhs_module'=> 'Consumers',
											'rhs_table'=> 'consumers',
											'rhs_key' => 'id',
											'relationship_type'=>'many-to-many',
											'join_table'=> 'prospect_lists_prospects',
											'join_key_lhs'=>'prospect_list_id',
											'join_key_rhs'=>'related_id',
											'relationship_role_column'=>'related_type',
											'relationship_role_column_value'=>'Consumers',
        ]
    ]

];
