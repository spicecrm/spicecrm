<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Proposal'] = [
    'table' => 'proposals',
    'comment' => 'Proposals Module',
    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '32',
            'required' => true,
            'comment' => 'proposal number'
        ],
        'proposalstatus' => [
            'name' => 'proposalstatus',
            'type' => 'enum',
            'options' => 'proposalstatus_dom',
            'len' => '16',
            'vname' => 'LBL_STATUS',
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
            'duplicate_merge' => false,
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
            'duplicate_merge' => false,
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
        ],
        'parent_type' => [
            'name' => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'vname' => 'LBL_RELATED_TO',
            'parent_type' => 'record_type_display',
            'type_name' => 'parent_type',
            'id_name' => 'parent_id',
            'type' => 'parent',
            'source' => 'non-db',
        ],
        'accounts' => [
            'name' => 'accounts',
			'vname' => 'LBL_ACCOUNTS_LINK',
            'type' => 'link',
            'relationship' => 'accounts_proposals_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => false,
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'vname' => 'LBL_OPPORTUNITY_ID',
            'type' => 'id',
            'reportable' => false,
            'duplicate_merge' => false,
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
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'vname' => 'LBL_OPPORTUNITIES_LINK',
            'type' => 'link',
            'relationship' => 'opportunities_proposals_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => false,
        ],
        // Files
        'file1name' => [
            'name' => 'file1name',
            'vname' => 'LBL_FILE1NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
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
        ],
        'file1link' => [
            'name' => 'file1link',
            'vname' => 'LBL_FILE1EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
        ],
        'file1_mime_type' => [
            'name' => 'file1_mime_type',
            'vname' => 'LBL_FILE1_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'comment' => 'Attachment MIME type'
        ],
        'file2name' => [
            'name' => 'file2name',
            'vname' => 'LBL_FILE2NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'comment' => 'File name associated with the note (attachment)'
        ],
        'file2exists' => [
            'name' => 'file2exists',
            'vname' => 'LBL_FILE2EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
        ],
        'file2link' => [
            'name' => 'file2link',
            'vname' => 'LBL_FILE2EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
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
            'comment' => 'Attachment MIME type'
        ],
        'file3name' => [
            'name' => 'file3name',
            'vname' => 'LBL_FILE3NAME',
            'type' => 'varchar',
            'len' => '255',
            'reportable' => true,
            'comment' => 'File name associated with the note (attachment)'
        ],
        'file3exists' => [
            'name' => 'file3exists',
            'vname' => 'LBL_FILE3EXISTS',
            'type' => 'bool',
            'source' => 'non-db',
        ],
        'file3link' => [
            'name' => 'file3link',
            'vname' => 'LBL_FILE3EXISTS',
            'type' => 'varchar',
            'source' => 'non-db',
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
