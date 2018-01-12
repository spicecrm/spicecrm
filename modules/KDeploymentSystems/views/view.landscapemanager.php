<?php

require_once('include/MVC/View/SugarView.php');

class KDeploymentSystemsViewLandscapeManager extends SugarView
{

    function __construct()
    {
        parent::__construct();
    }

    function display()
    {
        echo $this->ss->fetch('modules/KDeploymentSystems/tpls/landscapemanager.tpl');
    }
}