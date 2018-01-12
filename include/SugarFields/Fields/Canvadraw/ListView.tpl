{if strval($parentFieldArray.$col) != ""}
    {assign var="checked" value="CHECKED"}
{else}
    {assign var="checked" value=""}
{/if}
<input type="checkbox" class="checkbox" disabled="true" {$checked}>