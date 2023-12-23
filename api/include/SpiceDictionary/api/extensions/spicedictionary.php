<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * routes
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/dictionary/domains',
        'oldroute'       => '/system/dictionary/domains',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'getDomains',
        'description' => 'get domains',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/dictionary/domains',
        'oldroute'       => '/system/dictionary/domains',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'postDomains',
        'description' => 'set domains',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'domaindefinitions' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'domainfields' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'domainfieldvalidations' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'domainfieldvalidationvalues' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'languagelabels' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'languagetranslations' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'languagecustomlabels' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'languagecustomtranslations' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/domains/appliststrings',
        'oldroute'    => '/system/dictionary/domains/appliststrings',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'getAppListStrings',
        'description' => 'get AppListStrings',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/definitions',
        'oldroute'       => '/system/dictionary/definitions',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'getDefinitions',
        'description' => 'get dictionary definitions including relationship & index definitions ',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/fields',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'getDictionaryFields',
        'description' => 'get dictionary definitions including relationship & index definitions ',
        'options'     => ['adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/vardefs/{dictionaryname}',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'getDictionaryVardefs',
        'description' => 'get dictionary definitions vardefs for a given dictionary item by name',
        'options'     => ['adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/dictionary/definitions',
        'oldroute'       => '/system/dictionary/definitions',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'postDefinitions',
        'description' => 'save dictionary definitions including relationship & index definitions ',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'dictionarydefinitions' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'dictionaryitems' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'dictionaryrelationships' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'dictionaryrelationshipfields' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'dictionaryrelationshiprelatefields' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'dictionaryindexes' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ],
            'dictionaryindexitems' => [
                'in' => 'body',
                'description' => '',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '',
                'required' => false
            ]
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/spicewords',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'getSpiceWords',
        'description' => 'will get the list of database related keywords and reserved words',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/spicewords/reservedwords',
        'class'       => SpiceDictionaryController::class,
        'function'    => 'checkSpiceWordsInVardefs',
        'description' => 'will check on current column names that are reserved word. USed only in MySQL. ONly for dev purpose. Will be removed.',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],

];

/**
 * register the Extension
 */
$RESTManager->registerExtension('dictionary', '1.0', [], $routes);
