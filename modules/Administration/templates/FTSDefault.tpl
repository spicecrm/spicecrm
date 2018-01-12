{*@todo: create labels for text...*}
<div>
    <h1>FTS load default settings</h1>
    <p>&nbsp;</p>
    <form name="FTSDefaultConf" action="" method="POST">
        <h2>CAUTION! Following processes will be triggered:</h2>
        <ol>
            <li><strong>delete</strong> current FTS settings stored in sysfts table</li>
            <li>load default FTS settings into sysfts table</li>
            <li><strong>delete</strong> current indexes in ElasticSearch</li>
            <li>create indexes in ElasticSearch</li>
            <li>reset indexed date in records</li>
            <li>activate the cron job to index records automatically</li>
        </ol>
        <p>&nbsp;</p>
        <h2>Continue?</h2>
        <input name="ftsdefaultconf_process" value="1" type="hidden">
        <input name="ftsdefaultconf_btn" value="YES" type="submit">
    </form>
</div>