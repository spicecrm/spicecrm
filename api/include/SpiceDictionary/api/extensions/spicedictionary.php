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
        ]
    ],

];

/**
 * register the Extension
 */
$RESTManager->registerExtension('dictionary', '1.0', [], $routes);
