<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['calls_leads'] = ['table' => 'calls_leads'
                                  , 'fields' => [
       ['name' =>'id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'call_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'lead_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'required', 'type' =>'varchar', 'len'=>'1', 'default'=>'1']
      , ['name' =>'accept_status', 'type' =>'varchar', 'len'=>'25', 'default'=>'none']
      , ['name' => 'date_modified','type' => 'datetime']
      , ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'default'=>'0', 'required'=>false]
    ]
                                  , 'indices' => [
       ['name' =>'calls_leadspk', 'type' =>'primary', 'fields'=> ['id']]
      , ['name' =>'idx_lead_call_call', 'type' =>'index', 'fields'=> ['call_id']]
      , ['name' =>'idx_lead_call_lead', 'type' =>'index', 'fields'=> ['lead_id']]
      , ['name' => 'idx_call_lead', 'type'=>'alternate_key', 'fields'=> ['call_id','lead_id']]
    ]

 	  , 'relationships' => ['calls_leads' => ['lhs_module'=> 'Calls', 'lhs_table'=> 'calls', 'lhs_key' => 'id',
							  'rhs_module'=> 'Leads', 'rhs_table'=> 'leads', 'rhs_key' => 'id',
							  'relationship_type'=>'many-to-many',
							  'join_table'=> 'calls_leads', 'join_key_lhs'=>'call_id', 'join_key_rhs'=>'lead_id']]

]
?>
