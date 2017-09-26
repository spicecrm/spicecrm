<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$viewdefs['CompanyFiscalPeriods']['DetailView'] = array(
    'templateMeta' => array(
        'form' => array(
            'buttons' => array('EDIT', 'DUPLICATE', 'DELETE')
        ),
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
        'useTabs' => false,
        'tabDefs' => array(
            'LBL_MAINDATA' => array(
                'newTab' => true
            ),
            'LBL_PANEL_ASSIGNMENT' => array(
                'newTab' => true
            )
        ),
    ),
    'panels' => array(
        'LBL_MAINDATA' => array(
            array(
                array('name' => 'name', 'type' => 'readonly'),
                array('name' => 'companycode_name'),

            ),
            array(
                array('name' => 'cal_date_start'),
                array('name' => 'cal_date_end'),
            ),
            array(
                array('name' => 'cal_quarter'),
                null,
            ),
            array(
                array('name' => 'fiscal_date_start'),
                array('name' => 'fiscal_date_end'),
            ),
            array(
                array('name' => 'fiscal_year'),
                array('name' => 'fiscal_month'),
            ),
            array(
                array('name' => 'fiscal_quarter'),
                null,
            ),
		)
	)
);
