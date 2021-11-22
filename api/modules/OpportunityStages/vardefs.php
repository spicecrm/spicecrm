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
global $dictionary;
$dictionary['OpportunityStage'] = [
    'table' => 'opportunitystages',
    'comment' => 'track opportunity stage changes',
    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'name',
            'dbType' => 'varchar',
            'len' => '50',
            'required' => false
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
        'amount_usdollar' => [
            'name' => 'amount_usdollar',
            'vname' => 'LBL_AMOUNT_USDOLLAR',
            'type' => 'currency',
            'group' => 'amount',
            'dbType' => 'double',
            'disable_num_format' => true,
            'audited' => true
        ],
        'forecast' => [
            'name' => 'forecast',
            'vname' => 'LBL_FORECAST',
            'type' => 'bool'
        ],
        'budget' => [
            'name' => 'budget',
            'vname' => 'LBL_BUDGET',
            'type' => 'currency',
            'dbType' => 'double',
        ],
        'bestcase' => [
            'name' => 'bestcase',
            'vname' => 'LBL_BESTCASE',
            'type' => 'currency',
            'dbType' => 'double',
        ],
        'worstcase' => [
            'name' => 'worstcase',
            'vname' => 'LBL_WORSTCASE',
            'type' => 'currency',
            'dbType' => 'double',
        ],
        'currency_id' => [
            'name' => 'currency_id',
            'type' => 'id',
            'group' => 'currency_id',
            'vname' => 'LBL_CURRENCY',
        ],
        'date_closed' => [
            'name' => 'date_closed',
            'vname' => 'LBL_DATE_CLOSED',
            'type' => 'date',
            'audited' => true
        ],
        'sales_stage' => [
            'name' => 'sales_stage',
            'vname' => 'LBL_SALES_STAGE',
            'type' => 'enum',
            'options' => 'sales_stage_dom',
            'len' => '255',
            'audited' => true,
        ],
        'probability' => [
            'name' => 'probability',
            'vname' => 'LBL_PROBABILITY',
            'type' => 'int',
            'dbtype' => 'double',
            'audited' => true,
        ],
        'opportunity_id' => [
            'name' => 'opportunity_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'opportunities' => [
            'name' => 'opportunities',
            'type' => 'link',
            'relationship' => 'opportunity_opportunitystages',
            'source' => 'non-db',
            'link_type' => 'one',
            'module' => 'Opportunities',
            'bean_name' => 'Opportunity',
            'vname' => 'LBL_OPPORTUNITY',
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_opp_id',
            'type' => 'index',
            'fields' => ['opportunity_id'],
        ]
    ],
    'relationships' => [
        'opportunity_opportunitystages' => [
            'lhs_module' => 'Opportunities',
            'lhs_table' => 'opportunities',
            'lhs_key' => 'id',
            'rhs_module' => 'OpportunityStages',
            'rhs_table' => 'opportunitystages',
            'rhs_key' => 'opportunity_id',
            'relationship_type' => 'one-to-many',
        ]
    ]
    //This enables optimistic locking for Saves From EditView
, 'optimistic_locking' => true,
];
VardefManager::createVardef('OpportunityStages', 'OpportunityStage', ['default', 'assignable',
]);
