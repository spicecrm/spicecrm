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

$dictionary['CompetitorAssessment'] = array(
    'table' => 'competitorassessments',
    'comment' => 'Competitor Assessments Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,
    //THIS FLAG ENABLES OPTIMISTIC LOCKING FOR SAVES FROM EDITVIEW
    'optimistic_locking'=>true,

    'fields' => array(
        'name' => array(
            'name' => 'name',
            'vname'  => 'LBL_COMPETITOR',
            'type'  => 'varchar',
            'len' => 150,
            'audited'  => false,
            'required'  => true,
            'comment'  => 'competitor name',
        ),
        'products' => array (
            'name' => 'products',
            'vname' => 'LBL_PRODUCTS',
            'type' => 'text',
            'required' => false,
            'massupdate' => false,
            'audited' => false,
        ),
        'differentitation' => array (
            'name' => 'differentitation',
            'vname' => 'LBL_DIFFERENTITATION',
            'type' => 'text',
            'required' => false,
            'massupdate' => false,
            'audited' => false,
        ),
        'weaknesses' => array (
            'name' => 'weaknesses',
            'vname' => 'LBL_WEAKNESSES',
            'type' => 'text',
            'required' => false,
            'massupdate' => false,
            'audited' => false,
        ),
        'strengths' => array (
            'name' => 'strengths',
            'vname' => 'LBL_STRENGTHS',
            'type' => 'text',
            'required' => false,
            'massupdate' => false,
            'audited' => false,
        ),
        'competitive_threat' => array (
            'name' => 'competitive_threat',
            'vname' => 'LBL_COMPETITIVE_THREAT',
            'type' => 'enum',
            'options' => 'competitive_threat_dom',
            'len' => 10,
            'required' => false,
            'massupdate' => false,
            'audited' => false,
        ),
        'competitive_status' => array (
            'name' => 'competitive_status',
            'vname' => 'LBL_COMPETITIVE_STATUS',
            'type' => 'enum',
            'options' => 'competitive_status_dom',
            'len' => 10,
            'required' => false,
            'massupdate' => false,
            'audited' => false,
        ),
        'opportunity_id' => array(
            'name' => 'opportunity_id',
            'vname'  => 'LBL_OPPORTUNITY_ID',
            'type'  => 'id',
            'audited'  => false,
            'required'  => true,
            'comment'  => '',
        ),
        'opportunity_name' => array(
            'name'=>'opportunity_name',
            'rname'=>'name',
            'vname' => 'LBL_OPPORTUNITY_NAME',
            'type' => 'relate',
            'reportable'=>false,
            'source'=>'non-db',
            'table' => 'opportunities',
            'id_name' => 'opportunity_id',
            'link' => 'opportunities',
            'module'=>'Opportunities',
            'duplicate_merge'=>'disabled',
            'comment' => 'Name of related opportunity',
        ),
        'opportunities' => array (
            'name' => 'opportunities',
			'vname' => 'LBL_OPPORTUNITIES_LINK',
            'type' => 'link',
            'relationship' => 'competitorassessments_opportunities',
            'link_type'=>'one',
            'side'=>'right',
            'source'=>'non-db',
            'vname'=>'LBL_OPPORTUNITIES',
        ),
    ),
    'indices' => array(
        array(
            'name' => 'idx_opp',
            'type' => 'index',
            'fields' => array('opportunity_id'),
        ),
        array(
            'name' => 'idx_oppdel',
            'type' => 'index',
            'fields' => array('opportunity_id', 'deleted'),
        ),
    ),
    'relationships' => array(
        'competitorassessments_opportunities' => array(
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'CompetitorAssessments',
            'rhs_table' => 'competitorassessments',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ),
    )
);

if ($GLOBALS['sugar_flavor'] != 'CE')
    VardefManager::createVardef('CompetitorAssessments', 'CompetitorAssessment', array('default', 'assignable', 'team_security'));
else
    VardefManager::createVardef('CompetitorAssessments', 'CompetitorAssessment', array('default', 'assignable'));