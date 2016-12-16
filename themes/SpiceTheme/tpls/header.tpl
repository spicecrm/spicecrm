
{include file="themes/SpiceTheme/tpls/_head.tpl" theme_template=true}
<body onMouseOut="closeMenus();" ng-app="SpiceCRM">
<a name="top"></a>
{$SUGAR_DCJS}
<div id="header">
    {*include file="_companyLogo.tpl" theme_template=true*}
    {*include file="_globalLinks.tpl" theme_template=true*}
    {*include file="_welcome.tpl" theme_template=true*}
    <div class="clear"></div>
    {*include file="_headerSearch.tpl" theme_template=true*}
    <div class="clear"></div>
    {if !$AUTHENTICATED}
    <br /><br />
    {/if}
    <div id="ajaxHeader">
        {include file="themes/SpiceTheme/tpls/_headerTotal.tpl" theme_template=true}
    </div>
    <div class="clear"></div>
</div>

{literal}
<iframe id='ajaxUI-history-iframe' src='index.php?entryPoint=getImage&imageName=blank.png'  title='empty' style='display:none'></iframe>
<input id='ajaxUI-history-field' type='hidden'>
<script type='text/javascript'>
if (SUGAR.ajaxUI && !SUGAR.ajaxUI.hist_loaded)
{
    YAHOO.util.History.register('ajaxUILoc', "", SUGAR.ajaxUI.go);
    {/literal}{if $smarty.request.module != "ModuleBuilder"}{* Module builder will init YUI history on its own *}
    YAHOO.util.History.initialize("ajaxUI-history-field", "ajaxUI-history-iframe");
    {/if}{literal}
}
</script>
{/literal}

<div id="main">
    <div id="content" {if !$AUTHENTICATED}class="noLeftColumn"{else}class="{if $sideBarClosed == 'true'}noLeftColumn{else}wLeftColumn{/if}"{/if}>
        <table style="width:100%"><tr><td>
