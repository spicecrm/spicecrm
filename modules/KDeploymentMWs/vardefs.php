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
        'mwstatus' => array(
            'name' => 'mwstatus',
            'vname' => 'LBL_MWSTATUS',
            'type' => 'enum',
            'len' => '10',
            'options' => 'mwstatus_dom'
        ),
        'disable_cron' => array(
            'name' => 'disable_cron',
            'vname' => 'LBL_DISABLE_CRON',
            'type' => 'bool',
            'comment' => 'flag turn off cron. Running jobs will run, planned jobs won\'t be started',
        ),
        'disable_krest' => array(
            'name' => 'disable_krest',
            'vname' => 'LBL_DISABLE_KREST',
            'type' => 'bool',
            'comment' => 'flag turn off krest except for admin users',
        ),
        'disable_login' => array(
            'name' => 'disable_login',
            'vname' => 'LBL_DISABLE_LOGIN',
            'type' => 'bool',
            'comment' => 'flag turn off login except for admin users',
        ),
        'notified' => array(
            'name' => 'notified',
            'vname' => 'LBL_NOTIFIED',
            'type' => 'bool',
            'comment' => 'flag tells us if e-mail notification was sent',
        )
    ),
    'indices' => array(
        array('name' => 'idx_kdeploymentmws_deleted', 'type' => 'index', 'fields' => array('deleted')),
    ),
);

require_once('include/SugarObjects/VardefManager.php');
VardefManager::createVardef('KDeploymentMWs', 'KDeploymentMW', array('default', 'assignable'));