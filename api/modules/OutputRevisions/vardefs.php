<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['OutputRevision'] = [
    'table' => 'outputrevisions',
    'audited' => true,
    'fields' => [
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'len'      => 255,
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'parent_type' => 'record_type_display',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'source'      => 'non-db',
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_LIST_RELATED_TO_ID',
            'type'       => 'id',
            'reportable' => false,
            'comment'    => 'The ID of the parent Sugar object identified by parent_type'
        ],
        /**
         * store the file is an original has been recorded
         */
        'file_mime_type' => [
            'name' => 'file_mime_type',
            'vname' => 'LBL_FILE_MIME_TYPE',
            'type' => 'varchar',
            'len' => '100',
            'comment' => 'Attachment MIME type',
            'importable' => false
        ],
        'file_md5' => [
            'name' => 'file_md5',
            'vname' => 'LBL_FILE_MD5',
            'type' => 'char',
            'len' => '32',
            'comment' => 'Attachment MD5'
        ],
        'file_name' => [
            'name' => 'file_name',
            'vname' => 'LBL_FILENAME',
            'type' => 'file',
            'dbType' => 'varchar',
            'len' => '255',
            'comment' => 'File name associated with the note (attachment)'
        ],
    ],
    'indices' => [
        'idx_outputrevisions_id_del' => ['name' => 'idx_outputrevisions_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']],
        'idx_outputrevisions_parent' => ['name' => 'idx_outputrevisions_parent', 'type' => 'index', 'fields' => ['parent_id']]
    ],
    'relationships' => [],
    'optimistic_lock' => true
];


VardefManager::createVardef('OutputRevisions', 'OutputRevision', ['default', 'assignable']);
unset(SpiceDictionaryHandler::getInstance()->dictionary['OutputRevision']['fields']['name']);
