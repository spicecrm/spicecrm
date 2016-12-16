<div id="lastviewed" class="shortcuts">
    <span class="shortcutstitle">Last Viewed</span>
    <ul>
        {foreach from=$recentRecords item=item name=lastViewed}
            <li>

                <a title="{$item.item_summary}"
                   accessKey="{$smarty.foreach.lastViewed.iteration}"
                   href="{sugar_link module=$item.module_name action='DetailView' record=$item.item_id link_only=1}">
                    <span>{$item.item_summary_short}</span>
                </a>
                <div class="changeIcon"><a title="{$item.item_summary}"
                                           href="{sugar_link module=$item.module_name action='EditView' record=$item.item_id link_only=1}">
                        <img src="themes/SpiceTheme/images/dashlet-header-edit.gif"></a></div>
            </li>
            {*foreachelse*}
            {*$APP.NTC_NO_ITEMS_DISPLAY*}
        {/foreach}
    </ul>
</div>

