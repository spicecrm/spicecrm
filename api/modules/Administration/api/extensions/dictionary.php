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


use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Administration\api\controllers\DictionaryController;

$routes = [
    [
        'method' => 'get',
        'route' => '/admin/repair/cachedb',
        'class' => DictionaryController::class,
        'function' => 'repairCacheDb',
        'description' => 'save all vardefs to sysdictionaryfields table and relationships to relationships table',
        'options' => ['adminOnly' => true, 'validate' => true],
    ],
    [
        'method' => 'post',
        'route' => '/admin/repair/dictionary',
        'class' => DictionaryController::class,
        'function' => 'repairDictionary',
        'description' => 'repaire database, cache and relationships for specific dictionaries',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'dictionaries' => [
                'in' => 'body',
                'description' => 'an array containing dictionary names',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'required' => false
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/admin/repair/custom/enum',
        'class' => DictionaryController::class,
        'function' => 'repairCustomEnum',
        'description' => 'save all vardefs to sysdictionaryfields table and relationships to relationships table',
        'options' => ['adminOnly' => true, 'validate' => true],
    ],
//    [
//        'method' => 'get',
//        'route' => '/admin/dictionary/links',
//        'class' => DictionaryController::class,
//        'function' => 'checkLinks',
//        'description' => 'save all vardefs to sysdictionaryfields table and relationships to relationships table',
//        'options' => ['adminOnly' => true, 'validate' => false],
//    ]
];

/**
 * get a Rest Manager Instance
 */
RESTManager::getInstance()->registerExtension('dictionary', '2.0', [], $routes);