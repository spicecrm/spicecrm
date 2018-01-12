<?php

if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');


$listViewDefs['CompanyCodes'] = array(
    'NAME' => array(
        'width' => '20%',
        'label' => 'LBL_LIST_NAME',
        'link' => true,
        'default' => true,
    ),
    'COMPANYCODE' => array(
        'width' => '20%',
        'label' => 'LBL_LIST_NAME',
        'link' => false,
        'default' => true,
    ),
    'VATID' => array(
        'width' => '20%',
        'label' => 'LBL_VATID',
        'module' => 'Accounts',
        'id' => 'PUSER_ID',
        'link' => true,
        'default' => true,
        'sortable' => true,
        'ACLTag' => 'USER',
        'related_fields' => array('puser_id')
    )
);

