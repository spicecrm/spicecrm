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
<script type="text/javascript" src='{sugar_getjspath file="include/SugarFields/Fields/Address/SugarFieldAddress.js"}'></script>
<fieldset id='{{$displayParams.key}}_address_fieldset'>
    <legend>{sugar_translate label='LBL_{{$displayParams.key|upper}}_ADDRESS' module='{{$module}}'}</legend>
    <table border="0" cellspacing="1" cellpadding="0" class="edit" width="100%">
    {{foreach from=$displayParams.fields item=field}}
        <tr>
            <td id="{{$field.name}}_label" width='{{$def.templateMeta.widths[$smarty.foreach.colIteration.index].label}}%' scope='row' >
                <label for="{{$field.name}}">{sugar_translate label='{{$field.vname}}' module='{{$module}}'}:</label>
                {{if $field.required || $field.name|lower|in_array:$displayParams.required}}
                    <span class="required">{$APP.LBL_REQUIRED_SYMBOL}</span>
                {{/if}}
            </td>
            <td>
                {{if strpos($field.name, 'address_street')}}
                    <textarea id="{{$field.name}}" name="{{$field.name}}" maxlength="{{$field.len|default:$displayParams.maxlength}}" rows="{{$displayParams.rows|default:4}}" cols="{{$displayParams.cols|default:60}}" tabindex="{{$tabindex}}">{$fields.{{$field.name}}.value}</textarea>
                {{else}}
                    <input type="text" name="{{$field.name}}" id="{{$field.name}}" size="{{$displayParams.size|default:30}}" maxlength="{{$field.len|default:$displayParams.maxlength}}" value='{$fields.{{$field.name}}.value}' tabindex="{{$tabindex}}">
                {{/if}}
            </td>
        </tr>
    {{/foreach}}
    {{if $displayParams.copy}}
        <tr>
            <td scope='row' NOWRAP>
                {sugar_translate label='LBL_COPY_ADDRESS_FROM_LEFT' module=''}:
            </td>
            <td>
                <input id="{{$displayParams.key}}_checkbox" name="{{$displayParams.key}}_checkbox" type="checkbox" onclick="{{$displayParams.key}}_address.syncFields();">
            </td>
        </tr>
    {{else}}
        <tr>
            <td colspan='2' NOWRAP>&nbsp;</td>
        </tr>
    {{/if}}
    </table>
</fieldset>
<script type="text/javascript">
   SUGAR.util.doWhen("typeof(SUGAR.AddressField) != 'undefined'", function(){ldelim}
		{{$displayParams.key}}_address = new SUGAR.AddressField("{{$displayParams.key}}_checkbox",'{{$displayParams.copy}}', '{{$displayParams.key}}');
	{rdelim});
</script>
