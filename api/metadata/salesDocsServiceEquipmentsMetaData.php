<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

$dictionary['salesdocs_serviceequipments'] = [
    'table' => 'salesdocs_serviceequipments'
, 'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36']
    , ['name' => 'salesdoc_id', 'type' => 'char', 'len' => '36']
    , ['name' => 'serviceequipment_id', 'type' => 'char', 'len' => '36']
    , ['name' => 'date_modified', 'type' => 'datetime']
    , ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'required' => true, 'default' => '0']
    ]
, 'indices' => [
        ['name' => 'salesdocs_serviceequipmentspk', 'type' => 'primary', 'fields' => ['id']]
    , ['name' => 'idx_salesdocs_serviceequipmentsalt', 'type' => 'alternate_key', 'fields' => ['salesdoc_id', 'serviceequipment_id']]
    , ['name' => 'idx_salesdocservequ_del', 'type' => 'index', 'fields' => ['salesdoc_id', 'serviceequipment_id', 'deleted']]
    ]
, 'relationships' => [
        'salesdocs_serviceequipments' => [
            'lhs_module' => 'SalesDocs',
            'lhs_table' => 'salesdocs',
            'lhs_key' => 'id',
            'rhs_module' => 'ServiceEquipments',
            'rhs_table' => 'serviceequipments',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'salesdocs_serviceequipments',
            'join_key_lhs' => 'salesdoc_id',
            'join_key_rhs' => 'serviceequipment_id'
        ]
    ]
];
