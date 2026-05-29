<?php

namespace SpiceCRM\modules\Administration\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\DataStreams\StreamFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceBeans\SpiceModules;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\utils\FileUtils;
use SpiceCRM\includes\utils\SpiceFileUtils;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Configurator\Configurator;

class AdminController
{

    /**
     * post request that expects the username and password in the body
     * executes a git pull command with the params for username and password on the shell
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function pullFromRepository(Request $req, Response $res, array $args): Response {
        // get the body
        $postBody = $req->getParsedBody();

        // extract username and password or token from the body
        $username = str_replace('@','%40',$postBody['username']);
        if (empty($postBody['password'])){
            $password = $postBody['token'];
        } else
            $password = $postBody['password'];

        // execute git pull
        $gitPullLog = '';


        // get the remote url
        $output = '';
        exec("git config --get remote.origin.url", $output);



        // if success
        if (empty($postBody['password'])) {
            $remoteUrl = str_replace('//', '//' . $password . '@', $output);
        } else
            $remoteUrl = str_replace('//', '//' . $username . ':' . $password . '@', $output);

        $remoteUrl =  trim($remoteUrl[0], '.git');

        $currentBranch = null;
        exec("git branch --show-current", $currentBranch);

        exec("git pull $remoteUrl $currentBranch[0] 2>&1", $gitPullLog);


        // error handling if this fails
        if(empty($gitPullLog)){
            $gitPullLog = ['Something went wrong, please check the login credentials'];
        }

        return $res->withJson(['success' => true, 'output' => $gitPullLog]);

    }    public function showStatusRepository(Request $req, Response $res, array $args): Response {

        // execute git status
        $gitStatus = '';

        exec("git status", $gitStatus);

        return $res->withJson(['success' => true, 'output' => $gitStatus]);
    }

    /**
     * resets the cache
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function resetCache(Request $req, Response $res, array $args): Response {
        SpiceCache::instance()->resetFull();
        SpiceDictionary::getInstance()->clearSessionCache();
        return $res->withJson(['success' => true]);
    }

    /**
     * build stats for the system
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function systemstats(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $statsArray = [];

        if (!$current_user->is_admin) {
            throw new ForbiddenException();
        }

        $dbSize = 0;
        $dbCount = 0;
        $dbStats = $db->getStats();
        $statsArray['database'] = $dbStats['tables'];
        // get the fts stats
        $statsArray['elastic'] = SpiceFTSHandler::getInstance()->getStats();

        $statsArray['uploadfiles'] = StreamFactory::getStats('upload');

        $params = $req->getQueryParams();
        if ($params['summary']) {
            return $res->withJson([
                'database' => ['size' => $dbStats['size'], 'count' => $dbStats['count']],
                'uploadfiles' => $statsArray['uploadfiles'],
                'elastic' => ['size' => $statsArray['elastic']['_all']['total']['store']['size_in_bytes'], 'count' => $statsArray['elastic']['_all']['total']['docs']['count']],
                'users' => $db->fetchByAssoc($db->fetchByAssoc("SELECT count(id) usercount FROM users WHERE status='Active'"))['usercount']
            ]);
        }
        return $res->withJson($statsArray);
    }

    /**
     * get function to read the contents of system default locales in config table
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getGeneralSettings(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$current_user->is_admin) {
            throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        }

        return $res->withJson([
            'system' => [
                'name' => SpiceConfig::getInstance()->config['system']['name'],
                'site_url' => SpiceConfig::getInstance()->config['site_url'],
                'unique_key' => SpiceConfig::getInstance()->config['unique_key'],
                'startup_mode' => SpiceConfig::getInstance()->config['system']['startup_mode'],
                'edit_mode' => SpiceConfig::getInstance()->config['system']['edit_mode']
            ],
            'advanced' => [
                'stack_trace_errors' => SpiceUtils::getStackTrace(),
                'dump_slow_queries' => SpiceConfig::getInstance()->config['dump_slow_queries'],
                'log_memory_usage' => SpiceConfig::getInstance()->config['log_memory_usage'],
                'slow_query_time_msec' => SpiceConfig::getInstance()->config['slow_query_time_msec'],
                'upload_maxsize' => SpiceConfig::getInstance()->config['upload_maxsize'],
                'upload_dir' => SpiceConfig::getInstance()->config['upload_dir'],
                'file_types' => SpiceConfig::getInstance()->config['attachments']['file_types'] ?: false,
                'international_email_addresses' => SpiceConfig::getInstance()->config['international_email_addresses'],
                'translatable_fields' => SpiceConfig::getInstance()->get('system.translatable_fields'),
                'encryption_hash_salt' => SpiceConfig::getInstance()->get('system.encryption_hash_salt'),
                'gateway_server_api_key' => SpiceConfig::getInstance()->get('system.gateway_server_api_key'),
                'gateway_server_domain' => SpiceConfig::getInstance()->get('system.gateway_server_domain'),
            ],
            'cache' => [
                'class' => SpiceConfig::getInstance()->config['cache']['class'] ?? 'SpiceCacheFile',
                'external_cache_disabled' => SpiceConfig::getInstance()->config['cache']['external_cache_disabled'] ?? false,
                'redis_host' => SpiceConfig::getInstance()->config['cache']['redis_host'] ?? 'localhost',
                'redis_port' => SpiceConfig::getInstance()->config['cache']['redis_port'] ?? 6379,
                'memcached_host' => SpiceConfig::getInstance()->config['cache']['memcached_host'] ?? '127.0.0.1',
                'memcached_port' => SpiceConfig::getInstance()->config['cache']['memcached_port'] ?? 11211,
                'file_location' => SpiceConfig::getInstance()->config['cache']['file_location'] ?? 'cache',
                'file_transparentnames' => SpiceConfig::getInstance()->config['cache']['file_transparentnames'] ?? false
            ],
            'logger' => SpiceConfig::getInstance()->config['logger']
        ]);

    }

    /**
     * writes the values of system default settings in the config table
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws ForbiddenException
     */
    public function writeGeneralSettings(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $diffArray = [];

        $postBody = $req->getParsedBody();

        if (!empty($postBody)) {
            // handle sytem settings
            foreach ($postBody['system'] as $itemname => $itemvalue) {
                switch ($itemname) {
                    // do not write the unique key
                    case 'unique_key':
                        break;
                        // name goes to database
                    case 'name':
                    case 'startup_mode':
                    case 'edit_mode':
                        SpiceConfig::getInstance()->config['system'][$itemname] = $itemvalue;
                        if($db->fetchOne("SELECT * FROM config WHERE category = 'system' AND name = '$itemname'")) {
                            $query = "UPDATE config SET value = '$itemvalue' WHERE category = 'system' AND name = '$itemname'";
                        } else {
                            $query = "INSERT INTO config (category, name, value) VALUES ('system', '$itemname', '$itemvalue')";
                        }
                        $db->query($query);
                        break;
                    default:
                        SpiceConfig::getInstance()->config[$itemname] = $itemvalue;
                        $diffArray[$itemname] = $itemvalue;
                }
            }

            // handle advanced settings
            foreach ($postBody['advanced'] as $itemname => $itemvalue) {

                switch ($itemname) {
                    case 'file_types':
                        if($db->fetchOne("SELECT * FROM config WHERE category = 'attachments' AND name = '$itemname'")) {
                            $query = "UPDATE config SET value = '$itemvalue' WHERE category = 'attachments' AND name = '$itemname'";
                        } else {
                            $query = "INSERT INTO config (category, name, value) VALUES ('attachments', '$itemname', '$itemvalue')";
                        }
                        $db->query($query);
                        break;
                    case 'encryption_hash_salt':
                        SpiceConfig::getInstance()->set('system', 'encryption_hash_salt', $itemvalue);
                        break;
                    case 'gateway_server_api_key':
                        SpiceConfig::getInstance()->set('system', 'gateway_server_api_key', $itemvalue);
                        break;
                    case 'gateway_server_domain':
                        SpiceConfig::getInstance()->set('system', 'gateway_server_domain', $itemvalue);
                        break;
                    case 'translatable_fields':
                        SpiceConfig::getInstance()->set('system', 'translatable_fields', $itemvalue);
                        break;
                    default:
                        SpiceConfig::getInstance()->config[$itemname] = $itemvalue;
                        $diffArray[$itemname] = $itemvalue;
                }
            }

            // handle the cache settings
            foreach ($postBody['cache'] as $itemname => $itemvalue) {
                if($itemvalue == null) continue;
                SpiceConfig::getInstance()->config['cache'][$itemname] = $itemvalue;
                $diffArray['cache'][$itemname] = $itemvalue;
            }

            // handle logger settings
            if($postBody['logger']) {
                SpiceConfig::getInstance()->config['logger'] = $postBody['logger'];
                $diffArray['logger'] = $postBody['logger'];
            }

            // handle default currency settings settings
            foreach ($postBody['currencies'] as $itemname => $itemvalue) {
                SpiceConfig::getInstance()->config['currencies'][$itemname] = $itemvalue;
                $query = "UPDATE config SET value = '$itemvalue' WHERE category = 'currencies' AND name = '$itemname'";
                $db->query($query);
            }

        }

        $configurator = new Configurator();
        $configurator->handleOverrideFromArray($diffArray);

        // clear the config cache
        SpiceCache::clear('dbconfig');

        return $res->withJson([
            'status' => boolval($query)
        ]);
    }

