<?php

require_once('include/SpiceFTSManager/SpiceFTSUtils.php');
require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
require_once('include/SpiceFTSManager/ElasticHandler.php');

class SpiceFTSearch
{
    function search($searchTerm)
    {
        $resSmarty = new Sugar_Smarty();
        $resSmarty->assign('searchterm', $searchTerm);

        $resResult = $resSmarty->fetch('include/SpiceFTSManager/tpls/globalfts.tpl');

        echo $resResult;
    }
}