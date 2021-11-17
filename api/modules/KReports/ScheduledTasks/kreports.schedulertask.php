<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

//check on function_exists for backwards compatibility
//runScheduledKReports might already exist under custom/Extensions/modules/Jobs/Ext...
if(!function_exists('runScheduledKReports')) {
    $job_strings[98] = 'runScheduledKReports';

    function runScheduledKReports()
    {
        require_once('extensions/modules/KReports/Plugins/Integration/kscheduling/kschedulingcronhandler.php');
        $kreportscheduler = new kschedulingcronhandler();
        $kreportscheduler->initializeScheduledReports();
        $kreportscheduler->runScheduledReports();
    }
}