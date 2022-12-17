<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
/* this table should never get created, it should only be used as a template for the acutal audit tables
 * for each moudule.
 */
SpiceDictionaryHandler::getInstance()->dictionary['audit'] =
    ['table' => 'audit_template',
        'fields' => [
            'id'=> ['name' =>'id', 'type' =>'id', 'len'=>'36','required'=>true],
            'parent_id'=> ['name' =>'parent_id', 'type' =>'id', 'len'=>'36','required'=>true],
            'transaction_id'=> ['name' =>'transaction_id', 'type' =>'varchar', 'len'=>'36','required'=>false],
            'date_created'=> ['name' =>'date_created','type' => 'datetime'],
            'created_by'=> ['name' =>'created_by','type' => 'varchar','len' => 36],
            'field_name'=> ['name' =>'field_name','type' => 'varchar','len' => 100],
            'data_type'=> ['name' =>'data_type','type' => 'varchar','len' => 100],
            'before_value_string'=> ['name' =>'before_value_string','type' => 'varchar'],
            'after_value_string'=> ['name' =>'after_value_string','type' => 'varchar'],
            'before_value_text'=> ['name' =>'before_value_text','type' => 'text'],
            'after_value_text'=> ['name' =>'after_value_text','type' => 'text'],
        ],
        'indices' => [
            //name will be re-constructed adding idx_ and table name as the prefix like 'idx_accounts_'
            ['name' => 'pk', 'type' => 'primary', 'fields' => ['id']],
            ['name' => 'parent_id', 'type' => 'index', 'fields' => ['parent_id']],
            ['name' => 'field_name', 'type' => 'index', 'fields' => ['field_name']],
        ]
    ];
