<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['salesdocsflow'] = [
    'table' => 'salesdocsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'salesdoc_from_id', 'type' => 'id'],
        ['name' => 'salesdoc_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'salesdocsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'salesdocsflow' => [
            'rhs_module' => 'SalesDocs',
            'rhs_table' => 'salesdocs',
            'rhs_key' => 'id',
            'lhs_module' => 'SalesDocs',
            'lhs_table' => 'salesdocs',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'salesdocsflow',
            'join_key_lhs' => 'salesdoc_from_id',
            'join_key_rhs' => 'salesdoc_to_id',
            'reverse' => 0
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['salesdocsitemsflow'] = [
    'table' => 'salesdocsitemsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'salesdocitem_from_id', 'type' => 'id'],
        ['name' => 'salesdocitem_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'salesdocsitemsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'salesdocsitemsflow' => [
            'rhs_module' => 'SalesDocItems',
            'rhs_table' => 'salesdocitems',
            'rhs_key' => 'id',
            'lhs_module' => 'SalesDocItems',
            'lhs_table' => 'salesdocitems',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'salesdocsitemsflow',
            'join_key_lhs' => 'salesdocitem_from_id',
            'join_key_rhs' => 'salesdocitem_to_id',
            'reverse' => 0
        ]
    ]
];
