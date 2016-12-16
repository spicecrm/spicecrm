<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
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

$listViewDefs['Proposals'] = array(
    'NAME' => array(
        'width'   => '30',
        'label'   => 'LBL_LIST_PROPOSAL_NAME',
        'link'    => true,
        'default' => true),
    'ACCOUNT_NAME' => array(
        'width'   => '20',
        'label'   => 'LBL_ACCOUNT_NAME',
        'id'      => 'ACCOUNT_ID',
        'module'  => 'Accounts',
        'link'    => true,
        'default' => true,
        'sortable'=> true,
        'ACLTag' => 'ACCOUNT',
        'related_fields' => array('account_id')),
    'OPPORTUNITY_NAME' => array(
        'width'   => '20',
        'label'   => 'LBL_OPPORTUNITY_NAME',
        'id'      => 'OPPORTUNITY_ID',
        'module'  => 'Opportunities',
        'link'    => true,
        'default' => true,
        'sortable'=> true,
        'ACLTag' => 'OPPORTUNITY',
        'related_fields' => array('opportunity_id')),
    'PROPOSALSTATUS' => array(
        'width'   => '10',
        'label'   => 'LBL_PROPOSALSTATUS',
        'default' => true),
    'AMOUNT' => array(
        'width'   => '10',
        'label'   => 'LBL_AMOUNT',
        'align'   => 'right',
        'default' => true,
        'currency_format' => true,
    ),
    'CREATED_BY_NAME' => array(
        'width' => '10',
        'label' => 'LBL_CREATED'),
    'ASSIGNED_USER_NAME' => array(
        'width' => '5',
        'label' => 'LBL_LIST_ASSIGNED_USER',
        'module' => 'Employees',
        'id' => 'ASSIGNED_USER_ID',
        'default' => true),
    'MODIFIED_BY_NAME' => array(
        'width' => '5',
        'label' => 'LBL_LIST_MODIFIED_USER'),
    'DATE_ENTERED' => array(
        'width' => '10',
        'label' => 'LBL_LIST_DATE_ENTERED',
        'default' => true)
);

