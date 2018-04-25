<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$html = <<<EOQ
<link rel="stylesheet" type="text/css" href="modules/SecurityGroups/style.css"/>

<div class="so-info">
    <h1>Add a Custom Layout for Any Group</h1>
    <br/>
    <p>Have fields that your sales team needs, but your support team doesn't?</p>
    
    <p>With SecuritySuite - Full Edition you can create custom layouts for any group. Great for both optimizing the interface by removing unneeded fields and for hiding sensitive information.
    </p>
    <a href="https://www.sugaroutfitters.com/docs/securitysuite/features" target="_blank">Learn more about all of the available features in SecuritySuite - Full Edition</a>
    <br/><br/>
    <div class="so-center">
        <img class="so-shadow" src="https://www.eggsurplus.com/addons/ss_customlayouts.png" width="432" height="442"/>
    </div>
    <div class="so-center so-cta-container">
        <a href="https://www.sugaroutfitters.com/addons/securitysuite/pricing" target="_blank" class="so-btn so-btn-cta so-btn-cta-lg">
            See Plans and Pricing<br/>
            <span class="so-cta-small">30-day free trial, sign up in 60 seconds</span>
        </a>
    </div>
</div>
EOQ;

$mb_mod_strings = return_module_language($current_language, 'ModuleBuilder');

require_once('modules/ModuleBuilder/MB/AjaxCompose.php');
$ajax = new AjaxCompose();
$ajax->addCrumb($mb_mod_strings['LBL_STUDIO'], 'ModuleBuilder.getContent("module=ModuleBuilder&action=wizard")');
$ajax->addCrumb($mb_mod_strings['LBL_ADD_GROUP_LAYOUT'], '');


$ajax->addSection('center', $mb_mod_strings['LBL_ADD_GROUP_LAYOUT'], $html);


echo $ajax->getJavascript();
        
        