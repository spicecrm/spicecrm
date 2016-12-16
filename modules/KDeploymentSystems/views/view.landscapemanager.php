<?php

require_once('include/MVC/View/SugarView.php');

class KDeploymentSystemsViewLandscapeManager extends SugarView
{

    function KDeploymentSystemsViewLandscapeManager()
    {
        parent::SugarView();
    }

    function display()
    {
        echo $this->ss->fetch('modules/KDeploymentSystems/tpls/landscapemanager.tpl');
    }
}