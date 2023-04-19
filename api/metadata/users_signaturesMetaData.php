<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
///////////////////////////////////////////////////////////////////////////////
////	TABLE DEFINITION FOR EMAIL STUFF
SpiceDictionaryHandler::getInstance()->dictionary['UserSignature'] = [
	'table' => 'users_signatures',
	'fields' => [
		'id' => [
			'name'		=> 'id',
			'vname'		=> 'LBL_ID',
			'type'		=> 'id',
			'required'	=> true,
        ],
		'date_entered' => [
			'name' => 'date_entered',
			'vname' => 'LBL_DATE_ENTERED',
			'type' => 'datetime',
			'required'=>true,
        ],
		'date_modified' => [
			'name' => 'date_modified',
			'vname' => 'LBL_DATE_MODIFIED',
			'type' => 'datetime',
			'required'=>true,
        ],
		'deleted' => [
			'name' => 'deleted',
			'vname' => 'LBL_DELETED',
			'type' => 'bool',
			'required' => false,
			'reportable'=>false,
        ],
		'user_id' => [
			'name' => 'user_id',
			'vname' => 'LBL_USER_ID',
			'type' => 'varchar',
			'len' => 36,
        ],
		'name' => [
			'name' => 'name',
			'vname' => 'LBL_SUBJECT',
			'type' => 'varchar',
			'required' => false,
			'len' => '255',
        ],
		'signature' => [
			'name' => 'signature',
			'vname' => 'LBL_SIGNATURE',
			'type' => 'text',
			'reportable' => false,
        ],
		'signature_html' => [
			'name' => 'signature_html',
			'vname' => 'LBL_SIGNATURE_HTML',
			'type' => 'text',
			'reportable' => false,
        ],
    ],
	'indices' => [
		[
			'name' => 'users_signaturespk',
			'type' =>'primary',
			'fields' => ['id']
        ],
		[
			'name' => 'idx_usersig_uid',
			'type' => 'index',
			'fields' => ['user_id']
        ]
    ],
];
