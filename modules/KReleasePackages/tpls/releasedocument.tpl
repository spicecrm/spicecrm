{literal}
    <style>
        body, html {
            margin: 20px;
            font-size: 12px;
        }

        h2 {
            margin-top: 20px;
            font-size: 15px!important;
        }
        h3 {
            margin-top: 10px;
        }

        .packageHeader{
            margin-top: 10px;
            font-size: 18px;
        }

        .fileHeader{
            margin-top: 5px; 
            margin-bottom: 10px; 
            font-size: 15px;
        }

        .fileName{
            font-style: italic;
        }

    </style>
{/literal}
<h1 style="font-size: 25px;">Release Document for Release {$KReleasePackage->name}</h1>
<div>Release: {$KReleasePackage->name}</div>
<div>Version: {$KReleasePackage->release_version}</div>
<div>Release Date: {$KReleasePackage->release_date}</div>

{foreach from=$KChangeRequests item=KChangeRequest}
    <div style="page-break-inside: avoid">
        <h3 class="packageHeader">Package {$KChangeRequest->crid}</h3>
        <div><b>Name:</b> {$KChangeRequest->name}</div>
        <!--div><b>Type:</b> {$KChangeRequest->crtype}</div-->
        {if $KChangeRequest->tickets != ''}
            <div><b>Jira Tickets:</b> {$KChangeRequest->tickets}</div>
        {/if}
        {if $KChangeRequest->demandid != ''}
            <div><b>Demand ID:</b> {$KChangeRequest->demandid}</div>
        {/if}
        <div><b>Description:</b> {$KChangeRequest->description|nl2br}</div>
        {if $KChangeRequest->resolution != ''}
            <div><b>Solution:</b> {$KChangeRequest->resolutio|nl2br}</div>
        {/if}
        {if $KChangeRequest->post_deploy_action != ''}
            <div style="color: red"><b>Post Deploy Action:</b> {$KChangeRequest->post_deploy_action|nl2br}</div>
        {/if}
        <h3>Changed Files</h3>
        {foreach from=$KChangeRequest->fileArray item=changerequestfile}
            <div class="fileName">{$changerequestfile.name}</div>
        {/foreach}
    </div>
    <h3>Database Records</h3>
    {foreach from=$KChangeRequest->dbentriesArray item=dbentry}
        <div style="page-break-inside: avoid">
            <div class="fileName">table: {$dbentry.table_name}</div>
            <table style="padding:5px; border-left: 1px solid #ddd;" width='50%'>
                <tr>
                    <td><i>field</i></td><td><i>value</i></td>
                </tr>
                {foreach from=$dbentry.data key=dbentryfield item=dbentryvalue}
                    <tr>
                        <td>{$dbentryfield}</td><td>{$dbentryvalue}</td>
                    </tr>
                {/foreach}
            </table>
        </div>
    {/foreach}
</div>
{/foreach}
