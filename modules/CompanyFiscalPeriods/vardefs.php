<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$dictionary['CompanyFiscalPeriod'] = array(
    'table' => 'companyfiscalperiods',
    'comment' => 'CompanyFiscalPeriods Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,
	
	'fields' => array(
	    'cal_date_start' => array(
	        'name' => 'cal_date_start',
            'vname' => 'LBL_CAL_DATE_START',
            'type' => 'date',
            'required' => true,
            'comment' => 'common calendar date start'
        ),
        'cal_date_end' => array(
            'name' => 'cal_date_end',
            'vname' => 'LBL_CAL_DATE_END',
            'type' => 'date',
            'required' => true,
            'comment' => 'common calendar date end'
        ),
        'cal_quarter' => array(
            'name' => 'cal_quarter',
            'vname' => 'LBL_CAL_QUARTER',
            'type' => 'tinyint',
            'len' => 1,
            'required' => true,
            'disable_num_format' => true,
            'comment' => 'common calendar date end'
        ),
        'fiscal_date_start' => array(
            'name' => 'fiscal_date_start',
            'vname' => 'LBL_FISCAL_DATE_START',
            'type' => 'date',
            'required' => true,
            'comment' => 'fiscal calendar date start'
        ),
        'fiscal_date_end' => array(
            'name' => 'fiscal_date_end',
            'vname' => 'LBL_FISCAL_DATE_END',
            'type' => 'date',
            'required' => true,
            'comment' => 'fiscal calendar date end'
        ),
        'fiscal_year' => array(
            'name' => 'fiscal_year',
            'vname' => 'LBL_FISCAL_YEAR',
            'type' => 'int',
            'len' => 4,
            'required' => true,
            'disable_num_format' => true,
            'comment' => 'common calendar date end'
        ),
        'fiscal_month' => array(
            'name' => 'fiscal_month',
            'vname' => 'LBL_FISCAL_MONTH',
            'type' => 'tinyint',
            'len' => 2,
            'required' => true,
            'comment' => 'common calendar date end'
        ),
        'fiscal_quarter' => array(
            'name' => 'fiscal_quarter',
            'vname' => 'LBL_FISCAL_QUARTER',
            'type' => 'tinyint',
            'len' => 1,
            'required' => true,
            'comment' => 'common calendar date end'
        ),

        //=> Company codes
        'companycode_id' => array(
            'name' => 'companycode_id',
            'vname' => 'LBL_COMPANYCODE_ID',
            'type' => 'id',
            'required' => true,
            'comment' => 'ID of company code that uses this information'
        ),
        'companycode_name' => array(
            'name' => 'companycode_name',
            'vname' => 'LBL_COMPANYCODE_NAME',
            'type' => 'relate',
            'module' => 'CompanyCodes',
            'bean_name' => 'CompanyCode',
            'id_name' => 'companycode_id',
            'rname' => 'name',
            'link' => 'companycodes',
            'source' => 'non-db',
            'required' => true,
            'comment' => 'Name of company code that uses this information'
        ),
        'companycodes' => array(
            'name' => 'companycodes',
            'vname' => 'LBL_COMPANYCODES',
            'type' => 'link',
            'link_type' => 'one',
            'relationship' => 'cfperiods_companycodes',
            'source' => 'non-db',
            'coment' => 'Link to CompanyCodes module'
        )
	),
	'relationships' => array(
	    'cfperiods_companycodes' => array(
	        'lhs_module' => 'CompanyCodes',
            'lhs_table' => 'companycodes',
            'lhs_key' => 'id',
            'rhs_module' => 'CompanyFiscalPeriods',
            'rhs_table' => 'companyfiscalperiods',
            'rhs_key' => 'companycode_id',
            'relationship_type'=>'one-to-many',
        )
	),
	'indices' => array(
	    array('name' => 'cfpid', 'type' => 'index', 'fields' => array('companycode_id', 'deleted'))
	)
);
if ($GLOBALS['sugar_flavor'] != 'CE')
    VardefManager::createVardef('CompanyFiscalPeriods', 'CompanyFiscalPeriod', array('default', 'assignable', 'team_security'));
else
    VardefManager::createVardef('CompanyFiscalPeriods', 'CompanyFiscalPeriod', array('default', 'assignable'));
