<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary["documents_accounts"] = [
  'true_relationship_type' => 'many-to-many',
  'relationships' => 
  [
    'documents_accounts' => 
    [
      'lhs_module' => 'Documents',
      'lhs_table' => 'documents',
      'lhs_key' => 'id',
      'rhs_module' => 'Accounts',
      'rhs_table' => 'accounts',
      'rhs_key' => 'id',
      'relationship_type' => 'many-to-many',
      'join_table' => 'documents_accounts',
      'join_key_lhs' => 'document_id',
      'join_key_rhs' => 'account_id',
    ],
  ],
  'table' => 'documents_accounts',
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
      'name' => 'account_id',
      'type' => 'varchar',
      'len' => 36,
    ],
  ],
  'indices' => 
  [
    0 => 
    [
      'name' => 'documents_accountsspk',
      'type' => 'primary',
      'fields' => 
      [
        0 => 'id',
      ],
    ],
    1 => 
    [
      'name' => 'documents_accounts_account_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'account_id',
        1 => 'document_id',
      ],
    ],
    2 => 
    [
      'name' => 'documents_accounts_document_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'document_id',
        1 => 'account_id',
      ],
    ],
  ],
];
