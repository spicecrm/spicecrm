<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['meetings_contacts'] = [
	'table'=> 'meetings_contacts',
	'fields'=> [
		['name'			=> 'id',
				'type'			=> 'varchar', 
				'len'			=> '36'
        ],
		['name'			=> 'meeting_id',
				'type'			=> 'varchar', 
				'len'			=> '36',
        ],
		['name'			=> 'contact_id',
				'type'			=> 'varchar', 
				'len'			=> '36',
        ],
		['name'			=> 'required',
				'type'			=> 'varchar', 
				'len'			=> '1', 
				'default'		=> '1',
        ],
		['name'			=> 'accept_status',
				'type'			=> 'varchar', 
				'len'			=> '25', 
				'default'		=> 'none'
        ],
		['name'			=> 'date_modified',
				'type'			=> 'datetime'
        ],
		['name'			=> 'deleted',
				'type'			=> 'bool', 
				'len'			=> '1', 
				'default'		=> '0', 
				'required'		=> false
        ],
    ],
	'indices' => [
 		['name'			=> 'meetings_contactspk',
				'type'			=> 'primary', 
				'fields'		=> ['id'],
        ],
		['name'			=> 'idx_con_mtg_mtg',
				'type'			=> 'index', 
				'fields'		=> ['meeting_id'],
        ],
		['name'			=> 'idx_con_mtg_con',
				'type'			=> 'index', 
				'fields'		=> ['contact_id'],
        ],
		['name'			=> 'idx_meeting_contact',
				'type'			=> 'alternate_key', 
				'fields'		=> ['meeting_id','contact_id'],
        ],
    ],
	'relationships' => [
		'meetings_contacts' => [
			'lhs_module'		=> 'Meetings', 
			'lhs_table'			=> 'meetings', 
			'lhs_key'			=> 'id',
			'rhs_module'		=> 'Contacts', 
			'rhs_table'			=> 'contacts', 
			'rhs_key'			=> 'id',
			'relationship_type'	=> 'many-to-many',
			'join_table'		=> 'meetings_contacts', 
			'join_key_lhs'		=> 'meeting_id', 
			'join_key_rhs'		=> 'contact_id',
        ],
    ],
];
?>
