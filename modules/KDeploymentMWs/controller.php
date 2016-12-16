<?php
require_once('include/MVC/Controller/SugarController.php');
require_once('include/utils.php');

class KDeploymentMWsController extends SugarController
{

    public function action_editview()
    {
        $this->view = 'edit';
    }

    public function action_detailview()
    {
        $this->view = 'detail';
    }

    public function action_index()
    {
        $this->view = 'list';
    }

}

