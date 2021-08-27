<?php

namespace SpiceCRM\modules\Administration\api\controllers;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SystemDeploymentPackages\SystemDeploymentPackageSource;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguagesRESTHandler;

class ReferenceController
{

    /**
     * get the current system Configuration
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */

    public function getCurrentSystemConf(Request $req, Response $res, array $args): Response {
        $getJSONcontent = file_get_contents(SystemDeploymentPackageSource::getPublicSource().'referenceconfig');

        //BEGIN CR1000048 maretval: catch version and modify depending on reference / release
        $loader = new SpiceUIConfLoader();
        $content = json_decode($getJSONcontent);
        if ($loader->release === true) {
            $content->versions = [];
            $content->versions[0]->version = $GLOBALS['sugar_version'];
        }
        $content->loaded = $loader->getCurrentConf();
        return $res->withJson($content);
    }


    /**
     * load the system language
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function loadSystemLanguage(Request $req, Response $res, array $args): Response {
        $handler = new SpiceLanguagesRESTHandler();
        $params = $req->getQueryParams();
        $params['languages'] = $args['languages'];
        $result = $handler->loadSysLanguages($params);
        return $res->withJson($result);
    }

    /**
     * laad and cleanup the default configuration
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function cleanUpDefaultConf(Request $req, Response $res, array $args): Response {
        $params = $req->getQueryParams();
        $loader = new SpiceUIConfLoader();
        $route = $loader->routebase;
        $package = (isset($params['package']) ? $params['package'] : "*");
        $version = (isset($params['version']) ? $params['version'] : "*");
        $endpoint = implode("/", [$route, $package, $version]);
        $results = $loader->loadDefaultConf($endpoint, ['route' => $route, 'package' => $package, 'version' => $version]);
        $loader->cleanDefaultConf();
        return $res->withJson($results);
    }
}