<?php
$dictionary['contacts_contacts'] = [
    'table' => 'contacts_contacts',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'parent_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'child_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'relationship_type', 'type' => 'enum', 'len' => '50', 'options' => 'relationship_type_dom'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'required' => false, 'default' => '0']
    ],
    'indices' => [
        ['name' => 'contacts_contacts_key', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_contacts_contacts_parent', 'type' => 'index', 'fields' => ['parent_id']],
        ['name' => 'idx_contacts_contacts_child', 'type' => 'index', 'fields' => ['child_id']],
        ['name' => 'idx_contacts_contacts_parent_child', 'type' => 'alternate_key', 'fields' => ['parent_id', 'child_id']],
        ['name' => 'idx_contacts_contacts_deleted', 'type' => 'index', 'fields' => ['deleted']]
    ],
    'relationships' => [
        'contacts_contacts' => [
            'lhs_module' => 'Contacts', 'lhs_table' => 'contacts', 'lhs_key' => 'id',
            'rhs_module' => 'Contacts', 'rhs_table' => 'contacts', 'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'contacts_contacts',
            'join_key_lhs' => 'parent_id',
            'join_key_rhs' => 'child_id'
        ]
    ]
];
