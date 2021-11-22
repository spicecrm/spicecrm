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
use SpiceCRM\modules\ProductGroups\api\controllers\ProductGroupsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'oldroute'       => '/productgroups/tree',
        'route'       => '/module/ProductGroups/tree',
        'class'       => ProductGroupsController::class,
        'function'    => 'getTreeNodes',
        'description' => 'load report categories for the ui loadtasks',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
        ]
    ],
    [
        'method'      => 'get',
        'oldroute'       => '/productgroups/tree/{nodeid}',
        'route'       => '/module/ProductGroups/tree/{nodeid}',
        'class'       => ProductGroupsController::class,
        'function'    => 'getTreeNodes',
        'description' => 'load report categories for the ui loadtasks',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'nodeid' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'example' => '40109eab-ddc0-01fb-3a85-b3f3f87cfa1c'
            ],
        ]
    ],
    /*
    [
        'method'      => 'get',
        'route'       => '/productgroups/{id}/productattributes',
        'class'       => ProductGroupsController::class,
        'function'    => 'ProductWriteValidation',
        'description' => 'links validation values to a product',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
    */
    [
        'method'      => 'get',
        'oldroute'    => '/productgroups/{id}/productattributes/direct',
        'route'       => '/module/ProductGroups/{id}/ProductAttributes/direct',
        'class'       => ProductGroupsController::class,
        'function'    => 'ProductGetRelatedAttributes',
        'description' => 'get the related attributes of a product',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'ID of the ProductGroup',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'example' => '40109eab-ddc0-01fb-3a85-b3f3f87cfa1c'
            ],
            'searchparams' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'required' => false,
                'example' => true
            ],
            'validations' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'required' => false,
                'example' => false
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/ProductGroups/{id}/products',
        'oldroute'    => '/module/ProductGroups/{id}/Products',
        'class'       => ProductGroupsController::class,
        'function'    => 'getProducts',
        'description' => 'get the products ',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the ProductGroup',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/ProductGroups/{id}/productattributes/textgenerator',
        'class'       => ProductGroupsController::class,
        'function'    => 'productParseTextDataType',
        'description' => 'changes text datatypes to another',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the ProductGroup',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/ProductGroups/{id}/productattributes/textgenerator',
        'class'       => ProductGroupsController::class,
        'function'    => 'productWriteTextProductBody',
        'description' => 'writes a textbody in the database',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the ProductGroup',
            ],
            ''   => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'required'    => true,
                'description' => 'An array of records',
                'subtype'     => [
                    'id'           => [
                        'type'        => ValidationMiddleware::TYPE_GUID,
                        'required'    => true,
                        'description' => 'GUID of the product attribute',
                    ],
                    'contentcode'  => [
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'description' => 'Content code',
                    ],
                    'contentcode2' => [
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'description' => 'Content code 2',
                    ],
                    'contentprefix'  => [
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'description' => 'Content prefix',
                    ],
                ],
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/ProductGroups/{id}/productattributes/longtextgenerator',
        'oldroute'    => '/module/ProductGroups/{id}/productattributes/longtextgenerator',
        'class'       => ProductGroupsController::class,
        'function'    => 'productParseLongTextDataType',
        'description' => 'changes datatypes to another',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the ProductGroup',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/ProductGroups/{id}/productattributes/longtextgenerator',
        'class'       => ProductGroupsController::class,
        'function'    => 'productWriteLongTextProductBody',
        'description' => 'inserts a new body in the database',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the ProductGroup',
            ],
            ''   => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'required'    => true,
                'description' => 'An array of records',
                'subtype'     => [
                    'id'           => [
                        'type'        => ValidationMiddleware::TYPE_GUID,
                        'required'    => true,
                        'description' => 'GUID of the product attribute',
                    ],
                    'contentcode'  => [
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'description' => 'Content code',
                    ],
                    'contentcode2' => [
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'description' => 'Content code 2',
                    ],
                    'textpattern'  => [
                        'type'        => ValidationMiddleware::TYPE_STRING,
                        'required'    => true,
                        'description' => 'Text pattern',
                    ],
                    'sequence'     => [
                        'type'        => ValidationMiddleware::TYPE_NUMERIC,
                        'required'    => true,
                        'description' => 'Sequence',
                    ],
                ],
            ],
        ],
    ],

];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('productgroups', '2.0', [], $routes);
