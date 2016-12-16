<div>
    <table width="100%" style="margin: 10px 0px;" cellspacing="0px" cellpadding="0px">
        <tr>
            {foreach name=aggregates from=$aggregates key=aggregateitem item=aggregatedata}
            <td style="padding: 0px!important" width="25%">
                <div style="background-color: #e5e5e5; padding: 10px 5px; margin: 5px 0px;font-weight: bold;">{$aggregatedata.name}</div>
                {foreach name=aggbuckets from=$aggregatedata.buckets key=bindex item=bdata}
                    <div style="padding: 3px 5px;">
                        <img id="{{$aggregatedata.aggregateindex}|cat:"::"|cat:{$bdata.aggdata}|md5}" style="vertical-align: middle" {if $bdata.checked}src="themes/SpiceTheme/images/checkbox_checked.png"{else}src="themes/SpiceTheme/images/checkbox_unchecked.png"{/if} onclick="SpiceCRM.fts.handleAggClick(event, '{$aggregatedata.aggregateindex}::{$bdata.aggdata}')"/>
                        <div style="display: inline;vertical-align: middle;">&nbsp;{$bdata.displayName}<span style="font-style: italic;margin-left: 5px;">({$bdata.doc_count})</span></div>
                    </div>
                {/foreach}
            </td>
            {if ($smarty.foreach.aggregates.index + 1) % 3 == 0}
               </tr><tr style="margin-top:10px;">
            {/if}
            {assign "indexcounter" $smarty.foreach.aggregates.index}
        {/foreach}
        {while ($indexcounter + 1) % 3 !== 0}
            <td style="padding: 0px!important" width="25%"><div style="color: #e5e5e5;background-color: #e5e5e5; padding: 10px 0px; margin: 5px 0px;font-weight: bold;">-</div></td>
           {$indexcounter = $indexcounter + 1}
        {/while}
        </tr>
    </table>
</div>