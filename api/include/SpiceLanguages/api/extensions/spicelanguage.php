<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceUI\api\controllers\ConfServerController;
use SpiceCRM\includes\SpiceLanguages\api\controllers\SpiceLanguageController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'post',
        'oldroute' => '/syslanguages/labels',
        'route' => '/configuration/syslanguages/labels',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageSaveLabel',
        'description' => 'saves the labels',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'excludeBodyValidation' => true],
        'parameters' => [
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'delete',
        'oldroute' => '/syslanguages/labels/{id}/[{environment}]',
        'route' => '/configuration/syslanguages/labels/{id}/[{environment}]',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageDeleteLabel',
        'description' => 'deletes a label name',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
            ],
            '$environment' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
            ],
        ]
    ],
    [
        'method' => 'get',
        'oldroute' => '/syslanguages/labels/search/{search_term}',
        'route' => '/configuration/syslanguages/labels/search/{search_term}',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageSearchLabel',
        'description' => 'search for a label',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'search_term' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
            ],

        ]
    ],
    [
        'method' => 'get',
        'oldroute' => '/syslanguages/labels/{label_name}',
        'route' => '/configuration/syslanguages/labels/{label_name}',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageGetLabel',
        'description' => 'gets a label by name',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'label_name' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => true,
                'required' => false
            ],
        ],
    ],
    [
        'method' => 'get',
        'oldroute' => '/system/syslanguages/load/{language}',
        'route' => '/syslanguages/load/{language}',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageLoadDefault',
        'description' => 'loads the default language',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'language' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
            ],
        ]
    ],
    [
        'method' => 'get',
        'oldroute' => '/syslanguages/language/{language}',
        'route' => '/configuration/syslanguages/language/{language}',
        'class' => ConfServerController::class,
        'function' => 'getLanguageLabels',
        'description' => 'gets json for a language',
        'options' => ['noAuth' => true, 'adminOnly' => false],
        'parameters' => [
            'language' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
            ],
        ]
    ],
    [
        'method' => 'post',
        'oldroute' => '/syslanguages/setdefault/{language}',
        'route' => '/configuration/syslanguages/setdefault/{language}',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageSetDefault',
        'description' => 'sets a default language',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'language' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
            ],
        ]
    ],
    [
        'method' => 'post',
        'oldroute' => '/syslanguages/filesToDB',
        'route' => '/configuration/syslanguages/filesToDB',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageTransferToDB',
        'description' => 'transfers value from a file to a database',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'confirmed' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => true,
                'required' => false
            ],
        ],
    ],
    [
        'method' => 'get',
        'oldroute' => '/syslanguage/{language}/{scope}/labels/untranslated',
        'route' => '/configuration/syslanguage/{language}/{scope}/labels/untranslated',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageGetRawLabels',
        'description' => 'et the untranslated labels',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'language' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'en_us',
                'required' => true
            ],
            'scope' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'custom',
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'get',
        'route' => '/syslanguage/labels/translate/cantranslate',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageTranslateAPIKEYGet',
        'description' => 'translates a label using the google Translate API',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'post',
        'route' => '/syslanguage/labels/translate/{fromlanguage}/{tolanguage}',
        'class' => SpiceLanguageController::class,
        'function' => 'LanguageTranslateLabel',
        'description' => 'translates a label using the google Translate API',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'fromlanguage' => [
                'in' => 'path',
                'description' => 'the language to translate from',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'tolanguage' => [
                'in' => 'path',
                'description' => 'the language to translate to',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'labels'=> [
                'in' => 'body',
                'description' => 'the language to translate to',
                'type' => ValidationMiddleware::TYPE_ARRAY
            ],
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('syslanguages', '1.0', [], $routes);
