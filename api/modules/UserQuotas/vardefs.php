<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/


use SpiceCRM\includes\SugarObjects\VardefManager;

$GLOBALS['dictionary']['UserQuota'] = [
    'table' => 'userquotas',
    'fields' => [
        'period' => [
            'name' => 'period',
            'type' => 'int'
        ],
        'year' => [
            'name' => 'year',
            'type' => 'int'
        ],
        'sales_quota' => [
            'name' => 'sales_quota',
            'type' => 'currency'
        ],
        'period_date' => [
            'name' => 'period_date',
            'type' => 'date'
        ],
        'user' => [
            'name' => 'user',
            'type' => 'link',
            'relationship' => 'users_userquotas',
            'source' => 'non-db',
            'vname' => 'LBL_USER',
        ]
    ],
    'relationships' => [
        'users_userquotas' =>
            [
                'lhs_module' => 'Users',
                'lhs_table' => 'users',
                'lhs_key' => 'id',
                'rhs_module' => 'UserQuotas',
                'rhs_table' => 'userquotas',
                'rhs_key' => 'assigned_user_id',
                'relationship_type' => 'one-to-many'
            ]
    ],
    'indices' => [
        [
            'name' => 'idx_userquotasuserid',
            'type' => 'index',
            'fields' => ['assigned_user_id']
        ]
    ]
];

VardefManager::createVardef('UserQuotas', 'UserQuota', ['default', 'assignable']);
