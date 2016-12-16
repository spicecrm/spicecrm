<div id="SpiceSideBar">
{foreach from=$SpiceSideBar item=item}
    {if $item.directive != ""}
        {$item.directive}
    {else}
        {if $item.count > 0 }
        <div id="{$item.name}" class="shortcuts">
            <span class="shortcutstitle">{$item.label}</span>
            <div id="expand_{$item.name}" class="expander" onClick="spicetheme.toggle('{$item.name}',true)">
                <span class="{if $item.closed == 'true'}arrow_down{else}arrow_up{/if}"></span>
            </div>
            <div id="widget_cotent_{$item.name}" class="widget_content {if $item.closed == 'true'}close{else}open{/if}">
            {if ($item.closed === true || $item.closed === 'true') && $item.load_closed}
                {$item.content}
            {/if}
            {if $item.closed === false || $item.closed === 'false'}
                {$item.content}
            {/if}
            </div>
        </div>
        {/if}
    {/if}
{/foreach}

{$jsIncludes}
{$jsAfterLoad}
<script tyle="text/javascript">
    var load_closed = {if $config_load_closed}true{else}false{/if} ;
    var currentModule = '{$currentModule}' ;
    var currentRecord = '{$currentRecord}' ;
    var currentAction = '{$currentAction}' ;
    var subpanelsTabbed = {if $subpanelsTabbed}true{else}false{/if} ;
</script>
</div>
