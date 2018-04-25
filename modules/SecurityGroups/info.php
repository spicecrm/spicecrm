<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

/** old...
global $sugar_config;
require_once('XTemplate/xtpl.php');
$xtpl=new XTemplate ('modules/SecurityGroups/info.html');               
$xtpl->assign("sugar_version", $sugar_config['sugar_version']);
$xtpl->parse("main");
$xtpl->out("main");
*/

global $sugar_version, $sugar_flavor, $server_unique_key, $current_language, $app_strings;

$sugaroutfitters_url = "https://www.sugaroutfitters.com/start/store?utm_sugarcrm_version={$sugar_version}&utm_sugarcrm_edition={$sugar_flavor}&utm_sugarcrm_lang={$current_language}&install=1";

if(!empty($tag)) {
    $sugaroutfitters_url .= "&tag=eggsurplus";
}

?>

<link rel="stylesheet" type="text/css" href="modules/SecurityGroups/style.css"/>

<h1>Features</h1>
<iframe src="https://www.sugaroutfitters.com/docs/securitysuite/options?embedded=true" width="100%" height="400px" tabindex="1" title="SecuritySuite - Options" class="so-doc-box"></iframe>

<iframe src="<?php echo $sugaroutfitters_url; ?>" width="100%" height="400px" tabindex="1" title="SugarOutfitters store" class="so-store-box" scrolling="no"></iframe>

