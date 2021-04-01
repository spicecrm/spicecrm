<?php
namespace SpiceCRM\modules\Administration\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use Slim\Routing\RouteCollectorProxy;
use stdClass;


class ConfiguratorController{

    /**
     * checks if an config exists if not create an stdclass
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function CheckForConfig($req,$res,$args){
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

    public function WriteConfToDb($req,$res,$args){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $forbiddenCategories = ['dbconfig', 'dbconfigoption', 'host_name', 'ldap'];

        # header("Access-Control-Allow-Origin: *");
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        // check for forbidden categories
        if (array_search($args['category'], $forbiddenCategories)) throw ( new ForbiddenException('Category not allowed.'));

        $postBody = $req->getParsedBody();

        foreach($postBody as $name => $value){
            // write sugar config
            SpiceConfig::getInstance()->config[$args['category']][$name] = $value;

            // write to database
            $entry = $db->fetchByAssoc($db->query("SELECT * FROM config WHERE category='{$args['category']}' AND name='{$name}'"));
            if($entry){
                $db->query("UPDATE config SET value='{$value}' WHERE category='{$args['category']}' AND name='{$name}'");
            } else {
                $db->query("INSERT INTO config (category, name, value) VALUES('{$args['category']}', '{$name}', '{$value}')");
            }
        }

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

    public function ConvertToHTMLDecoded($req,$res,$args){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        # header("Access-Control-Allow-Origin: *");
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        $retArray = [];

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

    public function CheckMetaData($req,$res,$args){
        global  $dictionary;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        # header("Access-Control-Allow-Origin: *");
        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        foreach ($dictionary as $meta) {
            if ($meta['table'] == $args['table']) {
                // check if we have a CR set
                if ($meta['changerequests']['active'] && $_SESSION['SystemDeploymentCRsActiveCR'])
                    $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

                if($cr){
                    $record = $db->fetchByAssoc($db->query("SELECT * FROM {$args['table']} WHERE id = '{$args['id']}'"));
                    if(is_array($meta['changerequests']['name'])){
                        $nameArray = [];
                        foreach($meta['changerequests']['name'] as $item){
                            $nameArray[]=$record['item'];
                        }
                        $cr->addDBEntry($args['table'], $args['id'], 'D', implode('/', $nameArray));
                    } else {
                        $cr->addDBEntry($args['table'], $args['id'], 'D', $record[$meta['changerequests']['name']]);
                    }
                }
            }
        }
        $db->query("DELETE FROM {$args['table']} WHERE id = '{$args['id']}'");
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

    public function WriteConfig($req,$res,$args){
        global  $dictionary;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$current_user->is_admin) throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        # header("Access-Control-Allow-Origin: *");

        $postBody = $req->getParsedBody();

        $setArray = [];
        foreach ($postBody as $field => $value) {
            if ($field !== 'id' && $value !== "")
                $setArray[] = sprintf('`%s` = "%s"', $field, $db->quote( $value ));
        }

        // no error handling, fire and forget :)
        if (count($setArray) > 0) {
            $exists = $db->fetchByAssoc($db->query("SELECT id FROM {$args['table']} WHERE id='{$args['id']}'"));
            if ($exists) {
                $db->query("UPDATE {$args['table']} SET " . implode(',', $setArray) . " WHERE id='{$args['id']}'");
            } else {
                $setArray[] = "id='{$args['id']}'";
                $db->query("INSERT INTO {$args['table']} SET " . implode(',', $setArray));
            }

            // check for CR relevancy
            foreach ($dictionary as $meta) {
                if ($meta['table'] == $args['table']) {
                    // check if we have a CR set
                    if ($meta['changerequests']['active'] && $_SESSION['SystemDeploymentCRsActiveCR'])
                        $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

                    if($cr){
                        if(is_array($meta['changerequests']['name'])){
                            $nameArray = [];
                            foreach($meta['changerequests']['name'] as $item){
                                $nameArray[]=$postBody['item'];
                            }
                            $cr->addDBEntry($args['table'], $args['id'], $exists ? 'U' : 'I', implode('/', $nameArray));
                        } else {
                            $cr->addDBEntry($args['table'], $args['id'], $exists ? 'U' : 'I', $postBody[$meta['changerequests']['name']]);
                        }
                    }

                }
            }

        }

        return $res->withJson(['status' => 'success']);
    }

    /**
     * merges the postbody and postparams arrays together
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function ConfigMergeArrays($req,$res,$args){
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $data = array_merge($postBody, $postParams);
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

    public function LoadDefaultConfig($req,$res,$args){
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
     * concats the repository queries together
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function ConcatRepoQuery($req,$res,$args){
        $db = DBManagerFactory::getInstance();

        $db->query('SET SESSION group_concat_max_len = 1000000;');
        $sql = 'SELECT CONCAT("\'", group_concat(item ORDER BY item SEPARATOR "\',\'"), "\'") FROM (SELECT component item FROM sysuiobjectrepository UNION SELECT component item FROM sysuicustomobjectrepository UNION SELECT module item FROM sysuimodulerepository UNION SELECT module item FROM sysuicustommodulerepository) x;';

        $dbResult = $db->query( $sql );
        $row = $db->fetchByAssoc( $dbResult );

        return $res->withJson([ 'repostring' => array_pop( $row ) ]);
    }

}