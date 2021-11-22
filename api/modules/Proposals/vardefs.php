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

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Proposal'] = [
    'table' => 'proposals',
    'comment' => 'Proposals Module',
    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '32',
            'required' => true,
            'massupdate' => false,
            'comment' => 'proposal number'
        ],
        'proposalstatus' => [
            'name' => 'proposalstatus',
            'type' => 'enum',
            'options' => 'proposalstatus_dom',
            'len' => '16',
            'vname' => 'LBL_STATUS',
            'massupdate' => false,
            'comment' => 'Status: draft|submitted|accepted|rejected'
        ],
        'amount' => [
            'name' => 'amount',
            'vname' => 'LBL_AMOUNT',
            'type' => 'currency',
            'dbType' => 'double',
            'importable' => 'required',
            'duplicate_merge' => '1',
            'required' => true,
            'options' => 'numeric_range_search_dom',
            'enable_range_search' => true,
            'comment' => 'Unconverted amount of the opportunity',
        ],
        'currency_id' => [
            'name' => 'currency_id',
            'type' => 'id',
            'group' => 'currency_id',
            'vname' => 'LBL_CURRENCY',
            'reportable' => false,
            'comment' => 'Currency used for display purposes'
        ],
        'currency_name' => [
            'name' => 'currency_name',
            'rname' => 'name',
            'id_name' => 'currency_id',
            'vname' => 'LBL_CURRENCY_NAME',
            'type' => 'relate',
            'isnull' => 'true',
            'table' => 'currencies',
            'module' => 'Currencies',
            'source' => 'non-db',
            'function' => ['name' => 'getCurrencyNameDropDown', 'returns' => 'html'],
            'studio' => 'false',
            'duplicate_merge' => 'disabled',
        ],
        'currency_symbol' => [
            'name' => 'currency_symbol',
            'rname' => 'symbol',
            'id_name' => 'currency_id',
            'vname' => 'LBL_CURRENCY_SYMBOL',
            'type' => 'relate',
            'isnull' => 'true',
            'table' => 'currencies',
            'module' => 'Currencies',
            'source' => 'non-db',
            'function' => ['name' => 'getCurrencySymbolDropDown', 'returns' => 'html'],
            'studio' => 'false',
            'duplicate_merge' => 'disabled',
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
            'group' => 'parent_fields'
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'group' => 'parent_fields',
            'options' => 'parent_type_display',
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'vname' => 'LBL_RELATED_TO',
            'parent_type' => 'record_type_display',
            'type_name' => 'parent_type',
            'id_name' => 'parent_id',
            'type' => 'parent',
            'group' => 'parent_fields',
            'source' => 'non-db',
            'options' => 'parent_type_display',
        ],
        'accounts' => [
            'name' => 'accounts',
			'vname' => 'LBL_ACCOUNTS_LINK',
            'type' => 'link',
            'relationship' => 'accounts_proposals_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'vname' => 'LBL_OPPORTUNITY_ID',
            'type' => 'id',
            'reportable' => false,
            'massupdate' => false,
            'duplicate_merge' => 'disabled',
        ],
        'opportunity_name' => [
            'name' => 'opportunity_name',
            'rname' => 'name',
            'id_name' => 'opportunity_id',
            'vname' => 'LBL_OPPORTUNITY',
            'join_name' => 'opportunities',
            'type' => 'relate',
            'link' => 'opportunities',
            'table' => 'opportunities',
            'isnull' => 'true',
            'module' => 'Opportunities',
            'dbType' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
            'massupdate' => false,
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'vname' => 'LBL_OPPORTUNITIES_LINK',
            'type' => 'link',
            'relationship' => 'opportunities_proposals_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ],
        // Files
        'file1name' => [
            'name' => 'file1name',
            'vname' => 'LBL_FILE1NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'massupdate' => false,
            'comment' => 'File name associated with the note (attachment)'
        ],
        'file1id' => [
            'name' => 'file1id',
            'type' => 'id'
        ],
        'file1exists' => [
            'name' => 'file1exists',
            'vname' => 'LBL_FILE1EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
            'massupdate' => false,
        ],
        'file1link' => [
            'name' => 'file1link',
            'vname' => 'LBL_FILE1EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
            'massupdate' => false,
        ],
        'file1_mime_type' => [
            'name' => 'file1_mime_type',
            'vname' => 'LBL_FILE1_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'massupdate' => false,
            'comment' => 'Attachment MIME type'
        ],
        'file2name' => [
            'name' => 'file2name',
            'vname' => 'LBL_FILE2NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'massupdate' => false,
            'comment' => 'File name associated with the note (attachment)'
        ],
        'file2exists' => [
            'name' => 'file2exists',
            'vname' => 'LBL_FILE2EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
            'massupdate' => false,
        ],
        'file2link' => [
            'name' => 'file2link',
            'vname' => 'LBL_FILE2EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
            'massupdate' => false,
        ],
        'file2id' => [
            'name' => 'file2id',
            'type' => 'id'
        ],
        'file2_mime_type' => [
            'name' => 'file2_mime_type',
            'vname' => 'LBL_FILE2_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'massupdate' => false,
            'comment' => 'Attachment MIME type'
        ],
        'file3name' => [
            'name' => 'file3name',
            'vname' => 'LBL_FILE3NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'massupdate' => false,
            'comment' => 'File name associated with the note (attachment)'
        ],
        'file3exists' => [
            'name' => 'file3exists',
            'vname' => 'LBL_FILE3EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
            'massupdate' => false,
        ],
        'file3link' => [
            'name' => 'file3link',
            'vname' => 'LBL_FILE3EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
            'massupdate' => false,
        ],
        'file3id' => [
            'name' => 'file3id',
            'type' => 'id'
        ],
        'file3_mime_type' => [
            'name' => 'file3_mime_type',
            'vname' => 'LBL_FILE3_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'massupdate' => false,
            'comment' => 'Attachment MIME type'
        ],
        'proposal_notes_link' => [
            'name' => 'proposal_notes_link',
            'type' => 'link',
            'relationship' => 'proposal_notes_rel',
            'source' => 'non-db',
            'vname' => 'LBL_PROPOSAL_NOTES_LINK'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_pac',
            'type' => 'index',
            'fields' => ['parent_id'],
        ],
        [
            'name' => 'idx_opp',
            'type' => 'index',
            'fields' => ['opportunity_id'],
        ],
        [
            'name' => 'idx_paoppdel',
            'type' => 'index',
            'fields' => ['parent_id', 'opportunity_id', 'deleted'],
        ],
        [
            'name' => 'idx_stadel',
            'type' => 'index',
            'fields' => ['proposalstatus', 'deleted'],
        ],
    ],
    'relationships' => [
        'accounts_proposals_rel' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'Proposals',
            'rhs_table' => 'proposals',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Accounts'
        ],
        'opportunities_proposals_rel' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'Proposals',
            'rhs_table' => 'proposals',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ],
        'proposal_notes_rel' => [
            'lhs_module' => 'Proposals',
            'lhs_table' => 'proposals',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many', 'relationship_role_column' => 'parent_type', 'relationship_role_column_value' => 'Proposals'
        ],
    ]
];

VardefManager::createVardef('Proposals', 'Proposal', ['default', 'assignable']);
