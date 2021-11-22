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
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\KREST\controllers\ModuleController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$RESTManager = RESTManager::getInstance();

/**
 * register the extension
 */
$RESTManager->registerExtension('module', '2.0', ['disableAutoloadListAll' => SpiceConfig::getInstance()->config['module_list']['disable_autoload_list_all']]);

$routes = [
    [
        'method'      => 'post',
        'route'       => '/common/bean/file/upload',
        'class'       => ModuleController::class,
        'function'    => 'uploadFile',
        'description' => 'Attachment upload',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'file' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BASE64,
                'required' => true,
                'description' => 'The file content base64 encoded.',
            ],
            'file_mime_type' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'type of the file',
            ],
            'file_name' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'name of the file',
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}',
        'oldroute'    => '/module/{beanName}',
        'class'       => ModuleController::class,
        'function'    => 'getBeanList',
        'description' => 'Get bean list',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'aggregates' => [
                'in'          => 'query',
                'description' => 'a JSON object for selected aggregates',
                'type'        => ValidationMiddleware::TYPE_JSON,
            ],
            'buckets'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => '',
            ],
            'filter'     => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => '',
            ],
            'filtercontextbeanid'     => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'additonal values that can be passed in',
            ],
            'limit'      => [
                'in'          => 'query',
                'description' => 'the maximum number of record to be retrieved',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'default'     => 25,
                'required'    => false
            ],
            'listid'     => [
                'in'          => 'query',
                'description' => 'a listid that identifies the list to be loaded. Allowed values are all, own or the guid of a listid stored in teh database',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'default'     => 'all',
            ],
            'offset'     => [
                'in'          => 'query',
                'description' => 'the offset to start from for a paginated query',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'default'     => 0,
                'required'    => false
            ],
            'orderby'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => '',
            ],
            'searchtags' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => '',
            ],
            'searchfields' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'description' => '',
            ],
            'searchgeo' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'json string containing radius and start geocoded point for radius search',
            ],
            'searchterm' => [
                'in'          => 'query',
                'description' => 'a searchterm to search by',
                'type'        => ValidationMiddleware::TYPE_STRING,
            ],
            'sortfields' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'description' => '',
            ],
            'source'     => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => '',
            ],
            'start'      => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => false,
                'description' => '',
            ],
            'modulefilter'      => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'a module filter to be applied',
            ],
            'relatefilter'      => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'a relate module filter to be applied',
            ],
            'fields'      => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'encoded fields - DEPRECATED and to be removed',
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}',
        'class'       => ModuleController::class,
        'function'    => 'postBean',
        'description' => 'Post bean (insert or update)',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/export',
        'class'       => ModuleController::class,
        'function'    => 'exportBeanList',
        'description' => 'Export bean list',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'    => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'listid'      => [
                'in'          => 'body',
                'description' => 'a listid that identifies the list to be loaded. Allowed values are all, own or the guid of a listid stored in teh database',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'default'     => 'all',
            ],
            'fields'      => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => 'can be a string, or an array or a json encoded array',
            ],
            'ids'         => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'An array of GUIDs',
            ],
            'whereclause' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'this does not seem to come from the request. it is just set later on. (╯°□°）╯︵ ┻━┻',
            ],
            'orderby'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => '',
            ],
            'source'      => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => '',
            ],
            'filter'      => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => '',
            ],
            'records'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => 'this does not seem to come from the request. it is just set later on. (╯°□°）╯︵ ┻━┻',
            ],
            'searchterm'  => [
                'in'          => 'body',
                'description' => 'a searchterm to search by',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
            ],
            'searchtags'  => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => '',
            ],
            'aggregates'  => [
                'in'          => 'body',
                'description' => 'a JSON object for selected aggregates',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
            ],
            'sortfields'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'description' => '',
                'required'    => false,
            ],

        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/duplicates',
        'class'       => ModuleController::class,
        'function'    => 'checkBeanDuplicates',
        'description' => 'Check bean duplicates',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ]
        ]
    ],

    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/massupdate/{action}',
        'class'       => ModuleController::class,
        'function'    => 'massUpdate',
        'description' => 'massupdate beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'action' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'required'    => true,
                'description' => 'the action to be performed',
                'options' => ['assign']
            ]
        ]
    ],
    [
        'method'      => 'patch',
        'route'       => '/module/{beanName}',
        'class'       => ModuleController::class,
        'function'    => 'patchBeans',
        'description' => 'Delete or mass update beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'action'=> [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['DELETE', 'UPDATE'],
                'required'    => true,
                'description' => 'the action to be performed'
            ],
            'ids'      => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'Bean GUIDs'
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}',
        'class'       => ModuleController::class,
        'function'    => 'getBean',
        'description' => 'Get bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'trackaction'     => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING, // maybe change to enum
                'required'    => false,
                'description' => '',
            ],
            'includeReminder' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING, // should actually be bool
                'required'    => false,
                'description' => '',
            ],
            'includeNotes'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING, // should actually be bool
                'required'    => false,
                'description' => '',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}',
        'class'       => ModuleController::class,
        'function'    => 'addBean',
        'description' => 'Add bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'templateId'          => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'GUID or other id type for a bean that is being duplicated',
            ],
            // bean in body
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'description' => 'array with bean data',
                'example' => '',
                'required' => true
            ]
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}/{beanId}',
        'class'       => ModuleController::class,
        'function'    => 'deleteBean',
        'description' => 'Delete bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/duplicates',
        'class'       => ModuleController::class,
        'function'    => 'getBeanDuplicates',
        'description' => 'Get bean duplicates',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/auditlog',
        'class'       => ModuleController::class,
        'function'    => 'getBeanAuditlog',
        'description' => 'Get bean auditlog',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'grouped'     => [
                'in'          => 'grouped',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'if the result shoudl be returned as an array grouped by the transaction id',
            ],
            'user'     => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'User name',
            ],
            'field'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'Field name',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Timeline/{beanName}/{beanId}',
        'class'       => ModuleController::class,
        'function'    => 'loadFTSTimeline',
        'description' => 'get held items in timeline stream for specified bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'required' => true,
                'description' => 'name of the module'
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'id of the parent bean'
            ],
            'startDate' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'tracks the last date to avoid double loading of records'
            ],
            'endDate' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'if a record was deleted while opened timeline it the date of the oldest displayed entry to load the same timespan as currently shown'
            ],
            'searchTerm' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
            'moduleSearch' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'required' => true,
                'description' => 'indicates if searching for module records is allowed'
            ],
            'auditSearch' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'required' => true,
                'description' => 'indicates if searching for audit records is allowed'
            ],
            'own' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'true',
                'required' => true
            ],
            'objects' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '[]',
                'required' => true
            ],
            'timeRangeStart' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'holds a start date to search from - chosen by the user'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/noteattachment',
        'class'       => ModuleController::class,
        'function'    => 'getBeanAttachments',
        'description' => 'Get bean attachments',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/noteattachment/download',
        'class'       => ModuleController::class,
        'function'    => 'downloadBeanAttachment',
        'description' => 'Download bean attachment',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'     => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/noteattachment',
        'class'       => ModuleController::class,
        'function'    => 'setBeanAttachment',
        'description' => 'Set bean attachment',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'     => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'filename'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The file name',
            ],
            'filemimetype' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The mime type of the file',
            ],
            'file'         => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BASE64,
                'required'    => true,
                'description' => 'The base64 contents of the file',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/checklist/{fieldName}/{item}',
        'class'       => ModuleController::class,
        'function'    => 'postChecklist',
        'description' => 'Post checklist',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'fieldName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
            'item'      => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => ''
            ],
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}/{beanId}/checklist/{fieldName}/{item}',
        'class'       => ModuleController::class,
        'function'    => 'deleteChecklist',
        'description' => 'Delete checklist',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'fieldName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
            'item'      => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => ''
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/related/{linkName}',
        'class'       => ModuleController::class,
        'function'    => 'getRelatedBean',
        'description' => 'Get related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'           => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'             => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'linkName'           => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the link',
            ],
            'modulefilter'       => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'Module filter GUID',
            ],
            'fieldfilters'       => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => '',
            ],
            'sort'               => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_OBJECT,
                'required'    => false,
                'description' => '',
                'parameters' => [
                    'sortfield' => [
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'description' => 'the sort fieldname'
                    ],
                    'sortdirection' => [
                        'type'        => ValidationMiddleware::TYPE_ENUM,
                        'required'    => true,
                        'description' => 'the sort direction',
                        'options' => ['ASC', 'DESC']
                    ]
                ]
            ],
            'offset'             => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => false,
                'description' => '',
            ],
            'limit'              => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => false,
                'description' => '',
            ],
            'relationshipFields' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => false,
                'description' => '',
            ],
            'getcount'           => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => '',
            ],
            'module'   => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => false,
                'description' => 'The name of the module',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/related/{linkName}',
        'class'       => ModuleController::class,
        'function'    => 'addRelatedBean',
        'description' => 'Add related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => false],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'linkName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the link',
            ],
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'An array with GUIDs of related beans',
            ],
        ],
    ],
    [
        'method'      => 'put',
        'route'       => '/module/{beanName}/{beanId}/related/{linkName}',
        'class'       => ModuleController::class,
        'function'    => 'setRelatedBean',
        'description' => 'Set related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'beanName'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'         => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'linkName'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the link',
            ],
            'id'             => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the related bean',
            ],
            'deleted'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'Deleted flag',
            ],
            'date_modified'  => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => false,
                'description' => 'Date modified',
            ],
            'date_entered'  => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => false,
                'description' => 'Date entered',
            ],
            'date_indexed'  => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => false,
                'description' => 'Date indexed',
            ],
            'name'           => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => '',
            ],
            'emailaddresses' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_EMAIL,
                'required'    => false,
                'description' => '',
            ],
            'file'           => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BASE64,
                'required'    => false,
                'description' => 'The base64 contents of the file',
            ],
            'filename'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'The file name',
            ],
            'favorite'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => '',
            ],
            // possibly there are more
        ],
    ],
    [
        'method'      => 'put',
        'route'       => '/module/{beanName}/{beanId}/related/beans/{linkName}',
        'class'       => ModuleController::class,
        'function'    => 'setRelatedBeans',
        'description' => 'Set related beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'beanName'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'         => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'linkName'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the link',
            ],
            'id'             => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'GUID of the related bean',
            ],
            'deleted'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'Deleted flag',
            ],
            'date_modified'  => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => false,
                'description' => 'Date modified',
            ],
            'date_entered'  => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => false,
                'description' => 'Date entered',
            ],
            'date_indexed'  => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => false,
                'description' => 'Date indexed',
            ],
            'name'           => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => '',
            ],
            'emailaddresses' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'required'    => false,
                'description' => 'array of related beans to be updated',
            ]
            // possibly there are more
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}/{beanId}/related/{linkName}',
        'class'       => ModuleController::class,
        'function'    => 'deleteRelatedBean',
        'description' => 'Delete related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'     => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'linkName'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the link',
            ],
            'relatedids' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
                'required'    => true,
                'description' => 'An array of GUIDs or just a GUID',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/mergebeans',
        'class'       => ModuleController::class,
        'function'    => 'mergeBeans',
        'description' => 'Merge beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'duplicates' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => '',
            ],
            'fields'          => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                // todo array fieldName => beanId
                'required'    => true,
                'description' => '',
            ],

        ],
    ],
];

/**
 * register the extension
 */
$RESTManager->registerExtension('module', '2.0', [], $routes);

