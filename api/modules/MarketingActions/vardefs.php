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

SpiceDictionaryHandler::getInstance()->dictionary['MarketingAction'] = [
    'table' => 'marketingactions',
    'comment' => 'marketing actions applicable to email templates',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'id' =>
            [
                'name' => 'id',
                'vname' => 'LBL_ID',
                'type' => 'id',
                'required' => true,
            ],
        'name' =>
            [
                'name' => 'name',
                'vname' => 'LBL_NAME',
                'type' => 'varchar',
                'len' => 255,
            ],
        'date_entered' =>
            [
                'name' => 'date_entered',
                'vname' => 'LBL_DATE_ENTERED',
                'type' => 'datetime',
            ],
        'date_modified' =>
            [
                'name' => 'date_modified',
                'vname' => 'LBL_DATE_MODIFIED',
                'type' => 'datetime',
            ],
        'redirect_url' =>
            [
                'name' => 'redirect_url',
                'vname' => 'LBL_REDIRECT_URL',
                'type' => 'varchar',
            ],
        'redirect_type' =>
            [
                'name' => 'redirect_type',
                'vname' => 'LBL_REDIRECT_TYPE',
                'type' => 'varchar',
                'len' => 16,
                'default' => 'url',
            ],
        'deleted' =>
            [
                'name' => 'deleted',
                'vname' => 'LBL_DELETED',
                'type' => 'bool',
            ],
    ],
    'relationships' => [],
    'indices' => [
        ['name' => 'marketingactionspk', 'type' => 'primary', 'fields' => ['id']]
    ],

];

VardefManager::createVardef('MarketingActions', 'MarketingAction', []);