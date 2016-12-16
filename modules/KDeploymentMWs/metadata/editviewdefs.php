<?php
$module_name = 'KDeploymentMWs';
$viewdefs[$module_name]['EditView'] = array(
    'templateMeta' => array('maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
    ),
    'panels' => array(
        'default' =>
            array(
                array(
                    'name',
                    'mwstatus'
                ),
                array(
                    array('name' => 'from_date','type' => 'datetimecombo', 'displayParams' => array('required' => true)),
                    array('name' => 'to_date','type' => 'datetimecombo', 'displayParams' => array('required' => true))
                ),
                array(
                    'description',
                ),
            ),
    ),
);