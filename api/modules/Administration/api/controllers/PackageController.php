<?php
namespace SpiceCRM\modules\Administration\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\modules\SystemDeploymentPackages\SystemDeploymentPackageSource;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageLoader;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\authentication\AuthenticationController;

class PackageController {

    /**
     * get the url to call for specified repository
     * fallback on default when no repository found
     * @param null $repositoryId
     * @return mixed|string
     * @throws \Exception
     */
    public function getRepoUrl($repositoryId = null) {
        $db = DBManagerFactory::getInstance();
        $repositoryUrl = '';
        if ($repositoryId) {
            $repository = $db->fetchByAssoc($db->query("SELECT * FROM sysuipackagerepositories WHERE id = '{$repositoryId}'"));
            $repositoryUrl = $repository['url'];
        }
        if(empty($repositoryUrl)) $repositoryUrl = SystemDeploymentPackageSource::getPublicSource();
        return $repositoryUrl;
    }

    private function checkAdmin() {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if(!$current_user->is_admin) {
            throw new ForbiddenException();
        }
    }

    public function getRepositories(Request $req, Response $res, array $args): Response {
//        $this->checkAdmin();

        $db = DBManagerFactory::getInstance();
        $repositories = [];
        $repositorieObjects = $db->query("SELECT * FROM sysuipackagerepositories");
        while($repository = $db->fetchByAssoc($repositorieObjects)){
            $repositories[] = $repository;
        };
        return $res->withJson($repositories);
    }

    public function getPackages(Request $req, Response $res, array $args): Response {

        $this->checkAdmin();

        $confloader = new SpiceUIConfLoader();

        $repositoryUrl = $this->getRepoUrl($args['repository']);
        // switched to curl
        // $getJSONcontent = file_get_contents("{$repositoryUrl}/config");
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($curl, CURLOPT_URL, $repositoryUrl .'/config');
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
            if(is_array(SpiceConfig::getInstance()->config['packageloader']['blacklist'])) {
                $blacklist = SpiceConfig::getInstance()->config['packageloader']['blacklist']; // BWC with array in config_override.php
            } else{
                $blacklist =json_decode(SpiceConfig::getInstance()->config['packageloader']['blacklist'], true);
            }
            if(is_array($blacklist)) {
                foreach ($content->packages as $idx => $package) {
                    if (in_array($package->package, $blacklist)) {
                        $package->extensions = 'locked by admin'; // will disable package load since there is no KREST extension by that name
                    }
                }
            }
        }
        return $res->withJson($content);
    }

    public function loadPackage(Request $req, Response $res, array $args): Response {
        $this->checkAdmin();
        $confloader = new SpiceUIConfLoader($this->getRepoUrl($args['repository']));
        $result = ['response' => $confloader->loadPackage($args['package'], '*')];
        if ($result['response']['success']) {
            SpiceModules::getInstance()->loadModules(true);
        }
        return $res->withJson($result);
    }

    public function deletePackage(Request $req, Response $res, array $args): Response {
        $this->checkAdmin();

        $confloader = new SpiceUIConfLoader();

        if(!$confloader) $this->getLoaders();

        return $res->withJson(['response' => $confloader->deletePackage($args['package'])]);
    }

    /**
     * load language entry & corresponding translations for specified language
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function loadLanguage(Request $req, Response $res, array $args): Response {
        $langloader = new SpiceLanguageLoader($this->getRepoUrl($args['repository']));
        return $res->withJson($langloader->loadLanguage($args['language']));
    }

    /**
     * remove language entry & corresponding translations for specified language
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function deleteLanguage(Request $req, Response $res, array $args): Response {
        $langloader = new SpiceLanguageLoader();
        return $res->withJson(['success' => $langloader->deleteLanguage($args['language'])]);
    }

}
