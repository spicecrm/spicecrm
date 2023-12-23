<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['spice_address_references'] = [
    'table'         => 'spice_address_references',
    'contenttype'   => 'metadata',
    'fields'        => [
        'id' => ['name' =>'id', 'type' =>'varchar', 'len'=>'36'],
        'parent_module' => ['name' =>'parent_module', 'type' =>'varchar', 'len'=> 60],
        'parent_address_key' => ['name' => 'parent_address_key','type' => 'varchar', 'len' => 30],
        'parent_link_name' => ['name' => 'parent_link_name','type' => 'varchar', 'len' => 100],
        'child_module' => ['name' =>'child_module', 'type' =>'varchar', 'len'=> 60],
        'child_address_key' => ['name' => 'child_address_key','type' => 'varchar', 'len' => 30],
        'child_link_name' => ['name' => 'child_link_name','type' => 'varchar', 'len' => 100],
    ],
    'indices'       => [
        ['name' =>'address_references_pk', 'type' =>'primary', 'fields'=> ['id']],

    ],
];
