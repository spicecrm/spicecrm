<?php

$viewdefs['CompanyCodes']['EditView'] = array(
    'templateMeta' => array(
        'form' => array(),
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        )
    ),
    'panels' => array(
        'lbl_companycodes_main' => array(
            array(
                'name',
                'vatid'
            ),
            array(
                array(
                    'name' => 'company_address_street',
                    'hideLabel' => true,
                    'type' => 'address',
                    'displayParams' =>
                    array(
                        'key' => 'company',
                        'rows' => 2,
                        'cols' => 30,
                        'maxlength' => 150,
                    ),
                ),
                'companycode'
            )
        ),
        'lbl_output_panel' => array(
            array(
                'header_from',
                'footer_1'
            ),
            array(
                '',
                'footer_2'
            ),
            array(
                '',
                'footer_3'
            ),
        ),
        'lbl_security_panel' => array(
            array(
                array('name' => 'assigned_user_name', 'displayParams' => array('WinWidth' => 1000, 'WinHeight' => 600),),
                //array('name' => 'team_name', 'displayParams' => array('WinWidth' => 1000, 'WinHeight' => 600),)
            )
        )
    ),
);

