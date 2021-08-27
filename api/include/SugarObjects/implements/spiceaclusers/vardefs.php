<?php

$vardefs['fields']['spiceacl_users_hash'] = [
    'name' => 'spiceacl_users_hash',
    'vname' => 'LBL_ADDITIONAL_USERS',
    'type' => 'users',
    'dbtype' => 'varchar',
    'len' => 32,
    'audited' => true,
    'reportable' => false
];

$vardefs['relationships'][strtolower($module) . '_spiceaclusers'] = [
    'lhs_module' => $module,
    'lhs_table' => $table_name,
    'lhs_key' => 'spiceacl_users_hash',
    'rhs_module' => 'Users',
    'rhs_table' => 'users',
    'rhs_key' => 'id',
    'relationship_type' => 'many-to-many',
    'join_table' => 'spiceaclusers_hash',
    'join_key_lhs' => 'hash_id',
    'join_key_rhs' => 'user_id',
];

$vardefs['fields']['spiceaclusers_hash_link'] = [
    'name' => 'spiceaclusers_hash_link',
    'vname' => 'LBL_SPICEACLUSERSECONDARY',
    'type' => 'link',
    'relationship' => strtolower($module) . '_spiceaclusers',
    'link_type' => 'one',
    'source' => 'non-db'
];
$vardefs['fields']['spiceacl_additional_users'] = [
    'name' => 'spiceacl_additional_users',
    'vname' => 'LBL_ADDITIONAL_USERS',
    'type' => 'users',
    'source' => 'non-db'
];
$vardefs['indices'] = [
    ['name' => 'idx_' . strtolower($table_name) . '_uhash', 'type' => 'index', 'fields' => ['spiceacl_users_hash']],
];

