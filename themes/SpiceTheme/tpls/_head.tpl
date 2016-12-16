<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html {$langHeader}>
<head>
<script type="text/javascript" src='vendor/angular/angular.min.js'></script>
<link rel="SHORTCUT ICON" href="themes/SpiceTheme/images/favicon.png">
<meta http-equiv="Content-Type" content="text/html; charset={$APP.LBL_CHARSET}">
<title>{$APP.LBL_BROWSER_TITLE}{if $MODULE_NAME != ''}/{if $trmodulenames.$MODULE_NAME != ''}{$trmodulenames.$MODULE_NAME}{else}{$MODULE_NAME}{/if}{if $trbeanname != ''}/{$trbeanname}{/if}{/if}</title>
{$SUGAR_CSS}
<link rel="stylesheet" href="modules/SpiceThemeController/SpiceSideBarWidgets/css/SpiceSideBarWidgets.css">
{$SUGAR_JS}
<link rel="stylesheet" href="themes/SpiceTheme/css/app.css">
<script type="text/javascript" src="themes/SpiceTheme/js/libs/jquery-ui.min.js"></script>
{literal}
<script type="text/javascript">
<!--
SUGAR.themes.theme_name      = '{/literal}{$THEME}{literal}';
SUGAR.themes.theme_ie6compat = {/literal}{$THEME_IE6COMPAT}{literal};
SUGAR.themes.hide_image      = '{/literal}{sugar_getimagepath file="hide.gif"}{literal}';
SUGAR.themes.show_image      = '{/literal}{sugar_getimagepath file="show.gif"}{literal}';
SUGAR.themes.loading_image      = '{/literal}{sugar_getimagepath file="img_loading.gif"}{literal}';
SUGAR.themes.allThemes       = eval({/literal}{$allThemes}{literal});
if ( YAHOO.env.ua )
    UA = YAHOO.env.ua;
-->
</script>
{/literal}
<script type="text/javascript" src="themes/SpiceTheme/js/complete.js"></script>
<script type="text/javascript" src='{sugar_getjspath file="cache/include/javascript/sugar_field_grp.js"}'></script>
</head>