<?php

if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');


$listViewDefs['KReleasePackages'] = array(
    'NAME' => array(
        'width' => '20%',
        'label' => 'LBL_LIST_NAME',
        'link' => true,
        'default' => true,
    ),
    'RPTYPE' => array(
        'width' => '20%',
        'label' => 'LBL_RPTYPE',
        'link' => false,
        'default' => true,
    ),
    'RELEASE_DATE' => array(
        'width' => '20%',
        'label' => 'LBL_RELEASE_DATE',
        'link' => false,
        'default' => true,
    ),
    'RELEASE_VERSION' => array(
        'width' => '20%',
        'label' => 'LBL_RELEASE_VERSION',
        'link' => false,
        'default' => true,
    ),
);
