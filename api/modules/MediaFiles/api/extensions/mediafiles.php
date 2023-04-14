<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
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
$RESTManager->registerExtension('mediafiles', '1.0', [
    'public_url' => SpiceConfig::getInstance()->config['mediafiles']['public_url'] ?? 'https://cdn.spicecrm.io/'
]);

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
