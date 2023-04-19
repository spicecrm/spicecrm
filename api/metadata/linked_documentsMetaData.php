<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['linked_documents'] = [
    'table' => 'linked_documents',
    'contenttype'   => 'relationdata',
    'fields' => [
        ['name' =>'id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'parent_id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'parent_type', 'type' =>'varchar', 'len'=>'25']
      , ['name' =>'document_id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'document_revision_id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'date_modified','type' => 'datetime']
      , ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'default'=>'0', 'required'=>false]
    ]
   , 'indices' => [
        ['name' =>'linked_documentspk', 'type' =>'primary', 'fields'=> ['id']],
        ['name'			=> 'idx_parent_document',
				'type'			=> 'alternate_key', 
				'fields'		=> ['parent_type','parent_id','document_id'],
        ],
    ]
   , 'relationships' => [
			'contracts_documents' => ['lhs_module'=> 'Contracts', 'lhs_table'=> 'contracts', 'lhs_key' => 'id',
				   'rhs_module'=> 'Documents', 'rhs_table'=> 'documents', 'rhs_key' => 'id',
				   'relationship_type'=>'many-to-many',
				   'join_table'=> 'linked_documents', 'join_key_lhs'=>'parent_id', 'join_key_rhs'=>'document_id', 'relationship_role_column'=>'parent_type',
				   'relationship_role_column_value'=>'Contracts'],
			'leads_documents' => ['lhs_module'=> 'Leads', 'lhs_table'=> 'leads', 'lhs_key' => 'id',
				   'rhs_module'=> 'Documents', 'rhs_table'=> 'documents', 'rhs_key' => 'id',
				   'relationship_type'=>'many-to-many',
				   'join_table'=> 'linked_documents', 'join_key_lhs'=>'parent_id', 'join_key_rhs'=>'document_id', 'relationship_role_column'=>'parent_type',
				   'relationship_role_column_value'=>'Leads'],
			'contracttype_documents' => ['lhs_module'=> 'ContractTypes', 'lhs_table'=> 'contract_types', 'lhs_key' => 'id',
				   'rhs_module'=> 'Documents', 'rhs_table'=> 'documents', 'rhs_key' => 'id',
				   'relationship_type'=>'many-to-many',
				   'join_table'=> 'linked_documents', 'join_key_lhs'=>'parent_id', 'join_key_rhs'=>'document_id', 'relationship_role_column'=>'parent_type',
				   'relationship_role_column_value'=>'ContracTemplates'],
    ],
];
