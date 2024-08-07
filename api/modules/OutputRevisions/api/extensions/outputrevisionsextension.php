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
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\OutputRevisions\api\controllers\OutputRevisionsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('outputrevisions', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/OutputRevisions/{parenttype}/{parentid}/output/{template}/preview',
        'class' => OutputRevisionsController::class,
        'function' => 'previewOutput',
        'description' => 'previews a new Output',
        'options' => ['validate' => true],
        'parameters' => [
            'parenttype' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'the parent module',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the parent module',
                'required' => true
            ],
            'template' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the id of the template to be used',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/OutputRevisions/{parenttype}/{parentid}/output/{template}',
        'class' => OutputRevisionsController::class,
        'function' => 'createOutput',
        'description' => 'creates a new Output',
        'options' => ['validate' => true],
        'parameters' => [
            'parenttype' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'the parent module',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the parent module',
                'required' => true
            ],
            'template' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the id of the template to be used',
                'required' => true
            ],
            'description' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'id of sales document',
                'example' => '9229b126-96fc-11eb-b689-00fffe0c4f07',
                'required' => false
            ],
        ]
    ],
];

$RESTManager->registerRoutes($routes);

