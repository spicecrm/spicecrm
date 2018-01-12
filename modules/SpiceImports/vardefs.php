<?php
$dictionary['SpiceImport'] = array(
    'table' => 'spiceimports',
    'fields' => array(
        'status' => array(
            'name' => 'status',
            'type' => 'enum',
            'options' => 'spiceimports_status_dom',
            'len' => 1,
            'vname' => 'LBL_STATUS'
        ),
        'data' => array(
            'name' => 'data',
            'type' => 'text',
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
        ),
    ),
    'indices' => array(
        'id' => array('name' => 'spiceimports_pk', 'type' => 'primary', 'fields' => array('id')),
    ),
);

require_once('include/SugarObjects/VardefManager.php');
VardefManager::createVardef('SpiceImports', 'SpiceImport', array('default', 'assignable'));