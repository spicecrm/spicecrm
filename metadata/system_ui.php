<?php

$dictionary['sysuimodulerepository'] = array(
    'table' => 'sysuimodulerepository',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'path' => array(
            'name' => 'path',
            'type' => 'varchar',
            'len' => 500
        ),
        'description' => array(
            'name' => 'description',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuimodulerepository',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustommodulerepository'] = array(
    'table' => 'sysuicustommodulerepository',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'path' => array(
            'name' => 'path',
            'type' => 'varchar',
            'len' => 500
        ),
        'description' => array(
            'name' => 'description',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustommodulerepository',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuiobjectrepository'] = array(
    'table' => 'sysuiobjectrepository',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'object' => array(
            'name' => 'object',
            'type' => 'varchar',
            'len' => 100
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 36
        ),
        'path' => array(
            'name' => 'path',
            'type' => 'varchar',
            'len' => 500
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'description' => array(
            'name' => 'description',
            'type' => 'text'
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuiobjectrepository',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomobjectrepository'] = array(
    'table' => 'sysuicustomobjectrepository',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'object' => array(
            'name' => 'object',
            'type' => 'varchar',
            'len' => 100
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 36
        ),
        'path' => array(
            'name' => 'path',
            'type' => 'varchar',
            'len' => 500
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'description' => array(
            'name' => 'description',
            'type' => 'text'
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomobjectrepository',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicomponentsets'] = array(
    'table' => 'sysuicomponentsets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicomponentsets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomcomponentsets'] = array(
    'table' => 'sysuicustomcomponentsets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomcomponentsets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicomponentsetscomponents'] = array(
    'table' => 'sysuicomponentsetscomponents',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'componentset_id' => array(
            'name' => 'componentset_id',
            'type' => 'id'
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentConfig' => array(
            'name' => 'componentConfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicomponentsetscomponents',
            'type' => 'primary',
            'fields' => array('id')),
        array(
            'name' => 'idx_sysuicomponentsetscomponents_setid',
            'type' => 'index',
            'fields' => array('componentset_id'))
    )
);

$dictionary['sysuicustomcomponentsetscomponents'] = array(
    'table' => 'sysuicustomcomponentsetscomponents',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'componentset_id' => array(
            'name' => 'componentset_id',
            'type' => 'id'
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentConfig' => array(
            'name' => 'componentConfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomcomponentsetscomponents',
            'type' => 'primary',
            'fields' => array('id')),
        array(
            'name' => 'idx_sysuicustomcomponentsetscomponents_setid',
            'type' => 'index',
            'fields' => array('componentset_id'))
    )
);

$dictionary['sysuifieldsets'] = array(
    'table' => 'sysuifieldsets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuifieldsets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomfieldsets'] = array(
    'table' => 'sysuicustomfieldsets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomfieldsets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuifieldsetsitems'] = array(
    'table' => 'sysuifieldsetsitems',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'fieldset_id' => array(
            'name' => 'fieldset_id',
            'type' => 'id'
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        ),
        'field' => array(
            'name' => 'field',
            'type' => 'varchar',
            'len' => 100
        ),
        'fieldset' => array(
            'name' => 'fieldset',
            'type' => 'varchar',
            'len' => 36
        ),
        'fieldconfig' => array(
            'name' => 'fieldconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuifieldsetsitems',
            'type' => 'primary',
            'fields' => array('id')),
        array(
            'name' => 'idx_sysuifieldsetsitems_setid',
            'type' => 'index',
            'fields' => array('fieldset_id'))
    )
);

$dictionary['sysuicustomfieldsetsitems'] = array(
    'table' => 'sysuicustomfieldsetsitems',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'fieldset_id' => array(
            'name' => 'fieldset_id',
            'type' => 'id'
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        ),
        'field' => array(
            'name' => 'field',
            'type' => 'varchar',
            'len' => 100
        ),
        'fieldset' => array(
            'name' => 'fieldset',
            'type' => 'varchar',
            'len' => 36
        ),
        'fieldconfig' => array(
            'name' => 'fieldconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomfieldsetsitems',
            'type' => 'primary',
            'fields' => array('id')),
        array(
            'name' => 'idx_sysuicustomfieldsetsitems_setid',
            'type' => 'index',
            'fields' => array('fieldset_id'))
    )
);

$dictionary['sysuiactionsets'] = array(
    'table' => 'sysuiactionsets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuiactionsets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomactionsets'] = array(
    'table' => 'sysuicustomactionsets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomactionsets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuiactionsetitems'] = array(
    'table' => 'sysuiactionsetitems',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'actionset_id' => array(
            'name' => 'actionset_id',
            'type' => 'id'
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        ),
        'action' => array(
            'name' => 'action',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 36
        ),
        'actionconfig' => array(
            'name' => 'actionconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuiactionsetitems',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomactionsetitems'] = array(
    'table' => 'sysuicustomactionsetitems',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'actionset_id' => array(
            'name' => 'actionset_id',
            'type' => 'id'
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        ),
        'action' => array(
            'name' => 'action',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 36
        ),
        'actionconfig' => array(
            'name' => 'actionconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomactionsetitems',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuiroutes'] = array(
    'table' => 'sysuiroutes',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'path' => array(
            'name' => 'path',
            'type' => 'varchar',
            'len' => 255
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'redirectto' => array(
            'name' => 'redirectto',
            'type' => 'varchar',
            'len' => 100
        ),
        'pathmatch' => array(
            'name' => 'pathmatch',
            'type' => 'varchar',
            'len' => 4
        ),
        'loginrequired' => array(
            'name' => 'loginrequired',
            'type' => 'int',
            'len' => 1
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuiroutes',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomroutes'] = array(
    'table' => 'sysuicustomroutes',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'path' => array(
            'name' => 'path',
            'type' => 'varchar',
            'len' => 255
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'redirectto' => array(
            'name' => 'redirectto',
            'type' => 'varchar',
            'len' => 100
        ),
        'pathmatch' => array(
            'name' => 'pathmatch',
            'type' => 'varchar',
            'len' => 4
        ),
        'loginrequired' => array(
            'name' => 'loginrequired',
            'type' => 'int',
            'len' => 1
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomroutes',
            'type' => 'primary',
            'fields' => array('id'))
    )
);


$dictionary['sysmodules'] = array(
    'table' => 'sysmodules',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'singular' => array(
            'name' => 'singular',
            'type' => 'varchar',
            'len' => 100
        ),
        'icon' => array(
            'name' => 'icon',
            'type' => 'varchar',
            'len' => 100
        ),
        'track' => array(
            'name' => 'track',
            'type' => 'int',
            'len' => 1
        ),
        'favorites' => array(
            'name' => 'favorites',
            'type' => 'int',
            'len' => 1
        ),
        'duplicatecheck' => array(
            'name' => 'duplicatecheck',
            'type' => 'int',
            'len' => 1
        ),
        'actionset' => array(
            'name' => 'actionset',
            'type' => 'varchar',
            'len' => 36
        ),
        'bean' => array(
            'name' => 'bean',
            'type' => 'varchar',
        ),
        'beanfile' => array(
            'name' => 'beanfile',
            'type' => 'varchar',
        ),
        'beantable' => array(
            'name' => 'beantable',
            'type' => 'varchar',
        ),
        'visible' => array(
            'name' => 'visible',
            'type' => 'varchar',
        ),
        'tagging' => array(
            'name' => 'tagging',
            'type' => 'bool',
            'default' => 0
        ),
        'workflow' => array(
            'name' => 'workflow',
            'type' => 'bool',
            'default' => 0
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysmodules',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['syscustommodules'] = array(
    'table' => 'syscustommodules',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'singular' => array(
            'name' => 'singular',
            'type' => 'varchar',
            'len' => 100
        ),
        'icon' => array(
            'name' => 'icon',
            'type' => 'varchar',
            'len' => 100
        ),
        'track' => array(
            'name' => 'track',
            'type' => 'int',
            'len' => 1
        ),
        'favorites' => array(
            'name' => 'favorites',
            'type' => 'int',
            'len' => 1
        ),
        'duplicatecheck' => array(
            'name' => 'duplicatecheck',
            'type' => 'int',
            'len' => 1
        ),
        'actionset' => array(
            'name' => 'actionset',
            'type' => 'varchar',
            'len' => 36
        ),
        'bean' => array(
            'name' => 'bean',
            'type' => 'varchar',
        ),
        'beanfile' => array(
            'name' => 'beanfile',
            'type' => 'varchar',
        ),
        'beantable' => array(
            'name' => 'beantable',
            'type' => 'varchar',
        ),
        'visible' => array(
            'name' => 'visible',
            'type' => 'varchar',
        ),
        'tagging' => array(
            'name' => 'tagging',
            'type' => 'bool',
            'default' => 0
        ),
        'workflow' => array(
            'name' => 'workflow',
            'type' => 'bool',
            'default' => 0
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_syscustommodules',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysmodulemenus'] = array(
    'table' => 'sysmodulemenus',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'menuitem' => array(
            'name' => 'menuitem',
            'type' => 'varchar',
            'len' => 100
        ),
        'action' => array(
            'name' => 'action',
            'type' => 'varchar',
            'len' => 100
        ),
        'route' => array(
            'name' => 'route',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysmodulemenus',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_sysmodule_module',
            'type' => 'index',
            'fields' => array('module')
        )
    )
);

$dictionary['sysuicomponentdefaultconf'] = array(
    'table' => 'sysuicomponentdefaultconf',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'role_id' => array(
            'name' => 'role_id',
            'type' => 'id'
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicomponentdefaultconf',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomcomponentdefaultconf'] = array(
    'table' => 'sysuicustomcomponentdefaultconf',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'role_id' => array(
            'name' => 'role_id',
            'type' => 'id'
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomcomponentdefaultconf',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicomponentmoduleconf'] = array(
    'table' => 'sysuicomponentmoduleconf',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'role_id' => array(
            'name' => 'role_id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicomponentmoduleconf',
            'type' => 'primary',
            'fields' => array('id')),
        array(
            'name' => 'idx_sysuicomponentmoduleconf_module',
            'type' => 'index',
            'fields' => array('module'))
    )
);

$dictionary['sysuicustomcomponentmoduleconf'] = array(
    'table' => 'sysuicustomcomponentmoduleconf',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'role_id' => array(
            'name' => 'role_id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomcomponentmoduleconf',
            'type' => 'primary',
            'fields' => array('id')),
        array(
            'name' => 'idx_sysuicustomcomponentmoduleconf_module',
            'type' => 'index',
            'fields' => array('module'))
    )
);

$dictionary['sysmodulelists'] = array(
    'table' => 'sysmodulelists',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'created_by_id' => array(
            'name' => 'created_by_id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'list' => array(
            'name' => 'list',
            'type' => 'varchar',
            'len' => 100
        ),
        'global' => array(
            'name' => 'global',
            'type' => 'int',
            'len' => 1
        ),
        'basefilter' => array(
            'name' => 'basefilter',
            'type' => 'varchar',
            'len' => 3,
            'default' => 'all'
        ),
        'fielddefs' => array(
            'name' => 'fielddefs',
            'type' => 'text'
        ),
        'filterdefs' => array(
            'name' => 'filterdefs',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysmodulelists',
            'type' => 'primary',
            'fields' => array('id'))
    )
);


$dictionary['sysuidashboards'] = array(
    'table' => 'sysuidashboards',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'created_by_id' => array(
            'name' => 'created_by_id',
            'type' => 'id'
        ),
        'global' => array(
            'name' => 'global',
            'type' => 'int',
            'len' => 1
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuidashboards',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuidashboarddashlets'] = array(
    'table' => 'sysuidashboarddashlets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuidashboarddashlets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomdashboarddashlets'] = array(
    'table' => 'sysuicustomdashboarddashlets',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomdashboarddashlets',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuidashboardcomponents'] = array(
    'table' => 'sysuidashboardcomponents',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'sysuidashboard_id' => array(
            'name' => 'sysuidashboard_id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        ),
        'position' => array(
            'name' => 'position',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuidashboardcomponents',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuiroles'] = array(
    'table' => 'sysuiroles',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'identifier' => array(
            'name' => 'identifier',
            'type' => 'varchar',
            'len' => '3'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100'
        ),
        'icon' => array(
            'name' => 'icon',
            'type' => 'varchar',
            'len' => '50'
        ),
        'systemdefault' => array(
            'name' => 'systemdefault',
            'type' => 'tinyint'
        ),
        'portaldefault' => array(
            'name' => 'portaldefault',
            'type' => 'tinyint'
        ),
        'showsearch' => array(
            'name' => 'showsearch',
            'type' => 'tinyint',
            'default' => 1
        ),
        'showfavorites' => array(
            'name' => 'showfavorites',
            'type' => 'tinyint',
            'default' => 1
        ),
        'description' => array(
            'name' => 'description',
            'type' => 'text'
        )

    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuiroles',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuicustomroles'] = array(
    'table' => 'sysuicustomroles',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'identifier' => array(
            'name' => 'identifier',
            'type' => 'varchar',
            'len' => '3'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100'
        ),
        'icon' => array(
            'name' => 'icon',
            'type' => 'varchar',
            'len' => '50'
        ),
        'systemdefault' => array(
            'name' => 'systemdefault',
            'type' => 'tinyint'
        ),
        'portaldefault' => array(
            'name' => 'portaldefault',
            'type' => 'tinyint'
        ),
        'showsearch' => array(
            'name' => 'showsearch',
            'type' => 'tinyint',
            'default' => 1
        ),
        'showfavorites' => array(
            'name' => 'showfavorites',
            'type' => 'tinyint',
            'default' => 1
        ),
        'description' => array(
            'name' => 'description',
            'type' => 'text'
        )

    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomroles',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['sysuiuserroles'] = array(
    'table' => 'sysuiuserroles',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'user_id' => array(
            'name' => 'user_id',
            'type' => 'id'
        ),
        'sysuirole_id' => array(
            'name' => 'sysuirole_id',
            'type' => 'id'
        ),
        'defaultrole' => array(
            'name' => 'defaultrole',
            'type' => 'int',
            'len' => 1,
            'default' => 0
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuiuserroles',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_sysuiuserroles_userid',
            'type' => 'index',
            'fields' => array('user_id')
        )
    )
);

$dictionary['sysuirolemodules'] = array(
    'table' => 'sysuirolemodules',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'sysuirole_id' => array(
            'name' => 'sysuirole_id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuirolemodules',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_sysuirolemodules_roleid',
            'type' => 'index',
            'fields' => array('sysuirole_id')
        )
    )
);

$dictionary['sysuicustomrolemodules'] = array(
    'table' => 'sysuicustomrolemodules',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'sysuirole_id' => array(
            'name' => 'sysuirole_id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomrolemodules',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_sysuicustomrolemodules_roleid',
            'type' => 'index',
            'fields' => array('sysuirole_id')
        )
    )
);

$dictionary['sysuiadmincomponents'] = array(
    'table' => 'sysuiadmincomponents',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'admingroup' => array(
            'name' => 'admingroup',
            'type' => 'varchar',
            'len' => 100
        ),
        'adminaction' => array(
            'name' => 'adminaction',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        ),
        'componentconfig' => array(
            'name' => 'componentconfig',
            'type' => 'text'
        ),
        'sequence' => array(
            'name' => 'sequence',
            'type' => 'int'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuiadmincomponents',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);


$dictionary['sysuifieldtypemapping'] = array(
    'table' => 'sysuifieldtypemapping',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'fieldtype' => array(
            'name' => 'fieldtype',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuifieldtypemapping',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);


$dictionary['sysuicustomfieldtypemapping'] = array(
    'table' => 'sysuicustomfieldtypemapping',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'fieldtype' => array(
            'name' => 'fieldtype',
            'type' => 'varchar',
            'len' => 100
        ),
        'component' => array(
            'name' => 'component',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicustomfieldtypemapping',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);


$dictionary['sysuicopyrules'] = array(
    'table' => 'sysuicopyrules',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'frommodule' => array(
            'name' => 'frommodule',
            'type' => 'varchar',
            'len' => 50
        ),
        'fromfield' => array(
            'name' => 'fromfield',
            'type' => 'varchar',
            'len' => 50
        ),
        'tomodule' => array(
            'name' => 'tomodule',
            'type' => 'varchar',
            'len' => 50
        ),
        'tofield' => array(
            'name' => 'tofield',
            'type' => 'varchar',
            'len' => 50
        ),
        'fixedvalue' => array(
            'name' => 'fixedvalue',
            'type' => 'varchar',
            'len' => 100
        ),
        'calculatedvalue' => array(
            'name' => 'calculatedvalue',
            'type' => 'varchar',
            'len' => 100
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysuicopyrules',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);

$dictionary['spiceimporttemplates'] = array(
    'table' => 'spiceimporttemplates',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ),
        'mappings' => array(
            'name' => 'mappings',
            'type' => 'text'
        ),
        'fixed' => array(
            'name' => 'fixed',
            'type' => 'text'
        ),
        'checks' => array(
            'name' => 'checks',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_spiceimporttemplates',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

$dictionary['spiceimportlogs'] = array(
    'table' => 'spiceimportlogs',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'import_id' => array(
            'name' => 'import_id',
            'type' => 'id'
        ),
        'msg' => array(
            'name' => 'msg',
            'type' => 'varchar'
        ),
        'data' => array(
            'name' => 'data',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_spiceimportlogs',
            'type' => 'primary',
            'fields' => array('id'))
    )
);

/**
 * VALIDATIONs
 */


$dictionary['sysuimodelvalidations'] = array(
    'table' => 'sysuimodelvalidations',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 20,
            'required' => true,
        ),
        'onevents' => array(
            'name' => 'onevents',
            'type' => 'varchar',
            'len' => 100,
        ),
        'active' => array(
            'name' => 'active',
            'type' => 'bool',
            'default' => 1,
        ),
        'logicoperator' => array(
            'name' => 'logicoperator',
            'type' => 'enum',
            'options' => 'logicoperators_dom',
            'len' => 3,
        ),
        'priority' => array(
            'name' => 'priority',
            'type' => 'int',
            'default' => 0,
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'isnull' => false,
        ),
    ),
    'indices' => array(
        array(
            'name' => 'prm_sysuimodelvalidations',
            'type' => 'primary',
            'fields' => array('id')
        )
    ),
);

$dictionary['sysuimodelvalidationconditions'] = array(
    'table' => 'sysuimodelvalidationconditions',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'sysuimodelvalidation_id' => array(
            'name' => 'sysuimodelvalidation_id',
            'type' => 'id',
            'required' => true,
        ),
        'fieldname' => array(
            'name' => 'fieldname',
            'type' => 'varchar',
            'required' => true,
            'len' => 50,
        ),
        'comparator' => array(
            'name' => 'comparator',
            'type' => 'enum',
            'options' => 'comparators_dom',
            'default' => 'equal',
            'len' => 20,
        ),
        'valuations' => array(
            'name' => 'valuations',
            'type' => 'varchar',
            'required' => true,
        ),
        'onchange' => array(
            'name' => 'onchange',
            'type' => 'bool'
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'isnull' => false,
        ),
    ),
    'indices' => array(
        array(
            'name' => 'prm_sysuimodvalcon',
            'type' => 'primary',
            'fields' => array('id'),
        ),
    ),
);

$dictionary['sysuimodelvalidationactions'] = array(
    'table' => 'sysuimodelvalidationactions',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'sysuimodelvalidation_id' => array(
            'name' => 'sysuimodelvalidation_id',
            'type' => 'id'
        ),
        'fieldname' => array(
            'name' => 'fieldname',
            'type' => 'varchar',
            'len' => 20,
            'required' => true,
        ),
        'action' => array(
            'name' => 'action',
            'type' => 'varchar',
            'len' => 10,
            'required' => true,
        ),
        'params' => array(
            'name' => 'params',
            'type' => 'varchar'
        ),
        'priority' => array(
            'name' => 'priority',
            'type' => 'int',
            'default' => 0,
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'isnull' => false,
        ),
    ),
    'indices' => array(
        array(
            'name' => 'prm_sysuimodvalact',
            'type' => 'primary',
            'fields' => array('id'),
        ),
    ),
);

$dictionary['sysmailrelais'] = array(
    'table' => 'sysmailrelais',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
        ),
        'service' => array(
            'name' => 'service',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
        ),
        'api_key' => array(
            'name' => 'api_key',
            'type' => 'varchar'
        ),
        'username' => array(
            'name' => 'username',
            'type' => 'varchar'
        ),
        'password' => array(
            'name' => 'password',
            'type' => 'varchar'
        ),
        'from_email' => array(
            'name' => 'from_email',
            'type' => 'varchar'
        ),
        'from_name' => array(
            'name' => 'from_name',
            'type' => 'varchar'
        ),

    ),
    'indices' => array(
        array(
            'name' => 'idx_sysmailrelais',
            'type' => 'primary',
            'fields' => array('id'),
        )
    ),
);