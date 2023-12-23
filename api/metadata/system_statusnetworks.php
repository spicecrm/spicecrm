<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['syststatusnetworks'] = [
    'table' => 'syststatusnetworks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'domain' => [
            'name' => 'domain',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_from' => [
            'name' => 'status_from',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_to' => [
            'name' => 'status_to',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_priority' => [
            'name' => 'status_priority',
            'type' => 'int'
        ],
        'action_label' => [
            'name' => 'action_label',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_component' => [
            'name' => 'status_component',
            'type' => 'varchar',
            'len' => 100
        ],
        'prompt_label' => [
            'name' => 'prompt_label',
            'type' => 'varchar',
            'len' => 100
        ],
        'required_model_state' => [
            'name' => 'required_model_state',
            'type' => 'varchar',
            'len' => 100
        ],
        'required_model_acl_action' => [
            'name' => 'required_model_acl_action',
            'type' => 'varchar',
            'len' => 100
        ],
        'componentconfig' => [
            'name' => 'componentconfig',
            'type' => 'shorttext',
            'len' => 2000,
            'comment' => 'config of the item to be rendered in modal (fieldset, componentset etc.)'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syststatusnetworks',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['systcustomstatusnetworks'] = [
    'table' => 'systcustomstatusnetworks',
    'fields' => SpiceDictionaryHandler::getInstance()->dictionary['syststatusnetworks']['fields'],
    'indices' => [
        [
            'name' => 'systcustomstatusnetworkspk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]

];