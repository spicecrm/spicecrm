<?php
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceSwagger\api\controllers\ExampleController;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceSwagger\api\middleware\CustomMiddleware;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/example/size/{exampleString}',
        'oldroute'    => '/example/size/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'sizeExample',
        'description' => 'An example endpoint to highlight min and max string size validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'                => 'path',
                'default'           => 2432, // todo add to swagger spec
                'description'       => 'Just an example string',
                'type'              => ValidationMiddleware::TYPE_STRING,
                'example'           => 'Lorem ipsum',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_MIN_SIZE => 5,
                    ValidationMiddleware::VOPT_MAX_SIZE => 15,
                ],
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/enum/{exampleString}',
        'oldroute'    => '/example/enum/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'enumExample',
        'description' => 'An example endpoint to highlight enum validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'          => 'path',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => 'salutation',
//                'options'     => ['lorem', 'ipsum', 'dolor', 'sit', 'amet'],
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/guid/{exampleString}',
        'oldroute'    => '/example/guid/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'guidExample',
        'description' => 'An example endpoint to highlight guid validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'          => 'path', // path, query, body
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'example'     => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/regex/{exampleString}',
        'oldroute'    => '/example/regex/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'regexExample',
        'summary'     => 'An example endpoint to highlight regex validation.',
        'description' => 'An endpoint to highlight regex validation using a letter only regex as an example.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'                => 'path',
                'description'       => 'Just an example string',
                'type'              => ValidationMiddleware::TYPE_STRING,
                'example'           => 'LoremIpsum',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '/^[A-Za-z]+$/',
                ],
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/inverseRegex/{exampleString}',
        'oldroute'    => '/example/inverseRegex/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'inverseRegexExample',
        'summary'     => 'An example endpoint to highlight inverse regex validation.',
        'description' => 'An endpoint to highlight inverse regex validation using a letter only regex as an example. Only strings that are not exclusively letters should pass.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'                => 'path',
                'description'       => 'Just an example string',
                'type'              => ValidationMiddleware::TYPE_STRING,
                'example'           => 'Lorem Ipsum 1',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_INVERSE_REGEX => '/^[A-Za-z]+$/',
                ],
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/function/{exampleString}',
        'oldroute'    => '/example/function/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'functionExample',
        'summary'     => 'An example endpoint to highlight function validation.',
        'description' => 'An endpoint to highlight a validation that uses a specific function. To pass validation',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'                => 'path',
                'description'       => 'Just an example string',
                'type'              => ValidationMiddleware::TYPE_STRING,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_FUNCTION => [
                        // todo string with the full namespace :: function name
                        'class'  => SpiceUtils::class,
                        'method' => 'exampleValidationRule',
                    ],
                ],
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/numeric/{exampleString}',
        'oldroute'    => '/example/numeric/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'numericExample',
        'summary'     => 'An example endpoint to highlight numeric validation.',
        'description' => 'An endpoint to highlight numeric validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'          => 'path',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                // todo add min max value
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/alphanumeric/{exampleString}',
        'oldroute'    => '/example/alphanumeric/{exampleString}',
        'class'       => ExampleController::class,
        'function'    => 'alphanumericExample',
        'summary'     => 'An example endpoint to highlight alphanumeric validation.',
        'description' => 'An endpoint to highlight alphanumeric validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'exampleString'    => [
                'in'          => 'path',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_ALPHANUMERIC,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/email',
        'oldroute'    => '/example/email',
        'class'       => ExampleController::class,
        'function'    => 'emailExample',
        'summary'     => 'An example endpoint to highlight email validation.',
        'description' => 'An endpoint to highlight email validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'email'    => [
                'in'          => 'body',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_EMAIL,
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/example/json/{payload}',
        'oldroute'    => '/example/json/{payload}',
        'class'       => ExampleController::class,
        'function'    => 'jsonExample',
        'summary'     => 'An example endpoint to highlight json validation.',
        'description' => 'An endpoint to highlight json validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'payload'    => [
                'in'          => 'path',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_JSON,
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/base64',
        'oldroute'    => '/example/base64',
        'class'       => ExampleController::class,
        'function'    => 'base64Example',
        'summary'     => 'An example endpoint to highlight base64 validation.',
        'description' => 'An endpoint to highlight base64 validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'payload'    => [
                'in'          => 'body',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_BASE64,
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/datetime',
        'oldroute'    => '/example/datetime',
        'class'       => ExampleController::class,
        'function'    => 'datetimeExample',
        'summary'     => 'An example endpoint to highlight datetime validation.',
        'description' => 'An endpoint to highlight datetime validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'datetime'    => [
                'in'          => 'body',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/date',
        'oldroute'    => '/example/date',
        'class'       => ExampleController::class,
        'function'    => 'dateExample',
        'summary'     => 'An example endpoint to highlight date validation.',
        'description' => 'An endpoint to highlight date validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'date'    => [
                'in'          => 'body',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_DATE,
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/module',
        'oldroute'    => '/example/module',
        'class'       => ExampleController::class,
        'function'    => 'moduleExample',
        'summary'     => 'An example endpoint to highlight module validation.',
        'description' => 'An endpoint to highlight module validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'module'    => [
                'in'          => 'body',
                'description' => 'Just an example string',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/array',
        'oldroute'    => '/example/array',
        'class'       => ExampleController::class,
        'function'    => 'arrayExample',
        'summary'     => 'An example endpoint to highlight array validation.',
        'description' => 'An endpoint to highlight array validation. The input array should only contain numeric value to pass the validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'data'    => [
                'in'          => 'body',
                'description' => 'Just an example array',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/complex',
        'oldroute'    => '/example/complex',
        'class'       => ExampleController::class,
        'function'    => 'complexExample',
        'summary'     => 'An example endpoint to highlight complex structure validation.',
        'description' => 'An endpoint to highlight complex structure validation.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'complexData'    => [
                'in'          => 'body',
                'description' => 'Just an example array',
                'type'        => ValidationMiddleware::TYPE_OBJECT,
                'required'    => true,
                'parameters'  => [
                    'id'           => [
                        'description' => 'ID',
                        'type'        => ValidationMiddleware::TYPE_GUID,
                        'required'    => true,
                    ],
                    'name'         => [
                        'description' => 'name',
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'validationOptions' => [
                            ValidationMiddleware::VOPT_MAX_SIZE => 8,
                        ],
                    ],
                    'email'        => [
                        'description' => 'email address',
                        'type'        => ValidationMiddleware::TYPE_EMAIL,
                        'required'    => false,
                    ],
                    'module_list'        => [
                        'description' => 'a list of modules',
                        'type'        => ValidationMiddleware::TYPE_ARRAY,
                        'subtype'     => ValidationMiddleware::TYPE_MODULE,
                        'required'    => true,
                    ],
                    'date_created' => [
                        'description' => 'creation date',
                        'type'        => ValidationMiddleware::TYPE_DATETIME,
                        'required'    => true,
                    ],
                    'deleted'      => [
                        'description' => 'deleted flag',
                        'type'        => ValidationMiddleware::TYPE_BOOL,
                        'required'    => true,
                    ],
                ],
            ],
        ],
    ],

    [
        'method'      => 'post',
        'route'       => '/common/example/arrayWithParameters',
        'class'       => ExampleController::class,
        'function'    => 'arrayWithParametersExample',
        'description' => 'Example for arrays with a more complex structure',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beans' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => [
                    'type'       => ValidationMiddleware::TYPE_OBJECT,
                    'parameters' => [
                        'id'     => [
                            'type'        => ValidationMiddleware::TYPE_GUID,
                            'required'    => true,
                            'description' => 'GUID of the bean',
                        ],
                        'module' => [
                            'type'        => ValidationMiddleware::TYPE_MODULE,
                            'required'    => true,
                            'description' => 'Module name of the bean',
                        ],
                    ]
                ],
                'required'    => true,
                'description' => 'An array with bean ID and module data',
            ],
        ],
    ],

    [
        'method'      => 'post',
        'route'       => '/common/example/anonymousArray',
        'class'       => ExampleController::class,
        'function'    => 'anonymousArray',
        'description' => 'Example for anonymous arrays',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'An array with module names',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/example/customMiddleware',
        'class'       => ExampleController::class,
        'function'    => 'customMiddleware',
        'description' => 'Example for custom middleware',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true, 'middleware' => [CustomMiddleware::class]],
        'parameters'  => [
            'data'    => [
                'in'          => 'body',
                'description' => 'Just an example array',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true,
            ],
        ],
    ],
];

/**
 * register the extension
 */
$RESTManager->registerExtension(
    'example',
    '1.0',
    [],
    $routes
);
