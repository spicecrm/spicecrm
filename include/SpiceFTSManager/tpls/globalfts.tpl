<!--form name="ftsSearch" action="index.php" onsubmit="return SUGAR.unifiedSearchAdvanced.checkUsaAdvanced()" class="ng-pristine ng-valid">
    <input type="hidden" name="action" value="UnifiedSearch">
    <input type="hidden" name="module" value="Home">
    <input type="hidden" name="search_form" value="true">
    <input type="hidden" name="advanced" value="false">
    <input type="text" name="query_string" id="query_string_ext" size="20" value="{$searchterm}">&nbsp;
    <input type="submit" src="themes/SpiceTheme/images/search.gif" alt="">
</form-->
<link rel="stylesheet" type="text/css" href="include/SpiceFTSManager/css/globalfts.css"/>
<script src="include/javascript/spiceglobalfts.js"></script>

<div ng-controller="GlobalFTSController" class="globalftscontainer">
    <div class="globalftssearchtermcontainer">
        <span>Searchterm</span>
        <input type="text" class="globalftssearchterm" ng-model="globalFTSService.gloablSearchTerm" {literal}ng-model-options="{debounce: 500}"{/literal}/>
    </div>
    <div class="globalftssearchresults">
        <global-fts-module-panel ng-repeat="searchModule in globalFTSService.globalFTSSearchModules" search-module="searchModule">panel</global-fts-module-panel>
    </div>
    <div class="globalftssearchmodules" style="">
        <global-fts-module-item ng-repeat="menuItem in globalFTSService.globalFTSSearchModules"
                                menu-item="menuItem"></global-fts-module-item>
    </div>
</div>
