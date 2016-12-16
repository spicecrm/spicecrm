<?php

if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$searchFields['KReleasePackages'] =
        array(
            'name' => array('query_type' => 'default', 'operator'=> 'like'),
            'current_user_only' => array('query_type' => 'default', 'db_field' => array('assigned_user_id'), 'my_items' => true, 'vname' => 'LBL_CURRENT_USER_FILTER', 'type' => 'bool'),
            'assigned_user_id' => array('query_type' => 'default'),
);
?>
