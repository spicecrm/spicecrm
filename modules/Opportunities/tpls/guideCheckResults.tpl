<h2>Checkpoints</h2><br>
{foreach from=$checkResults key=checkId item=checkData}
    <div class="checkitem">
    <img src="themes/SpiceTheme/images/checkbox_{if !$checkData.result}un{/if}checked.png"/><div class="checkitemtext">{$checkData.name}</div>
    </div>
{/foreach}