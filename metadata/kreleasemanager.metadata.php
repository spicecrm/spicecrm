<?php

$dictionary['krp_kcr'] = array(
    'table' => 'krp_kcr',
    'audited' => true,
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'kreleasepackage_id' => array(
            'name' => 'kreleasepackage_id',
            'type' => 'id',
            'required' => true,
            'isnull' => false            
        ),
        'kdeploymentcr_id' => array(
            'name' => 'kdeploymentcr_id',
            'type' => 'id',
            'required' => true,
            'isnull' => false            
        ),
        'date_modified' => array(
            'name' => 'date_modified',
            'type' => 'date'
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'required' => true,
            'isnull' => false
            
        )
    ),
    'relationships' => array(
        'krp_kcr' => array(
            'lhs_module' => 'KReleasePackages',
            'lhs_table' => 'kreleasepackages',
            'lhs_key' => 'id',
            'rhs_module' => 'KDeploymentCRs',
            'rhs_table' => 'kdeploymentcrs',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'krp_kcr',
            'join_key_lhs' => 'kreleasepackage_id',
            'join_key_rhs' => 'kdeploymentcr_id'
        )
    ),
    'indices' => array(
        array('name' => 'krp_kcr_is', 'type' => 'primary', 'fields' => array('id', 'deleted')),
        array('name' => 'krp_kcr_releasepackage', 'type' => 'index', 'fields' => array('kreleasepackage_id', 'deleted'))
    )
);

$dictionary['kdeploymentcrfiles'] = array(
    'table' => 'kdeploymentcrfiles',
    'audited' => true,
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar'
        ),
        'kdeploymentcr_id' => array(
            'name' => 'kdeploymentcr_id',
            'type' => 'id',
            'required' => true,
            'isnull' => false
        ),
        'filetype' => array(
            'name' => 'filetype',
            'type' => 'varchar',
            'len' => 4
        ),
        'filenamehash' => array(
            'name' => 'filenamehash',
            'type' => 'varchar',
            'len' => 36
        ),
        'filehash' => array(
            'name' => 'filehash',
            'type' => 'varchar',
            'len' => 36
        ),
        'date_modified' => array(
            'name' => 'date_modified',
            'type' => 'date'
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'required' => true,
            'isnull' => false

        )
    ),
    'indices' => array(
        array('name' => 'kdeploymentcrfiles_id', 'type' => 'primary', 'fields' => array('id', 'deleted')),
        array('name' => 'kdeploymentcrfiles_kdeploymentcr_id', 'type' => 'index', 'fields' => array('kdeploymentcr_id', 'deleted'))
    )
);

$dictionary['kdeploymentcrdbentrys'] = array(
    'table' => 'kdeploymentcrdbentrys',
    'audited' => true,
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar'
        ),
        'kdeploymentcr_id' => array(
            'name' => 'kdeploymentcr_id',
            'type' => 'id',
            'required' => true,
            'isnull' => false
        ),
        'tablename' => array(
            'name' => 'tablename',
            'type' => 'varchar',
            'len' => 100
        ),
        'tablekey' => array(
            'name' => 'tablekey',
            'type' => 'varchar',
            'len' => 36
        ),
        'date_modified' => array(
            'name' => 'date_modified',
            'type' => 'date'
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'required' => true,
            'isnull' => false

        )
    ),
    'indices' => array(
        array('name' => 'kdeploymentcrdbentrys_id', 'type' => 'primary', 'fields' => array('id', 'deleted')),
        array('name' => 'kdeploymentcrdbentrys_kdeploymentcr_id', 'type' => 'index', 'fields' => array('kdeploymentcr_id', 'deleted'))
    )
);
