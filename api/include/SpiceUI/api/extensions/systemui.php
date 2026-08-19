<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIActionsetsController;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIFieldsetsController;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUILoadtasksController;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIModelValidationsController;
use SpiceCRM\includes\SpiceUI\api\controllers\SystemUIController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

$routes = [
    [
        'method' => 'get',
        'route' => '/system/spiceui/admin/navigation',
        'oldroute' => '/spiceui/admin/navigation',
        'class' => SystemUIController::class,
        'function' => 'SystemGetAdminNav',
        'description' => 'get the admin navigation',
        'options' => ['adminOnly' => false],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/system/spiceui/admin/modules',
        'oldroute' => '/spiceui/admin/modules',
        'class' => SystemUIController::class,
        'function' => 'SystemGetAllModules',
        'description' => 'gets all modules from the database',
        'options' => ['adminOnly' => false],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/system/spiceui/admin/assets',
        'class' => SystemUIController::class,
        'function' => 'SystemGetAssets',
        'description' => 'gets all assets nd css settoings',
        'options' => ['adminOnly' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/system/spiceui/admin/assets',
        'class' => SystemUIController::class,
        'function' => 'SystemSetAssets',
        'description' => 'sets all assets nd css settoings',
        'options' => ['adminOnly' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/system/spiceui/core/loadtasks',
        'oldroute' => '/spiceui/core/loadtasks',
        'class' => SpiceUILoadtasksController::class,
        'function' => 'getLoadTasks',
        'description' => 'loads the tasks from the database to get the system going',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'valdiate' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/system/spiceui/core/loadtasks/{loadtaskid}',
        'oldroute' => '/spiceui/core/loadtasks/{loadtaskid}',
        'class' => SpiceUILoadtasksController::class,
        'function' => 'executeLoadTask',
        'description' => 'executes the loaded task',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'loadtaskid' => [
                'in' => 'path',
                'description' => 'the id of the loadtask',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/system/spiceui/core/loadtaskitem/{name}',
        'class' => SpiceUILoadtasksController::class,
        'function' => 'executeLoadTaskItemByName',
        'description' => 'executes the loaded task item by name',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'name' => [
                'in' => 'path',
                'description' => 'the name of the loadtask item',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'moduledefs',
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/modules/{module}/listtypes',
        'oldroute' => '/spiceui/core/modules/{module}/listtypes',
        'class' => SystemUIController::class,
        'function' => 'SystemAddListType',
        'description' => 'add a list type',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Contacts',
            ],
            'global' => [
                'in' => 'query',
                'description' => 'designates if a list is global',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => '1',
            ],
            'name' => [
                'in' => 'query',
                'description' => 'the name of the list',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'My list',
            ],
            'listcomponent' => [
                'in' => 'query',
                'description' => 'the used component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'ObjectList',
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/modules/{module}/listtypes/{id}',
        'oldroute' => '/spiceui/core/modules/{module}/listtypes/{id}',
        'class' => SystemUIController::class,
        'function' => 'SystemSetListType',
        'description' => 'sets a list type',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Contacts',
            ],
            'id' => [
                'in' => 'path',
                'description' => 'the id of the list',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ],
            'aggregates' => [
                'in' => 'body',
                'description' => 'the set of aggregates',
                'type' => ValidationMiddleware::TYPE_BASE64
            ],
            'fielddefs' => [
                'in' => 'body',
                'description' => 'the fields et ',
                'type' => ValidationMiddleware::TYPE_BASE64
            ],
            'filterdefs' => [
                'in' => 'body',
                'description' => 'the fields et ',
                'type' => ValidationMiddleware::TYPE_JSON
            ],
            'sortfields' => [
                'in' => 'body',
                'description' => 'the fields et ',
                'type' => ValidationMiddleware::TYPE_BASE64
            ],
            'listcomponent' => [
                'in' => 'body',
                'description' => 'the used component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'ObjectList',
            ],
            'name' => [
                'in' => 'body',
                'description' => 'the name of the list',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'global' => [
                'in' => 'body',
                'description' => 'if the list is global',
                'type' => ValidationMiddleware::TYPE_BOOL
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/configuration/spiceui/core/modules/{module}/listtypes/{id}',
        'oldroute' => '/spiceui/core/modules/{module}/listtypes/{id}',
        'class' => SystemUIController::class,
        'function' => 'SystemDeleteListType',
        'description' => 'delete a list type',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Contacts',
            ],
            'id' => [
                'in' => 'path',
                'description' => 'the id of the list',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/components',
        'oldroute' => '/spiceui/core/components',
        'class' => SystemUIController::class,
        'function' => 'SystemReturnListType',
        'description' => 'returns list types',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/roles/{userid}',
        'oldroute' => '/spiceui/core/roles/{userid}',
        'class' => SystemUIController::class,
        'function' => 'SystemGetAllRoles',
        'description' => 'get all roles of users',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => 'the id of the user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/roles',
        'class' => SystemUIController::class,
        'function' => 'getSystemRoles',
        'description' => 'get all system roles',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/rolemodules/{role_id}',
        'class' => SystemUIController::class,
        'function' => 'getRoleModules',
        'description' => 'get all role corresponding modules',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'role_id' => [
                'in' => 'path',
                'description' => 'the id of the role',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/spiceui/core/module/dashboardsets',
        'class'       => SystemUIController::class,
        'function'    => 'getDashboardSets',
        'description' => 'selects all dashboardsets',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/spiceui/core/module/dashboards',
        'class'       => SystemUIController::class,
        'function'    => 'getDashboards',
        'description' => 'selects all dashboards',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/spiceui/core/module/hooks',
        'class'       => SystemUIController::class,
        'function'    => 'getAllHooks',
        'description' => 'selects all global and custom hooks',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/spiceui/core/module/syswebhooks',
        'class'       => SystemUIController::class,
        'function'    => 'getAllWebHooks',
        'description' => 'selects all global and custom hooks',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/roles/{roleid}/{userid}/{action}',
        'oldroute' => '/spiceui/core/roles/{roleid}/{userid}/{default}',
        'class' => SystemUIController::class,
        'function' => 'SystemSetUserRole',
        'description' => 'sets the roles of a user',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => 'the id of the user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ],
            'roleid' => [
                'in' => 'path',
                'description' => 'the id of the role',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ],
            'action' => [
                'in' => 'path',
                'description' => 'if this should be set as default role',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'default or new',
            ],
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/configuration/spiceui/core/roles/{roleid}/{userid}',
        'oldroute' => '/spiceui/core/roles/{roleid}/{userid}',
        'class' => SystemUIController::class,
        'function' => 'SystemDeleteUserRole',
        'description' => 'deletes the roles of an user',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => 'the id of the user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ],
            'roleid' => [
                'in' => 'path',
                'description' => 'the id of the role',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '24f0fdda-79f0-4054-acb9-c8cce36e5fdc',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/componentmodulealreadyexists',
        'oldroute' => '/spiceui/core/componentmodulealreadyexists',
        'class' => SystemUIController::class,
        'function' => 'SystemCheckForExist',
        'description' => 'checks if an module module already exists',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'component' => [
                'in' => 'query',
                'description' => 'the name of the component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'HomeAssistantTile',
            ],
            'componentconfig' => [
                'in' => 'query',
                'description' => 'the configuration of the component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '{"fieldset":"123562d5-d74b-4587-a10a-fabe7ec2f696"}',
            ],
            'id' => [
                'in' => 'query',
                'description' => 'the id of the component',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'role_id' => [
                'in' => 'query',
                'description' => 'the id of the assigned role for the component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'module' => [
                'in' => 'query',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
            ],
            'type' => [
                'in' => 'query',
                'description' => 'the type of configuration',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'global',
            ],
            'package' => [
                'in' => 'query',
                'description' => 'the package of configuration',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'core',
            ],
            'version' => [
                'in' => 'query',
                'description' => 'the version of configuration',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '2024.01.001',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/componentdefaultalreadyexists',
        'oldroute' => '/spiceui/core/componentdefaultalreadyexists',
        'class' => SystemUIController::class,
        'function' => 'SystemCheckForDefault',
        'description' => 'checks if an default component allready exists',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'component' => [
                'in' => 'query',
                'description' => 'the name of the component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'ActivityCloseCreateModal',
            ],
            'componentconfig' => [
                'in' => 'query',
                'description' => 'the configuration of the component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '{"newBeanModules":"Tasks,Meetings,Calls"}',
            ],
            'id' => [
                'in' => 'query',
                'description' => 'the id of the component',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'role_id' => [
                'in' => 'query',
                'description' => 'the id of the assigned role for the component',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'type' => [
                'in' => 'query',
                'description' => 'the type of configuration',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'global',
            ],
            'package' => [
                'in' => 'query',
                'description' => 'the package of configuration',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'core',
            ],
            'version' => [
                'in' => 'query',
                'description' => 'the version of configuration',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '2024.01.001',
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/componentsets',
        'oldroute' => '/spiceui/core/componentsets',
        'class' => SystemUIController::class,
        'function' => 'SystemSetComponentSet',
        'description' => 'sets the component sets',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'add' => [
                'in' => 'body',
                'description' => 'the componentset to be added with its components',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{add: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ],
            'delete' => [
                'in' => 'body',
                'description' => 'the componentset to be deleted with its components',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{delete: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ],
            'update' => [
                'in' => 'body',
                'description' => 'the componentset to be updated with its components',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{update: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/configuration/spiceui/core/componentsets',
        'class' => SystemUIController::class,
        'function' => 'SystemDeleteComponentSet',
        'description' => 'delete the componentset and its corresponding items',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'table' => [
                'in' => 'query',
                'description' => 'table name from where the componentset should be deleted',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'sysuicustomcomponentsets'
            ],
            'id' => [
                'in' => 'query',
                'description' => 'id of the componentset that should be deleted',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '9c1452fe-6009-f75b-6e0f-de124ab0e86f'
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/fieldsets',
        'oldroute' => '/spiceui/core/fieldsets',
        'class' => SystemUIController::class,
        'function' => 'SystemGetFieldSet',
        'description' => 'gets the fieldsets',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/fieldsets',
        'oldroute' => '/spiceui/core/fieldsets',
        'class' => SpiceUIFieldsetsController::class,
        'function' => 'setFieldSets',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'add' => [
                'in' => 'body',
                'description' => 'the fieldset to be added with its fields',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{add: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ],
            'delete' => [
                'in' => 'body',
                'description' => 'the fieldset to be deleted with its fields',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{delete: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ],
            'update' => [
                'in' => 'body',
                'description' => 'the fieldset to be updated with its fields',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{update: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/configuration/spiceui/core/{tableName}/{id}',
        'class' => SpiceUIFieldsetsController::class,
        'function' => 'deleteFieldset',
        'description' => 'delete the fieldset and its corresponding items',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'tableName' => [
                'in' => 'path',
                'description' => 'name of the table from where the fieldset should be removed',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'sysuifieldsets'
            ],
            'id' => [
                'in' => 'path',
                'description' => 'id of the fieldset that is being removed',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '9c142fge-90k9-f0ob-6lkf-d1d90ab0e9tf'
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/actionsets',
        'oldroute' => '/spiceui/core/actionsets',
        'class' => SpiceUIActionsetsController::class,
        'function' => 'setActionSets',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'add' => [
                'in' => 'body',
                'description' => 'the actionset to be added with its actions',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{add: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ],
            'delete' => [
                'in' => 'body',
                'description' => 'the actionset to be deleted with its actions',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{delete: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ],
            'update' => [
                'in' => 'body',
                'description' => 'the actionset to be updated with its actions',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{update: {9c1452fe-6009-f75b-6e0f-de124ab0e86f: {}}}',
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/configuration/spiceui/core/actionsets',
        'class' => SpiceUIActionsetsController::class,
        'function' => 'deleteActionSets',
        'description' => 'delete the actionset and its corresponding items',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'table' => [
                'in' => 'query',
                'description' => 'table from where the actionset should be removed',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'sysuiactionsets',
            ],
            'id' => [
                'in' => 'query',
                'description' => 'id of the actionset to be removed',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '9c1452fe-6009-f75b-6e0f-de124ab0e86f'
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/fieldsetalreadyexists',
        'oldroute' => '/spiceui/core/fieldsetalreadyexists',
        'class' => SystemUIController::class,
        'function' => 'SystemCheckForFieldSet',
        'description' => 'checks if an fieldset already exists',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'query',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
            ],
            'type' => [
                'in' => 'query',
                'description' => 'the type of configuration',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'global',
            ],
            'name' => [
                'in' => 'query',
                'description' => 'the name of the fieldset',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Task ActivityTimeline Container',
            ],
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/servicecategories',
        'oldroute' => '/spiceui/core/servicecategories',
        'class' => SystemUIController::class,
        'function' => 'SystemGetServiceCategory',
        'description' => 'gets the service category',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/servicecategories/tree',
        'oldroute' => '/spiceui/core/servicecategories/tree',
        'class' => SystemUIController::class,
        'function' => 'SystemGetServiceTree',
        'description' => 'gets the service category tree',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/servicecategories/tree',
        'oldroute' => '/spiceui/core/servicecategories/tree',
        'class' => SystemUIController::class,
        'function' => 'SystemGetServiceTreeBody',
        'description' => 'gets the service category tree with a parsed body',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in' => 'body',
                'description' => 'the tree categories',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '',
            ],
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/selecttree/trees',
        'oldroute' => '/spiceui/core/selecttree/trees',
        'class' => SystemUIController::class,
        'function' => 'SystemGetSelectTree',
        'description' => 'selects a tree without param',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/selecttree/list/{id}',
        'oldroute' => '/spiceui/core/selecttree/list/{id}',
        'class' => SystemUIController::class,
        'function' => 'SystemGetSelectTreeListById',
        'description' => 'selects a tree list by id',
        'options' => ['noAuth' => false, 'adminOnly' => false,'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/selecttree/tree/{id}',
        'oldroute' => '/spiceui/core/selecttree/tree/{id}',
        'class' => SystemUIController::class,
        'function' => 'SystemGetSelectTreeById',
        'description' => 'selects a tree by id',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/selecttree/tree',
        'oldroute' => '/spiceui/core/selecttree/tree',
        'class' => SystemUIController::class,
        'function' => 'SystemSetSelectTree',
        'description' => 'writes a tree in the database',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in' => 'body',
                'description' => 'the tree categories',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '',
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/selecttree/newtree',
        'oldroute' => '/spiceui/core/selecttree/newtree',
        'class' => SystemUIController::class,
        'function' => 'SystemSetTree',
        'description' => 'creates a new tree with from a parsed body',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'body',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'name' => [
                'in' => 'body',
                'description' => 'the name of the tree',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'My tree',
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/modelvalidations',
        'oldroute' => '/spiceui/core/modelvalidations',
        'class' => SystemUIController::class,
        'function' => 'SystemSetModelValidation',
        'description' => 'sets a model validation',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'body',
                'description' => 'the id of the validation rule',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'actions' => [
                'in' => 'body',
                'description' => 'the id of the validation rule',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '[{}]',
            ],
            'active' => [
                'in' => 'body',
                'description' => 'tells if validation rule is active or not',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => '1',
            ],
            'conditions' => [
                'in' => 'body',
                'description' => 'the id of the validation rule',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '[{}]',
            ],
            'deleted' => [
                'in' => 'body',
                'description' => 'the priority of the rule',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => '0',
            ],
            'isnewrecord' => [
                'in' => 'body',
                'description' => 'indicates if the validation rule is new',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => 'true',
            ],
            'logicoperator' => [
                'in' => 'body',
                'description' => 'operator and | or',
                'type' => ValidationMiddleware::TYPE_ENUM,
                'options' => ['and', 'or']
            ],
            'module' => [
                'in' => 'body',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Opportunities',
            ],
            'name' => [
                'in' => 'body',
                'description' => 'the name of the rule',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Set field readonly',
            ],
            'onevents' => [
                'in' => 'body',
                'description' => 'the name of the event to apply the rule',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'all',
            ],
            'priority' => [
                'in' => 'body',
                'description' => 'the priority of the rule',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => '0',
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/configuration/spiceui/core/modelvalidations/{id}',
        'oldroute' => '/spiceui/core/modelvalidations',
        'class' => SystemUIController::class,
        'function' => 'SystemDeleteModelValidation',
        'description' => 'deletes a model validation',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the validation rule',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ]
        ]
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension(
    'spiceui',
    '2.0',
    SpiceConfig::getInstance()->config['ui'],
    $routes
);
