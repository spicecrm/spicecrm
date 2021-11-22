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
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('syslanguages', '1.0', [], $routes);
