<?php
if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$dictionary['kdeploymentsystems_kdeploymentsystems'] = array(
    'table' => 'kdeploymentsystems_kdeploymentsystems',
    'fields' => array(
        array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'kdeploymentsystem1_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'kdeploymentsystem2_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'date_modified',
            'type' => 'datetime'),
        array(
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        )
    ),
    'indices' => array(
        array(
            'name' => 'kdeploymentsystems_kdeploymentsystemspk',
            'type' => 'primary',
            'fields' => array('id')
        )
    ),
    'relationships' => array(
        'kdeploymentsystems_kdeploymentsystems_rel' => array(
            'lhs_module' => 'KDeploymentSystems',
            'lhs_table' => 'kdeploymentsystems',
            'lhs_key' => 'id',
            'rhs_module' => 'KDeploymentSystems',
            'rhs_table' => 'kdeploymentsystems',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'kdeploymentsystems_kdeploymentsystems',
            'join_key_lhs' => 'kdeploymentsystem1_id',
            'join_key_rhs' => 'kdeploymentsystem2_id',
        )
    )
);
