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
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\SpiceTags\api\controllers\SpiceTagsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    /* route not found in fe
     * [
        'method'      => 'get',
        'route'=>'/common/spicetags',
        'oldroute'       => '/SpiceTags/{query}',
        'class'       => SpiceTagsController::class,
        'function'    => 'searchTags',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => []

    ],*/
    [
        'method' => 'post',
        'route' => '/common/spicetags',
        'oldroute' => '/SpiceTags',
        'class' => SpiceTagsController::class,
        'function' => 'searchPostTags',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'search' => [
                'in' => 'body',
                'description' => 'the name the tag',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'mytag',
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicetags', '1.0', [], $routes);
