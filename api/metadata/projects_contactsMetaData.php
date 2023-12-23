<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['projects_contacts'] = [
    'table' => 'projects_contacts',
    'contenttype'   => 'relationdata',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'contact_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'project_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false],
    ],
    'indices' => [
        ['name' => 'projects_contacts_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_proj_con_proj', 'type' =>'index', 'fields'=> ['project_id']],
        ['name' => 'idx_proj_con_con', 'type' =>'index', 'fields'=> ['contact_id']],
        ['name' => 'projects_contacts_alt', 'type'=>'alternate_key', 'fields'=> ['project_id','contact_id']],
    ],
    'relationships' => [
        'projects_contacts' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Contacts',
            'rhs_table' => 'contacts',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_contacts',
            'join_key_lhs' => 'project_id',
            'join_key_rhs' => 'contact_id',
        ],
    ],
];
