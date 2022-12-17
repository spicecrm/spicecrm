<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['accounts_contacts'] = [
    'table'         => 'accounts_contacts',
    'contenttype'   => 'relationdata',
    'fields'        => [
        'id' => ['name' =>'id', 'type' =>'varchar', 'len'=>'36'],
        'contact_id' => ['name' =>'contact_id', 'type' =>'varchar', 'len'=>'36'],
        'account_id' => ['name' =>'account_id', 'type' =>'varchar', 'len'=>'36'],
        'date_modified' => ['name' => 'date_modified','type' => 'datetime'],
        'deleted' => ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'required'=>false, 'default'=>0],
    ],
    'indices'       => [
        ['name' =>'accounts_contactspk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_account_contact', 'type'=>'alternate_key', 'fields'=> ['account_id','contact_id']],
        ['name' => 'idx_contid_del_accid', 'type' => 'index', 'fields'=> ['contact_id', 'deleted', 'account_id']],

    ],
    'relationships' => [
        'accounts_contacts' => [
            'lhs_module'=> 'Accounts',
            'lhs_table'=> 'accounts',
            'lhs_key' => 'id',
            'rhs_module'=> 'Contacts',
            'rhs_table'=> 'contacts',
            'rhs_key' => 'id',
            'relationship_type'=>'many-to-many',
            'join_table'=> 'accounts_contacts',
            'join_key_lhs'=>'account_id',
            'join_key_rhs'=>'contact_id',
        ],
    ],
];
