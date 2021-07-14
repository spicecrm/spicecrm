<?php
namespace SpiceCRM\includes\Logger\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LogViewer;
use SpiceCRM\includes\Logger\APIlogViewer;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


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
        $entry = $viewer->getFullEntry( $args['id'] );
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
