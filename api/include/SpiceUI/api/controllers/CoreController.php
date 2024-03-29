<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHandler;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class CoreController
{


    /**
     * returns a list of all loaded extensions
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getExtensions($req, $res, $args) {
        $RESTManager = RESTManager::getInstance();
        return $res->withJson([
            'version' => '2.0',
            'extensions' => $RESTManager->extensions
        ]);
    }

    /**
     * returns general system information
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getSysinfo(Request $req, Response $res, array $args): Response {

        $languages = LanguageManager::getLanguages(true);
        $languages['required_labels'] = LanguageManager::getSpecificLabels( SpiceLanguageManager::getInstance()->getSystemDefaultLanguage(), [
            'LBL_KEEP_ME_LOGGED_IN', 'LBL_USER_NAME', 'LBL_PASSWORD', 'LBL_LOGIN', 'LBL_ENTER_CODE'
        ]);

        // CR1000463 User Manager cleanup.. we need to know in frontend if spiceacl is running
        $aclcontroller = 'spiceacl';
        if (SpiceConfig::getInstance()->config['acl']['controller'] && !preg_match('/SpiceACL/', SpiceConfig::getInstance()->config['acl']['controller'])) {
            $aclcontroller = 'bwcacl';
        }

        $uiRestHandler = new SpiceUIRESTHandler();

        $payload = [
            'version' => SpiceConfig::getSystemVersion(),
            'systemsettings' => [
                'upload_maxsize' => SpiceConfig::getInstance()->config['upload_maxsize'],
                'enableSettingUserPrefsByAdmin' => isset(SpiceConfig::getInstance()->config['enableSettingUserPrefsByAdmin']) ? (boolean)@SpiceConfig::getInstance()->config['enableSettingUserPrefsByAdmin'] : false,
                'aclcontroller' => $aclcontroller, //CR1000463
                'stack_trace_errors' => SpiceUtils::getStackTrace(),
                'international_email_addresses' => SpiceConfig::getInstance()->config['international_email_addresses'] ?? 0
            ],
            'extensions' => RESTManager::getInstance()->extensions,
            'languages' => $languages,
            'elastic' => SpiceFTSUtils::checkElastic(),
            'php' => [
                'version' => phpversion(),
                'extensions' => get_loaded_extensions()
            ],
            'socket_frontend' => SpiceConfig::getInstance()->config['core']['socket_frontend'],
            'loginSidebarUrl' => isset (SpiceConfig::getInstance()->config['uiLoginSidebarUrl'][0]) ? SpiceConfig::getInstance()->config['uiLoginSidebarUrl'] : false,
            'displayloginsidebar' => SpiceConfig::getInstance()->config['uiDisplayLoginSidebar'] ?: false,
            'allowForgotPass' => (boolean)( SpiceConfig::getInstance()->config['uiAllowForgotPass'] ),
            'ChangeRequestRequired' => isset(SpiceConfig::getInstance()->config['change_request_required']) ? (boolean)SpiceConfig::getInstance()->config['change_request_required'] : false,
            'sessionMaxLifetime' => (int)ini_get('session.gc_maxlifetime'),
            'unique_key' => SpiceConfig::getInstance()->config['unique_key'],
            'name' => SpiceConfig::getInstance()->config['system']['name'],
            'assets' => $uiRestHandler->getAssets()
        ];

        $response = RESTManager::getInstance()->app->getResponseFactory()->createResponse();
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * returns the system assets
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     */
    function getSysAssets(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $assets = [];
        $assetsObj = $db->query("SELECT assetkey, assetvalue FROM sysuiassets");
        while($asset = $db->fetchByAssoc($assetsObj)) $assets[] = $asset;
        return $res->withJson($assets);
    }

    /**
     * writes the http errors to the log .. this is called from teh UI when a http error occurs on the client .. the client will
     * after a certain time retry and call the logger for http errors
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    function postHttpErrors(Request $req, Response $res, $args): Response
    {
        $errors = $req->getParsedBody()['errors'];
        $logtext = '';
        $now = date('c');
        foreach ($errors as $error) $logtext .= $now . "\n" . var_export($error, true) . "\n------------------------------\n";
        $ret = file_put_contents('ui_http_network_errors.log', $logtext, FILE_APPEND);
        return $res->withJson(['success' => $ret !== false]);
    }

    /**
     * stores a tmp file for the proxy handling of the FILES in PHP
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    function storeTmpFile(Request $req, Response $res, $args): Response
    {
        $postBody = file_get_contents('php://input');
        $temppath = sys_get_temp_dir();
        $filename = SpiceUtils::createGuid();
        file_put_contents($temppath . '/' . $filename, base64_decode($postBody));
        return $res->withJson(['filepath' => $temppath . '/' . $filename]);
    }

    /**
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @deprecated
     *
     * gets the backend timezones
     *
     */
    function getTimeZones($req, $res, $args)
    {
        return $res->withJson(TimeDate::getTimezoneList());
    }


    /**
     * retruns the language strings
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    function getLanguage($req, $res, $args)
    {
        // get the current user
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // retrieve the available languages
        $languages = LanguageManager::getLanguages();

        // get the requested language
        $language = $args['language'];
        $params = $req->getQueryParams();

        // see if the user has a default language set
        if (empty($language)) {
            $language = $current_user->getPreference('language');
        }

        // see if we have a language passed in .. if not use the default
        if (empty($language)) {
            $language = LanguageManager::getDefaultLanguage();
        }

        // see if we have cached the language
        $cached = SpiceCache::get("cachedlanguage{$language}");
        if($cached) return $res->withJson($cached);

        // get the app List Strings
        $appStrings = SpiceUtils::returnAppListStringsLanguage($language);

        $syslanguagelabels = LanguageManager::loadDatabaseLanguage($language);
        $syslanguages = [];
        if (is_array($syslanguagelabels)) {
            foreach ($syslanguagelabels as $syslanguagelbl => $syslanguagelblcfg) {
                $syslanguages[$syslanguagelbl] = [
                    'default' => $syslanguagelblcfg['default'],
                    'short' => $syslanguagelblcfg['short'],
                    'long' => $syslanguagelblcfg['long'],
                ];
            }
        }

        $responseArray = [
            'language' => $language,
            'languages' => $languages,
            'applang' => $syslanguages,
            'applist' => $appStrings
        ];

        // cache the values
        SpiceCache::set("cachedlanguage{$language}", $responseArray);

        return $res->withJson($responseArray);
    }

    function getPortalGDPRagreementText()
    {
        1;
    }



    public function getRoutes($req, $res, $args) {
        return $res->withJson(RESTManager::getInstance()->getRoutes());
    }

    /**
     * Returns the swagger definition of the API.
     * todo multiple extensions
     * todo generate routes from generic functions for specific modules
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getSwagger($req, $res, $args) {
        $postBody = $req->getParsedBody();
        $node       = $postBody['node'] ?: "/";
        $extensions = $postBody['extensions'];
        $modules    = $postBody['modules'];
//        $extensionName = $args['extensionName'] ?: '';
        $res->getBody()->write(RESTManager::getInstance()->getSwagger($extensions, $modules, $node));
        return $res->withHeader('Content-Type', 'text/yaml');
    }

}
