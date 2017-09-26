<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
$module_name = 'KDeploymentMWs';
$subpanel_layout = array(
    'top_buttons' => array(
        array('widget_class' => 'SubPanelTopCreateButton'),
        array('widget_class' => 'SubPanelTopSelectButton', 'popup_module' => $module_name),
    ),

    'where' => '',

    'list_fields' => array(
        'name' => array(
            'vname' => 'LBL_NAME',
            'widget_class' => 'SubPanelDetailViewLink',
            'width' => '45%',
        ),
        'from_date' => array(
            'vname' => 'LBL_FROM_DATE',
            'width' => '10%',
        ),
        'to_date' => array(
            'vname' => 'LBL_TO_DATE',
            'width' => '10%',
        ),
        'date_modified' => array(
            'vname' => 'LBL_DATE_MODIFIED',
            'width' => '10%',
        ),
        'edit_button' => array(
            'widget_class' => 'SubPanelEditButton',
            'module' => $module_name,
            'width' => '4%',
        ),
        'remove_button' => array(
            'widget_class' => 'SubPanelRemoveButton',
            'module' => $module_name,
            'width' => '5%',
        ),
    ),
);

?>