<?php
namespace SpiceCRM\includes\SpiceInstaller\REST\controllers;

use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;

class SpiceInstallerKRESTController {


    public function getSysInfo($req, $res, $args)
    {
        $res->getBody()->write('spiceinstaller');
        return $res;
    }
    public function checkSystem($req, $res, $args)
    {
        $spiceInstaller = new SpiceInstaller();
        return $res->withJson($spiceInstaller->checkSystem());
    }

    public function checkDB($req, $res,  $args) {
        $spiceInstaller = new SpiceInstaller();
        return $res->withJson($spiceInstaller->checkDatabase($req));
    }

    public function checkFTS($req, $res, $args) {
        $spiceInstaller = new SpiceInstaller();
        return $res->withJson($spiceInstaller->checkFTS($req));
    }

    public function checkReference($req, $res, $args) {
        $spiceInstaller = new SpiceInstaller();
        return $res->withJson($spiceInstaller->checkReference());
    }

    public function getLanguages($req, $res, $args) {
        $spiceInstaller = new SpiceInstaller();
        return $res->withJson($spiceInstaller->getLanguages());
    }
    public function install($req, $res, $args) {
        $spiceInstaller = new SpiceInstaller();
        return $res->withJson($spiceInstaller->install($req));
    }
}