    /**
     * get all columns from the module-table in the database
     * allowed as admin
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getDBColumns(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (SpiceUtils::isAdmin($current_user)) {
            $db = DBManagerFactory::getInstance();
            $nodeModule = BeanFactory::getBean($args['module']);
            return $res->withJson($db->get_columns($nodeModule->_tablename));
        }

        throw new UnauthorizedException('only admin access');
    }

    /**
     * delete all the given columns in the database (with all data!) be carefully
     * allowed as admin
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function repairDBColumns(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (SpiceUtils::isAdmin($current_user)) {

            $db = DBManagerFactory::getInstance();
            $postBody = $req->getParsedBody();
            $nodeModule = BeanFactory::getBean($postBody['module']);

            // build sql to drop table-column
            $deleteQuery = 'ALTER TABLE ' . $nodeModule->_tablename . ' ';
            foreach ($postBody['dbcolumns'] as $column) {
                $deleteQuery .= 'DROP COLUMN ' . $column['name'] . ', ';
            }
            $deleteQuery = substr($deleteQuery, 0, -2);
            $deleteQuery .= ';';

            //execute query
            $result = $db->query($deleteQuery);

            return $res->withJson($result);
        }

        throw new UnauthorizedException('only admin access');
    }

    /**
     * Converts the DB charset and collation
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function convertDatabase(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $body = $req->getParsedBody();
        $result = $db->convertDBCharset($body['charset'], $this->getCollation($body['charset']));

        return $res->withJson($result);
    }

    /**
     * Convert the charset and collation of the given tables
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function convertTables(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        $db = DBManagerFactory::getInstance();

        foreach ($body['tables'] as $table) {
            $db->convertTableCharset($table, $body['charset'], $this->getCollation($body['charset']));
        }

        return $res->withJson(true);
    }

    /**
     * Returns the charset and collation info for the database and its tables
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getDatabaseCharsetInfo(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $result = $db->getDatabaseCharsetInfo();

        return $res->withJson($result);
    }

    private function getCollation(string $charset): string {
        // try from the Spice config
        $configuredCollation = SpiceConfig::getInstance()->config['dbconfigoption']['collation'];
        if($configuredCollation && str_starts_with($configuredCollation, $charset)){ // we trust that utf8mb4 is set and not utf8
            return $configuredCollation;
        }

        switch ($charset) {
            case 'utf8mb4':
                return 'utf8mb4_unicode_ci';
            case 'utf8':
            default:
                return 'utf8_unicode_ci';
        }
    }
}
