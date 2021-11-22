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
use SpiceCRM\modules\SpiceImports\api\controllers\SpiceImportsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/SpiceImports/savedimports/{beanName}',
        'oldroute'    => '/modules/SpiceImports/savedImports/{beanName}',
        'class'       => SpiceImportsController::class,
        'function'    => 'getSavedImports',
        'description' => 'get the saved spice imports',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'Module name',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceImports/filepreview',
        'oldroute'    => '/modules/SpiceImports/filePreview',
        'class'       => SpiceImportsController::class,
        'function'    => 'getFilePreview',
        'description' => 'get the file reviews',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'separator' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['comma', 'semicolon'],
                'required'    => true,
                'description' => ''
            ],
            'enclosure' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['single', 'double'],
                'required'    => true,
                'description' => ''
            ],
            'file_md5'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => ''
            ],
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceImports/upf',
        'oldroute'    => '/modules/SpiceImports/upf',
        'class'       => SpiceImportsController::class,
        'function'    => 'deleteImportFile',
        'description' => 'delete the import files',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceImports/import',
        'oldroute'    => '/modules/SpiceImports/import',
        'class'       => SpiceImportsController::class,
        'function'    => 'saveFromImport',
        'description' => 'saves data from an imports',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'objectimport' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_JSON,
                'required'    => true,
                'description' => '',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceImports/{importId}/logs',
        'oldroute'    => '/modules/SpiceImports/{importId}/logs',
        'class'       => SpiceImportsController::class,
        'function'    => 'getImportLog',
        'description' => 'get the spice import log entries',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'importId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the import',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spiceimports', '1.0', [], $routes);
