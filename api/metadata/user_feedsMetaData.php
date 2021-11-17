<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['users_feeds'] = ['table' => 'users_feeds'
                                  , 'fields' => [
    
       ['name' =>'user_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'feed_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'rank', 'type' =>'int', 'required' => false]
      , ['name' => 'date_modified','type' => 'datetime']
      , ['name' =>'deleted', 'type' =>'bool', 'len'=>'', 'default'=>'0', 'required' => false]
    ]
                                 , 'indices' => [
  
       ['name' =>'idx_ud_user_id', 'type' =>'index', 'fields'=> ['user_id', 'feed_id']]
    ]
]
?>
