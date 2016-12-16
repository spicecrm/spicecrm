<?php

require_once('include/MVC/Controller/SugarController.php');


class KDeploymentSystemsController extends SugarController {

    function action_LandscapeManager()
    {
        $this->view = 'landscapemanager';
    }

    function action_deploymentManager()
    {
        $this->view = 'deploymentmanager';
    }

}
