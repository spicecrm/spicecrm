<?php

/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 * 
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 * 
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */
require_once('modules/KDeploymentSystems/KDeploymentSystem.php');
$app->group('/kdeployment', function () use ($app) {
    $app->get('/systems', function () use ($app) {
        $dep = new KDeploymentSystem();
        $return = $dep->get_systems();
        echo json_encode($return);
    });
    $app->get('/remoteReleasePackages', function () use ($app) {
        $getParams = $app->request->get();
        $dep = new KDeploymentSystem();
        $return = $dep->get_remote_packages($getParams['system']);
        echo json_encode($return);
    });
    $app->post('/fetchReleasePackage/:id/:system', function ($id, $system) use ($app) {
        $postBody = $app->request->getBody();
        $postParams = $app->request->get();
        $params = array_merge(json_decode($postBody, true), $postParams);
        $dep = new KDeploymentSystem();
        $return = $dep->fetch_remote_package($id, $system, $params);
        echo json_encode($return);
    });
    $app->get('/fetchReleasePackageContent/:id/:system', function ($id, $system) use ($app) {
        $dep = new KDeploymentSystem();
        $return = $dep->fetch_package_content($id, $system);
        echo json_encode($return);
    });
    $app->get('/releasePackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->release_package($packages);
        echo json_encode($return);
    });
    $app->get('/checkAccessPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->check_access($packages);
        echo json_encode($return);
    });
    $app->get('/backupPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->backup($packages);
        echo json_encode($return);
    });
    $app->get('/writeFilesPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->write_files($packages, false);
        echo json_encode($return);
    });
    $app->get('/remoteWriteFilesPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->write_files($packages, true);
        echo json_encode($return);
    });
    $app->get('/writeDBPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->write_db($packages);
        echo json_encode($return);
    });
    $app->get('/markPackageDeployed/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->mark_deployed($packages);
        echo json_encode($return);
    });
    $app->get('/rollbackPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->rollback($packages);
        echo json_encode($return);
    });
    $app->get('/repairPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->repair($packages, false);
        echo json_encode($return);
    });
    $app->get('/remoteRepairPackage/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $res = json_decode($id);
        if ($res === NULL) {
            $packages = array($id);
        } else {
            $packages = $res;
        }
        $return = $dep->repair($packages, true);
        echo json_encode($return);
    });
    $app->get('/releasePackageHistory/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $return = $dep->release_package_history($id);
        echo json_encode($return);
    });
    $app->get('/remoteReleasePackageStatusUpdate/:package/:status/:system', function ($package, $status, $system) use ($app) {
        $dep = new KDeploymentSystem();
        $getParams = $app->request->get();
        $return = $dep->update_remote_package_status($package, $status, $system);
        echo json_encode($return);
    });
    $app->get('/localReleasePackages', function () use ($app) {
        $dep = new KDeploymentSystem();
        $getParams = $app->request->get();
        $return = $dep->get_release_packages($getParams);
        echo json_encode($return);
    });
    $app->get('/sourceSystems', function () use ($app) {
        $dep = new KDeploymentSystem();
        $return = $dep->get_source_systems();
        echo json_encode($return);
    });
    $app->delete('/delSystem/:id', function ($id) use ($app) {
        $dep = new KDeploymentSystem();
        $return = $dep->del_system($id);
        echo json_encode($return);
    });
    $app->post('/addSystemLink/:id/:link', function ($id,$link) use ($app) {
        $dep = new KDeploymentSystem();
        $return = $dep->add_system_link($id,$link);
        echo json_encode($return);
    });
    $app->post('/testConnection', function () use ($app) {
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $dep = new KDeploymentSystem();
        $return = $dep->test_connection(array_merge(json_decode($postBody, true), $postParams));
        echo json_encode($return);
    });
    $app->group('/distribute', function () use ($app) {
        $app->post('/', function () use ($app) {
            $postBody = $body = $app->request->getBody();
            $data = str_replace('data=','',$postBody);
            $postParams = $app->request->get();
            $params = array_merge(json_decode($data, true), $postParams);
            $dep = new KDeploymentSystem();
            $return = $dep->import_systems($params);
            echo json_encode($return);
        });
        $app->post('/:id', function ($id) use ($app) {
            $dep = new KDeploymentSystem();
            $return = $dep->distribute($id);
            echo json_encode($return);
        });
    });
    $app->get('/getRepositories', function () use ($app) {
        $getParams = $app->request->get();
        $dep = new KDeploymentSystem();
        $repos = $dep->getRepositories($getParams);
        echo json_encode(array('list' => $repos));
    });

    $app->get('/latestSwVersions/:swpacks', function ($swpacks) use ($app) {
        $getParams = $app->request->get();
        $dep = new KDeploymentSystem();
        $latestSwPacks = $dep->latestSwVersions(json_decode(html_entity_decode($swpacks)));
        echo json_encode($latestSwPacks);
    });

    $app->get('/appConfig', function () use ($app) {
        $getParams = $app->request->get();
        $dep = new KDeploymentSystem();
        $conf = $dep->getAppConfig();
        echo json_encode($conf);
    });

    $app->post('/RPfromZIPlocal', function ($request) use ($app) {
        $dep = new KDeploymentSystem();
        $postParams = $app->request->get();
        $res = $dep->recieveZipFromForm($postParams);
        echo json_encode($res);
    });

    $app->post('/RPfromZIPremote', function () use ($app) {
        $dep = new KDeploymentSystem();
        $postBody = $app->request->getBody();
        $postParams = $app->request->get();
        $params = array_merge(json_decode($postBody, true), $postParams);
        $res = $dep->recieveZipFromRest($params);
        echo json_encode($res);
    });

});
