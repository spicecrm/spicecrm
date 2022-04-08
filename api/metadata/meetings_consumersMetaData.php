<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['meetings_consumers'] = [
    'table'         => 'meetings_consumers',
    'contenttype'   => 'relationdata',
    'fields'        => [
        [
            'name'			=> 'id',
            'type'			=> 'id',
            'len'			=> '36',
        ],
        [
            'name'			=> 'meeting_id',
            'type'			=> 'varchar',
            'len'			=> '36',
        ],
        [
            'name'			=> 'consumer_id',
            'type'			=> 'varchar',
            'len'			=> '36',
        ],
        [
            'name'			=> 'required',
            'type'			=> 'varchar',
            'len'			=> '1',
            'default'		=> '1',
        ],
        [
            'name'			=> 'accept_status',
            'type'			=> 'varchar',
            'len'			=> '25',
            'default'		=> 'none',
        ],
        [
            'name'			=> 'date_modified',
            'type'			=> 'datetime',
        ],
        [
            'name'			=> 'deleted',
            'type'			=> 'bool',
            'len'			=> '1',
            'default'		=> '0',
            'required'		=> false,
        ],
    ],
    'indices'       => [
        [
            'name'			=> 'meetings_consumerspk',
            'type'			=> 'primary',
            'fields'		=> ['id'],
        ],
        [
            'name'			=> 'idx_cons_mtg_mtg',
            'type'			=> 'index',
            'fields'		=> ['meeting_id'],
        ],
        [
            'name'			=> 'idx_cons_mtg_con',
            'type'			=> 'index',
            'fields'		=> ['consumer_id'],
        ],
        [
            'name'			=> 'idx_meeting_consumer',
            'type'			=> 'alternate_key',
            'fields'		=> ['meeting_id','consumer_id'],
        ],
    ],
    'relationships' => [
        'meetings_consumers' => [
            'lhs_module'		=> 'Meetings',
            'lhs_table'			=> 'meetings',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'Consumers',
            'rhs_table'			=> 'consumers',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'join_table'		=> 'meetings_consumers',
            'join_key_lhs'		=> 'meeting_id',
            'join_key_rhs'		=> 'consumer_id',
        ],
    ],
];
