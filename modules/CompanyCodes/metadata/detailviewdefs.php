<?php

$viewdefs['CompanyCodes']['DetailView'] = array(
    'templateMeta' => array(
        'useTabs' => false,
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
        'form' => array(
            'buttons' => array(
                'EDIT',
                'DUPLICATE',
                'DELETE',
            ),
        ),
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
                    'label' => 'LBL_COMPANY_ADDRESS',
                    'type' => 'address',
                    'displayParams' =>
                    array(
                        'key' => 'company',
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
        'lbl_admin_panel' => array(
            array(
                array(
                    'name' => 'date_entered',
                    'customCode' => '{$fields.date_entered.value} {$APP.LBL_BY} {$fields.created_by_name.value}',
                    'label' => 'LBL_DATE_ENTERED',
                ),
                array(
                    'name' => 'date_modified',
                    'customCode' => '{$fields.date_modified.value} {$APP.LBL_BY} {$fields.modified_by_name.value}',
                    'label' => 'LBL_DATE_MODIFIED',
                )
            )
        )
    )
);

