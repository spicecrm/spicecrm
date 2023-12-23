<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary["documents_orgunits"] = [
    'true_relationship_type' => 'many-to-many',
    'relationships' =>
        [
            'documents_orgunits' =>
                [
                    'lhs_module' => 'Documents',
                    'lhs_table' => 'documents',
                    'lhs_key' => 'id',
                    'rhs_module' => 'OrgUnits',
                    'rhs_table' => 'orgunits',
                    'rhs_key' => 'id',
                    'relationship_type' => 'many-to-many',
                    'join_table' => 'documents_orgunits',
                    'join_key_lhs' => 'document_id',
                    'join_key_rhs' => 'orgunit_id',
                ],
        ],
    'table' => 'documents_orgunits',
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
                    'name' => 'date_modified',
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
                    'name' => 'document_id',
                    'type' => 'varchar',
                    'len' => 36,
                ],
            4 =>
                [
                    'name' => 'orgunit_id',
                    'type' => 'varchar',
                    'len' => 36,
                ],
        ],
    'indices' =>
        [
            0 =>
                [
                    'name' => 'documents_orgunitspk',
                    'type' => 'primary',
                    'fields' =>
                        [
                            0 => 'id',
                        ],
                ],
            1 =>
                [
                    'name' => 'idx_docu_orgs_org_id',
                    'type' => 'alternate_key',
                    'fields' =>
                        [
                            0 => 'orgunit_id',
                            1 => 'document_id',
                        ],
                ],
            2 =>
                [
                    'name' => 'idx_docu_org_docu_id',
                    'type' => 'alternate_key',
                    'fields' =>
                        [
                            0 => 'document_id',
                            1 => 'orgunit_id',
                        ],
                ],
        ],
];