<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

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
