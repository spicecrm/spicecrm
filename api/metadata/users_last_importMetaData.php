<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['users_last_import'] = ['table' => 'users_last_import'
                                  , 'fields' => [
       ['name' =>'id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'assigned_user_id', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'bean_type', 'type' =>'varchar', 'len'=>'36']
      , ['name' =>'bean_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' => 'date_modified','type' => 'datetime']
      , ['name' =>'deleted', 'required'=>false, 'type' =>'bool', 'len'=>'1']
    ], 'indices' => [
        ['name' => 'users_last_importpk', 'type' => 'primary', 'fields' => ['id']]
    , ['name' => 'idx_user_imp_id', 'type' => 'index', 'fields' => ['assigned_user_id']]
    ]
]
?>
