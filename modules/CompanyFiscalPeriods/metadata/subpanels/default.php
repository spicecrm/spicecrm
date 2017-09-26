<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$subpanel_layout = array(
    'top_buttons' => array(
        array(
            'widget_class' => 'SubPanelTopCreateButton',
        ),
        array(
            'widget_class' => 'SubPanelTopSelectButton', 'popup_module' => 'CompanyFiscalPeriods'
        ),
    ),
    'list_fields' => array(
        'name' => array(
            'vname' => 'LBL_NAME',
            'widget_class' => 'SubPanelDetailViewLink',
            'width' => '15%',
        ),
//        'assigned_user_name' => array(
//            'vname' => 'LBL_LIST_ASSIGNED_USER',
//            'width' => '10%',
//        ),
        'edit_button' => array(
            'vname' => 'LBL_EDIT_BUTTON',
            'widget_class' => 'SubPanelEditButton',
            'width' => '2%',
        ),
        'remove_button' => array(
            'vname' => 'LBL_REMOVE',
            'widget_class' => 'SubPanelRemoveButton',
            'width' => '2%',
        ),
    ),
);

