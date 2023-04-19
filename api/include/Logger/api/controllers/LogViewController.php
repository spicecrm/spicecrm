<?php
namespace SpiceCRM\includes\Logger\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LogViewer;
use SpiceCRM\includes\Logger\APIlogViewer;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;


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
        $dictionary = SpiceDictionaryHandler::getInstance()->dictionary;

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

}
