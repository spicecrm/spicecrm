<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\DocumentRevisions\api\controllers\Docu;
use SpiceCRM\modules\DocumentRevisions\api\controllers\DocumentRevisionsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/documentrevisions/relatedRevisions/{id}',
        'class'       => DocumentRevisionsController::class,
        'function'    => 'loadUnreadRevisions',
        'description' => 'returns all user related users_documentrevision entries',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'User Id',
                'type' => 'guid',
                'required' => true
            ]

        ]
    ]
];

/**
 * register the extension
 */
$RESTManager->registerExtension('module', '2.0', [], $routes);