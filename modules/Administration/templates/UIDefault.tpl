{*@todo: create labels for text...*}
<div>
    <h1>UI load default settings</h1>
    <p>&nbsp;</p>
    <form name="UIDefaultConf" action="" method="POST">
        <h2>CAUTION! Following processes will be triggered:</h2>
        <ol>
            <li><strong>delete</strong> current UI settings stored in sysui tables
                <div>
                    {$sysuitableslist}
                </div>
            </li>
            <li>load default UI settings into sysui tables</li>
        </ol>
        <p>&nbsp;</p>
        <h2>Continue?</h2>
        <input name="uidefaultconf_process" value="1" type="hidden">
        <input name="uidefaultconf_btn" value="YES" type="submit">
    </form>
</div>