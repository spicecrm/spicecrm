<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

$dictionary["documents_opportunities"] = [
  'true_relationship_type' => 'many-to-many',
  'relationships' => 
  [
    'documents_opportunities' => 
    [
      'lhs_module' => 'Documents',
      'lhs_table' => 'documents',
      'lhs_key' => 'id',
      'rhs_module' => 'Opportunities',
      'rhs_table' => 'opportunities',
      'rhs_key' => 'id',
      'relationship_type' => 'many-to-many',
      'join_table' => 'documents_opportunities',
      'join_key_lhs' => 'document_id',
      'join_key_rhs' => 'opportunity_id',
    ],
  ],
  'table' => 'documents_opportunities',
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
      'name' => 'opportunity_id',
      'type' => 'varchar',
      'len' => 36,
    ],
  ],
  'indices' => 
  [
    0 => 
    [
      'name' => 'documents_opportunitiesspk',
      'type' => 'primary',
      'fields' => 
      [
        0 => 'id',
      ],
    ],
    1 => 
    [
      'name' => 'idx_docu_opps_oppo_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'opportunity_id',
        1 => 'document_id',
      ],
    ],
    2 => 
    [
      'name' => 'idx_docu_oppo_docu_id',
      'type' => 'alternate_key',
      'fields' => 
      [
        0 => 'document_id',
        1 => 'opportunity_id',
      ],
    ],
  ],
];

