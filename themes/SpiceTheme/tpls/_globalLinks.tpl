
<div id="globalLinks">
    <ul>
    {foreach from=$GCLS item=GCL name=gcl key=gcl_key}
    <li>
    {if !$smarty.foreach.gcl.first}<span>|</span>{/if}
    <a id="{$gcl_key}_link" href="{$GCL.URL}"{if !empty($GCL.ONCLICK)} onclick="{$GCL.ONCLICK}"{/if}>{$GCL.LABEL}</a>
    {foreach from=$GCL.SUBMENU item=GCL_SUBMENU name=gcl_submenu key=gcl_submenu_key}
    {if $smarty.foreach.gcl_submenu.first}
    {sugar_getimage name="menuarrow" ext=".gif" alt="" other_attributes=''}<br />
    <ul class="cssmenu">
    {/if}
    <li><a id="{$gcl_submenu_key}_link" href="{$GCL_SUBMENU.URL}"{if !empty($GCL_SUBMENU.ONCLICK)} onclick="{$GCL_SUBMENU.ONCLICK}"{/if}>{$GCL_SUBMENU.LABEL}</a></li>
    {if $smarty.foreach.gcl_submenu.last}
    </ul>
    {/if}
    {/foreach}
    </li>
    {/foreach}
    </ul>
</div>
