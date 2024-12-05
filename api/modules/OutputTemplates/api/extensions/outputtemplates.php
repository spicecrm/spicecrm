<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\OutputTemplates\api\controllers\OutputTemplatesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use Slim\Routing\RouteCollectorProxy;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('outputtemplates', '1.0', ['bucketMaxItems' => SpiceConfig::getInstance()->get('bulkpdf_export.max_items')]);

$routes = [
    [
        'method'      => 'put',
        'route'       => '/module/OutputTemplates/{id}/formodule/{beanName}/{beanId}/related/{linkName}/generateBulkPDF',
        'class'       => OutputTemplatesController::class,
        'function'    => 'generateRelatedBulkPDF',
        'description' => 'generate bulk pdf for related beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'moduleRoute' => true, 'validate' => true],
        'parameters'  => [
            'id'           => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'The id of the output template',
            ],
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
            'excludeinactive'           => [
                'in'          => 'excludeinactive',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'set to excludeinactive',
            ],
            'module'   => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => false,
                'description' => 'The name of the module',
            ],
            'forceResolveLinks' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'Forces resolving the links (when default=true in vardefs).',
            ],
            'searchterm' => [
                'in'          => 'query',
                'description' => 'a searchterm to search by',
                'type'        => ValidationMiddleware::TYPE_STRING,
            ],

        ],
    ],
    [
        'method'      => 'put',
        'route'       => '/module/OutputTemplates/{id}/formodule/{module}/generateBulkPDF',
        'class'       => OutputTemplatesController::class,
        'function'    => 'generateBulkPDF',
        'description' => 'get all templates of the given module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'module' => [
                'in'            => 'path',
                'type'          => ValidationMiddleware::TYPE_MODULE,
                'description'   => 'name of a module',
                'example'       => 'Accounts',
                'required'      => true
            ],
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the OutputTemplate',
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/OutputTemplates/formodule/{module}',
        'class'       => OutputTemplatesController::class,
        'function'    => 'getModuleTemplates',
        'description' => 'get all templates of the given module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
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
        'route'       => '/module/OutputTemplates/formodule/{module}/{id}',
        'class'       => OutputTemplatesController::class,
        'function'    => 'getModuleTemplates',
        'description' => 'get all templates of the given module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'module' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of the bean',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/OutputTemplates/previewhtml',
        'oldroute'    => '/OutputTemplates/previewhtml',
        'class'       => OutputTemplatesController::class,
        'function'    => 'previewhtml',
        'description' => 'get the html prieview of the given parent',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'excludeBodyValidation' => true],
        'parameters'  => [
            'body'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'html string for template-body',
            ],
            'header'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'html string for template-header',
            ],
            'footer'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'html string for template-footer',
            ],
            'stylesheet_id'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the stylesheet',
            ],
            'parentype'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'name of a module',
                'example' => 'Accounts',
            ],
            'parentid'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the parent bean',
            ],
            'margin_bottom'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => '',
            ],
            'margin_left'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => '',
            ],
            'margin_right'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => '',
            ],
            'margin_top'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => '',
            ],
            'page_size'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
            'page_orientation'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
            'id'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => '',
            ],
            'language'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/OutputTemplates/previewpdf',
        'oldroute'    => '/OutputTemplates/previewpdf',
        'class'       => OutputTemplatesController::class,
        'function'    => 'previewpdf',
        'description' => 'get the pdf prieview of the given parent',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'body'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'html string for template-body',
            ],
            'header'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'html string for template-header',
            ],
            'footer'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'html string for template-footer',
            ],
            'margin_left'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => 'number of margin_left',
            ],
            'margin_top'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => 'number of margin_top',
            ],
            'margin_right'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => 'number of margin_right',
            ],
            'margin_bottom'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
                'description' => 'number of margin_bottom',
            ],
            'page_size'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'number of page_size',
            ],
            'page_orientation'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'GUID of the stylesheet',
            ],
            'parentype'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'name of a module',
                'example' => 'Accounts',
            ],
            'parentid'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the parent bean',
            ],
            'language'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/OutputTemplates/{id}/compile/{bean_id}',
        'oldroute'    => '/OutputTemplates/{id}/compile/{bean_id}',
        'class'       => OutputTemplatesController::class,
        'function'    => 'compile',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the OutputTemplate',
            ],
            'bean_id'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean to compile',
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/OutputTemplates/{id}/convert/{bean_id}/to/{format}',
        'oldroute'    => '/OutputTemplates/{id}/convert/{bean_id}/to/{format}',
        'class'       => OutputTemplatesController::class,
        'function'    => 'convertToFormat',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the OutputTemplate',
            ],
            'bean_id'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean to convert',
            ],
            'format'       => [
                'in'          => 'path',
                'type'        => 'string',
                'required'    => true,
                'description' => 'not in use',
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/OutputTemplates/{id}/convert/{bean_id}/to/{format}/base64',
        'oldroute'    => '/OutputTemplates/{id}/convert/{bean_id}/to/{format}/base64',
        'class'       => OutputTemplatesController::class,
        'function'    => 'convertToBase64',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the OutputTemplate',
            ],
            'bean_id'       => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean to compile',
            ],
            'format'       => [
                'in'          => 'path',
                'type'        => 'string',
                'required'    => true,
                'description' => 'not in use',
            ],
            'bean_data'       => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_OBJECT,
                'required'    => true,
                'description' => 'bean data to be rendered',
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/OutputTemplates/templateFunctions',
        'class'       => OutputTemplatesController::class,
        'function'    => 'getTemplateFunctions',
        'description' => 'Get the full list of system template functions.',
        'options'     => ['noAuth' => false, 'adminOnly' => false]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/OutputTemplates/{id}/livecompile/{parentmodule}/{parentid}',
        'class'       => OutputTemplatesController::class,
        'function'    => 'liveCompileHtml',
        'description' => 'live compile html',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'parentmodule' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'name of parent module',
                'example' => 'Accounts',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'if of parent bean',
                'example' => '2816ba5c-97e7-11eb-8c42-00fffe0c4f07',
                'required' => true
            ],
            'html' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'html string',
                'example' => '',
                'required' => true
            ],
            'field' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'html field',
                'example' => '',
                'required' => false
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);

