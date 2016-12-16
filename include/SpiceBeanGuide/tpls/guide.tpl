<link rel="stylesheet" type="text/css" href="include/SpiceBeanGuide/css/guide.css"/>
<script src="include/SpiceBeanGuide/js/SpiceBeanGuide.js"></script>

<div class="guidecontainer">
    <div class="guidevizcollapse" onClick="SpiceCRM.SpiceBeanGuide.toggleDetails()"><img src="themes/SpiceTheme/images/basic_search.gif"></div>
    <div class="guidevizcontainer">
        <div class="guideviz">
            {foreach from=$stages key=thisStageKey item=thisStageData}
                <div class="item{if $thisStageData.pastactive} passed{/if}{if $active_stage == $thisStageKey} activeStage{/if}"
                     onClick="SpiceCRM.SpiceBeanGuide.setStageDesctiption(event, '{$thisStageKey}')">
                    <div>{$thisStageData.stage_name} {$thisStageData.stage_secondaryname}</div>
                </div>
            {/foreach}
        </div>
    </div>
    <div class="guidedetail">
        <div class="guidedetailchecks">
            here goes the checks
        </div>
        <div class="guidedetailinstructions">
            here goes the guide
        </div>
    </div>
</div>
<script>
    SpiceCRM.SpiceBeanGuide.salesStageDetails = {$stages|@json_encode};
    SpiceCRM.SpiceBeanGuide.setStageDesctiption(null, '{$active_stage}');
</script>