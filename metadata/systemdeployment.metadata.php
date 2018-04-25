<?php

$dictionary['sdp_scr'] = array(
    'table' => 'sdp_scr',
    'audited' => true,
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'systemdeploymentpackage_id' => array(
            'name' => 'systemdeploymentpackage_id',
            'type' => 'id',
            'required' => true,
            'isnull' => false
        ),
        'systemdeploymentcr_id' => array(
            'name' => 'systemdeploymentcr_id',
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
        'sdp_scr' => array(
            'lhs_module' => 'SystemDeploymentPackages',
            'lhs_table' => 'systemdeploymentpackages',
            'lhs_key' => 'id',
            'rhs_module' => 'SystemDeploymentCRs',
            'rhs_table' => 'systemdeploymentcrs',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'sdp_scr',
            'join_key_lhs' => 'systemdeploymentpackage_id',
            'join_key_rhs' => 'systemdeploymentcr_id'
        )
    ),
    'indices' => array(
        array('name' => 'sdp_scr_id', 'type' => 'primary', 'fields' => array('id', 'deleted')),
        array('name' => 'sdp_scr_releasepackage', 'type' => 'index', 'fields' => array('systemdeploymentpackage_id', 'deleted'))
    )
);


$dictionary['systemdeploymentcrfiles'] = array(
    'table' => 'systemdeploymentcrfiles',
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
        'systemdeploymentcr_id' => array(
            'name' => 'systemdeploymentcr_id',
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
        array('name' => 'systemdeploymentcrfiles_id', 'type' => 'primary', 'fields' => array('id', 'deleted')),
        array('name' => 'systemdeploymentcrfiles_systemdeploymentcr_id', 'type' => 'index', 'fields' => array('systemdeploymentcr_id', 'deleted'))
    )
);

$dictionary['systemdeploymentcrdbentrys'] = array(
    'table' => 'systemdeploymentcrdbentrys',
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
        'systemdeploymentcr_id' => array(
            'name' => 'systemdeploymentcr_id',
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
        'tableaction' => array(
            'name' => 'tableaction',
            'type' => 'varchar',
            'len' => 1
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
        array('name' => 'systemdeploymentcrdbentrys_id', 'type' => 'primary', 'fields' => array('id', 'deleted')),
        array('name' => 'systemdeploymentcrdbentrys_systemdeploymentcr_id', 'type' => 'index', 'fields' => array('systemdeploymentcr_id', 'deleted'))
    )
);


$dictionary['systemdeploypack_items'] = array(
    'table' => 'systemdeploypack_items',
    'fields' => array(
        array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'systemdeploymentpackage_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'ckey',
            'type' => 'varchar'
        ),
        array(
            'name' => 'ctype',
            'type' => 'varchar',
            'len' => '10'
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
        ),
        array(
            'name' => 'exist',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        )
    ),
    'indices' => array(
        array(
            'name' => 'systemdeploypack_items',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);


$dictionary['systemdeploypack_sysstatus'] = array(
    'table' => 'systemdeploypack_sysstatus',
    'fields' => array(
        array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'systemdeploymentpackage_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'systemdeploymentsystem_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'pstatus',
            'type' => 'varchar',
            'len' => '1'
        ),
        array(
            'name' => 'date_modified',
            'type' => 'datetime'
        ),
        array(
            'name' => 'history',
            'type' => 'bool',
            'required' => true,
            'isnull' => false
        ),
    ),
    'indices' => array(
        array(
            'name' => 'systemdeploypack_sysstatus',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);

$dictionary['systemdeploypack_contents'] = array(
    'table' => 'systemdeploypack_contents',
    'fields' => array(
        array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'systemdeploypack_item_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'content',
            'type' => 'longblob',
        ),
        array(
            'name' => 'ctype',
            'type' => 'varchar',
            'len' => 1
        ),
        array(
            'name' => 'dirs_created',
            'type' => 'varchar'
        ),
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
            'name' => 'systemdeploypack_contents',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);


$dictionary['systemdeploymentsystems_link'] = array(
    'table' => 'systemdeploymentsystems_link',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'systemdeploymentsystem1_id' => array(
            'name' => 'systemdeploymentsystem1_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'systemdeploymentsystem2_id' => array(
            'name' => 'systemdeploymentsystem2_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'date_modified' => array(
            'name' => 'date_modified',
            'type' => 'datetime'),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        )
    ),
    'indices' => array(
        array(
            'name' => 'systemdeploymentsystems_link_pk',
            'type' => 'primary',
            'fields' => array('id')
        )
    ),
    'relationships' => array(
        'systemdeploymentsystems_systemdeploymentsystems_rel' => array(
            'lhs_module' => 'SystemDeploymentSystems',
            'lhs_table' => 'Systemdeploymentsystems',
            'lhs_key' => 'id',
            'rhs_module' => 'SystemDeploymentSystems',
            'rhs_table' => 'systemdeploymentsystems',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'systemdeploymentsystems_link',
            'join_key_lhs' => 'systemdeploymentsystem1_id',
            'join_key_rhs' => 'systemdeploymentsystem2_id',
        )
    )
);
