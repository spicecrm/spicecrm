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


use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['opportunities_products'] = [
    'table' => 'opportunities_products',
    'contenttype' => 'relationdata',
    'fields' => [
        'id' => ['name' => 'id', 'type' => 'char', 'len' => 36],
        'opportunity_id' => ['name' => 'opportunity_id', 'type' => 'char', 'len' => 36],
        'product_id' => ['name' => 'product_id', 'type' => 'char', 'len' => 36],
        'date_modified' => ['name' => 'date_modified', 'type' => 'datetime'],
        'deleted' => ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'required' => false, 'default' => 0],
        'date_requested' => ['name' => 'date_requested', 'type' => 'date', 'vname' => 'LBL_DATE_REQUESTED'],
        'quantity' => ['name' => 'quantity','vname' => 'LBL_QUANTITY', 'type' => 'quantity', 'dbtype' => 'double'],
        ],
    'indices' => [
        ['name' => 'opportunities_productspk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'opportunities_productsalt', 'type' => 'alternate_key', 'fields' => ['opportunity_id', 'product_id']],
        ['name' => 'opportunities_products_oppproddel', 'type' => 'index', 'fields' => ['opportunity_id', 'product_id', 'deleted']],

    ],
    'relationships' => [
        'opportunities_products' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'Products',
            'rhs_table' => 'products',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'opportunities_products',
            'join_key_lhs' => 'opportunity_id',
            'join_key_rhs' => 'product_id',
        ],
    ],
];
