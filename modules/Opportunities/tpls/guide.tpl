<link rel="stylesheet" type="text/css" href="modules/Opportunities/css/guide.css"/>
<script src="modules/Opportunities/js/opportunityguide.js"></script>

<div class="guidecontainer">
    <div class="guidevizcontainer">
    <div class="guideviz">

        {foreach from=$sales_stages key=thisStageKey item=thisStageData}
            <div class="item{if $thisStageData.pastactive} passed{/if}{if $active_sales_stage == $thisStageKey} activeStage{/if}" onClick="SpiceCRM.OpportunityGuide.setStageDesctiption(event, '{$thisStageKey}')" >
                <!--img style="margin-right: 10px;" src="themes/SpiceTheme/images/checkbox_unchecked.png"/--><div>{$thisStageData.sales_stage_name}</div>
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
    SpiceCRM.OpportunityGuide.salesStageDetails = {$sales_stages|@json_encode};
    SpiceCRM.OpportunityGuide.setStageDesctiption(null, '{$active_sales_stage}');
</script>