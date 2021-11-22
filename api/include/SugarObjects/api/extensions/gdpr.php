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
use SpiceCRM\includes\SugarObjects\api\controllers\GdprController;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/gdpr/{module}/{id}',
        'oldroute'    => '/gdpr/{module}/{id}',
        'class'       => GdprController::class,
        'function'    => 'getGdprReleases',
        'description' => 'Get the GDPR Releases.',
        'options'     => ['noAuth' => false, 'adminOnly' => false]
    ], [
        'method'      => 'get',
        'route'       => '/common/gdpr/portalGDPRconsentText',
        'oldroute'    => '/gdpr/portalGDPRconsentText',
        'class'       => GdprController::class,
        'function'    => 'getPortalGDPRconsentText',
        'description' => 'Get the consent text that the user has agreed to.',
        'options'     => ['noAuth' => false, 'adminOnly' => false]
    ],[
        'method'      => 'post',
        'route'       => '/common/gdpr/portalGDPRconsent',
        'oldroute'    => '/gdpr/portalGDPRconsent',
        'class'       => GdprController::class,
        'function'    => 'setPortalGDPRconsent',
        'description' => 'Set the GDPR consent of the user and save the consent text the user has agreed.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'consentText'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The consent text that the user has agreed to.',
            ]
        ]
    ],
];

/**
 * register the Extension and register the routes
 */
RESTManager::getInstance()->registerExtension('gdpr', '2.0', [], $routes );
