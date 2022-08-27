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

SpiceDictionaryHandler::getInstance()->dictionary['SpiceACLObject'] = [
    'table' => 'spiceaclobjects',
    'fields' => [
        'sysmodule_id' => [
            'name' => 'sysmodule_id',
            'vname' => 'LBL_SYSMODULE_ID',
            'required' => true,
            'type' => 'varchar',
            'len' => 60
        ],
        'spiceacltype_module' => [
            'name' => 'spiceacltype_module',
            'type' => 'varchar',
            'len' => 60,
            'source' => 'non-db'
        ],
        'spiceaclobjecttype' => [
            'name' => 'spiceaclobjecttype',
            'vname' => 'LBL_SPICEACLOBJECTTYPE',
            'type' => 'enum',
            'len' => 1,
            'options' => 'spiceaclobjects_types_dom'
        ],
        'description' => [
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'text'],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'len' => 1,
            'options' => 'kauthprofiles_status'],
        'spiceaclorgassignment' => [
            'name' => 'spiceaclorgassignment',
            'vname' => 'LBL_SPICEACLORGASSIGNMENT',
            'type' => 'varchar',
            'len' => 2
        ],
        'spiceaclowner' => [
            'name' => 'spiceaclowner',
            'vname' => 'LBL_SPICEACLOWNER',
            'type' => 'bool',
            'default' => false
        ],
        'spiceaclcreator' => [
            'name' => 'spiceaclcreator',
            'vname' => 'LBL_SPICEACLCREATOR',
            'type' => 'bool',
            'default' => false
        ],
        'spiceaclorgunit' => [
            'name' => 'spiceaclorgunit',
            'vname' => 'LBL_SPICEACLORGUNIT',
            'type' => 'bool',
            'default' => false
        ],
        'allorgobjects' => [
            'name' => 'allorgobjects',
            'vname' => 'LBL_ALLORGOBJECTS',
            'type' => 'bool',
            'default' => false
        ],
        'activity' => [
            'name' => 'activity',
            'vname' => 'LBL_ACTIVITY',
            'type' => 'varchar',
            'len' => 36],
        'customsql' => [
            'name' => 'customsql',
            'vname' => 'LBL_CUSTOMSQL',
            'type' => 'base64',
            'dbType' => 'text'
        ],
        'fieldvalues' => [
            'name' => 'fieldvalues',
            'type' => 'json',
            'source' => 'non-db'
        ],
        'fieldcontrols' => [
            'name' => 'fieldcontrols',
            'type' => 'json',
            'source' => 'non-db'
        ],
        'objectactions' => [
            'name' => 'objectactions',
            'type' => 'json',
            'source' => 'non-db'
        ],
        'territoryelementvalues' => [
            'name' => 'territoryelementvalues',
            'type' => 'json',
            'source' => 'non-db'
        ]
    ]
];

VardefManager::createVardef('SpiceACLObjects', 'SpiceACLObject', ['default']);
