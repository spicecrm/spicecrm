<?php

require_once('include/MVC/View/SugarView.php');

class KDeploymentSystemsViewDeploymentManager extends SugarView
{

    function KDeploymentSystemsViewDeploymentManager()
    {
        parent::SugarView();
    }

    function display()
    {
        echo $this->ss->fetch('modules/KDeploymentSystems/tpls/deploymentmanager.tpl');
    }
}