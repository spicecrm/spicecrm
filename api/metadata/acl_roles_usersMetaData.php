<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['acl_roles_users'] = [

	'table' => 'acl_roles_users',
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
			'name' => 'acl_roles_userspk',
			'type' => 'primary',
			'fields' => ['id']
        ],
		[
			'name' => 'idx_aclrole_id',
			'type' => 'index',
			'fields' => ['role_id']
        ],
		[
			'name' => 'idx_acluser_id',
			'type' => 'index',
			'fields' => ['user_id']
        ],
		['name' => 'idx_aclrole_user', 'type'=>'alternate_key', 'fields'=> ['role_id','user_id']]
    ],
	'relationships' => ['acl_roles_users' => ['lhs_module'=> 'ACLRoles', 'lhs_table'=> 'acl_roles', 'lhs_key' => 'id',
							  'rhs_module'=> 'Users', 'rhs_table'=> 'users', 'rhs_key' => 'id',
							  'relationship_type'=>'many-to-many',
							  'join_table'=> 'acl_roles_users', 'join_key_lhs'=>'role_id', 'join_key_rhs'=>'user_id']],

];
