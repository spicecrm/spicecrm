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

// adding project-to-bugs relationship
$dictionary['productgroups_productattributes'] = [
    'table' => 'productgroups_productattributes',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'productgroup_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'productattribute_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'prod_proda_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_prod_prodg', 'type' =>'index', 'fields'=> ['productgroup_id']],
        ['name' => 'idx_prod_proda', 'type' =>'index', 'fields'=> ['productattribute_id']]
    ],
    'relationships' => [
        'productgroups_productattributes' => [
            'lhs_module' => 'ProductGroups',
            'lhs_table' => 'productgroups',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductAttributes',
            'rhs_table' => 'productattributes',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'productgroups_productattributes',
            'join_key_lhs' => 'productgroup_id',
            'join_key_rhs' => 'productattribute_id'
        ]
    ]
];

$dictionary['productvariants_resellers'] = [
    'table' => 'productvariants_resellers',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'productvariant_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'account_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'prodvar_resellers_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_prodvar_resellers_acc', 'type' =>'index', 'fields'=> ['account_id']],
        ['name' => 'idx_prodvar_resellers_pv', 'type' =>'index', 'fields'=> ['productvariant_id']]
    ],
    'relationships' => [
        'productvariants_resellers' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductVariants',
            'rhs_table' => 'productvariants',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'productvariants_resellers',
            'join_key_lhs' => 'account_id',
            'join_key_rhs' => 'productvariant_id'
        ]
    ]
];
