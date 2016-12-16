{if $AUTHENTICATED}

    <div id="moduleList">
        <ul>
            <li class="newsubmenuitem" id="Hometab" ><span class="notCurrentTab"><a id="moduleTab_Home" module="Home" href="index.php?module=Home&action=index"><img id="homeIcon" src={sugar_getimagepath file="Home_white.png"}></a></span></li>
            <li>|</li>
            {if $USE_GROUP_TABS}
            <li id="groupdropdowntab" onclick="spicetheme.toggleGroups();"><span id="currentGroup">{$currentGroupTab}</span><span class="moreModuleItemsArrow"></span>
                <div id="tabGroupDropDown">
                    <ol>
                        {foreach from=$groupTabs item=modules key=group}
                            {if $group == $currentGroupTab}
                                <li class='currentgrouptab' onclick="spicetheme.changeGroup('{$group}');">{$group}</li>
                            {else}
                                <li onclick="spicetheme.changeGroup('{$group}');">{$group}</li>
                            {/if}
                        {/foreach}
                    </ol>
                </div>
            </li>
            <li>|</li>
            {/if}
            <span id="newSubmenu">
                {include file="themes/SpiceTheme/tpls/_headerModuleList.tpl" theme_template=true}
            </span>
            <li class='newSubmenuloading'><img id='newSubmenuloading' src={sugar_getimagepath file="ajax.gif"}></li>
        </ul>

        <div id="search">
            <form name='UnifiedSearch' action='index.php' onsubmit='return SUGAR.unifiedSearchAdvanced.checkUsaAdvanced()'>
                <input type="hidden" name="action" value="UnifiedSearch">
                <input type="hidden" name="module" value="Home">
                <input type="hidden" name="search_form" value="false">
                <input type="hidden" name="advanced" value="false">
                <input type="text" name="query_string" id="query_string" size="20" value="{$SEARCH}">&nbsp;
                <input type="image" id="searchimage" src={sugar_getimagepath file="search_white.gif"} alt="">
            </form><br />
        </div>

    </div>
    <div id="footerline" onMouseEnter="spicetheme.toggleFooterline_mouseover('mousein');" onMouseLeave="spicetheme.toggleFooterline_mouseover('mouseout');">
        <script type="text/javascript">
            spicetheme.footerLineCollapsedStatic={if $footerToggled == 'true'}true{else}false{/if};
            var toggled = new Array();
        </script>
        <div id="welcome_static">
            <ul class='welcome_main'>
                <li id="welcome_username" style="display: inline-block;"><a id="welcome_link" href='index.php?module=Users&action=EditView&record={$CURRENT_USER_ID}'>{$CURRENT_USER}</a></li>
                <li id="expand_footerline" onclick="spicetheme.toggleFooterline(true);"><span class="{if $footerToggled == 'true'}arrow_right{else}arrow_left{/if}"></span></li>
            </ul>
        </div>
        <div id="welcome_slide" {if $footerToggled == 'true'} class='footerCollapsed' {/if}>
            <ul class="welcome_main" id="welcome">
                <li id="errorcountli"><div id="errorcount" class="errorcount" onclick="spicetheme.displayErrors();" >0</div></li>
                <li id="statistics">... loading ...</li>
                <li id="poweredbysugarcrm" onclick="spicetheme.displayCopyright();">Powered by SugarCRM</li>
            </ul>

            <ul class="welcome_main" id="globalLinks">
                {foreach from=$GCLS item=GCL name=gcl key=gcl_key}
                    <li>
                        <a id="{$gcl_key}_link" href="{$GCL.URL}"{if !empty($GCL.ONCLICK)} onclick="{$GCL.ONCLICK}"{/if}>{$GCL.LABEL}</a>
                        {foreach from=$GCL.SUBMENU item=GCL_SUBMENU name=gcl_submenu key=gcl_submenu_key}
                            {if $smarty.foreach.gcl_submenu.first}
                                <span class="arrow_up" id="{$gcl_key}_submenu_open" onclick="spicetheme.displayGlobalLinksSubMenu('{$gcl_key}');"></span>
                                <ul class="globalLink_SubMenu" id="{$gcl_key}_submenu" onMouseLeave="$('#{$gcl_key}_submenu').hide();">
                            {/if}
                            <li><a id="{$gcl_submenu_key}_link" href="{$GCL_SUBMENU.URL}"{if !empty($GCL_SUBMENU.ONCLICK)} onclick="{$GCL_SUBMENU.ONCLICK}"{/if}>{$GCL_SUBMENU.LABEL}</a></li>
                            {if $smarty.foreach.gcl_submenu.last}
                                </ul>
                            {/if}
                        {/foreach}
                    </li>
                {/foreach}

                <li id="logout_link_li"><a id="logout_link" href='{$LOGOUT_LINK}' class='utilsLink'><img height="15px" src="themes/SpiceTheme/SpiceThemeimages/logout.png" alt="{$LOGOUT_LABEL}"></a></li>

            </ul>
        </div>
    </div>
{/if}


