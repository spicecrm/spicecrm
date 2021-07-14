<?php
namespace SpiceCRM\includes\SpiceInstaller\REST\controllers;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;

class SpiceInstallerController {

    public function __construct(){
        // workaround for installer because of SpiceUtils::spiceCleanup... find a better way
        $GLOBALS['installing'] = true;
    }

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
