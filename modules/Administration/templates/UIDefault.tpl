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
        <p>Custom configuration will not be affected.</p>
        <div>
            <div>Current Packages and versions</div>
            <table class="yui3-skin-sam edit view panelContainer">
                <tbody>
                <tr>
                    <td scope="col" width="12%"><label>Packages</label></td>
                    <td><ul>{foreach $currentpackages as $item}
                                <li>{$item}</li>
                            {/foreach}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td scope="col" width="12%"><label>Versions</label></td>
                    <td><ul>{foreach $currentversions as $item}
                                <li>{$item}</li>
                            {/foreach}
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>

            <div>Settings for load</div>
            <table class="yui3-skin-sam edit view panelContainer">
                <tbody>
                    <tr>
                        <td scope="col" width="12%"><label>Enter Package</label><span class="required">*</span></td>
                        <td><input name="uidefaultconf_package" value="*" type="text" required></td>
                    </tr>
                    <tr>
                        <td scope="col"><label>Enter Version</label><span class="required">*</span></td>
                        <td><input name="uidefaultconf_version" value="*" type="text" required></td>
                    </tr>
                </tbody>
            </table>

        </div>

        <h2>Continue?</h2>
        <input name="uidefaultconf_process" value="1" type="hidden">
        <input name="uidefaultconf_btn" value="YES" type="submit">
    </form>
</div>