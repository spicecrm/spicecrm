<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/




if( !isset( $install_script ) || !$install_script ){
    die($mod_strings['ERR_NO_DIRECT_SCRIPT']);
}
// $mod_strings come from calling page.

$langDropDown = get_select_options_with_id($supportedLanguages, $current_language);

///////////////////////////////////////////////////////////////////////////////
////	START OUTPUT

$langHeader = get_language_header();
$out = <<<EOQ
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html {$langHeader}>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   <meta http-equiv="Content-Style-Type" content="text/css">
   <title>{$mod_strings['LBL_WIZARD_TITLE']} {$mod_strings['LBL_TITLE_WELCOME']} {$setup_sugar_version} {$mod_strings['LBL_WELCOME_SETUP_WIZARD']}</title>
   <link REL="SHORTCUT ICON" HREF="include/images/spice_icon.png">
   <link rel="stylesheet" href="install/install.css" type="text/css">
</head>

<body onload="javascript:document.getElementById('button_next2').focus();">
	<form action="install.php" method="post" name="form" id="form">
  <table cellspacing="0" cellpadding="0" border="0" align="center" class="shell">
  <tr><td colspan="2" id="help"><a href="{$help_url}" target='_blank'>{$mod_strings['LBL_HELP']} </a></td></tr>
    <tr>
			<th width="500">
		<!--p>
		<img src="{$sugar_md}" alt="SpiceCRM" border="0">
		</p-->
		{$mod_strings['LBL_TITLE_WELCOME']} {$setup_sugar_version} {$mod_strings['LBL_WELCOME_SETUP_WIZARD']}</th>
    </tr>
   <tr>
      <td  id="ready_image"><IMG src="include/images/spice_big.png" width="700" alt="SpiceCRM" border="0"></td>
    </tr>
                <td>
			    {$mod_strings['LBL_WELCOME_CHOOSE_LANGUAGE']}: <select name="language" onchange='this.form.submit()';>{$langDropDown}</select>
                </td>
                <td>
			    &nbsp;
                </td>
    </tr>

    <tr>
			<td align="right">
        <hr>
        <table cellspacing="0" cellpadding="0" border="0" class="stdTable">
          <tr>
                <td>
						    <input type="hidden" name="current_step" value="{$next_step}">
						</td>
					    <td>
					        <input class="button paper-button-0 next" raised="" role="button" tabindex="0" animated="" aria-disabled="false" elevation="1" type="submit" name="goto" value="{$mod_strings['LBL_NEXT']}" id="button_next2" />
			            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
	</form>
    <script>
        function showtime(div){

            if(document.getElementById(div).style.display == ''){
                document.getElementById(div).style.display = 'none';
                document.getElementById('adv_'+div).style.display = '';
                document.getElementById('basic_'+div).style.display = 'none';
            }else{
                document.getElementById(div).style.display = '';
                document.getElementById('adv_'+div).style.display = 'none';
                document.getElementById('basic_'+div).style.display = '';
            }

        }
    </script>
</body>
</html>
EOQ;

$error_found = false;
if (version_compare(phpversion(),'5.4.0') < 0) {
	if(empty($mod_strings['LBL_MINIMUM_PHP_VERSION'])){
		$mod_strings['LBL_MINIMUM_PHP_VERSION'] = 'Minimum Php version required is 5.4.0.';
	}
    $error_found = true;
    $error_txt .= '
      <tr>
        <td><strong>'.$mod_strings['LBL_MINIMUM_PHP_VERSION'].'</strong></td>
        <td class="error">'.$mod_strings['ERR_CHECKSYS_PHP_INVALID_VER'].' '.phpversion().'</td>
      </tr>';

$php_verison_warning =<<<eoq
	    <table width="100%" cellpadding="0" cellpadding="0" border="0" class="Welcome">
			<tr>
		      <td colspan="2"  align="center" id="ready_image"><IMG src="include/images/spice_big.png" width="700" alt="SpiceCRM" border="0"></td>
		    </tr>
			<th colspan="2" align="center">
				<h1><span class='error'><b>{$mod_strings['LBL_MINIMUM_PHP_VERSION']}</b></span></h1>
			</th>
	</table>
eoq;
}

