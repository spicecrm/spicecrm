{if count($SHORTCUT_MENU) > 0}
<div id="shortcuts" class="shortcuts">
	<span class="shortcutstitle">Shortcuts</span>
	<ul>
    {foreach from=$SHORTCUT_MENU item=item}
    <li style="white-space:nowrap;">
        {if $item.URL == "-"}
          <a></a><span>&nbsp;</span>
        {else}
          <a href="{$item.URL}"><span>{$item.LABEL}</span></a>
        {/if}
    </li>
    {/foreach}
	</ul>
</div>
{/if}
