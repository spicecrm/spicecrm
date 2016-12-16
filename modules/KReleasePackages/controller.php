<?php

require_once('include/MVC/Controller/SugarController.php');
require_once('include/utils.php');

class KReleasePackagesController extends SugarController {

    function action_DetailView() {
        if ($_REQUEST['print'] == 'true') {
            echo $this->bean->getPrintOut();
            return;
        }

        $this->view = 'releasepackagemanager';
    }

    function action_createPackage()
    {
        $this->bean->create_package();
        $this->view = 'releasepackagemanager';
    }

    function action_releasePackage()
    {
        $this->bean->release_package($_GET['record']);
        $this->view = 'releasepackagemanager';
    }

    function action_getfilechanges() {
        $this->bean->getFileChanges();
        
        global $sugar_config;
        readfile($sugar_config['upload_dir'] . $this->bean->id . '/package_dif_'.$this->bean->id.'.html');
    }

    function action_manager()
    {
        $this->view = "releasepackagemanager";
    }

    function action_index()
    {
        SugarApplication::redirect('index.php?module=KReleasePackages&action=manager');
        exit;
    }

    function action_list()
    {
        SugarApplication::redirect('index.php?module=KReleasePackages&action=manager');
        exit;
    }
}
