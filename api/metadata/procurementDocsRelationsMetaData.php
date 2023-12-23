<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['procurementdocsflow'] = [
    'table' => 'procurementdocsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'procurementdoc_from_id', 'type' => 'id'],
        ['name' => 'procurementdoc_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'procurementdocsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'procurementdocsflow' => [
            'rhs_module' => 'ProcurementDocs',
            'rhs_table' => 'procurementdocs',
            'rhs_key' => 'id',
            'lhs_module' => 'ProcurementDocs',
            'lhs_table' => 'procurementdocs',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'procurementdocsflow',
            'join_key_lhs' => 'procurementdoc_from_id',
            'join_key_rhs' => 'procurementdoc_to_id',
            'reverse' => 0
        ]
    ]
];

/**
 * handles two things:
 */
SpiceDictionaryHandler::getInstance()->dictionary['procurementdocsitemsflow'] = [
    'table' => 'procurementdocsitemsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'procurementdocitem_from_id', 'type' => 'id'],
        ['name' => 'procurementdocitem_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'procurementdocsitemsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'procurementdocsitemsflow' => [
            'rhs_module' => 'ProcurementDocItems',
            'rhs_table' => 'procurementdocitems',
            'rhs_key' => 'id',
            'lhs_module' => 'ProcurementDocItems',
            'lhs_table' => 'procurementdocitems',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'procurementdocsitemsflow',
            'join_key_lhs' => 'procurementdocitem_from_id',
            'join_key_rhs' => 'procurementdocitem_to_id',
            'reverse' => 0
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['sysProcurementDocItemTypesFlow'] = [
    'table' => 'sysprocurementdocitemtypesflow',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'procurementdoctype_from' => [
            'name' => 'procurementdoctype_from',
            'vname' => 'LBL_PROCUREMENTDOCTYPE_FROM',
            'type' => 'varchar',
            'len' => 36
        ],
        'procurementdocitemtype_from' => [
            'name' => 'procurementdocitemtype_from',
            'vname' => 'LBL_PROCUREMENTDOCITEMTYPE_FROM',
            'type' => 'varchar',
            'len' => 36
        ],
        'procurementdoctype_to' => [
            'name' => 'procurementdoctype_to',
            'vname' => 'LBL_PROCUREMENTDOCTYPE_TO',
            'type' => 'varchar',
            'len' => 36
        ],
        'procurementdocitemtype_to' => [
            'name' => 'procurementdocitemtype_to',
            'vname' => 'LBL_PROCUREMENTDOCITEMTYPE_TO',
            'type' => 'varchar',
            'len' => 36
        ],
        'convert_method' => [
            'name' => 'convert_method',
            'vname' => 'LBL_CONVERT_METHOD',
            'type' => 'varchar',
            'len' => 200,
            'comment' => 'a class and method to identify the processing of the item to be applied when copying from one item to the next'
        ],
        'quantityhandling' => [
            'name' => 'quantityhandling',
            'vname' => 'LBL_QUANTITYHANDLING',
            'type' => 'char',
            'len' => 1,
            'default' => '0',
            'comment' => 'defines the quantitiy handling, 0 has no impact, - reduces the open quantity, + adds to the open quantity'
        ]
    ],
    'indices' => [
        [
            'name' => 'sysprocurementdocitemtypesflow_id',
            'type' => 'unique',
            'fields' => ['id']
        ]
    ]
];

