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


use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['SpiceACLProfile'] = [
    'table' => 'spiceaclprofiles',
    'fields' => [
        'status' => [
            'name' => 'status',
            'type' => 'enum',
            'len' => 1,
            'options' => 'kauthprofiles_status'
        ],
        'users' =>    [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'spiceaclprofiles_users',
            'source' => 'non-db',
            'module' => 'Users',
            'vname' => 'LBL_USERS',
        ],
        'orgunits' =>    [
            'name' => 'orgunits',
            'type' => 'link',
            'relationship' => 'spiceaclprofiles_orgunits',
            'source' => 'non-db',
            'module' => 'OrgUnits',
            'vname' => 'LBL_ORGUNITS',
        ],
        'for_portal_users' => [
            'name' => 'for_portal_users',
            'vname' => 'LBL_FOR_PORTAL_USERS',
            'type' => 'bool',
            'default' => '0',
            'comment' => 'ACL profile is intended for portal users.'
        ]
    ],
    'indices' => [
    ]
];

VardefManager::createVardef('SpiceACLProfiles', 'SpiceACLProfile', ['default']);
