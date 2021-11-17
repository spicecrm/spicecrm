<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

/**
 * table storing reports filter information
 */
$dictionary['oauth_nonce'] = [
	'table' => 'oauth_nonce',
	'fields' => [
		'conskey' => [
			'name'		=> 'conskey',
			'type'		=> 'varchar',
			'len'		=> 32,
			'required'	=> true,
			'isnull'	=> false,
        ],
		'nonce' => [
			'name'		=> 'nonce',
			'type'		=> 'varchar',
			'len'		=> 32,
			'required'	=> true,
			'isnull'	=> false,
        ],
		'nonce_ts' => [
			'name'		=> 'nonce_ts',
			'type'		=> 'long',
			'required'	=> true,
        ],
    ],
	'indices' => [
		[
			'name'			=> 'oauth_nonce_pk',
			'type'			=> 'primary',
			'fields'		=> ['conskey', 'nonce']
        ],
		[
			'name'			=> 'oauth_nonce_keyts',
			'type'			=> 'index',
			'fields'		=> ['conskey', 'nonce_ts']
        ],
    ],
];
