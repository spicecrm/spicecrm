<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceFTSManager\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceFTSController
{

    /**
     * retrieve some statistics from elasticsearch
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getStatus(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['version' => SpiceFTSHandler::getInstance()->getStatus(), 'stats' => SpiceFTSHandler::getInstance()->getStats(), 'settings' => SpiceFTSHandler::getInstance()->getSettings()]);
    }

    /**
     * retrieve the stats on the elastic cluster
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getStats(Request $req, Response $res, array $args): Response
    {

        return $res->withJson(SpiceFTSHandler::getInstance()->getStats());
    }

    /**
     * returns the settings for the index with the current prefix
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function unblock(Request $req, Response $res, array $args): Response
    {

        return $res->withJson(SpiceFTSHandler::getInstance()->unblock());
    }

    /**
     * return all fields for a given module to be used in the selection tree
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getFTSModuleFields(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(SpiceFTSHandler::getInstance()->getFTSModuleFields($args['module']));
    }

///////////////////////////
    /**
     * return results from global search query
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
//    public function getGlobalSearchResults($req, $res, $args)
//    {
//        $getParams = $req->getParsedBody();
//        return $res->withJson(SpiceFTSHandler::getInstance()->getGlobalSearchResults('', '', $getParams));
//    }

    /**
     * return results from module search query on get query
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
//    public function getSearchResultsForModuleByGet($req, $res, $args)
//    {
//        $getParams = $req->getQueryParams();
//        return $res->withJson(SpiceFTSHandler::getInstance()->getGlobalSearchResults($args['module'], '', $getParams));
//    }

    /**
     * return results from module search query on post request
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
//    public function getSearchResultsForModuleByPost($req, $res, $args)
//    {
//        $getParams = $req->getParsedBody();
//        $postBody = $req->getParsedBody();
//        $result = SpiceFTSHandler::getInstance()->getGlobalSearchResults($args['module'], '', $getParams, $postBody['aggregates'], $postBody['sort']);
//        return $res->withJson($result);
//    }


    /**
     * return results from module search with search term on get request
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
//    public function getGlobalSearchResultsForModuleSearchTermByGet($req, $res, $args)
//    {
//        $getParams = $req->getQueryParams();
//        return $res->withJson(SpiceFTSHandler::getInstance()->getGlobalSearchResults($args['module'], urlencode($args['searchterm']), $getParams));
//    }

    /**
     * return results from module search with search term on post request
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
//    public function getGlobalSearchResultsForModuleSearchTermByPost($req, $res, $args)
//    {
//        $getParams = $req->getParsedBody();
//        $postBody = $req->getParsedBody();
//        return $res->withJson(SpiceFTSHandler::getInstance()->getGlobalSearchResults($args['module'], urlencode($args['searchterm']), $getParams, $postBody['aggregates'], $postBody['sort']));
//    }

    /**
     * retrieve all global search enabled modules
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
//    public function getGlobalSearchModules($req, $res, $args)
//    {
//        return $res->withJson(SpiceFTSHandler::getInstance()->getGlobalSearchModules());
//    }

    /**
     * search in a module
     * @param $req
     * @param $res
     * @param $args
     */
//    public function searchTerm($req, $res, $args)
//    {
//        $getParams = $req->getQueryParams();
//        return $res->withJson(SpiceFTSHandler::getInstance()->searchTerm(urlencode($args['searchterm']), [], $getParams['size'] ?: 10, $getParams['from'] ?: 0));
//    }

    /**
     * check elasticsearch connection
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
//    public function check($req, $res, $args)
//    {
//        if (!SpiceFTSHandler::getInstance()->check()) {
//            throw (new ServiceUnavailableException('FTS Service unavailable'));
//        }
//        return $res->withJson(['ftsstatus' => true]);
//    }
}