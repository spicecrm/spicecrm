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
use SpiceCRM\modules\MediaFiles\api\controllers\MediaFilesController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('mediafiles', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/MediaFiles/{id}/file',
        'oldroute'    => '/module/MediaFiles/{mediaId}/file',
        'class'       => MediaFilesController::class,
        'function'    => 'getMediaFile',
        'description' => 'Get a media file, the original, not a variant in a specific size.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'The ID of the media file.',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/MediaFiles/{id}/base64',
        'oldroute'    => '/module/MediaFiles/{mediaId}/base64',
        'class'       => MediaFilesController::class,
        'function'    => 'getMediaFileBase64',
        'description' => 'Get a media file base64 encoded, the original, not a variant in a specific size.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'The ID of the media file.',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/MediaFiles/{id}/file/th/{thumbSize}',
        'oldroute'    => '/module/MediaFiles/{mediaId}/file/th/{thumbSize}',
        'class'       => MediaFilesController::class,
        'function'    => 'getThumbnail',
        'description' => 'Get the thumbnail of a media file.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'The ID of the media file.',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ],
            'thumbSize' => [
                'in' => 'path',
                'description' => 'The size of the thumbnail.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'required' => true
            ]
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/MediaFiles/{id}/file/mw/{maxWidth}',
        'oldroute'    => '/module/MediaFiles/{mediaId}/file/mw/{maxWidth}',
        'class'       => MediaFilesController::class,
        'function'    => 'getImageWithMaxWidth',
        'description' => 'Get the thumbnail of a media file, nearly larger than a specific width (the height results from keeping the aspect ratio).',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'The ID of the media file.',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ],
            'maxWidth' => [
                'in' => 'path',
                'description' => 'The maximal width of the media file variant.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/MediaFiles/{id}/file/mwh/{maxWidth}/{maxHeight}',
        'oldroute'    => '/module/MediaFiles/{mediaId}/file/mwh/{maxWidth}/{maxHeight}',
        'class'       => MediaFilesController::class,
        'function'    => 'getImageWithMaxWidthAndHeight',
        'description' => 'Get the thumbnail of a media file, nearly larger than a specific width and height.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'The ID of the media file.',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ],
            'maxWidth' => [
                'in' => 'path',
                'description' => 'The maximal width of the media file variant.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'required' => true
            ],
            'maxHeight' => [
                'in' => 'path',
                'description' => 'The maximal height of the media file variant.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'required' => true
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
