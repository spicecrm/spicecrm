<!--form name="ftsSearch" action="index.php" onsubmit="return SUGAR.unifiedSearchAdvanced.checkUsaAdvanced()" class="ng-pristine ng-valid">
    <input type="hidden" name="action" value="UnifiedSearch">
    <input type="hidden" name="module" value="Home">
    <input type="hidden" name="search_form" value="true">
    <input type="hidden" name="advanced" value="false">
    <input type="text" name="query_string" id="query_string_ext" size="20" value="{$searchterm}">&nbsp;
    <input type="submit" src="themes/SpiceTheme/images/search.gif" alt="">
</form-->
<link rel="stylesheet" type="text/css" href="include/SpiceFTSmanager/css/globalfts.css"/>
<script src="include/SpiceFTSmanager/js/spiceglobalfts.js"></script>

<div ng-controller="GlobalFTSController" class="globalftscontainer">
    <div class="globalftssearchtermcontainer">
        <span>Searchterm</span>
        <input type="text" class="globalftssearchterm" ng-model="globalFTSService.gloablSearchTerm" {literal}ng-model-options="{debounce: 500}"{/literal}/>
    </div>
    <div class="globalftssearchresults">
        <global-fts-module-panel ng-repeat="searchModule in globalFTSService.globalFTSSearchModules" search-module="searchModule">panel</global-fts-module-panel>
        {*foreach name=hits from=$searchresults.hits key=hititem item=hitdata}
            <div style="width:100%; padding: 5px 0px;">
                <div style="display:inline-block;width:1%; margin-right:10px;"><a
                            href="index.php?module={$hitdata._type}&action=DetailView&record={$hitdata._id}">{sugar_getimage name=$hitdata._type attr="border=\"0\" align=\"absmiddle\" vertical-align=\"middle!important\"" ext=".gif" alt=$hitdata._type}</a>
                </div>
                <div style="display:inline-block;width:20%;font-weight:bold;vertical-align: top;">{$hitdata._source.summary_text}</div>
                <div style="display:inline-block;vertical-align: top;width:75%;">{$hitdata.listviewdata}</div>
            </div>
        {/foreach*}
    </div>
    <div class="globalftssearchmodules" style="">
        <global-fts-module-item ng-repeat="menuItem in globalFTSService.globalFTSSearchModules"
                                menu-item="menuItem"></global-fts-module-item>
    </div>
</div>
