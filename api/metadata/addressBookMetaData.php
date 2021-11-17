<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

$dictionary['AddressBook'] = ['table' => 'address_book',
	'fields' => [
		'assigned_user_id' => [
			'name' => 'assigned_user_id',
			'vname' => 'LBL_USER_ID',
			'type' => 'id',
			'required' => true,
			'reportable' => false,
        ],
		'bean' => [
			'name' => 'bean',
			'vname' => 'LBL_BEAN',
			'type' => 'varchar',
			'len' => '50',
			'required' => true,
			'reportable' => false,
        ],
		'bean_id' => [
			'name' => 'bean_id',
			'vname' => 'LBL_BEAN_ID',
			'type' => 'id',
			'required' => true,
			'reportable' => false,
        ],
    ],
	'indices' => [
		[
			'name' => 'ab_user_bean_idx',
			'type' =>'index',
			'fields' => [
				'assigned_user_id',
				'bean',
            ]
        ],
    ], /* end indices */
];

