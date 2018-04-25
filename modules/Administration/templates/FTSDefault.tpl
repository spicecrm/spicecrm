{*@todo: create labels for text...*}
<div>
    <h1>FTS load default settings</h1>
    <p>&nbsp;</p>
    <form name="FTSDefaultConf" action="" method="POST">
        <h2>CAUTION! Following processes will be triggered:</h2>
        <ol>
            <li><strong>delete</strong> current FTS settings stored in sysfts table for selected modules</li>
            <li>load default FTS settings into sysfts table</li>
            <li><strong>delete</strong> current indexes in ElasticSearch</li>
            <li>create indexes in ElasticSearch</li>
            <li>reset indexed date in records</li>
            <li>activate the cron job to index records automatically</li>
        </ol>
        <div>Settings for load</div>
        <table class="yui3-skin-sam edit view panelContainer">
            <tbody>
            <tr>
                <td scope="col" width="12%"><label>Enter Package</label><span class="required">*</span></td>
                <td><input name="ftsdefaultconf_package" value="*" type="text" required></td>
            </tr>
            <tr>
                <td scope="col"><label>Enter Version</label><span class="required">*</span></td>
                <td><input name="ftsdefaultconf_version" value="*" type="text" required></td>
            </tr>
            </tbody>
        </table>
        {*<p>Select modules</p>*}
        {*<table>*}
            {*<tr><td><input type="checkbox" name="all" value="1" /></td><td>select all</td></tr>*}
            {*{foreach $sysftsmodules as $sysftsmodule}*}
                {*<tr><td><input type="checkbox" name="selectedmodules[]" value="{$sysftsmodule}" /></td><td>{$sysftsmodule}</td></tr>*}
            {*{/foreach}*}
        {*</table>*}
        <h2>Continue?</h2>
        <input name="ftsdefaultconf_process" value="1" type="hidden">
        <input name="ftsdefaultconf_btn" value="YES" type="submit">
    </form>
</div>