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
                    array('name' => 'disable_login',),
                ),
                array(
                    array('name' => 'disable_login_description', 'customCode' => '{sugar_translate module="KDeploymentMWs" label="LBL_DISABLE_LOGIN_DESCRIPTION"}'),
                ),
                array(
                    array('name' => 'disable_krest'),
                ),
                array (
                    array('name' => 'disable_krest_description', 'customCode' => '{sugar_translate module="KDeploymentMWs" label="LBL_DISABLE_KREST_DESCRIPTION"}'),
                ),
                array(
                    array('name' => 'disable_cron'),
                ),
                array(
                    array('name' => 'disable_cron_description', 'customCode' => '{sugar_translate module="KDeploymentMWs" label="LBL_DISABLE_CRON_DESCRIPTION"}')
                ),

                array(
                    'description',
                ),
            ),
    ),
);