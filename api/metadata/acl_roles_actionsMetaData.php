<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['acl_roles_actions'] = [

	'table' => 'acl_roles_actions',
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
			'name' => 'action_id',
			'type' => 'varchar',
			'len' => '36',
        ],
		[
			'name' => 'access_override',
			'type' => 'int',
			'len' => '3',
			'required' => false,
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
			'name' => 'acl_roles_actionspk',
			'type' => 'primary',
			'fields' => ['id']
        ],
		[
			'name' => 'idx_acl_role_id',
			'type' => 'index',
			'fields' => ['role_id']
        ],
		[
			'name' => 'idx_acl_action_id',
			'type' => 'index',
			'fields' => ['action_id']
        ],
		 ['name' => 'idx_aclrole_action', 'type'=>'alternate_key', 'fields'=> ['role_id','action_id']]
    ],
	'relationships' => ['acl_roles_actions' => ['lhs_module'=> 'ACLRoles', 'lhs_table'=> 'acl_roles', 'lhs_key' => 'id',
							  'rhs_module'=> 'ACLActions', 'rhs_table'=> 'acl_actions', 'rhs_key' => 'id',
							  'relationship_type'=>'many-to-many',
							  'join_table'=> 'acl_roles_actions', 'join_key_lhs'=>'role_id', 'join_key_rhs'=>'action_id']],

];