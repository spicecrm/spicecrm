<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\KREST\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class CoreController
{
    /**
     * helper to generate a GUID
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function generateGuid(Request $req, Response $res, $args): Response
    {
        return $res->withJson(['id' => SpiceUtils::createGuid()]);
    }

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

        if (isset(SpiceConfig::getInstance()->config['syslanguages']['spiceuisource']) && SpiceConfig::getInstance()->config['syslanguages']['spiceuisource'] == 'db') {

            $languages = LanguageManager::getLanguages(true);
        } else {

            foreach (SpiceConfig::getInstance()->config['languages'] as $language_code => $language_name) {
                $languages['available'][] = [
                    'language_code' => $language_code,
                    'language_name' => $language_name,
                    'system_language' => true,
                    'communication_language' => true
                ];
            }
            $languages['default'] = SpiceConfig::getInstance()->config['default_language'];
        }

        // CR1000463 User Manager cleanup.. we need to know in frontend if spiceacl is running
        $aclcontroller = 'spiceacl';
        if (SpiceConfig::getInstance()->config['acl']['controller'] && !preg_match('/SpiceACL/', SpiceConfig::getInstance()->config['acl']['controller'])) {
            $aclcontroller = 'bwcacl';
        }

        $payload = [
            'version' => '2.0',
            'systemsettings' => [
                'upload_maxsize' => SpiceConfig::getInstance()->config['upload_maxsize'],
                'enableSettingUserPrefsByAdmin' => isset(SpiceConfig::getInstance()->config['enableSettingUserPrefsByAdmin']) ? (boolean)@SpiceConfig::getInstance()->config['enableSettingUserPrefsByAdmin'] : false,
                'aclcontroller' => $aclcontroller //CR1000463
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
            'ChangeRequestRequired' => isset(SpiceConfig::getInstance()->config['change_request_required']) ? (boolean)SpiceConfig::getInstance()->config['change_request_required'] : false,
            'sessionMaxLifetime' => (int)ini_get('session.gc_maxlifetime'),
            'unique_key' => SpiceConfig::getInstance()->config['unique_key'],
            'name' => SpiceConfig::getInstance()->config['system']['name'],
        ];

        $response = RESTManager::getInstance()->app->getResponseFactory()->createResponse();
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
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


    function getLanguage($req, $res, $args)
    {
        // get the requested language
        $language = $args['language'];
        $params = $req->getQueryParams();

        // set the selected language to the preferences
        if (isset($params['setPreferences']) && $params['setPreferences'] == '1') {
            $current_user = AuthenticationController::getInstance()->getCurrentUser();
            $current_user->setPreference('language', $language);
        }

        // see if we have a language passed in .. if not use the default
        if (empty($language)) $language = SpiceConfig::getInstance()->config['default_language'];

        $appStrings = return_app_list_strings_language($language);


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
            'languages' => LanguageManager::getLanguages(),
            'applang' => $syslanguages,
            'applist' => $appStrings
        ];

        $responseArray['md5'] = md5(json_encode($responseArray));

        return $res->withJson($responseArray);
    }

    function getPortalGDPRagreementText()
    {
        1;
    }

    /**
     * get redirection data for a short url
     */
    function getRedirection(Request $req, Response $res, $args): Response
    {
        $redirectTo = DBManagerFactory::getInstance()->getOne(sprintf('SELECT route FROM sysshorturls WHERE urlkey = "%s" AND active = 1 AND deleted = 0', $args['key']));
        return $res->withJson(['redirection' => $redirectTo]);
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
