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

$dictionary['SpiceThemePage'] = array(
    'table' => 'spicethemepages',
    'audited' => true,
    'fields' => array(
        'page_index' => array(
            'name' => 'page_index',
            'vname' => 'LBL_PAGE_INDEX',
            'type' => 'varchar',
            'len' => 3,
            'required' => false,
            'reportable' => true,
            'massupdate' => false,
        ),
        'page_priority' => array(
            'name' => 'page_priority',
            'vname' => 'LBL_PAGE_PRIORITY',
            'type' => 'varchar',
            'len' => 3,
            'required' => false,
            'reportable' => true,
            'massupdate' => false,
        ),
        'page_position_first' => array(
            'name' => 'page_position_first',
            'vname' => 'LBL_PAGE_POSITION_FIRST',
            'type' => 'bool',
            'required' => false,
            'reportable' => true,
            'massupdate' => false,
        ),
        //=> ACCOUNT
        'puser_id' => array(
            'name' => 'puser_id',
            'vname' => 'LBL_PUSER_ID',
            'type' => 'id',
            //'source'					=> 'non-db',
            'audited' => true,
        ),
        'puser_link' => array(
            'name' => 'puser_link',
            'type' => 'link',
            'relationship' => 'puser_spicethemepages',
            'source' => 'non-db',
            'link_type' => 'one',
            'module' => 'Users',
            'bean_name' => 'User',
            'vname' => 'LBL_PUSERS',
        ),
        'puser_name' => array(
            'name' => 'puser_name',
            'rname' => 'user_name',
            'id_name' => 'puser_id',
            'vname' => 'LBL_PUSER_NAME',
            'type' => 'relate',
            'table' => 'users',
            'join_name' => 'pusers',
            'isnull' => 'true',
            'module' => 'Users',
            'dbType' => 'varchar',
            'link' => 'puser_link',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
            'required' => true,
            'importable' => 'required',
        ),
        'ausers_link' => array(
            'name' => 'ausers_link',
            'type' => 'link',
            'relationship' => 'ausers_spicethemepages',
            'source' => 'non-db',
            'link_type' => 'one',
            'module' => 'Users',
            'bean_name' => 'User',
            'vname' => 'LBL_AUSERS_LINK',
        ),
        'aclroles_link' => array(
            'name' => 'aclroles_link',
            'type' => 'link',
            'relationship' => 'aclroles_spicethemepages',
            'source' => 'non-db',
            'link_type' => 'one',
            'module' => 'ACLRoles',
            'bean_name' => 'ACLRole',
            'vname' => 'LBL_ACLROLES_LINK',
        )
    ),
    'indices' => array(
        array('name' => 'idx_spicethemepages_id_del', 'type' => 'index', 'fields' => array('id', 'deleted'),),
    ),
    'relationships' => array(
        'puser_spicethemepages' => array(
            'rhs_module' => 'SpiceThemePages',
            'rhs_table' => 'spicethemepages',
            'rhs_key' => 'puser_id',
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'relationship_type' => 'one-to-many'
        )
    ),
    'optimistic_lock' => true,
);


require_once('include/SugarObjects/VardefManager.php');

if ($GLOBALS['sugar_flavor'] == 'PRO')
    VardefManager::createVardef('SpiceThemePages', 'SpiceThemePage', array('default', 'assignable', 'team_security'));
else
    VardefManager::createVardef('SpiceThemePages', 'SpiceThemePage', array('default', 'assignable'));

