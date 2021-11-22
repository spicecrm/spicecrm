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
use SpiceCRM\includes\SpiceAttachments\api\controllers\SpiceAttachmentsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;


/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/spiceattachments/module/{beanName}/{beanId}',
        'oldroute'    => '/spiceAttachments/module/{beanName}/{beanId}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'getAttachments',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'categoryId' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'category id to filter loaded attachments',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/common/spiceattachments/module/{beanName}/{beanId}/count',
        'oldroute'    => '/spiceAttachments/module/{beanName}/{beanId}/count',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'getAttachmentsCount',
        'description' => 'get spice attachments coutn. Define this route before this one /common/spiceattachments/module/{beanName}/{beanId}/{attachmentId} to avoid conflict',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'categoryId' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'ids of categories joined with ,',
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/common/spiceattachments/module/{beanName}/{beanId}/{attachmentId}',
        'oldroute'    => '/spiceAttachments/module/{beanName}/{beanId}/{attachmentId}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'getAttachment',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'attachmentId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of the attachment',
                'required' => true
            ]
        ]
    ],

    [
        'method'      => 'get',
        'route'       => '/common/spiceattachments/module/{beanName}/{beanId}/byfield/{fieldprefix}',
        'oldroute'    => '/spiceAttachments/module/{beanName}/{beanId}/byfield/{fieldprefix}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'getAttachmentForField',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'fieldprefix' => [
                'in' => 'path',
                'type'        => "string",
                'description' => 'Prefix of the field',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/common/spiceattachments',
        'oldroute'    => '/spiceAttachments',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'saveAttachment',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'file'       => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'file content',
            ],
            'filename' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'name of file',
            ],
            'filemimetype' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'type of file (Guesses if not given)',
            ],
            'beanId' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => false
            ],
            'beanModule' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => false
            ],
            'category_ids' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'ids of categories joined with ,',
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/common/spiceattachments/{id}',
        'oldroute'    => '/spiceAttachments/{id}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'spiceUpdateAttachmentData',
        'description' => 'save the attachment changes',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the Attachment',
            ],
            'category_ids' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'ids of categories joined with ,',
            ],
            'text'       => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'text',
            ],
            'display_name'       => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'the name to set as display name for the attachment',
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/common/spiceattachments/module/{beanName}/{beanId}',
        'oldroute'    => '/spiceAttachments/module/{beanName}/{beanId}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'saveAttachments',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'file' => [
                'in' => 'body',
                'type'        => ValidationMiddleware::TYPE_BASE64,
                'description' => 'the file content',
                'required' => true
            ],
            'filemimetype' => [
                'in' => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'the file Mime Type',
                'required' => true
            ],
            'filename' => [
                'in' => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'the file Name',
                'required' => true
            ],
            'category_ids' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'ids of categories joined with ,',
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/common/spiceattachments/module/{beanName}/{beanId}/clone/{fromBeanName}/{fromBeanId}',
        'oldroute'    => '/spiceAttachments/module/{beanName}/{beanId}/clone/{fromBeanName}/{fromBeanId}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'cloneAttachments',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'fromBeanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module it is cloned from',
                'example' => 'Accounts',
                'required' => true
            ],
            'fromBeanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean it is cloned from',
                'required' => true
            ],
            'categoryId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of a category to be cloned',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/common/spiceattachments/module/{beanName}/{beanId}/{attachmentId}',
        'oldroute'    => '/spiceAttachments/module/{beanName}/{beanId}/{attachmentId}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'deleteAttachment',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'attachmentId' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of the attachment',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/common/spiceattachments/categories/{module}',
        'oldroute'    => '/spiceAttachments/categories/{module}',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'getModuleCategories',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'module' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/common/spiceattachments/admin',
        'oldroute'    => '/spiceAttachments/admin',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'getAnalysis',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'post',
        'route'       => '/common/spiceattachments/admin/cleanup',
        'oldroute'    => '/spiceAttachments/admin/cleanup',
        'class'       => SpiceAttachmentsController::class,
        'function'    => 'cleanErroneous',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spiceattachments', '1.0', [], $routes);
