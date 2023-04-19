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
/** @deprecated
 * new Module at HCMTrainings
 */
SpiceDictionaryHandler::getInstance()->dictionary['Qualification'] = [
    'table' => 'qualifications',
    'audited' => false,
    'fields' => [
        'qualification_type' => [
            'name' => 'qualification_type',
            'type' => 'enum',
            'vname' => 'LBL_TYPE',
            'options' => 'qualification_type_dom'
        ],
        'sub_type' => [
            'name' => 'sub_type',
            'type' => 'enum',
            'vname' => 'LBL_TYPE',
            'options' => 'qualification_sub_type_dom'
        ],
        'bean_qualification_start_date' => [
            'name' => 'qualification_start_date',
            'vname' => 'LBL_VALID_FROM',
            'type' => 'date',
            'source' => 'non-db'
        ],
        'bean_qualification_end_date' => [
            'name' => 'qualification_end_date',
            'vname' => 'LBL_VALID_UNTIL',
            'type' => 'date',
            'source' => 'non-db'
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'users_qualifications',
            'rname' => 'user_name',
            'source' => 'non-db',
            'module' => 'Users'
        ],

    ],
    'indices' => [],
    'relationships' => []
];

VardefManager::createVardef('Qualifications', 'Qualification', array('default', 'assignable'));
