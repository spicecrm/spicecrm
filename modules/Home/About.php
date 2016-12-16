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


//NOTE: Under the License referenced above, you are required to leave in all copyright statements in both
//the code and end-user application.

global $sugar_config, $mod_strings;
?>
<style type="text/css">
ul li {
list-style-type: square;
}
</style>
<?php echo getVersionedScript("modules/Home/about.js"); ?>
<span>
<div class="about" style="padding: 10px 15px 20px 15px;">
<p>
<h1><IMG src="include/images/spice_big.png" alt="SpiceCRM" width="425"></h1>
<br>
<b><?php echo $mod_strings['LBL_VERSION']." ".$sugar_version." (".$mod_strings['LBL_BUILD']." ".$sugar_build.")";
    if( is_file( "custom_version.php" ) ){
        include( "custom_version.php" );
        print( "&nbsp;&nbsp;&nbsp;" . $custom_version );
    }
?>
</b></p>

<?php
echo "<P>Copyright ".$app_strings['LBL_SUGAR_COPYRIGHT']."</P>";

// This version of viewLicenseText is for Community Edition only.
$viewLicenseText = $mod_strings['LBL_VIEWLICENSE_COM'];



echo $viewLicenseText;

?>

<?php

$additionalTerm = $mod_strings['LBL_ADD_TERM_COM'];



echo $additionalTerm;


?>

<p ><table width="100%" border="0" cellspacing="0" cellpadding="0" class="contentBox">

<tr>
    <td valign="top" style="padding: 15px 10px 15px 10px;">
<P><h3><?php echo $mod_strings['LBL_SOURCE_CODE']; ?></h3></p>
<ul style="margin-bottom: 20px; padding-left: 0px;">
<LI><?php echo $mod_strings['LBL_SOURCE_SUGAR']; ?> (<A href="http://www.sugarcrm.com" target="_blank">http://www.sugarcrm.com</A>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_XTEMPLATE']; ?> (<A href="http://sourceforge.net/projects/xtpl" target="_blank">http://sourceforge.net/projects/xtpl</A>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_NUSOAP']; ?> (<a href="http://sourceforge.net/projects/nusoap/" target="_blank">http://sourceforge.net/projects/nusoap/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_HTTP_WEBDAV_SERVER']; ?> (<a href="http://pear.php.net/package/HTTP_WebDAV_Server" target="_blank">http://pear.php.net/package/HTTP_WebDAV_Server</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_PCLZIP']; ?> (<a href="http://www.phpconcept.net/pclzip/" target="_blank">http://www.phpconcept.net/pclzip/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_SMARTY']; ?> (<a href="http://www.smarty.net/" target="_blank">http://www.smarty.net/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_YAHOO_UI_LIB']; ?> (<a href="http://developer.yahoo.net/yui/" target="_blank">http://developer.yahoo.net/yui/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_JSHRINK']; ?> (<a href="https://github.com/tedivm/JShrink/" target="_blank">https://github.com/tedivm/JShrink/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_PHPMAILER']; ?> (<a href="http://sourceforge.net/projects/phpmailer/" target="_blank">http://sourceforge.net/projects/phpmailer/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_CRYPT_BLOWFISH']; ?> (<a href="http://pear.php.net/package/Crypt_Blowfish/" target="_blank">http://pear.php.net/package/Crypt_Blowfish/</a>) </LI>
<LI><?php echo $mod_strings['LBL_SOURCE_XML_HTMLSAX3']; ?> (<a href="http://pear.php.net/package/XML_HTMLSax3/" target="_blank">http://pear.php.net/package/XML_HTMLSax3/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_YAHOO_UI_LIB_EXT']; ?> (<a href="http://www.jackslocum.com/blog/" target="_blank">http://www.jackslocum.com/blog/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_SWFOBJECT']; ?> (<a href="http://blog.deconcept.com/swfobject/" target="_blank">http://blog.deconcept.com/swfobject</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_TINYMCE']; ?> (<a href="http://wiki.moxiecode.com/index.php/TinyMCE:Index" target="_blank">http://wiki.moxiecode.com/index.php/TinyMCE:Index</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_TCPDF']; ?> (<a href="http://www.tcpdf.org/" target="_blank">http://www.tcpdf.org/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_RECAPTCHA']; ?> (<a href="http://recaptcha.net/" target="_blank">http://recaptcha.net/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_CSSMIN']; ?> (<a href="http://code.google.com/p/cssmin/" target="_blank">http://code.google.com/p/cssmin/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_PHPSAML']; ?> (<a href="https://github.com/onelogin/php-saml" target="_blank">https://github.com/onelogin/php-saml/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_ISCROLL']; ?> (<a href="http://cubiq.org/iscroll" target="_blank">http://cubiq.org/iscroll</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_JIT']; ?> (<a href="http://thejit.org/" target="_blank">http://thejit.org/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_FLASHCANVAS']; ?> (<a href="http://flashcanvas.net/" target="_blank">http://flashcanvas.net/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_ZEND']; ?> (<a href="http://framework.zend.com/" target="_blank">http://framework.zend.com/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_PARSECSV']; ?> (<a href="http://code.google.com/p/parsecsv-for-php/" target="_blank">http://code.google.com/p/parsecsv-for-php/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_PHPJS']; ?> (<a href="http://phpjs.org/" target="_blank">http://phpjs.org/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_PHPSQL']; ?> (<a href="http://code.google.com/p/php-sql-parser/" target="_blank">http://code.google.com/p/php-sql-parser/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_HTMLPURIFIER']; ?> (<a href="http://htmlpurifier.org/" target="_blank">http://htmlpurifier.org/</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_XHPROF']; ?> (<a href="https://github.com/facebook/xhprof" target="_blank">https://github.com/facebook/xhprof</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_ELASTICA']; ?> (<a href="https://github.com/ruflin/Elastica" target="_blank">https://github.com/ruflin/Elastica</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_FACEBOOKSDK']; ?> (<a href="https://github.com/facebook/facebook-php-sdk" target="_blank">https://github.com/facebook/facebook-php-sdk</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_JQUERY']; ?> (<a href="http://jquery.com/" target="_blank">http://jquery.com</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_JQUERY_UI']; ?> (<a href="http://jqueryui.com/" target="_blank">http://jqueryui.com</a>)</LI>
<LI><?php echo $mod_strings['LBL_SOURCE_OVERLIB']; ?> (<a href="http://www.macridesweb.com/oltest/" target="_blank">http://www.macridesweb.com/oltest</a>)</LI>
</ul>

	</td>

</tr>
</table>

</span>

<br>


</div>