{if $AUTHENTICATED}

    <div id="leftBar" onMouseEnter="spicetheme.triggerSideBar('mousein');" onMouseLeave="spicetheme.cancelSideBar('mouseout');" class="leftbar {if $sideBarClosed == 'true'}leftbarclosed{/if}" >
        <div id="SideBarExpander" onClick="spicetheme.toggleSideBar(true);">
            <span id="SideBarExpander_arrow" class="{if $sideBarClosed == 'true'}arrow_right{else}arrow_left{/if}"></span>
        </div>
        {if $ACTION == "DetailView"}
        <div id="moduleTitleDummy"><h2>... Loading ...</h2></div>
        <div id="itemactions" class="itemactions">
            <div id="iafavorite" ng-click="favoritesWidget.toggleFavorite()" class="trtools" ng-controller="FavoritesCtrl">
                <img id="iafavoriteinactive" ng-show="!favoritesService.isFavorite" src={sugar_getimagepath file="favorite.gif"}>
                <img id="iafavoriteactive" ng-show="favoritesService.isFavorite" src={sugar_getimagepath file="favorite_active.gif"}>
            </div>
            <div class="trtools">
                <img id= "iaremindernew" src={sugar_getimagepath file="jscalendar.gif"} {if empty($iareminder)} style="display: inline" {/if}>
                <img id= "iareminderremove" src={sugar_getimagepath file="Trash_active.gif"}>
                <span id ="iareminder" >{$iareminder}</span>
            </div>
            <div id ="iareminderpicker" ></div>
            <div id ="ianotes" class="trtools" onclick="spicetheme.quickNotes.displayQuickNotes();" title="QuickNotes">
                <script type="text/javascript">spicetheme.quickNotes.quickNotesCount={$iaquicknotescount};</script>
                <img id="ianotesinactive" {if $iaquicknotescount > 0}style="display:none"{/if} src={sugar_getimagepath file="quicknotes.gif"}>
                <img id="ianotesactive" {if $iaquicknotescount == 0}style="display:none"{/if} src={sugar_getimagepath file="quicknotes_active.gif"}>
                {if $iaquicknotescount > 0} <div id="iaquicknotescount">{$iaquicknotescount}</div> {/if}
            </div>

            <div id ="iaattachments" class="trtools" onclick="spicetheme.attachments.displayAttachments();" title="Attachments">
                <script type="text/javascript">spicetheme.attachments.attachmentsCount={$iaattachmentscount};</script>
                <img id="iaattachmentsinactive" {if $iaattachmentscount > 0}style="display:none"{/if} src={sugar_getimagepath file="attachments.gif"}>
                <img id="iaattachmentsactive" {if $iaattachmentscount == 0}style="display:none"{/if} src={sugar_getimagepath file="attachments_active.gif"}>
                <div id="iaattachmentscount">{if $iaattachmentscount > 0} {$iaattachmentscount} {/if}</div>
            </div>
        </div>
        <div id="ianotes_container" class="transparent">
            <div id="ianotes_header">
                <span id="ianotes_header_title"></span>
                <img id="ianotes_close" src={sugar_getimagepath file="id-ff-clear.png"} alt="close" title="close" onclick="$('#ianotes_container').fadeOut();spicetheme.quickNotes.open = false;">
                <img id="ianotes_filter" src={sugar_getimagepath file="Users.png"}  alt="filter MyNotes" title="filter MyNotes" onclick="spicetheme.quickNotes.filterQuickNotes();$(this).hide();$('#ianotes_filter_active').show();">
                <img id="ianotes_filter_active" src={sugar_getimagepath file="Roles.png"}  alt="disable MyNotes filter" title="disable MyNotes filter" onclick="spicetheme.quickNotes.filterQuickNotes();$(this).hide();$('#ianotes_filter').show();">
                <img id="ianotes_add" src={sugar_getimagepath file="id-ff-add.png"}  alt="add Note" title="add Note" onclick="$('#ianotes_new_container').slideDown();">
            </div>
            <ul>
                <li id="ianotes_new_container">
                    <form action="#" method="POST" name="ianotes_new" id="ianotes_new" class="action_buttons">
                        <textarea cols="68" rows="4" name="text"></textarea><br>
                        <label for="global" style="vertical-align: bottom;">global Note:</label>&nbsp;
                        <input type="checkbox" name="global" value="1" id="global_note" onclick="$('#ianotes_new_container').toggleClass('ianotes_global')">&nbsp;
                        <input type="reset" name="reset" value="cancel" class="button" onclick="spicetheme.quickNotes.formClose();">&nbsp;
                        <input type="submit" name="submit" value="save" class="button" onclick="spicetheme.quickNotes.saveQuickNote();return false;">
                    </form>
                </li>
            </ul>
        </div>

        <div id="iaattachments_container" class="transparent">
            <div id="iaattachments_header">
                <span id="iaattachments_header_title"></span>
                <img id="iaattachments_close" src={sugar_getimagepath file="id-ff-clear.png"} alt="close" title="close" onclick="$('#iaattachments_container').fadeOut();spicetheme.attachments.open = false;">
                <img id="iaattachments_add" src={sugar_getimagepath file="id-ff-add.png"}  alt="add Note" title="add Note" onclick="$('#iaattachments_new_container').slideDown();">
            </div>
            <ul>
                <li id="iaattachments_new_container">
                    <form action="#" method="POST" name="iaattachments_new" id="iaattachments_new" class="action_buttons" enctype="multipart/form-data">
                        <div id="iaattachments_new_status">Drag a file from a folder or click here.</div>

                        <div id="iaattachments_new_drop">Drop file here.</div>
                        <input type="file" id="iaattachments_new_file" name="file">
                        <div id="iaattachments_new_list"></div>
                        <textarea cols="68" rows="4" name="text" id="iaattachments_new_text"></textarea><br>
                        <input type="reset" name="reset" value="cancel" class="button" onclick="spicetheme.attachments.formClose();">&nbsp;
                        <input type="submit" name="submit" value="save" class="button" onclick="return spicetheme.attachments.saveAttachment();">
                    </form>
                </li>
            </ul>
        </div>
        {/if}
        <div id="actionmenu" class="shortcuts">
            {if $MODULE_NAME == 'Home'}
                <ul>
                    {foreach from=$pagesArray item=pages name=pageName key=pageKey}
                        <li id="pageItem{$pageKey}"  {if $pageActive == $pageKey} class='activePageItem'{/if}>
                            <a id="pageItem{$pageKey}href" href="index.php?module=Home&action=index&activePage={$pageKey}">{$pages.title}</a>
                            <div class="changeIcon" onclick="spicetheme.editPage({$pageKey})"><img src={sugar_getimagepath file="dashlet-header-edit.gif"}></div>
                        </li>
                    {/foreach}
                </ul>
                <div id="pageEdit">
                    <div class="pageEditLabel">Title:</div>
                    <input type="text" id="pageTitle">
                    <div class="pageEditLabel">Columns:</div>
                    <select id="pageColumns" style="width:100%">
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                    <div class="pageEditButtons">
                        <div class="pageEditButton button" onclick="spicetheme.commitPageEdit()">OK</div>
                        <div class="pageEditButton button" onclick="spicetheme.cancelPageEdit()">Cancel</div>
                        <div id="pageEditDeleteButton" class="pageEditButton button" onclick="spicetheme.deletePage()">Delete</div>
                    </div>
                </div>
            {/if}
        </div>

        {include file="themes/SpiceTheme/tpls/SpiceSideBar.tpl" theme_template=true}

    </div>
{/if}
