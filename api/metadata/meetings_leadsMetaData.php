<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['meetings_leads'] = [
    'table' => 'meetings_leads',
    'contenttype'   => 'relationdata',
    'fields' => [
       ['name' =>'id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'meeting_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'lead_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'required', 'type' =>'varchar', 'len'=>'1', 'default'=>'1']
      , ['name' =>'accept_status', 'type' =>'varchar', 'len'=>'25', 'default'=>'none']
      , ['name' => 'date_modified','type' => 'datetime']
      , ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'default'=>'0', 'required'=>false]
    ]
                                  , 'indices' => [
       ['name' =>'meetings_leadspk', 'type' =>'primary', 'fields'=> ['id']]
      , ['name' =>'idx_lead_meeting_meeting', 'type' =>'index', 'fields'=> ['meeting_id']]
      , ['name' =>'idx_lead_meeting_lead', 'type' =>'index', 'fields'=> ['lead_id']]
      , ['name' => 'idx_meeting_lead', 'type'=>'alternate_key', 'fields'=> ['meeting_id','lead_id']]
    ]

 	  , 'relationships' => ['meetings_leads' => ['lhs_module'=> 'Meetings', 'lhs_table'=> 'meetings', 'lhs_key' => 'id',
							  'rhs_module'=> 'Leads', 'rhs_table'=> 'leads', 'rhs_key' => 'id',
							  'relationship_type'=>'many-to-many',
							  'join_table'=> 'meetings_leads', 'join_key_lhs'=>'meeting_id', 'join_key_rhs'=>'lead_id']]

];
