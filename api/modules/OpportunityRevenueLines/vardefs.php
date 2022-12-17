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


use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['OpportunityRevenueLine'] = [
    'table' => 'opportunityrevenuelines',
    'comment' => 'Split Opportunity Revenue in recognition lines',
    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => 255,
            'required' => false,
        ],
        'revenue_date' => [
            'name' => 'revenue_date',
            'vname' => 'LBL_DATE',
            'type' => 'date',
            'required' => true
        ],
        'amount' => [
            'name' => 'amount',
            'vname' => 'LBL_AMOUNT',
            //'function'=>array('vname'=>'getCurrencyType'),
            'type' => 'currency',
            'dbType' => 'double',
            'comment' => 'Unconverted amount of the opportunity',
            'importable' => 'required',
            'duplicate_merge' => '1',
            'required' => true,
            'options' => 'numeric_range_search_dom',
            'enable_range_search' => true,
        ],
        'amount_usdollar' => [ /**@deprecated **/
            'name' => 'amount_usdollar',
            'vname' => 'LBL_AMOUNT_USDOLLAR',
            'type' => 'currency',
            'dbType' => 'double',
            'disable_num_format' => true,
            'audited' => true
        ],
        'amount_systemcurrency' => [
            'name' => 'amount_systemcurrency',
            'vname' => 'LBL_AMOUNT_SYSTEMCURRENCY',
            'type' => 'currency',
            'dbType' => 'double',
            'disable_num_format' => true,
            'audited' => true
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'opportunity_opportunityrevenuelines',
            'source' => 'non-db',
            'link_type' => 'one',
            'module' => 'Opportunities',
            'bean_name' => 'Opportunity',
            'vname' => 'LBL_OPPORTUNITY',
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_opp_id',
            'type' => 'index',
            'fields' => ['opportunity_id'],
        ]
    ],
    'relationships' => [
        'opportunity_opportunityrevenuelines' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'OpportunityRevenueLines',
            'rhs_table' => 'opportunityrevenuelines',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ]
    ]
    //This enables optimistic locking for Saves From EditView
, 'optimistic_locking' => true,
];
VardefManager::createVardef('OpportunityRevenueLines', 'OpportunityRevenueLine', ['basic', 'assignable']);
