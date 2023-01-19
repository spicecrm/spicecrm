<?php
namespace SpiceCRM\modules\Administration\api\controllers;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use stdClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class ConfiguratorController{

    /**
     * checks if an config exists if not create an stdclass
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function checkForConfig( Request $req, Response $res, $args ): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $forbiddenCategories = ['dbconfig', 'dbconfigoption', 'host_name', 'ldap', 'tenant'];

        # header("Access-Control-Allow-Origin: *");
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        // check for forbidden categories
        if (array_search($args['category'], $forbiddenCategories)) throw ( new ForbiddenException('Category not allowed.'));

        $retArray = SpiceConfig::getInstance()->config[$args['category']] ?: new stdClass();

        /*
        $entries = $db->query("SELECT * FROM config WHERE category = '{$args['category']}'");
        while ($entry = $db->fetchByAssoc($entries)) {
            $retArray[$entry['name']] = $entry['value'];
        }
        */
        return $res->withJson($retArray);
    }

    /**
     * writes not forbidden categories to the database
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function writeConfToDb( Request $req, Response $res, $args ): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $forbiddenCategories = ['dbconfig', 'dbconfigoption', 'host_name', 'ldap'];

        # header("Access-Control-Allow-Origin: *");
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        // check for forbidden categories
        if (array_search($args['category'], $forbiddenCategories)) throw ( new ForbiddenException('Category not allowed.'));

        $postBody = $req->getParsedBody()['config'];

        foreach($postBody as $name => $value){
            // write sugar config
            SpiceConfig::getInstance()->config[$args['category']][$name] = $value;

            // write to database
            $entry = $db->fetchByAssoc($db->query("SELECT * FROM config WHERE category='{$db->quote($args['category'])}' AND name='{$db->quote($name)}'"));
            if($entry){
                $db->query("UPDATE config SET value='{$db->quote($value)}' WHERE category='{$db->quote($args['category'])}' AND name='{$db->quote($name)}'");
            } else {
                $db->query("INSERT INTO config (category, name, value) VALUES('{$db->quote($args['category'])}', '{$db->quote($name)}', '{$db->quote($value)}')");
            }
        }

        // clear the config cache and reload from DB
        SpiceConfig::getInstance()->reloadConfig(true);

        return $res->withJson($postBody);

    }

    /**
     * converts the arguments to an html decoded value
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function readConfig( Request $req, Response $res, $args ): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        # header("Access-Control-Allow-Origin: *");
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        $retArray = [];

        // check that we have a dictionary entry
        if(!isset(SpiceDictionaryHandler::getInstance()->dictionary[$args['table']])){
            throw new NotFoundException('not a known table');
        }
        $entries = $db->query("SELECT * FROM {$args['table']}");

        while ($entry = $db->fetchByAssoc($entries)) {
            $retArrayEntry = [];
            foreach ($entry as $key => $value) {
                $retArrayEntry[$key] = html_entity_decode($value);
            }

            $retArray[] = $retArrayEntry;
        }

        return $res->withJson($retArray);

    }

    /**
     * checks the metadata and handles them
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function deleteConfig(Request $req, Response $res, $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        # header("Access-Control-Allow-Origin: *");
        if (!$current_user->is_admin) throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        if(!isset(SpiceDictionaryHandler::getInstance()->dictionary[$args['table']])){
            throw new NotFoundException('not a known table');
        }

        SystemDeploymentCR::deleteDBEntry($args['table'], $args['id'], $args['table']);

        return $res->withJson(['status' => 'success']);
    }

    /**
     * writes config to database
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function writeConfig( Request $req, Response $res, $args ): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        # header("Access-Control-Allow-Origin: *");

        if(!isset(SpiceDictionaryHandler::getInstance()->dictionary[$args['table']])){
            throw new NotFoundException('not a known table');
        }

        $postBody = $req->getParsedBody();

        // no error handling, fire and forget :)
        if (count($postBody['config']) > 0) {
            // make sure array is only 1 level
            foreach($postBody['config'] as $key => $val){
                if(is_array($val)){
                    $postBody['config'][$key] = json_encode($val);
                }
            }
            // make sure id field is there
            if(!isset($postBody['config']['id'])){
                $postBody['config']['id'] = $args['id'];
            }

            SystemDeploymentCR::writeDBEntry($args['table'], $args['id'], $postBody['config'], $args['table']);
        }

        return $res->withJson(['status' => 'success']);
    }

    /**
     * @throws NotFoundException
     * @throws ForbiddenException
     */
    public function writeConfigList(Request $req, Response $res, $args ): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        if(!isset(SpiceDictionaryHandler::getInstance()->dictionary[$args['table']])){
            throw new NotFoundException('not a known table');
        }

        $postBody = $req->getParsedBody();

        foreach ($postBody['config'] as $entry) {

            foreach($entry as $key => $val){
                if(!is_array($val)) continue;
                $entry[$key] = json_encode($val);
            }

            SystemDeploymentCR::writeDBEntry($args['table'], $entry['id'], $entry, $args['table']);
        }

        return $res->withJson(['status' => 'success']);
    }

    /**
     * loads clears the default config
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function loadDefaultConfig( Request $req, Response $res, $args ): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        $params = $req->getQueryParams();

        $loader = new SpiceUIConfLoader();
        $route = $loader->routebase;
        $packages = explode(",", $params['packages']);
        $versions = (!empty($params['versions']) ? $params['versions'] : "*");
        $endpoint = implode("/", [$route, implode(",", $packages), $versions]);
        $results = $loader->loadDefaultConf($endpoint, ['route' => $route, 'packages' => $packages, 'versions' => $versions]);
        $loader->cleanDefaultConf();
        return $res->withJson($results);
    }

    /**
     * Gets the object repository items as string, comma separated.
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function getObjectRepositoryItems( Request $req, Response $res, $args ): Response {
        $db = DBManagerFactory::getInstance();

        $db->query('SET SESSION group_concat_max_len = 1000000;');
        $sql = 'SELECT CONCAT("\'", group_concat(item ORDER BY item SEPARATOR "\',\'"), "\'") FROM (SELECT component item FROM sysuiobjectrepository UNION SELECT component item FROM sysuicustomobjectrepository UNION SELECT module item FROM sysuimodulerepository UNION SELECT module item FROM sysuicustommodulerepository) x;';

        $dbResult = $db->query( $sql );
        $row = $db->fetchByAssoc( $dbResult );

        return $res->withJson([ 'repostring' => array_pop( $row ) ]);
    }

}