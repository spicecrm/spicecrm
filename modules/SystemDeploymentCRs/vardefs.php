<?php

$dictionary['SystemDeploymentCR'] = array(
    'table' => 'systemdeploymentcrs',
    'audited' => true,
    'fields' => array(
        'crid' => array(
            'name' => 'crid',
            'vname' => 'LBL_CRID',
            'type' => 'varchar',
            'readonly' => true,
            'len' => 11,
        ),
        'crstatus' => array(
            'name' => 'crstatus',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'len' => '10',
            'options' => 'crstatus_dom'
        ),
        'crtype' => array(
            'name' => 'crtype',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'len' => '10',
            'options' => 'crtype_dom'
        ),
        'package' => array(
            'name' => 'package',
            'vname' => 'LBL_PACKAGE',
            'type' => 'varchar',
            'length' => 50
        ),
        'tickets' => array(
            'name' => 'tickets',
            'vname' => 'LBL_TICKETS',
            'type' => 'text'
        ),
        'demandid' => array(
            'name' => 'demandid',
            'vname' => 'LBL_DEMANDID',
            'type' => 'varchar',
            'len' => '50'
        ),
        'resolution' => array(
            'name' => 'resolution',
            'vname' => 'LBL_RESOLUTION',
            'type' => 'text'
        ),
        'post_deploy_action' => array(
            'name' => 'post_deploy_action',
            'vname' => 'LBL_POST_DEPLOY_ACTION',
            'type' => 'text'
        ),
        'pre_deploy_action' => array(
            'name' => 'pre_deploy_action',
            'vname' => 'LBL_PRE_DEPLOY_ACTION',
            'type' => 'text'
        ),
        'repairs' => array(
            'name' => 'repairs',
            'vname' => 'LBL_REPAIRS',
            'type' => 'multienum',
            'options' => 'systemdeploymentpackage_repair_dom'
        ),
        'repair_modules' => array(
            'name' => 'repair_modules',
            'vname' => 'LBL_REPAIR_MODULES',
            'type' => 'multienum',
            'options' => 'systemdeploymentpackage_repair_modules_dom'
        ),
        'sdp_scr' => array(
            'name' => 'sdp_scr',
            'type' => 'link',
            'relationship' => 'sdp_scr',
            'module' => 'SystemDeploymentPackages',
            'source' => 'non-db',
            'vname' => 'LBL_SYSTEMDEPLOYMENTPACKAGES',
        )
    ),
    'indices' => array(
        array('name' => 'idx_systemdeploymentcrs_id_del', 'type' => 'index', 'fields' => array('id', 'deleted')),
        array('name' => 'idx_crid', 'type' => 'index', 'fields' => array('crid'))
    ),
    'relationships' => array(),
    'optimistic_lock' => true
);

require_once('include/SugarObjects/VardefManager.php');


VardefManager::createVardef('SystemDeploymentCRs', 'SystemDeploymentCR', array('default', 'assignable'));

