<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
$GLOBALS['sugar_config']['disableAjaxUI'] = true;
$themedef = array(
    'name'  => "SpiceCRM Theme",
    'description' => "SpiceCRM Theme",
    'version' => array(
        'regex_matches' => array('2016\.*.*'),
        ),
    'group_tabs' => true,
    );
