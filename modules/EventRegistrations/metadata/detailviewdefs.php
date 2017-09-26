<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$viewdefs['EventRegistrations']['DetailView'] = array(
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
        // 'headerPanel' => 'modules/EventRegistrations/EventRegistrationGuide.php',
    ),
    'panels' => array(
        // 'helper' => 'modules/EventRegistrations/EventRegistrationGuide.php',
        'LBL_MAINDATA' => array(
            array(
                array('name' => 'campaign_name'),
                array('name' => 'contact_name'),
            ),
            array(
                array('name' => 'registration_status'),
                null,
            ),
		)
	)
);
