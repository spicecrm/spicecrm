<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Document'] = ['table' => 'documents',
    'audited' => true,
    'fields' => [
        'file_name' => [
            'name' => 'file_name',
            'vname' => 'LBL_FILENAME',
            'type' => 'file',
            'dbType' => 'varchar',
            'len' => '255'
        ],
        'file_ext' => [
            'name' => 'file_ext',
            'vname' => 'LBL_FILE_EXTENSION',
            'type' => 'varchar',
            'len' => 100,
        ],
        'file_mime_type' => [
            'name' => 'file_mime_type',
            'vname' => 'LBL_MIME',
            'type' => 'varchar',
            'len' => '100',
        ],
        'file_md5' => [
            'name' => 'file_md5',
            'vname' => 'LBL_FILE_MD5',
            'type' => 'char',
            'len' => '32',
        ],
        'revision' => [
            'name' => 'revision',
            'vname' => 'LBL_REVISION',
            'type' => 'int',
            'len' => 5
        ],
        'revision_date' => [
            'name' => 'revision_date',
            'vname' => 'LBL_REVISION_DATE',
            'type' => 'datetime'
        ],
        'active_date' => [
            'name' => 'active_date',
            'vname' => 'LBL_ACTIVE_DATE',
            'type' => 'date',
        ],
        'exp_date' => [
            'name' => 'exp_date',
            'vname' => 'LBL_EXP_DATE',
            'type' => 'date',
        ],
        'category_id' => [
            'name' => 'category_id',
            'vname' => 'LBL_CATEGORY',
            'type' => 'enum',
            'len' => 100,
            'options' => 'document_category_dom',
            'reportable' => true,
        ],
        'subcategory_id' => [
            'name' => 'subcategory_id',
            'vname' => 'LBL_SUBCATEGORY',
            'type' => 'enum',
            'len' => 100,
            'options' => 'document_subcategory_dom',
            'reportable' => true,
        ],
        'status_id' => [
            'name' => 'status_id',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'len' => 100,
            'options' => 'document_status_dom',
            'reportable' => false,
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'varchar',
            'source' => 'non-db',
            'comment' => 'Document status for Meta-Data framework',
        ],
        'document_revision_id' => [
            'name' => 'document_revision_id',
            'vname' => 'LBL_LATEST_REVISION_ID',
            'type' => 'varchar',
            'len' => '36',
            'reportable' => false,
        ],
        'revisions' => [
            'name' => 'revisions',
            'type' => 'link',
            'relationship' => 'document_revisions',
            'source' => 'non-db',
            'vname' => 'LBL_REVISIONS',
        ],
        'documentrevisions' => [
            'name' => 'documentrevisions',
            'type' => 'link',
            'relationship' => 'document_revisions',
            'source' => 'non-db',
            'module' => 'DocumentRevisions',
            'side' => 'left',
            'vname' => 'LBL_REVISIONS',
        ],
        'contracts' => [
            'name' => 'contracts',
            'type' => 'link',
            'relationship' => 'contracts_documents',
            'source' => 'non-db',
            'vname' => 'LBL_CONTRACTS',
        ],
        //todo remove
        'leads' => [
            'name' => 'leads',
            'type' => 'link',
            'relationship' => 'leads_documents',
            'source' => 'non-db',
            'vname' => 'LBL_LEADS',
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'documents_accounts',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS_SUBPANEL_TITLE',
        ],
        'contacts' => [
            'name' => 'contacts',
            'type' => 'link',
            'relationship' => 'documents_contacts',
            'source' => 'non-db',
            'vname' => 'LBL_CONTACTS_SUBPANEL_TITLE',
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'documents_opportunities',
            'source' => 'non-db',
            'vname' => 'LBL_OPPORTUNITIES_SUBPANEL_TITLE',
        ],
        'projects' => [
            'name' => 'projects',
            'type' => 'link',
            'relationship' => 'documents_projects',
            'source' => 'non-db',
            'module' => 'Projects',
            'vname' => 'LBL_PROJECTS',
        ],
        'related_doc_id' => [
            'name' => 'related_doc_id',
            'vname' => 'LBL_RELATED_DOCUMENT_ID',
            'reportable' => false,
            'dbType' => 'id',
            'type' => 'varchar',
            'len' => '36',
        ],
        'related_doc_name' => [
            'name' => 'related_doc_name',
            'vname' => 'LBL_DET_RELATED_DOCUMENT',
            'type' => 'relate',
            'table' => 'documents',
            'id_name' => 'related_doc_id',
            'module' => 'Documents',
            'source' => 'non-db',
            'comment' => 'The related document name for Meta-Data framework',
        ],
        'related_doc_rev_id' => [
            'name' => 'related_doc_rev_id',
            'vname' => 'LBL_RELATED_DOCUMENT_REVISION_ID',
            'reportable' => false,
            'dbType' => 'id',
            'type' => 'varchar',
            'len' => '36',
        ],
        'related_doc_rev_number' => [
            'name' => 'related_doc_rev_number',
            'vname' => 'LBL_DET_RELATED_DOCUMENT_VERSION',
            'type' => 'varchar',
            'source' => 'non-db',
            'comment' => 'The related document version number for Meta-Data framework',
        ],
        'is_template' => [
            'name' => 'is_template',
            'vname' => 'LBL_IS_TEMPLATE',
            'type' => 'bool',
            'default' => 0,
            'reportable' => false,
        ],
        'template_type' => [
            'name' => 'template_type',
            'vname' => 'LBL_TEMPLATE_TYPE',
            'type' => 'enum',
            'len' => 100,
            'options' => 'document_template_type_dom',
            'reportable' => false,
        ],
        'latest_revision_name' => [
            'name' => 'latest_revision_name',
            'vname' => 'LBL_LASTEST_REVISION_NAME',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'selected_revision_name' => [
            'name' => 'selected_revision_name',
            'vname' => 'LBL_SELECTED_REVISION_NAME',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'contract_status' => [
            'name' => 'contract_status',
            'vname' => 'LBL_CONTRACT_STATUS',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'contract_name' => [
            'name' => 'contract_name',
            'vname' => 'LBL_CONTRACT_NAME',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'linked_id' => [
            'name' => 'linked_id',
            'vname' => 'LBL_LINKED_ID',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'selected_revision_id' => [
            'name' => 'selected_revision_id',
            'vname' => 'LBL_SELECTED_REVISION_ID',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'latest_revision_id' => [
            'name' => 'latest_revision_id',
            'vname' => 'LBL_LATEST_REVISION_ID',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'selected_revision_filename' => [
            'name' => 'selected_revision_filename',
            'vname' => 'LBL_SELECTED_REVISION_FILENAME',
            'type' => 'varchar',
            'reportable' => false,
            'source' => 'non-db'
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_PARENT_ID',
            'type'       => 'id'
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'options'  => 'parent_type_display',
            'len'      => 255,
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'source'      => 'non-db'
        ],
        'folder_id' => [
            'name'       => 'folder_id',
            'vname'      => 'LBL_FOLDER_ID',
            'type'       => 'id'
        ],
        'folder' => [
            'name' => 'folder',
            'type' => 'link',
            'relationship' => 'documents_folders',
            'source' => 'non-db',
            'module' => 'Folders',
            'vname' => 'LBL_FOLDERS',]

    ],
    'indices' => [
        ['name' => 'idx_doc_cat', 'type' => 'index', 'fields' => ['category_id', 'subcategory_id']],
    ],
    'relationships' => [
        'document_revisions' => [
            'lhs_module' => 'Documents',
            'lhs_table' => 'documents',
            'lhs_key' => 'id',
            'rhs_module' => 'DocumentRevisions',
            'rhs_table' => 'document_revisions',
            'rhs_key' => 'document_id',
            'relationship_type' => 'one-to-many'
        ],
        'documents_modified_user' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Documents',
            'rhs_table' => 'documents',
            'rhs_key' => 'modified_user_id',
            'relationship_type' => 'one-to-many'
        ],
        'documents_created_by' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Documents',
            'rhs_table' => 'documents',
            'rhs_key' => 'created_by',
            'relationship_type' => 'one-to-many'
        ]
    ]
];

VardefManager::createVardef('Documents', 'Document', ['default', 'assignable']);
