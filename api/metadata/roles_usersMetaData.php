<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['roles_users'] = [

	'table' => 'roles_users',
    'contenttype'   => 'relationdata',
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
			'name' => 'user_id',
			'type' => 'varchar',
			'len' => '36',
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
			'name' => 'roles_userspk',
			'type' => 'primary',
			'fields' => ['id']
        ],
		[
			'name' => 'idx_ru_role_id',
			'type' => 'index',
			'fields' => ['role_id']
        ],
		[
			'name' => 'idx_ru_user_id',
			'type' => 'index',
			'fields' => ['user_id']
        ],
    ],
	'relationships' => ['roles_users' => ['lhs_module'=> 'Roles', 'lhs_table'=> 'roles', 'lhs_key' => 'id',
							  'rhs_module'=> 'Users', 'rhs_table'=> 'users', 'rhs_key' => 'id',
							  'relationship_type'=>'many-to-many',
							  'join_table'=> 'roles_users', 'join_key_lhs'=>'role_id', 'join_key_rhs'=>'user_id']],

];
