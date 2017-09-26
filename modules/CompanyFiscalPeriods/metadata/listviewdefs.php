<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$listViewDefs['CompanyFiscalPeriods'] = array(
    'NAME' => array(
        'width' => '30',
        'label' => 'LBL_NAME',
        'link' => true,
        'default' => true
    ),
    'FISCAL_YEAR' => array(
        'width' => '30',
        'label' => 'LBL_FISCAL_YEAR',
        'link' => false,
        'default' => false
    ),
    'FISCAL_MONTH' => array(
        'width' => '30',
        'label' => 'LBL_FISCAL_MONTH',
        'link' => false,
        'default' => false
    ),
    'CAL_DATE_START' => array(
        'width' => '30',
        'label' => 'LBL_CAL_DATE_START',
        'link' => false,
        'default' => false
    ),
    'CAL_DATE_END' => array(
        'width' => '30',
        'label' => 'LBL_CAL_DATE_END',
        'link' => false,
        'default' => false
    ),
    'ASSIGNED_USER_NAME' => array(
        'width' => '5',
        'label' => 'LBL_LIST_ASSIGNED_USER',
        'module' => 'Employees',
        'id' => 'ASSIGNED_USER_ID',
        'default' => false
	),
    'CREATED_BY_NAME' => array(
        'width' => '10',
        'label' => 'LBL_CREATED',
        'default' => false
	),
    'MODIFIED_BY_NAME' => array(
        'width' => '5',
        'label' => 'LBL_MODIFIED',
        'default' => true
	),
    'DATE_MODIFIED' => array(
        'width' => '10',
        'label' => 'LBL_DATE_MODIFIED',
        'default' => true
	),
    'DATE_ENTERED' => array(
        'width' => '10',
        'label' => 'LBL_DATE_ENTERED',
        'default' => false
	)
);
