{*
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

*}
{{* If templateMeta.maxColumnsBasic is not set, use maxColumns *}}
<input type='hidden' id="orderByInput" name='orderBy' value=''/>
<input type='hidden' id="sortOrder" name='sortOrder' value=''/>
{if !isset($templateMeta.maxColumnsBasic)}
    {assign var="basicMaxColumns" value=$templateMeta.maxColumns}
{else}
    {assign var="basicMaxColumns" value=$templateMeta.maxColumnsBasic}
{/if}
<script>
    {literal}
    $(function () {
        var $dialog = $('<div></div>')
                .html(SUGAR.language.get('app_strings', 'LBL_SEARCH_HELP_TEXT'))
                .dialog({
                    autoOpen: false,
                    title: SUGAR.language.get('app_strings', 'LBL_HELP'),
                    width: 700
                });

        $('#filterHelp').click(function () {
            $dialog.dialog('open');
            // prevent the default action, e.g., following a link
        });

    });
    {/literal}
</script>
<script src="include/javascript/spicefts.js"></script>
<div >
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            {{assign var='accesskeycount' value=0}}  {{assign var='ACCKEY' value=''}}
            <td scope="row" nowrap="nowrap" width="1%">
                <label>Searchterm</label>
            </td>
            <td nowrap="nowrap" width='1%'>
                <input id="ftssearchterm" type="text" onkeypress="SpiceCRM.fts.handleKeyPress(event)"/>
            </td>
            <td class="sumbitButtons">
                <input type="button" name="Search" class="button" value="Search"
                       onClick="SpiceCRM.fts.submitSearch()"/>
                <input type="button" name="Clear" class="button" value="Clear"
                       onClick="SpiceCRM.fts.clearSearch()"/>
                <a id="basic_search_link"
                   onclick="SUGAR.searchForm.searchFormSelect('{$module}|basic_search','{$module}|advanced_search')"
                   href="javascript:void(0)" accesskey="{$APP.LBL_ADV_SEARCH_LNK_KEY}">{$APP.LNK_BASIC_SEARCH}</a>
                {if $HAS_ADVANCED_SEARCH}
                    <a id="advanced_search_link"
                       onclick="SUGAR.searchForm.searchFormSelect('{$module}|advanced_search','{$module}|basic_search')"
                       href="javascript:void(0);"
                       accesskey="{$APP.LBL_ADV_SEARCH_LNK_KEY}">{$APP.LNK_ADVANCED_SEARCH}</a>
                {/if}
            </td>
            <td style="text-align: right;" width="10%">Aggregates&nbsp;<img id="ftsaggregatetoggleimage" style="float:right;" src="themes/SpiceTheme/images/downarrow.gif"/ onclick="SpiceCRM.fts.toggleAggregates()"></td>
        </tr>
    </table>
    <div style="display:none" id="ftsaggregates"></div>
</div>