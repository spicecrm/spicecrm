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

$vardefs = [
    'fields' => [
        'assigned_orgunit_id' => [
            'name' => 'assigned_orgunit_id',
            'vname' => 'LBL_ASSIGNED_TO_ORGUNITID',
            'type' => 'varchar',
            'dbtype' => 'char',
            'reportable' => true,
            'len' => '36',
            'audited' => true,
            'comment' => 'OrgUnit ID assigned to record'
        ],
        'assigned_orgunit' => [
            'name' => 'assigned_orgunit',
            'link' => 'assigned_orgunit_link',
            'vname' => 'LBL_ASSIGNED_ORGUNIT',
            'rname' => 'name',
            'type' => 'linked',
            'reportable' => false,
            'source' => 'non-db',
            'table' => 'orgunits',
            'module' => 'OrgUnits',
            'id_name' => 'assigned_orgunit_id'
        ],
        'assigned_orgunit_link' => [
            'name' => 'assigned_orgunit_link',
            'type' => 'link',
            'relationship' => strtolower($module) . '_assigned_orgunit',
            'vname' => 'LBL_ASSIGNED_TO_ORGUNIT',
            'link_type' => 'one',
            'source' => 'non-db'
        ]
    ],
    'relationships' => [
        strtolower($module) . '_assigned_orgunit' => [
            'lhs_module' => 'OrgUnits',
            'lhs_table' => 'orgunits',
            'lhs_key' => 'id',
            'rhs_module' => $module,
            'rhs_table' => strtolower($module),
            'rhs_key' => 'assigned_orgunit_id',
            'relationship_type' => 'one-to-many'
        ]
    ]
];
