<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

$dictionary["documents_contacts"] = [
  'true_relationship_type' => 'many-to-many',
  'relationships' => 
  [
    'documents_contacts' => 
    [
      'lhs_module' => 'Documents',
      'lhs_table' => 'documents',
      'lhs_key' => 'id',
      'rhs_module' => 'Contacts',
      'rhs_table' => 'contacts',
      'rhs_key' => 'id',
      'relationship_type' => 'many-to-many',
      'join_table' => 'documents_contacts',
      'join_key_lhs' => 'document_id',
      'join_key_rhs' => 'contact_id',
    ],
  ],
  'table' => 'documents_contacts',
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
      'name' => 'contact_id',
      'type' => 'varchar',
      'len' => 36,
    ],
  ],
  'indices' => 
  [
    0 => 
    [
      'name' => 'documents_contactsspk',
      'type' => 'primary',
      'fields' => 
      [
        0 => 'id',
      ],
    ],
    1 => 
    [
      'name' => 'documents_contacts_contact_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'contact_id',
        1 => 'document_id',
      ],
    ],
    2 => 
    [
      'name' => 'documents_contacts_document_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'document_id',
        1 => 'contact_id',
      ],
    ],
  ],
];

