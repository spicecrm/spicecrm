<?php
namespace SpiceCRM\includes\Logger\api\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\Logger\LogViewer;
use SpiceCRM\includes\Logger\APIlogViewer;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\modules\Mailboxes\Handlers\DispatchResponse;
use SpiceCRM\modules\Mailboxes\Mailbox;


class LogViewController{

    /**
     * Get the entries of the error log.
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function CRMLogGetEntries( Request $req, Response $res, $args ): Response {
        $viewer = new LogViewer();
        return $res->withJson( $viewer->getEntries( $req->getQueryParams() ));
    }

    /**
     * Get a specific entry in full length.
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function CRMLogGetFullEntry( Request $req, Response $res, $args ): Response {
        $viewer = new LogViewer();
        $entry = $viewer->getFullEntry( $args['id'] );
        return $res->withJson([
            'currentLogLevel' => @SpiceConfig::getInstance()->config['logger']['level'],
            'entry' => $entry
        ]);
    }

    /**
     * Delete all the log data.
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function CRMlogTruncate( Request $req, Response $res, $args ): Response {
        $db = DBManagerFactory::getInstance();
        $db->query('truncate table syslogs');
        return $res->withJson(['success' => true]);
    }

    /**
     * Get the entries of the API Log config
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogGetConfig( Request $req, Response $res, $args ): Response {
        $db = DBManagerFactory::getInstance();
        $entriesObj = $db->query("SELECT * FROM sysapilogconfig");

        $entries = [];
        while($entry = $db->fetchByAssoc($entriesObj)) {
            $entry['is_active'] = boolval($entry['is_active']);
            $entries[] = $entry;
        };
        return $res->withJson($entries);
    }

    /**
     * loads the dictionary entreis that match the api log and thus can be used for the logging
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogGetLogTables( Request $req, Response $res, $args ): Response {
        $dictionary = SpiceDictionary::getInstance()->dictionary;

        $tables = [];
        foreach($dictionary as $name => $data){
            if($name != 'sysapilog' && $data['fields'] == $dictionary['sysapilog']['fields']){
                $tables[] = $name;
            }
        }

        return $res->withJson($tables);
    }

    /**
     * activates or deactivates a config entry for the API Log
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogConfigSet( Request $req, Response $res, $args ): Response {
        $db = DBManagerFactory::getInstance();
        $body = $req->getParsedBody();
        // set the id
        $body['id'] = $args['id'];
        // mingle is active
        $body['is_active'] = $body['is_active'] === true || $body['is_active'] == '1' ? 1 : 0;

        // run the query
        $db->upsertQuery('sysapilogconfig', ['id' => $args['id']], $body);
        return $res->withJson(['success' => true]);
    }
    /**
     * activates or deactivates a config entry for the API Log
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogSetActive( Request $req, Response $res, $args ): Response {
        $db = DBManagerFactory::getInstance();
        $db->query("UPDATE sysapilogconfig SET is_active = {$args['status']} WHERE id='{$args['id']}'");
        return $res->withJson(['success' => true]);
    }

    /**
     * deletes an entry for the api log config
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogConfigDelete( Request $req, Response $res, $args ): Response {
        $db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM sysapilogconfig WHERE id='{$args['id']}'");
        return $res->withJson(['success' => true]);
    }

    /**
     * Get the entries of the REST log.
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogGetRecords( Request $req, Response $res, $args ): Response {
        $viewer = new APIlogViewer();
        $entries = $viewer->getEntries($req->getQueryParams());
        return $res->withJson([
            'count' => count($entries),
            'totalCount' => $viewer->getTotalCount(),
            'entries' => $entries
        ]);
    }

    /**
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogGetRecord( Request $req, Response $res, $args ): Response {
        $viewer = new APIlogViewer();
        $params = $req->getQueryParams();
        $entry = $viewer->getFullEntry( $args['id'], $params['logtable'] );

        $entry['needsAuthorization'] = false;
        $routes = RESTManager::getInstance()->app->getRouteCollector()->getRoutes();
        foreach ( $routes as $route ) {
            if ( $route->getMethods()[0] === $entry['method'] and $route->getPattern() === $entry['route'] ) {
                $routeDefinition = RESTManager::getInstance()->getRoute( $route->getIdentifier(), strtolower( $entry['method'] ));
                $entry['needsAuthorization'] = !$routeDefinition['options']['noAuth'];
                break;
            }
        }
       return $res->withJson($entry);
    }

    /**
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function APIlogTruncate( Request $req, Response $res, $args ): Response {
        $db = DBManagerFactory::getInstance();
        $db->query("truncate table sysapilog");
        return $res->withJson(['success' => true]);
    }

    /**
     * Replay an API Log Entry
     */
    public function APIlogReplay( Request $req, Response $res, $args ): Response {

        $bodyParams = $req->getParsedBody();

        $viewer = new APIlogViewer();
        $entry = $viewer->getFullEntry( $args['id'] );

        $url = $entry['url'];
        $user = AuthenticationController::getInstance()->getCurrentUser();

        $curl = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $url,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $bodyParams['bodyParams'],
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode($user->user_name . ':' . base64_decode( $bodyParams['password'] ))
            ],
        ];
        curl_setopt_array($curl, $curlOptions);
        $response = curl_exec($curl);
        curl_close($curl);

        return $res->withJson([
            'response' => $response,
            'curlError' => curl_error( $curl ),
            'httpStatusCode' => ( $dummy = curl_getinfo( $curl, CURLINFO_HTTP_CODE )),
            'success' => ( $dummy < 300 and $dummy >= 200 )
        ]);
    }

}
