<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['outputtemplates_emailtemplates'] = [
    'table'         => 'outputtemplates_emailtemplates',
    'contenttype'   => 'relationdata',
    'fields'        => [
        'id' => ['name' =>'id', 'type' =>'varchar', 'len'=>'36'],
        'outputtemplate_id' => ['name' =>'outputtemplate_id', 'type' =>'varchar', 'len'=>'36'],
        'emailtemplate_id' => ['name' =>'emailtemplate_id', 'type' =>'varchar', 'len'=>'36'],
        'date_modified' => ['name' => 'date_modified','type' => 'datetime'],
        'deleted' => ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'required'=>false, 'default'=>0],
    ],
    'indices'       => [
        ['name' =>'emailtemplates_outputtemplatespk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_emailtemplate_outputtemplate', 'type'=>'alternate_key', 'fields'=> ['emailtemplate_id','outputtemplate_id']],
        ['name' => 'idx_emtid_del_outtid', 'type' => 'index', 'fields'=> ['outputtemplate_id', 'deleted', 'emailtemplate_id']],

    ],
    'relationships' => [
        'outputtemplates_emailtemplates' => [
            'lhs_module'=> 'EmailTemplates',
            'lhs_table'=> 'emailtemplates',
            'lhs_key' => 'id',
            'rhs_module'=> 'OutputTemplates',
            'rhs_table'=> 'outputtemplates',
            'rhs_key' => 'id',
            'relationship_type'=>'many-to-many',
            'join_table'=> 'outputtemplates_emailtemplates',
            'join_key_lhs'=>'emailtemplate_id',
            'join_key_rhs'=>'outputtemplate_id',
        ],
    ],
];
