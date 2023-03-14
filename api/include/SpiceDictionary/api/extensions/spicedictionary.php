<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryController;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryDefinitionsController;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryDomainDefinitionsController;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryDomainFieldsController;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryIndexesController;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryItemsController;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryRelationshipsController;
use SpiceCRM\includes\SpiceDictionary\api\controllers\SpiceDictionaryDomainValidationsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;


/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * routes
 */
$routes = [
    [
        'method' => 'put',
        'route' => '/dictionary/repair',
        'class' => SpiceDictionaryController::class,
        'function' => 'repair',
        'description' => 'does a general repair',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'put',
        'route' => '/dictionary/generatesystem',
        'class' => SpiceDictionaryController::class,
        'function' => 'generateSystem',
        'description' => 'generates the System cached file',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/repair',
        'class' => SpiceDictionaryController::class,
        'function' => 'getRepairDefintions',
        'description' => 'gets all definitions and relationships to be repaired',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'put',
        'route' => '/dictionary/repair/reset',
        'class' => SpiceDictionaryController::class,
        'function' => 'reset',
        'description' => 'does a resetr',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'fullreset' => [
                'in' => 'query',
                'description' => 'indicates that all cached table shoudl be truncated',
                'type' => ValidationMiddleware::TYPE_BOOL
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/repair/sqls/{hash}',
        'class' => SpiceDictionaryController::class,
        'function' => 'executeSQL',
        'description' => 'executes a hased and cached SQL',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'hash' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/dictionary/repair/definition/{id}',
        'class' => SpiceDictionaryController::class,
        'function' => 'repair',
        'description' => 'does a general repair for one item',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the definition',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'execute' => [
                'in' => 'query',
                'description' => 'set to true of the query shoudl be executed also immediately',
                'type' => ValidationMiddleware::TYPE_BOOL
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/dictionary/repair/relationship/{id}',
        'class' => SpiceDictionaryController::class,
        'function' => 'repairRelationship',
        'description' => 'does a general repair for one relationship',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the definition',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'template_sysdictionarydefinition_id' => [
                'in' => 'query',
                'description' => 'the id of the template from teh dictionary',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'referencing_sysdictionarydefinition_id' => [
                'in' => 'query',
                'description' => 'the id of the item this reference is going to',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/dictionary/repair/relationship/{dictionaryname}/{relationshipname}',
        'class' => SpiceDictionaryController::class,
        'function' => 'repairVardefRelationship',
        'description' => 'does a general repair for one relationship',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'dictionaryname' => [
                'in' => 'path',
                'description' => 'the name of the dictionary where this relationship is defined',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'relationshipname' => [
                'in' => 'path',
                'description' => 'the name of the relationship',
                'type' => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/dictionary/repair/relationships/vardefs',
        'class' => SpiceDictionaryController::class,
        'function' => 'repairVardefRelationships',
        'description' => 'does a general repair for all vardef relationship',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'put',
        'route' => '/dictionary/repair/vardef/{name}',
        'class' => SpiceDictionaryController::class,
        'function' => 'repairVardef',
        'description' => 'does a general repair for one vardef definition',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'name' => [
                'in' => 'path',
                'description' => 'the name of the vardef entry',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'execute' => [
                'in' => 'query',
                'description' => 'set to true of the query shoudl be executed also immediately',
                'type' => ValidationMiddleware::TYPE_BOOL
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/domains',
        'oldroute' => '/system/dictionary/domains',
        'class' => SpiceDictionaryController::class,
        'function' => 'getDomains',
        'description' => 'get domains',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/domains/appliststrings',
        'oldroute' => '/system/dictionary/domains/appliststrings',
        'class' => SpiceDictionaryController::class,
        'function' => 'getAppListStrings',
        'description' => 'get AppListStrings',
        'options' => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/definitions',
        'oldroute' => '/system/dictionary/definitions',
        'class' => SpiceDictionaryController::class,
        'function' => 'getDefinitions',
        'description' => 'get dictionary definitions including relationship & index definitions ',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/fields',
        'class' => SpiceDictionaryController::class,
        'function' => 'getDictionaryFields',
        'description' => 'get dictionary definitions including relationship & index definitions ',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/columns/{dictionaryname}',
        'class' => SpiceDictionaryController::class,
        'function' => 'getDBColumns',
        'description' => 'get dictionary definitions as defined on the database',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'delete',
        'route' => '/dictionary/columns/{dictionaryname}',
        'class' => SpiceDictionaryController::class,
        'function' => 'deleteDBColumns',
        'description' => 'deletes columns from the database',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'dictionaryname' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'fields' => [
                'in' => 'params',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_ARRAY
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/vardefs/{dictionaryname}',
        'class' => SpiceDictionaryController::class,
        'function' => 'getDictionaryVardefs',
        'description' => 'get dictionary definitions vardefs for a given dictionary item by name',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/definitions',
        'oldroute' => '/system/dictionary/definitions',
        'class' => SpiceDictionaryController::class,
        'function' => 'postDefinitions',
        'description' => 'save dictionary definitions including relationship & index definitions ',
        'options' => ['noAuth' => false, 'adminOnly' => true],
        'parameters' => [
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
    // for the domains
    [
        'method' => 'post',
        'route' => '/dictionary/domaindefinition/{id}',
        'class' => SpiceDictionaryDomainDefinitionsController::class,
        'function' => 'postDictionaryDomainDefinition',
        'description' => 'posts a dictionary Domain Definition',
        'options' => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ], [
        'method' => 'delete',
        'route' => '/dictionary/domaindefinition/{id}',
        'class' => SpiceDictionaryDomainDefinitionsController::class,
        'function' => 'deleteDictionaryDomainDefinition',
        'description' => 'delets a dictionary Domain Definition',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/domaindefinition/{id}/activate',
        'class' => SpiceDictionaryDomainDefinitionsController::class,
        'function' => 'activateDictionaryDomainDefinition',
        'description' => 'activates a dictionary Definition',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ], [
        'method' => 'delete',
        'route' => '/dictionary/domaindefinition/{id}/activate',
        'class' => SpiceDictionaryDomainDefinitionsController::class,
        'function' => 'deactivateDictionaryDomainDefinition',
        'description' => 'deactivates a dictionary Definition',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    // for the domainfieldss
    [
        'method' => 'post',
        'route' => '/dictionary/domainfield/{id}',
        'class' => SpiceDictionaryDomainFieldsController::class,
        'function' => 'postDictionaryDomainField',
        'description' => 'posts a dictionary Domain Definition',
        'options' => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ], [
        'method' => 'delete',
        'route' => '/dictionary/domainfield/{id}',
        'class' => SpiceDictionaryDomainFieldsController::class,
        'function' => 'deleteDictionaryDomainField',
        'description' => 'delets a dictionary Domain Definition',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/domainfield/{id}/activate',
        'class' => SpiceDictionaryDomainFieldsController::class,
        'function' => 'activateDictionaryDomainField',
        'description' => 'activates a dictionary DoaminField',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ], [
        'method' => 'delete',
        'route' => '/dictionary/domainfield/{id}/activate',
        'class' => SpiceDictionaryDomainFieldsController::class,
        'function' => 'deactivateDictionaryDomainField',
        'description' => 'deactivates a dictionary DoaminField',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    // for the domainvalidations
    [
        'method' => 'post',
        'route' => '/dictionary/domainvalidation/{id}',
        'class' => SpiceDictionaryDomainValidationsController::class,
        'function' => 'postDictionaryDomainValidation',
        'description' => 'posts a dictionary Domain Validation',
        'options' => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ], [
        'method' => 'post',
        'route' => '/dictionary/domainvalidation/{id}/values',
        'class' => SpiceDictionaryDomainValidationsController::class,
        'function' => 'postDictionaryDomainValidationValues',
        'description' => 'posts a dictionary Domain Validation',
        'options' => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ], [
        'method' => 'delete',
        'route' => '/dictionary/domainvalidation/{id}',
        'class' => SpiceDictionaryDomainValidationsController::class,
        'function' => 'deleteDictionaryDomainValidation',
        'description' => 'delets a dictionary Domain Validation',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    // ---
    [
        'method' => 'get',
        'route' => '/dictionary/spicewords',
        'class' => SpiceDictionaryController::class,
        'function' => 'getSpiceWords',
        'description' => 'will get the list of database related keywords and reserved words',
        'options' => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method' => 'get',
        'route' => '/dictionary/spicewords/reservedwords',
        'class' => SpiceDictionaryController::class,
        'function' => 'checkSpiceWordsInVardefs',
        'description' => 'will check on current column names that are reserved word. USed only in MySQL. ONly for dev purpose. Will be removed.',
        'options' => ['noAuth' => false, 'adminOnly' => true],
    ],
    // for the definitions
    [
        'method' => 'post',
        'route' => '/dictionary/definition/{id}',
        'class' => SpiceDictionaryDefinitionsController::class,
        'function' => 'postDictionaryDefinition',
        'description' => 'posts a dictionary Definition',
        'options' => ['adminOnly' => true]
    ], [
        'method' => 'delete',
        'route' => '/dictionary/definition/{id}',
        'class' => SpiceDictionaryDefinitionsController::class,
        'function' => 'deleteDictionaryDefinition',
        'description' => 'delets a dictionary Definition',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/definition/{id}/activate',
        'class' => SpiceDictionaryDefinitionsController::class,
        'function' => 'activateDictionaryDefinition',
        'description' => 'activates a dictionary Definition',
        'options' => ['adminOnly' => true]
    ], [
        'method' => 'delete',
        'route' => '/dictionary/definition/{id}/activate',
        'class' => SpiceDictionaryDefinitionsController::class,
        'function' => 'deactivateDictionaryDefinition',
        'description' => 'deactivates a dictionary Definition',
        'options' => ['adminOnly' => true]
    ], [
        'method' => 'put',
        'route' => '/dictionary/definition/{id}/repair',
        'class' => SpiceDictionaryDefinitionsController::class,
        'function' => 'repairDictionaryDefinition',
        'description' => 'repairs a dictionary Definition',
        'options' => ['adminOnly' => true]
    ],
    // for the items
    [
        'method' => 'post',
        'route' => '/dictionary/item/{id}',
        'class' => SpiceDictionaryItemsController::class,
        'function' => 'postDictionaryItem',
        'description' => 'posts a dictionary Item',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/items',
        'class' => SpiceDictionaryItemsController::class,
        'function' => 'postDictionaryItems',
        'description' => 'posts a group dictionary Items',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/items/sequence',
        'class' => SpiceDictionaryItemsController::class,
        'function' => 'postDictionaryItemsSequence',
        'description' => 'reshuffles the items',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'delete',
        'route' => '/dictionary/item/{id}',
        'class' => SpiceDictionaryItemsController::class,
        'function' => 'deleteDictionaryItem',
        'description' => 'posts a dictionary Index',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/item/{id}/activate',
        'class' => SpiceDictionaryItemsController::class,
        'function' => 'activateDictionaryItem',
        'description' => 'posts a dictionary Index',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'delete',
        'route' => '/dictionary/item/{id}/activate',
        'class' => SpiceDictionaryItemsController::class,
        'function' => 'deactivateDictionaryItem',
        'description' => 'posts a dictionary Index',
        'options' => ['adminOnly' => true]
    ],
    // for the indexes
    [
        'method' => 'post',
        'route' => '/dictionary/index/{id}',
        'class' => SpiceDictionaryIndexesController::class,
        'function' => 'postDictionaryIndex',
        'description' => 'posts a dictionary Index',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'delete',
        'route' => '/dictionary/index/{id}',
        'class' => SpiceDictionaryIndexesController::class,
        'function' => 'deleteDictionaryIndex',
        'description' => 'posts a dictionary Index',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/index/{id}/activate',
        'class' => SpiceDictionaryIndexesController::class,
        'function' => 'activateDictionaryIndex',
        'description' => 'activates a dictionary Index',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'delete',
        'route' => '/dictionary/index/{id}/activate',
        'class' => SpiceDictionaryIndexesController::class,
        'function' => 'dropDictionaryIndex',
        'description' => 'drops a dictionary Index',
        'options' => ['adminOnly' => true]
    ],
    // for the relationships
    [
        'method' => 'post',
        'route' => '/dictionary/relationship/{id}',
        'class' => SpiceDictionaryRelationshipsController::class,
        'function' => 'postDictionaryRelationship',
        'description' => 'posts a Relationship',
        'options' => ['adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/dictionary/relationship/{id}',
        'class' => SpiceDictionaryRelationshipsController::class,
        'function' => 'deleteDictionaryRelationship',
        'description' => 'deletes a Relationship',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/dictionary/relationship/{id}/activate',
        'class' => SpiceDictionaryRelationshipsController::class,
        'function' => 'activate',
        'description' => 'activates a Relationship',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'delete',
        'route' => '/dictionary/relationship/{id}/activate',
        'class' => SpiceDictionaryRelationshipsController::class,
        'function' => 'deactivate',
        'description' => 'deactivates  relationshipü',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('dictionary', '1.0', [], $routes);
