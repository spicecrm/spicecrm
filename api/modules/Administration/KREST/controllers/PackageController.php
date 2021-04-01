<?php
namespace SpiceCRM\modules\Administration\KREST\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\SystemDeploymentPackages\SystemDeploymentPackageSource;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageLoader;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\authentication\AuthenticationController;

class PackageController {

    public function getRepoUrl($repoid) {
        $db = DBManagerFactory::getInstance();
        $repourl = '';
        if ($repoid) {
            $repository = $db->fetchByAssoc($db->query("SELECT * FROM sysuipackagerepositories WHERE id = '{$repoid}'"));
            $repourl = $repository['url'];
        }
        if(empty($repourl)) $repourl = SystemDeploymentPackageSource::getPublicSource();
        return $repourl;
    }

    private function checkAdmin() {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if(!$current_user->is_admin) {
            throw new ForbiddenException();
        }
    }

    public function getRepositories($req, $res, $args) {
        $this->checkAdmin();

        $db = DBManagerFactory::getInstance();
        $repositories = [];
        $repositorieObjects = $db->query("SELECT * FROM sysuipackagerepositories");
        while($repository = $db->fetchByAssoc($repositorieObjects)){
            $repositories[] = $repository;
        };
        return $res->withJson($repositories);
    }

    public function getPackages($req, $res, $args) {
        
$db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        $confloader = new SpiceUIConfLoader();

        $repourl = $this->getRepoUrl($args['repository']);
        // switched to curl
        // $getJSONcontent = file_get_contents("{$repourl}/config");
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($curl, CURLOPT_URL, $repourl .'/config');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_ENCODING, "UTF-8");
        $getJSONcontent = curl_exec($curl);

        $content = json_decode($getJSONcontent);
        if ($confloader->release === true) {
            $content->versions = [];
            $content->versions[0]->version = $GLOBALS['sugar_version'];
        }
        $content->loaded = $confloader->getCurrentConf();
        $content->opencrs = $confloader->loader->hasOpenChangeRequest();

        // CR1000338 disable blacklisted packages
        if(isset( SpiceConfig::getInstance()->config['packageloader']['blacklist']) && !empty(SpiceConfig::getInstance()->config['packageloader']['blacklist'])) {
            foreach ($content->packages as $idx => $package) {
                if (in_array($package->package, SpiceConfig::getInstance()->config['packageloader']['blacklist'])) {
                    $package->extensions = 'locked by admin'; // will disable package load since there is no KREST extension by that name
                }
            }
        }
        return $res->withJson($content);
    }

    public function loadPackage($req, $res, $args) {
        $this->checkAdmin();
        $confloader = new SpiceUIConfLoader($this->getRepoUrl($args['repository']));
        return $res->withJson(['response' => $confloader->loadPackage($args['package'], '*')]);
    }

    public function deletePackage($req, $res, $args) {
        $this->checkAdmin();

        $confloader = new SpiceUIConfLoader();

        if(!$confloader) $this->getLoaders();

        return $res->withJson(['response' => $confloader->deletePackage($args['package'])]);
    }

    public function loadLanguage($req, $res, $args) {
        $this->checkAdmin();

        $langloader = new SpiceLanguageLoader($this->getRepoUrl($args['repository']));

        return $res->withJson($langloader->loadLanguage($args['language']));
    }

    public function deleteLanguage($req, $res, $args) {
        $this->checkAdmin();

        $langloader = new SpiceLanguageLoader();

        return $res->withJson(['success' => $langloader->deleteLanguage($args['language'])]);
    }

}
