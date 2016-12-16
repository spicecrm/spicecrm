<?php
$dictionary['KDeploymentMW'] = array(
    'table' => 'kdeploymentmws',
    'fields' => array(
        'from_date' => array(
            'name' => 'from_date',
            'type' => 'datetimecombo',
            'dbType' => 'datetime',
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
            'validation' => array('type' => 'isbefore', 'compareto' => 'to_date', 'blank' => false),
            'vname' => 'LBL_FROM_DATE',
        ),
        'to_date' => array(
            'name' => 'to_date',
            'type' => 'datetimecombo',
            'dbType' => 'datetime',
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
            'vname' => 'LBL_TO_DATE',
        ),
        'mwstatus' =>
            array(
                'name' => 'mwstatus',
                'vname' => 'LBL_MWSTATUS',
                'type' => 'enum',
                'len' => '10',
                'options' => 'mwstatus_dom'
            ),
    ),
    'indices' => array(
        'id' => array('name' => 'kdeploymentmws_pk', 'type' => 'primary', 'fields' => array('id')),
    ),
);

require_once('include/SugarObjects/VardefManager.php');
VarDefManager::createVardef('KDeploymentMWs', 'KDeploymentMW', array('default', 'assignable'));