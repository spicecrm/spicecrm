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
use SpiceCRM\includes\SpiceUI\api\controllers\ConfigTransferController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/configuration/transfer/tablenames',
        'class'       => ConfigTransferController::class,
        'function'    => 'getSelectableTablenames',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/transfer/export',
        'class'       => ConfigTransferController::class,
        'function'    => 'exportFromTables',
        'description' => 'Export configuration data from the tables.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'selectedTables' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'List of the names of the tables to export.'
            ],
            'additionalTables' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'description' => 'List of names of additional tables to export. A comma separated string.'
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/configuration/transfer/import',
        'class'       => ConfigTransferController::class,
        'function'    => 'importToTables',
        'description' => 'Import configuration data to the tables.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'ignoreUnknownTables' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'description' => 'Ignore table data for tables that are unknown in the CRM.'
            ],
            'file' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_BASE64,
                'description' => 'The configuration data to import, from the exported file.'
            ]
        ]
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('configtransfer', '2.0', [], $routes);