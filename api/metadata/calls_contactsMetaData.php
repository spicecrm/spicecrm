<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
global $dictionary;
$dictionary['calls_contacts'] = ['table' => 'calls_contacts'
                                  , 'fields' => [
       ['name' =>'id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'call_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'contact_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'required', 'type' =>'varchar', 'len'=>'1', 'default'=>'1']
      , ['name' =>'accept_status', 'type' =>'varchar', 'len'=>'25', 'default'=>'none']
      , ['name' => 'date_modified','type' => 'datetime']
      , ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'default'=>'0', 'required'=>false]
    ]
                                  , 'indices' => [
       ['name' =>'calls_contactspk', 'type' =>'primary', 'fields'=> ['id']]
      , ['name' =>'idx_con_call_call', 'type' =>'index', 'fields'=> ['call_id']]
      , ['name' =>'idx_con_call_con', 'type' =>'index', 'fields'=> ['contact_id']]
      , ['name' => 'idx_call_contact', 'type'=>'alternate_key', 'fields'=> ['call_id','contact_id']]
    ]

 	  , 'relationships' => ['calls_contacts' => ['lhs_module'=> 'Calls', 'lhs_table'=> 'calls', 'lhs_key' => 'id',
							  'rhs_module'=> 'Contacts', 'rhs_table'=> 'contacts', 'rhs_key' => 'id',
							  'relationship_type'=>'many-to-many',
							  'join_table'=> 'calls_contacts', 'join_key_lhs'=>'call_id', 'join_key_rhs'=>'contact_id']]

]
?>
