<?php

if ( !defined('sugarEntry') || !sugarEntry ) die('Not A Valid Entry Point');

$dictionary['MediaCategory'] = array(
    'table' => 'mediacategories',
    'fields' => array(
        'parent_id' => array(
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_MEDIACATEGORY_ID',
            'type' => 'id',
            'required' => false,
            'reportable' => false,
            'audited' => true,
            'comment' => 'Media Category ID of the parent of this Media Category'
        ),
        'parent_name' => array(
            'name' => 'parent_name',
            'rname' => 'name',
            'id_name' => 'parent_id',
            'vname' => 'LBL_BELONGS_TO',
            'type' => 'relate',
            'isnull' => 'true',
            'module' => 'MediaCategories',
            'table' => 'mediacategories',
            'massupdate' => false,
            'source' => 'non-db',
            'len' => 36,
            'link' => 'member_of',
            'unified_search' => true,
            #'importable' => 'true',
        ),
        'members' => array(
            'name' => 'members',
            'type' => 'link',
            'relationship' => 'member_mediacategories',
            'module' => 'MediaCategories',
            'bean_name' => 'MediaCategory',
            'source' => 'non-db',
            'vname' => 'LBL_SUBCATEGORIES',
        ),
        'member_of' => array(
            'name' => 'member_of',
            'type' => 'link',
            'relationship' => 'member_mediacategories',
            'module' => 'MediaCategories',
            'bean_name' => 'MediaCategory',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_BELONGS_TO',
            'side' => 'right',
        ),
    ),
    'relationships' => array(
        'member_mediacategories' => array(
            'lhs_module' => 'MediaCategories',
            'lhs_table' => 'mediacategories',
            'lhs_key' => 'id',
            'rhs_module' => 'MediaCategories',
            'rhs_table' => 'mediacategories',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        )
    ),
    'indices' => array(
        array( 'name' => 'idx_mediacategories_parent_id', 'type' => 'index', 'fields' => array('parent_id'))
    )
);

VardefManager::createVardef('MediaCategories', 'MediaCategory', array('default','assignable') );
