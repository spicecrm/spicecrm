<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['roles_modules'] = [

	'table' => 'roles_modules',

	'fields' => [
		[
			'name' => 'id',
			'type' => 'varchar',
			'len' => '36',
        ],
		[
			'name' => 'role_id',
			'type' => 'varchar',
			'len' => '36',
        ],
		[
			'name' => 'module_id',
			'type' => 'varchar',
			'len' => '36',
        ],
		[
			'name' => 'allow',
			'type' => 'bool',
			'len' => '1',
			'default' => '0',
        ]
      , ['name' => 'date_modified','type' => 'datetime'],
		[
			'name' => 'deleted',
			'type' => 'bool',
			'len' => '1',
			'default' => '0'
        ],
    ],
	
	'indices' => [
		[
			'name' => 'roles_modulespk',
			'type' => 'primary',
			'fields' => ['id']
        ],
		[
			'name' => 'idx_role_id',
			'type' => 'index',
			'fields' => ['role_id']
        ],
		[
			'name' => 'idx_module_id',
			'type' => 'index',
			'fields' => ['module_id']
        ],
    ],
]
                                  
?>
