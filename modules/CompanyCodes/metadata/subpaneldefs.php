<?php

if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$layout_defs['CompanyCodes'] = array(
    'subpanel_setup' => array(
//        'kankaccounts' => array(
//            'order' => 10,
//            'module' => 'KAccountingBankaccounts',
//            'subpanel_name' => 'default',
//            'get_subpanel_data' => 'kcompanies_kbankaccounts',
//            'title_key' => 'LBL_BANKACCOUNTS_SUBPANEL_TITLE',
//            'top_buttons' => array(
//                array('widget_class' => 'SubPanelTopCreateButton'),
//            )
//        ),
        'companyfiscalperiods' => array(
            'order' => 10,
            'module' => 'CompanyFiscalPeriods',
            'subpanel_name' => 'default',
            'get_subpanel_data' => 'companyfiscalperiods',
            'title_key' => 'LBL_COMPANYFISCALPERIODS_SUBPANEL_TITLE',
            'sort_order' => 'asc',
            'sort_by' => 'fiscal_year, fiscal_month',
            'top_buttons' => array(
                array('widget_class' => 'SubPanelTopCreateButton'),
            )
        )
    )
);
?>
