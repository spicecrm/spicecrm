<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
$subpanel_layout = array(
	'top_buttons' => array(
        array('widget_class' => 'SubPanelTopCreateButton'),
		array('widget_class' => 'SubPanelTopSelectButton', 'popup_module' => 'TRSystems'),
	),

	'where' => '',
	'list_fields' => array(

		'file_url'=>array(
			'usage'=>'query_only'
			),
		'filename'=>array(
			'usage'=>'query_only'
			),	
		'object_image'=>array(
			'vname' => 'LBL_OBJECT_IMAGE',
			'widget_class' => 'SubPanelIcon',
 		 	'width' => '2%',
 		 	'image2'=>'attachment',
 		 	'image2_url_field'=>'file_url'
		),	
	
        'name'=>array(
 			'vname' => 'LBL_LIST_NAME',
			'widget_class' => 'SubPanelDetailViewLink',
			'width' => '20%',
		),

		'system_type'=>array(
 			'vname' => 'LBL_SYSTEM_TYPE',
			'width' => '13%',
		),

		
		'virtueller_server'=>array(
 			'vname' => 'LBL_VIRTUELLER_SERVER',
			'width' => '13%',
		),
		
		'hostname'=>array(
 			'vname' => 'LBL_HOSTNAME',
			'width' => '13%',
		),

		'server_status'=>array(
 			'vname' => 'LBL_SERVER_STATUS',
			'width' => '13%',
		),
		
		'assigned_user_name'=>array(
 			'vname' => 'LBL_LIST_ASSIGNED_USER',
			//'widget_class' => 'SubPanelDetailViewLink',
			'width' => '20%',
		),



		'date_entered'=>array(
		 	'vname' => 'LBL_LIST_DATE_ENTERED',
			'width' => '9999%',
		),
		'date_modified'=>array(
		 	'vname' => 'LBL_LIST_DATE_MODIFIED',
			'width' => '9999%',
		),
		'edit_button'=>array(
			'vname' => 'LBL_EDIT_BUTTON',
			'widget_class' => 'SubPanelEditButton',
		 	'module' => 'KProjects',
			'width' => '9999%',
		),
		
	),
);

?>
