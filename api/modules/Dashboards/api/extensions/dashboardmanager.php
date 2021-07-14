<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Dashboards\api\controllers\DashboardManagerController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Dashboards/dashlets',
        'oldroute'    => '/module/Dashboards/dashlets',
        'class'       => DashboardManagerController::class,
        'function'    => 'getGlobalAndCustomDashlet',
        'description' => 'selects all global and custom dashlets',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Dashboards/dashlets/{dashletId}',
        'oldroute'    => '/dashboards/dashlets/{id}',
        'class'       => DashboardManagerController::class,
        'function'    => 'replaceDashlet',
        'description' => 'replaces into the database',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'dashletId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'GUID of the dashlet',
            ],
            'acl_action'      => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'ACL action',
            ],
            'component'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'Name of the component class',
            ],
            'componentconfig' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => 'Configuration of the component',
            ],
            'description'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'Description of the dashlet',
            ],
            'icon'            => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'Dashlet icon',
            ],

            'id'              => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the dashlet',
            ],

            'label'           => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'Dashlet label',
            ],
            'module'          => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => false,
                'description' => 'Module name',
            ],
            'name'            => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'Name of the dashlet',
            ],
            'sortfield'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'name of a of a fied to sort after',
            ],
            'sortdirection'   => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'sort direction for sort field',
            ],
            'type'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'a type',
            ],
            'version'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'a spicecrm release number',
            ],
            'package'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'a spicecrm package name',
            ],
            'type' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'required'    => false,
                'description' => 'the scope',
                'options' => ['global', 'custom']
            ],
            'package' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'the Package'
            ],
            'version' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'the Version'
            ],
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/Dashboards/dashlets/{dashletId}',
        'oldroute'    => '/dashboards/dashlets/{id}',
        'class'       => DashboardManagerController::class,
        'function'    => 'deleteDashlet',
        'description' => 'deletes a dashlet depending on the id',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'dashletId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the dashlet',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Dashboards/{dashboardId}/components',
        'oldroute'    => '/dashboards/{id}',
        'class'       => DashboardManagerController::class,
        'function'    => 'addDashboardComponents',
        'description' => 'Saves dashboard component',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'dashboardId'     => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the dashboard',
            ],
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in'         => 'body',
                'type'       => ValidationMiddleware::TYPE_ARRAY,
                'required'   => true,
                'subtype'    => [
                    'type'       => ValidationMiddleware::TYPE_OBJECT,
                    'parameters' => [
                        'acl_action'       => [
                            'type'        => ValidationMiddleware::TYPE_STRING,
                            'required'    => false,
                            'description' => 'Name of the acl action',
                        ],
                        'component'       => [
                            'type'        => ValidationMiddleware::TYPE_STRING,
                            'required'    => true,
                            'description' => 'Name of the component class',
                        ],
                        'componentconfig' => [
                            'type'        => ValidationMiddleware::TYPE_COMPLEX,
                            'required'    => false,
                            'description' => 'Configuration of the dashboard component. Saved as JSON in the DB.',
                        ],
                        'created_by'      => [
                            'type'        => ValidationMiddleware::TYPE_GUID,
                            'required'    => false,
                            'description' => 'GUID of the creator user',
                        ],
                        'dashboard_id'    => [
                            'type'        => ValidationMiddleware::TYPE_GUID,
                            'required'    => true,
                            'description' => 'GUID of the dashboard',
                        ],
                        'dashlet_id'      => [
                            'type'        => ValidationMiddleware::TYPE_GUID,
                            'required'    => false,
                            'description' => 'GUID of the dashlet',
                        ],
                        'dashletconfig'      => [
                            'type'        => ValidationMiddleware::TYPE_ARRAY,
                            'required'    => false,
                            'description' => 'config of the dashlet',
                        ],
                        'date_entered'    => [
                            'type'        => ValidationMiddleware::TYPE_DATETIME,
                            'required'    => false,
                            'description' => 'Date entered',
                        ],
                        'date_indexed'    => [
                            'type'        => ValidationMiddleware::TYPE_DATETIME,
                            'required'    => false,
                            'description' => 'Date indexed',
                        ],
                        'date_modified'   => [
                            'type'        => ValidationMiddleware::TYPE_DATETIME,
                            'required'    => false,
                            'description' => 'Date modified',
                        ],
                        'deleted'         => [
                            'type'        => ValidationMiddleware::TYPE_NUMERIC, // should be boolean tho
                            'required'    => false,
                            'description' => 'Deleted flag',
                        ],
                        'description'     => [
                            'type'        => ValidationMiddleware::TYPE_STRING,
                            'required'    => false,
                            'description' => 'Description',
                        ],
                        'icon'      => [
                            'type'        => ValidationMiddleware::TYPE_STRING,
                            'required'    => false,
                            'description' => 'icon name',
                        ],
                        'id'              => [
                            'type'        => ValidationMiddleware::TYPE_GUID,
                            'required'    => true,
                            'description' => 'GUID of the dashboard component',
                        ],
                        'label'      => [
                            'type'        => ValidationMiddleware::TYPE_STRING,
                            'required'    => false,
                            'description' => 'label name',
                        ],
                        'modified_user_id' => [
                            'type'        => ValidationMiddleware::TYPE_GUID,
                            'required'    => false,
                            'description' => 'GUID of the user who modified it',
                        ],
                        'module'      => [
                            'type'        => ValidationMiddleware::TYPE_MODULE,
                            'required'    => false,
                            'description' => 'module name',
                        ],
                        'name'            => [
                            'type'        => ValidationMiddleware::TYPE_STRING,
                            'required'    => true,
                            'description' => 'The name of the dashboard component',
                        ],
                        'position'        => [
                            'type'        => ValidationMiddleware::TYPE_OBJECT,
                            'required'    => true,
                            'description' => 'Position configuration. Saved as a JSON in the DB.',
                            'parameters'  => [
                                'top'    => [
                                    'type'        => ValidationMiddleware::TYPE_NUMERIC,
                                    'required'    => true,
                                    'description' => '',
                                ],
                                'left'   => [
                                    'type'        => ValidationMiddleware::TYPE_NUMERIC,
                                    'required'    => true,
                                    'description' => '',
                                ],
                                'width'  => [
                                    'type'        => ValidationMiddleware::TYPE_NUMERIC,
                                    'required'    => true,
                                    'description' => '',
                                ],
                                'height' => [
                                    'type'        => ValidationMiddleware::TYPE_NUMERIC,
                                    'required'    => true,
                                    'description' => '',
                                ],
                            ],
                        ],
                        'tags' => [
                            'type'        => ValidationMiddleware::TYPE_STRING, // maybe array tho
                            'required'    => false,
                            'description' => 'Tags',
                        ],
                    ],
                ]
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('dashboards', '1.0', [], $routes);

