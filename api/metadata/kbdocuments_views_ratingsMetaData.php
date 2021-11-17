<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

$dictionary['kbdocuments_viwes_ratings'] = [
	'table' => 'kbdocuments_views_ratings',
	'fields' => [
       ['name' =>'id', 'type' =>'varchar', 'len'=>'36']
      , ['name' => 'date_modified','type' => 'datetime']
      , ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'default'=>'0', 'required' => false,]
      , ['name' =>'kbdocument_id', 'type' =>'varchar', 'len'=>'36',]
      , ['name' =>'views_number', 'type' =>'int', 'default'=>'0','required' => false,]
      , ['name' =>'ratings_number', 'type' =>'int', 'default'=>'0','required' => false,]
    ],
	'indices' => [
       ['name' =>'kbdoc_views_ratingspk', 'type' =>'primary', 'fields'=> ['id']]
       , ['name' =>'idx_kbvr_kbdoc', 'type' =>'index', 'fields'=> ['kbdocument_id']]
    ],
];
?>
