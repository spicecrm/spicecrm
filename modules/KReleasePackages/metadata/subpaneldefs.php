<?php

if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$layout_defs['KReleasePackages'] = array(
    'subpanel_setup' => array(
        'kchangerequests' => array(
            'order' => 10,
            'module' => 'KDeploymentCRs',
            'sort_order' => 'asc',
            'sort_by' => 'crid',
            'get_subpanel_data' => 'kchangerequests',
            'subpanel_name' => 'default',
            'title_key' => 'LBL_CHANGEREQUESTS',
        )
    )
);
