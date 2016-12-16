<?php

require_once('include/MVC/View/SugarView.php');

class KReleasePackagesViewReleasePackageManager extends SugarView
{

    function KReleasePackagesViewReleasePackageManager()
    {
        parent::SugarView();
    }

    function display()
    {
        echo $this->ss->fetch('modules/KReleasePackages/tpls/releasepackagemanager.tpl');
    }
}