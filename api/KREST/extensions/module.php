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
use SpiceCRM\KREST\controllers\ModuleController;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'route'       => '/bean/file/upload',
        'class'       => ModuleController::class,
        'function'    => 'uploadFile',
        'description' => 'Attachment upload',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}',
        'class'       => ModuleController::class,
        'function'    => 'getBeanList',
        'description' => 'Get bean list',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}',
        'class'       => ModuleController::class,
        'function'    => 'postBean',
        'description' => 'Post bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/export',
        'class'       => ModuleController::class,
        'function'    => 'exportBeanList',
        'description' => 'Export bean list',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/duplicates',
        'class'       => ModuleController::class,
        'function'    => 'checkBeanDuplicates',
        'description' => 'Check bean duplicates',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}',
        'class'       => ModuleController::class,
        'function'    => 'deleteBeans',
        'description' => 'Delete beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}',
        'class'       => ModuleController::class,
        'function'    => 'getBean',
        'description' => 'Get bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}',
        'class'       => ModuleController::class,
        'function'    => 'addBean',
        'description' => 'Add bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}/{beanId}',
        'class'       => ModuleController::class,
        'function'    => 'deleteBean',
        'description' => 'Delete bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/duplicates',
        'class'       => ModuleController::class,
        'function'    => 'getBeanDuplicates',
        'description' => 'Get bean duplicates',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/auditlog',
        'class'       => ModuleController::class,
        'function'    => 'getBeanAuditlog',
        'description' => 'Get bean auditlog',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/noteattachment',
        'class'       => ModuleController::class,
        'function'    => 'getBeanAttachments',
        'description' => 'Get bean attachments',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/noteattachment/download',
        'class'       => ModuleController::class,
        'function'    => 'downloadBeanAttachment',
        'description' => 'Download bean attachment',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/noteattachment',
        'class'       => ModuleController::class,
        'function'    => 'setBeanAttachment',
        'description' => 'Set bean attachment',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/checklist/{fieldname}/{item}',
        'class'       => ModuleController::class,
        'function'    => 'postChecklist',
        'description' => 'Post checklist',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}/{beanId}/checklist/{fieldname}/{item}',
        'class'       => ModuleController::class,
        'function'    => 'deleteChecklist',
        'description' => 'Delete checklist',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/related/{linkname}',
        'class'       => ModuleController::class,
        'function'    => 'getRelatedBean',
        'description' => 'Get related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/related/{linkname}',
        'class'       => ModuleController::class,
        'function'    => 'addRelatedBean',
        'description' => 'Add related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'put',
        'route'       => '/module/{beanName}/{beanId}/related/{linkname}',
        'class'       => ModuleController::class,
        'function'    => 'setRelatedBean',
        'description' => 'Set related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}/{beanId}/related/{linkname}',
        'class'       => ModuleController::class,
        'function'    => 'deleteRelatedBean',
        'description' => 'Delete related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/merge_bean',
        'class'       => ModuleController::class,
        'function'    => 'mergeBeans',
        'description' => 'Merge beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true],
    ],
];

/**
 * register the extension
 */
$RESTManager->registerExtension('module', '2.0', [], $routes);

