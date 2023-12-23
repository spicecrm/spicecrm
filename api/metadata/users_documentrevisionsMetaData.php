<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary["users_documentrevisions"] = [
    'true_relationship_type' => 'many-to-many',
    'relationships' =>
        [
            'users_documentrevisions' =>
                [
                    'lhs_module' => 'Users',
                    'lhs_table' => 'users',
                    'lhs_key' => 'id',
                    'rhs_module' => 'DocumentRevisions',
                    'rhs_table' => 'document_revisions',
                    'rhs_key' => 'id',
                    'relationship_type' => 'many-to-many',
                    'join_table' => 'users_documentrevisions',
                    'join_key_lhs' => 'user_id',
                    'join_key_rhs' => 'document_revision_id',
                ],
        ],
    'table' => 'users_documentrevisions',
    'contenttype'   => 'relationdata',
    'fields' =>
        [
            0 =>
                [
                    'name' => 'id',
                    'type' => 'varchar',
                    'len' => 36,
                ],
            1 =>
                [
                    'name' => 'date_entered',
                    'type' => 'datetime',
                ],
            2 =>
                [
                    'name' => 'deleted',
                    'type' => 'bool',
                    'len' => '1',
                    'default' => '0',
                    'required' => true,
                ],
            3 =>
                [
                    'name' => 'user_id',
                    'type' => 'varchar',
                    'len' => 36,
                ],
            4 =>
                [
                    'name' => 'document_revision_id',
                    'type' => 'varchar',
                    'len' => 36,
                ],
            5 =>
            [
                'name' => 'acceptance_status',
                'type' => 'bool',
            ],
            6 =>
                [
                    'name' => 'date_update_accepted',
                    'type' => 'datetime',
                ],
        ],
    'indices' =>
        [
            0 =>
                [
                    'name' => 'users_documentrevisionspk',
                    'type' => 'primary',
                    'fields' =>
                        [
                            0 => 'id',
                        ],
                ],
            1 =>
                [
                    'name' => 'idx_user_docrev_user_id',
                    'type' => 'alternate_key',
                    'fields' =>
                        [
                            0 => 'user_id',
                            1 => 'document_revision_id',
                        ],
                ],
            2 =>
                [
                    'name' => 'idx_user_docrev_docrev_id',
                    'type' => 'alternate_key',
                    'fields' =>
                        [
                            0 => 'document_revision_id',
                            1 => 'user_id',
                        ],
                ],
        ],
];