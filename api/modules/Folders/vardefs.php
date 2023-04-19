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

SpiceDictionaryHandler::getInstance()->dictionary['Folder'] = [
    'table' => 'folders',
    'audited' => false,
    'fields' => [
        'module' => [
            'name'      => 'module',
            'type'      => 'varchar',
            'vname'     => 'LBL_MODULE',
            'required'  => true
        ],
        'parent_name' => [
            'name'       => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'type'       => 'parent',
            'vname'      => 'LBL_RELATED_TO',
            'reportable' => false,
            'source'     => 'non-db',
        ],
        'parent_type' => [
            'name'       => 'parent_type',
            'type'       => 'varchar',
            'reportable' => false,
            'len'        => 100,
            'comment'    => 'Identifier of Sugar module to which this email is associated (deprecated as of 4.2)',
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'type'       => 'id',
            'len'        => '36',
            'reportable' => false,
            'comment'    => 'ID of Sugar object referenced by parent_type (deprecated as of 4.2)',
        ],
        'parent_folder' => [
            'name' => 'parent_folder',
            'type' => 'link',
            'relationship' => 'folders_folders',
            'source' => 'non-db',
            'module' => 'Folders',
            'vname' => 'LBL_PARENT_FOLDER',
            'link_type' => 'one',
            'side' => 'right',
        ],
        'child_folders' => [
            'name' => 'child_folders',
            'type' => 'link',
            'relationship' => 'folders_folders',
            'source' => 'non-db',
            'module' => 'Folders',
            'vname' => 'LBL_CHILD_FOLDERS',
        ],
        'documents' => [
            'name' => 'documents',
            'type' => 'link',
            'relationship' => 'documents_folders',
            'source' => 'non-db',
            'module' => 'Documents',
            'vname' => 'LBL_DOCUMENTS',
        ]
    ],
    'relationships' => [
        'documents_folders' => [
            'lhs_module' => 'Folders',
            'lhs_table' => 'folders',
            'lhs_key' => 'id',
            'rhs_module' => 'Documents',
            'rhs_table' => 'documents',
            'rhs_key' => 'folder_id',
            'relationship_type' => 'one-to-many'
        ],
        'folders_folders' => [
            'lhs_module' => 'Folders',
            'lhs_table' => 'folders',
            'lhs_key' => 'id',
            'rhs_module' => 'Folders',
            'rhs_table' => 'folders',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ]
    ]
];

VardefManager::createVardef('Folders', 'Folder', ['default', 'assignable']);