//create cache, custom and upload folders
if(!is_dir('cache')) {
    if(!@mkdir('cache', 0766)){
        $error_found = true;
        $error_txt .= '
          <table width="100%" cellpadding="0" cellpadding="0" border="0"><tr>
            <td><strong>'.$mod_strings['ERR_CHECKSYS_CACHE_NOT_CREATEABLE'].'</strong></td>
            <td class="error">'.$mod_strings['ERR_CHECKSYS_CACHE_NOT_CREATEABLE'].'</td>
          </tr></table>';
    }
}
if(!is_dir('custom')) {
    if(!@mkdir('custom', 0766)){
        $error_found = true;
        $error_txt .= '
          <table width="100%" cellpadding="0" cellpadding="0" border="0"><tr>
            <td><strong>'.$mod_strings['ERR_CHECKSYS_CACHE_NOT_CREATEABLE'].'</strong></td>
            <td class="error">'.$mod_strings['ERR_CHECKSYS_CACHE_NOT_CREATEABLE'].'</td>
          </tr></table>';
    }
}
if(!is_dir('upload')) {
    if(!@mkdir('upload', 0766)){
        $error_found = true;
        $error_txt .= '
          <table width="100%" cellpadding="0" cellpadding="0" border="0"><tr>
            <td><strong>'.$mod_strings['ERR_CHECKSYS_UPLOAD_NOT_CREATEABLE'].'</strong></td>
            <td class="error">'.$mod_strings['ERR_CHECKSYS_UPLOAD_NOT_CREATEABLE'].'</td>
          </tr></table>';
    }
}

// config_override.php
if((file_exists('./config_override.php') && (!(make_writable('./config_override.php')) ||  !(is_writable('./config_override.php')))) 
        || !is_writable('.') || (file_exists('./config.php') && (!(make_writable('./config.php')) ||  !(is_writable('./config.php')))) || (!is_writable('./custom') && !make_writable('./custom')) || (!is_writable('./cache') && !make_writable('./cache')) || (!is_writable('./modules') && !make_writable('./modules'))) {
    $error_found = true;
    $error_txt .= '
      <table width="100%" cellpadding="0" cellpadding="0" border="0"><tr>
        <td><strong>'.$mod_strings['ERR_CHECKSYS_NOT_WRITABLE'].'</strong></td>
        <td class="error">'.$mod_strings['ERR_CHECKSYS_NOT_WRITABLE_MSG'].'</td>
      </tr></table>';
}

if($error_found){
    $out = <<<EOQ
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html {$langHeader}>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   <meta http-equiv="Content-Style-Type" content="text/css">
   <title>{$mod_strings['LBL_WIZARD_TITLE']} {$mod_strings['LBL_TITLE_WELCOME']} {$setup_sugar_version} {$mod_strings['LBL_WELCOME_SETUP_WIZARD']}</title>
   <link REL="SHORTCUT ICON" HREF="include/images/spice_icon.png">
   <link rel="stylesheet" href="install/install.css" type="text/css">
</head>

<body>
  <table cellspacing="0" cellpadding="0" border="0" align="center" class="shell">
  <tr><td colspan="2" id="help"><a href="{$help_url}" target='_blank'>{$mod_strings['LBL_HELP']} </a></td></tr>
    <tr>
			<th width="500">
		<!--p>
		<img src="{$sugar_md}" alt="SpiceCRM" border="0">
		</p-->
		{$mod_strings['LBL_TITLE_WELCOME']} {$setup_sugar_version} {$mod_strings['LBL_WELCOME_SETUP_WIZARD']}</th>
    </tr>
   <tr>
      <td  id="ready_image"><IMG src="include/images/spice_big.png" width="700" alt="SpiceCRM" border="0"></td>
    </tr>
                <td>
			    {$error_txt}
                </td>
    </tr>

  </table>

</body>
</html>
EOQ;

}

echo $out;