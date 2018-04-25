<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$viewdefs['CampaignTasks']['DetailView'] = array(
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
        // 'headerPanel' => 'modules/CampaignTasks/CampaignTaskGuide.php',
    ),
    'panels' => array(
        // 'helper' => 'modules/CampaignTasks/CampaignTaskGuide.php',
        'LBL_MAINDATA' => array(
            array(
                array('name' => 'name'),
                null,
            ),
		)
	)
);
