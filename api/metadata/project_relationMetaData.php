<?php
/***** SPICE-HEADER-SPACEHOLDER *****/



/*
$dictionary['project_relation'] = array(
	'table' => 'project_relation',
	'fields' => array(
		'id' => array(
			'name' => 'id',
			'vname' => 'LBL_ID',
			'required' => true,
			'type' => 'id',
		),
		'project_id' => array(
			'name' => 'project_id',
			'vname' => 'LBL_PROJECT_ID',
			'required' => true,
			'type' => 'id',
		),
		'relation_id' => array(
			'name' => 'relation_id',
			'vname' => 'LBL_PROJECT_NAME',
			'required' => true,
			'type' => 'id',
		),
		'relation_type' => array(
			'name' => 'relation_type',
			'vname' => 'LBL_PROJECT_NAME',
			'required' => true,
			'type' => 'enum',
			'options' => 'project_relation_type_options',
		),
		'deleted' => array(
			'name' => 'deleted',
			'vname' => 'LBL_DELETED',
			'type' => 'bool',
			'required' => true,
			'default' => '0',
		),
	    'date_modified' => array (
    		'name' => 'date_modified',
    		'vname' => 'LBL_DATE_MODIFIED',
    		'type' => 'datetime',
    		'required'=>true,
  		),
	),
	'indices' => array(
		array(
			'name' =>'proj_rel_pk',
			'type' =>'primary',
			'fields'=>array('id')
		),
	),

 	'relationships' => 
 		array ('projects_accounts' => array('lhs_module'=> 'Accounts', 'lhs_table'=> 'accounts', 'lhs_key' => 'id',
		'rhs_module'=> 'Projects', 'rhs_table'=> 'projects', 'rhs_key' => 'id',
		'relationship_type'=>'many-to-many',
		'join_table'=> 'project_relation', 'join_key_lhs'=>'relation_id', 'join_key_rhs'=>'project_id',
		'relationship_role_column'=>'relation_type','relationship_role_column_value'=>'Accounts'),
						  
		'projects_contacts' => array('lhs_module'=> 'Projects', 'lhs_table'=> 'projects', 'lhs_key' => 'id',
		'rhs_module'=> 'Contacts', 'rhs_table'=> 'contacts', 'rhs_key' => 'id',
		'relationship_type'=>'many-to-many',
		'join_table'=> 'project_relation', 'join_key_lhs'=>'project_id', 'join_key_rhs'=>'relation_id',
		'relationship_role_column'=>'relation_type','relationship_role_column_value'=>'Contacts'),							  

		'projects_opportunities' => array('lhs_module'=> 'Projects', 'lhs_table'=> 'projects', 'lhs_key' => 'id',
		'rhs_module'=> 'Opportunities', 'rhs_table'=> 'opportunities', 'rhs_key' => 'id',
		'relationship_type'=>'many-to-many',
		'join_table'=> 'project_relation', 'join_key_lhs'=>'project_id', 'join_key_rhs'=>'relation_id',
		'relationship_role_column'=>'relation_type','relationship_role_column_value'=>'Opportunities'),							  


		),
);
*/
?>
