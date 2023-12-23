<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
// adding project-to-products relationship
SpiceDictionaryHandler::getInstance()->dictionary['projects_products'] = [
    'table' => 'projects_products',
    'contenttype'   => 'relationdata',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'product_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'project_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false],
    ],
    'indices' => [
        ['name' => 'projects_products_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_proj_prod_project', 'type' =>'index', 'fields'=> ['project_id']],
        ['name' => 'idx_proj_prod_product', 'type' =>'index', 'fields'=> ['product_id']],
        ['name' => 'projects_products_alt', 'type'=>'alternate_key', 'fields'=> ['project_id','product_id']],
    ],
    'relationships' => [
        'projects_products' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Products',
            'rhs_table' => 'products',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_products',
            'join_key_lhs' => 'project_id',
            'join_key_rhs' => 'product_id',
        ],
    ],
];
