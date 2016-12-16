<?php
$dictionary['KDeploymentSystem'] = array(
    'table' => 'kdeploymentsystems',
    'audited' => false,
    'fields' => array(
        'url' => array(
            'name' => 'url',
            'vname' => 'LBL_URL',
            'type' => 'varchar',
            'len' => '200'
        ),
        'add_systems' => array(
            'name' => 'add_systems',
            'vname' => 'LBL_ADD_SYSTEMS',
            'type' => 'text',
        ),
        'sys_username' => array(
            'name' => 'sys_username',
            'vname' => 'LBL_SYS_USERNAME',
            'type' => 'varchar',
            'len' => '50'
        ),        
        'sys_password' => array(
            'name' => 'sys_password',
            'vname' => 'LBL_SYS_PASSWORD',
            'type' => 'varchar',
            'len' => '100'
        ),        
        'master_flag' => array(
            'name' => 'master_flag',
            'vname' => 'LBL_MASTER_FLAG',
            'type' => 'bool',
            'default' => false
        ),
        'this_system' => array(
            'name' => 'this_system',
            'vname' => 'LBL_THIS_SYSTEM',
            'type' => 'bool',
            'default' => false
        ),
        'type' => array(
            'name' => 'type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'options' => 'kdeploymentsystems_type_dom',
            'len' => '10'
        ),
        'status' => array(
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'varchar',
            'len' => '1'
        ),
        'kdeploymentsystems_link' => array(
            'name' => 'kdeploymentsystems_link',
            'type' => 'link',
            'relationship' => 'kdeploymentsystems_kdeploymentsystems_rel',
            'module' => 'KDeploymentSystems',
            'side' => 'left',
            'source' => 'non-db',
            'vname' => 'LBL_KDEPLOYMENTSYSTEMS_LINK',
        ),
        'git_user' => array(
            'name' => 'git_user',
            'vname' => 'LBL_GIT_USER',
            'type' => 'varchar',
            'len' => '100'
        ),
        'git_pass' => array(
            'name' => 'git_pass',
            'vname' => 'LBL_GIT_PASS',
            'type' => 'varchar',
            'len' => '100'
        ),
        'git_repo' => array(
            'name' => 'git_repo',
            'vname' => 'LBL_GIT_REPO',
            'type' => 'varchar'
        ),
    ),
    'indices' => array(
        array('name' => 'idx_kdeploymentsystems_id_del', 'type' => 'index', 'fields' => array('id', 'deleted')),
    ),
    'optimistic_lock' => true
);

require_once('include/SugarObjects/VardefManager.php');
if ($GLOBALS['sugar_flavor'] == 'PRO')
    VardefManager::createVardef('KDeploymentSystems', 'KDeploymentSystem', array('default', 'assignable', 'team_security'));
else
    VardefManager::createVardef('KDeploymentSystems', 'KDeploymentSystem', array('default', 'assignable'));
