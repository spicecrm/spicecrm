<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
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

$dictionary['Proposal'] = array(
    'table' => 'proposals',
    'comment' => 'Competitor Assessments Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => array(
        'name' => array(
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '32',
            'required' => true,
            'massupdate' => false,
            'comment' => 'proposal number'
        ),
        'proposalstatus' => array(
            'name' => 'proposalstatus',
            'type' => 'enum',
            'options' => 'proposalstatus_dom',
            'len' => '16',
            'vname' => 'LBL_PROPOSALSTATUS',
            'massupdate' => false,
            'comment' => 'Status: draft|submitted|accepted|rejected'
        ),
        'amount' => array(
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
        ),
        'currency_id' => array(
            'name' => 'currency_id',
            'type' => 'id',
            'group' => 'currency_id',
            'vname' => 'LBL_CURRENCY',
            'function' => array('name' => 'getCurrencyDropDown', 'returns' => 'html'),
            'reportable' => false,
            'comment' => 'Currency used for display purposes'
        ),
        'currency_name' => array(
            'name' => 'currency_name',
            'rname' => 'name',
            'id_name' => 'currency_id',
            'vname' => 'LBL_CURRENCY_NAME',
            'type' => 'relate',
            'isnull' => 'true',
            'table' => 'currencies',
            'module' => 'Currencies',
            'source' => 'non-db',
            'function' => array('name' => 'getCurrencyNameDropDown', 'returns' => 'html'),
            'studio' => 'false',
            'duplicate_merge' => 'disabled',
        ),
        'currency_symbol' => array(
            'name' => 'currency_symbol',
            'rname' => 'symbol',
            'id_name' => 'currency_id',
            'vname' => 'LBL_CURRENCY_SYMBOL',
            'type' => 'relate',
            'isnull' => 'true',
            'table' => 'currencies',
            'module' => 'Currencies',
            'source' => 'non-db',
            'function' => array('name' => 'getCurrencySymbolDropDown', 'returns' => 'html'),
            'studio' => 'false',
            'duplicate_merge' => 'disabled',
        ),
        'account_id' => array(
            'name' => 'account_id',
            'vname' => 'LBL_ACCOUNT_ID',
            'type' => 'id',
            'reportable' => false,
            'massupdate' => false,
            'duplicate_merge' => 'disabled',
        ),
        'account_name' => array(
            'name' => 'account_name',
            'rname' => 'name',
            'id_name' => 'account_id',
            'vname' => 'LBL_ACCOUNT_NAME',
            'join_name' => 'accounts',
            'type' => 'relate',
            'link' => 'accounts',
            'table' => 'accounts',
            'isnull' => 'true',
            'module' => 'Accounts',
            'dbType' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
            'massupdate' => false,
        ),
        'accounts' => array(
            'name' => 'accounts',
			'vname' => 'LBL_ACCOUNTS_LINK',
            'type' => 'link',
            'relationship' => 'accounts_proposals_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ),
        'opportunity_id' => array(
            'name' => 'opportunity_id',
            'vname' => 'LBL_OPPORTUNITY_ID',
            'type' => 'id',
            'reportable' => false,
            'massupdate' => false,
            'duplicate_merge' => 'disabled',
        ),
        'opportunity_name' => array(
            'name' => 'opportunity_name',
            'rname' => 'name',
            'id_name' => 'opportunity_id',
            'vname' => 'LBL_OPPORTUNITY_NAME',
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
        ),
        'opportunities' => array(
            'name' => 'opportunities',
            'vname' => 'LBL_OPPORTUNITIES_LINK',
            'type' => 'link',
            'relationship' => 'opportunities_proposals_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ),
        // Files
        'file1name' => array(
            'name' => 'file1name',
            'vname' => 'LBL_FILE1NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'massupdate' => false,
            'comment' => 'File name associated with the note (attachment)'
        ),
        'file1id' => array(
            'name' => 'file1id',
            'type' => 'id'
        ),
        'file1exists' => array(
            'name' => 'file1exists',
            'vname' => 'LBL_FILE1EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
            'massupdate' => false,
        ),
        'file1link' => array(
            'name' => 'file1link',
            'vname' => 'LBL_FILE1EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
            'massupdate' => false,
        ),
        'file1_mime_type' => array(
            'name' => 'file1_mime_type',
            'vname' => 'LBL_FILE1_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'massupdate' => false,
            'comment' => 'Attachment MIME type'
        ),
        'file1_url' => array(
            'name' => 'file1_url',
            'vname' => 'LBL_FILE1_URL',
            'type' => 'function',
            'function_require' => 'include/upload_file.php',
            'function_class' => 'UploadFile',
            'function_name' => 'get_url',
            'function_params' => array('filename', 'id'),
            'source' => 'function',
            'reportable' => false,
            'massupdate' => false,
            'comment' => 'Path to file (can be URL)'
        ),
        'file2name' => array(
            'name' => 'file2name',
            'vname' => 'LBL_FILE2NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'massupdate' => false,
            'comment' => 'File name associated with the note (attachment)'
        ),
        'file2exists' => array(
            'name' => 'file2exists',
            'vname' => 'LBL_FILE2EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
            'massupdate' => false,
        ),
        'file2link' => array(
            'name' => 'file2link',
            'vname' => 'LBL_FILE2EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
            'massupdate' => false,
        ),
        'file2id' => array(
            'name' => 'file2id',
            'type' => 'id'
        ),
        'file2_mime_type' => array(
            'name' => 'file2_mime_type',
            'vname' => 'LBL_FILE2_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'massupdate' => false,
            'comment' => 'Attachment MIME type'
        ),
        'file2_url' => array(
            'name' => 'file2_url',
            'vname' => 'LBL_FILE_URL',
            'type' => 'function',
            'function_require' => 'include/upload_file.php',
            'function_class' => 'UploadFile',
            'function_name' => 'get_url',
            'function_params' => array('file2name', 'id'),
            'source' => 'function',
            'reportable' => false,
            'massupdate' => false,
            'comment' => 'Path to file (can be URL)'
        ),
        'file3name' => array(
            'name' => 'file3name',
            'vname' => 'LBL_FILE3NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'massupdate' => false,
            'comment' => 'File name associated with the note (attachment)'
        ),
        'file3exists' => array(
            'name' => 'file3exists',
            'vname' => 'LBL_FILE3EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
            'massupdate' => false,
        ),
        'file3link' => array(
            'name' => 'file3link',
            'vname' => 'LBL_FILE3EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
            'massupdate' => false,
        ),
        'file3id' => array(
            'name' => 'file3id',
            'type' => 'id'
        ),
        'file3_mime_type' => array(
            'name' => 'file3_mime_type',
            'vname' => 'LBL_FILE3_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'massupdate' => false,
            'comment' => 'Attachment MIME type'
        ),
        'file3_url' => array(
            'name' => 'file3_url',
            'vname' => 'LBL_FILE_URL',
            'type' => 'function',
            'function_require' => 'include/upload_file.php',
            'function_class' => 'UploadFile',
            'function_name' => 'get_url',
            'function_params' => array('file2name', 'id'),
            'source' => 'function',
            'reportable' => false,
            'massupdate' => false,
            'comment' => 'Path to file (can be URL)'
        ),


        'proposal_notes_link' => array (
            'name' => 'proposal_notes_link',
            'type' => 'link',
            'relationship' => 'proposal_notes_rel',
            'source' => 'non-db',
            'vname' => 'LBL_PROPOSAL_NOTES_LINK'
        ),


    ),
    'indices' => array(
        array(
            'name' => 'idx_acc',
            'type' => 'index',
            'fields' => array('account_id'),
        ),
        array(
            'name' => 'idx_opp',
            'type' => 'index',
            'fields' => array('opportunity_id'),
        ),
        array(
            'name' => 'idx_accoppdel',
            'type' => 'index',
            'fields' => array('account_id', 'opportunity_id', 'deleted'),
        ),
        array(
            'name' => 'idx_stadel',
            'type' => 'index',
            'fields' => array('proposalstatus', 'deleted'),
        ),
    ),
    'relationships' => array(
        'accounts_proposals_rel' => array(
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'Proposals',
            'rhs_table' => 'proposals',
            'rhs_key' => 'account_id',
            'relationship_type' => 'one-to-many',
        ),
        'opportunities_proposals_rel' => array(
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'Proposals',
            'rhs_table' => 'proposals',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ),
        'proposal_notes_rel' => array (
            'lhs_module' => 'Proposals',
            'lhs_table' => 'proposals',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many', 'relationship_role_column' => 'parent_type', 'relationship_role_column_value' => 'Proposals'
        ),
    )
);

if ($GLOBALS['sugar_flavor'] != 'CE')
    VardefManager::createVardef('Proposals', 'Proposal', array('default', 'assignable', 'team_security'));
else
    VardefManager::createVardef('Proposals', 'Proposal', array('default', 'assignable'));