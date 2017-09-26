<?php

$module_name = 'KDeploymentMWs';
$viewdefs[$module_name]['DetailView'] = array(
    'templateMeta' => array('form' => array('buttons' => array('EDIT', 'DUPLICATE', 'DELETE',
    )),
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
    ),

    'panels' => array(

        array(
            array('name' => 'name'),
            array('name' => 'mwstatus'),
        ),
        array(
            array('name' => 'from_date'),
            array('name' => 'to_date')
        ),

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
            ),
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
            array('name' => 'description'),
            array('name' => 'notified'),
        ),
    )
);
?>