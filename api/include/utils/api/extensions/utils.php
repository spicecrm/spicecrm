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
use SpiceCRM\includes\utils\api\controllers\UtilsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/system/pdf/toImage/base64data/{filepath}',
        'class'       => UtilsController::class,
        'function'    => 'RestPDFToBaseImage',
        'description' => 'convert a pdf to a base64 image',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/system/pdf/toImageurl/{filepath}',
        'class'       => UtilsController::class,
        'function'    => 'RestPDFToUrlImage',
        'description' => 'converts a pdf to Url image',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/system/pdf/upload/tmp',
        'class'       => UtilsController::class,
        'function'    => 'PutToTmpPdfPath',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/system/pdf/upload/uploadsDir',
        'class'       => UtilsController::class,
        'function'    => 'PutToUpPath',
        'description' => 'puts the content to an upload path',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/system/guid',
        'class'       => UtilsController::class,
        'function'    => 'generateGuid',
        'description' => 'helper to generate a GUID',
        'options'     => ['noAuth' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/system/shorturl/{key}',
        'class'       => UtilsController::class,
        'function'    => 'getRedirection',
        'description' => 'get redirection data for a short url',
        'options'     => ['noAuth' => true, 'validate' => true],
        'parameters'  => [
            'key' => [
                'in'          => 'path',
                'description' => 'Short URL key',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example'     => 'gX2qwKsKc',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^[a-km-zA-HJ-NP-Z2-9]+$#'
                ]
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('utils', '1.0', [], $routes);
