<?php

$viewdefs['KReleasePackages']['EditView'] = array(
    'templateMeta' => array(
        'form' => array(
            'hidden' =>
            array(
            //    '<input type="hidden" name="linkedfiles" id = "linkedfiles" value="{$fields.linkedfiles.value}">',
            ),
        ),
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        )
    ),
    'panels' => array(
        'lbl_kreleasepackages_main' => array(
            array(
                'name',
                'rpstatus'
            ),
            array(
                'release_date',
                'rptype'
            ), 
            array(
                'release_version', 
                'required_release_regex'
            ), 
            array(
                'set_version', 
                ''
            )
        ),
        'lbl_security_panel' => array(
            array(
                array('name' => 'assigned_user_name', 'displayParams' => array('WinWidth' => 1000, 'WinHeight' => 600),),
                array('name' => 'team_name', 'displayParams' => array('WinWidth' => 1000, 'WinHeight' => 600),)
            )
        )
    )
);
