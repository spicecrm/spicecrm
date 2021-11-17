<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

$dictionary["documents_projects"] = [
  'true_relationship_type' => 'many-to-many',
  'relationships' => 
  [
    'documents_projects' =>
    [
      'lhs_module' => 'Documents',
      'lhs_table' => 'documents',
      'lhs_key' => 'id',
      'rhs_module' => 'Projects',
      'rhs_table' => 'projects',
      'rhs_key' => 'id',
      'relationship_type' => 'many-to-many',
      'join_table' => 'documents_projects',
      'join_key_lhs' => 'document_id',
      'join_key_rhs' => 'project_id',
    ],
  ],
  'table' => 'documents_projects',
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
      'name' => 'project_id',
      'type' => 'varchar',
      'len' => 36,
    ],
  ],
  'indices' => 
  [
    0 => 
    [
      'name' => 'documents_projectspk',
      'type' => 'primary',
      'fields' => 
      [
        0 => 'id',
      ],
    ],
    1 => 
    [
      'name' => 'documents_projects_project_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'project_id',
        1 => 'document_id',
      ],
    ],
    2 => 
    [
      'name' => 'documents_projects_document_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'document_id',
        1 => 'project_id',
      ],
    ],
  ],
];

