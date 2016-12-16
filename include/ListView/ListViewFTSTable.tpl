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

<table cellpadding='0' cellspacing='0' width='100%' border='0' class='list view'>
    {assign var="link_select_id" value="selectLinkTop"}
    {assign var="link_action_id" value="actionLinkTop"}
    {assign var="actionsLink" value=$actionsLinkTop}
    {assign var="selectLink" value=$selectLinkTop}
    {assign var="action_menu_location" value="top"}
    {include file='include/ListView/ListViewPaginationFTS.tpl'}
    <tr height='20'>
        {if $prerow}
            <td width='1%' class="td_alt">
                &nbsp;
            </td>
        {/if}
        {if !empty($quickViewLinks)}
            <td class='td_alt' width='1%' style="padding: 0px;">&nbsp;</td>
        {/if}
        {counter start=0 name="colCounter" print=false assign="colCounter"}
        {foreach from=$displayColumns key=colHeader item=params}
            <th scope='col' width='{$params.width}%'>
                <div style='white-space: normal;' width='100%' align='{$params.align|default:'left'}'>
                    {sugar_translate label=$params.label module=$pageData.bean.moduleDir}
                </div>
            </th>
            {counter name="colCounter"}
        {/foreach}
        <td class='td_alt' nowrap="nowrap" width='1%'>&nbsp;</td>
    </tr>

    {counter start=$pageData.offsets.current print=false assign="offset" name="offset"}
    {foreach name=rowIteration from=$data key=id item=rowData}
        {counter name="offset" print=false}
        {assign var='scope_row' value=true}

        {if $smarty.foreach.rowIteration.iteration is odd}
            {assign var='_rowColor' value=$rowColor[0]}
        {else}
            {assign var='_rowColor' value=$rowColor[1]}
        {/if}
        <tr height='20' class='{$_rowColor}S1'>
            {if $prerow}
                <td width='1%' class='nowrap'>
                    {if !$is_admin && is_admin_for_user && $rowData.IS_ADMIN==1}
                        <input type='checkbox' disabled="disabled" class='checkbox' value='{$rowData.ID}'>
                    {else}
                        <input title="{sugar_translate label='LBL_SELECT_THIS_ROW_TITLE'}"
                               onclick='sListView.check_item(this, document.MassUpdate)' type='checkbox'
                               class='checkbox' name='mass[]' value='{$rowData.ID}'>
                    {/if}
                </td>
            {/if}
            {if !empty($quickViewLinks)}
                {capture assign=linkModule}{if $params.dynamic_module}{$rowData[$params.dynamic_module]}{else}{$pageData.bean.moduleDir}{/if}{/capture}
                {capture assign=action}{if $act}{$act}{else}EditView{/if}{/capture}
                <td width='2%' nowrap>
                    {if $pageData.rowAccess[$id].edit}
                        <a title='{$editLinkString}' id="edit-{$rowData.ID}"
                           href="index.php?module={$linkModule}&offset={$offset}&stamp={$pageData.stamp}&return_module={$linkModule}&action={$action}&record={$rowData.ID}"
                        >
                            {capture name='tmp1' assign='alt_edit'}{sugar_translate label="LNK_EDIT"}{/capture}
                            {sugar_getimage name="edit_inline.gif" attr='border="0" ' alt="$alt_edit"}</a>
                    {/if}
                </td>
            {/if}
            {counter start=0 name="colCounter" print=false assign="colCounter"}
            {foreach from=$displayColumns key=col item=params}
                {strip}
                    <td {if $scope_row} scope='row' {/if} align='{$params.align|default:'left'}' valign="top"
                                                          class="{if ($params.type == 'teamset')}nowrap{/if}{if preg_match('/PHONE/', $col)} phone{/if}">
                        {if $col == 'NAME' || $params.bold}<b>{/if}
                            {if $params.link && !$params.customCode}
                                {capture assign=linkModule}{if $params.dynamic_module}{$rowData[$params.dynamic_module]}{else}{$params.module|default:$pageData.bean.moduleDir}{/if}{/capture}
                                {capture assign=action}{if $act}{$act}{else}DetailView{/if}{/capture}
                                {capture assign=record}{$rowData[$params.id]|default:$rowData.ID}{/capture}
                                {capture assign=url}index.php?module={$linkModule}&offset={$offset}&stamp={$pageData.stamp}&return_module={$linkModule}&action={$action}&record={$record}{/capture}
                                <{$pageData.tag.$id[$params.ACLTag]|default:$pageData.tag.$id.MAIN} href="{sugar_ajax_url url=$url}">
                            {/if}
                            {if $params.customCode}
                                {sugar_evalcolumn_old var=$params.customCode rowData=$rowData}
                            {else}
                                {sugar_field parentFieldArray=$rowData vardef=$params displayType=ListView field=$col}

                            {/if}
                            {if empty($rowData.$col) && empty($params.customCode)}&nbsp;{/if}
                            {if $params.link && !$params.customCode}
                        </{$pageData.tag.$id[$params.ACLTag]|default:$pageData.tag.$id.MAIN}>
                        {/if}
                        {if $col == 'NAME' || $params.bold}</b>{/if}
                    </td>
                {/strip}
                {assign var='scope_row' value=false}
                {counter name="colCounter"}
            {/foreach}
            <td align='right'>{$pageData.additionalDetails.$id}</td>
        </tr>
        {foreachelse}
        <tr height='20' class='{$rowColor[0]}S1'>
            <td colspan="{$colCount}">
                <em>{$APP.LBL_NO_DATA}</em>
            </td>
        </tr>
    {/foreach}
    {assign var="link_select_id" value="selectLinkBottom"}
    {assign var="link_action_id" value="actionLinkBottom"}
    {assign var="selectLink" value=$selectLinkBottom}
    {assign var="actionsLink" value=$actionsLinkBottom}
    {assign var="action_menu_location" value="bottom"}
    {include file='include/ListView/ListViewPagination.tpl'}
</table>
