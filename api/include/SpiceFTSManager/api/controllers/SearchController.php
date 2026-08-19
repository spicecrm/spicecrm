<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceFTSManager\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSRESTManager;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SearchController {

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function export(Request $req, Response $res, array $args): Response {
        $postBody = $req->getParsedBody();
        $charsetTo=SpiceFTSHandler::getInstance()->export($postBody);
        return $res->withHeader('Content-Type', 'text/csv; charset=' . $charsetTo);
    }


    /**
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function searchPhone(Request $req, Response $res, array $args): Response {
        // get post body or get Request param
        $postBody = $req->getParsedBody();
        $getParams = $req->getQueryParams();

        // replace leading 00 with +
        $phonenumber = $postBody['searchterm'] ?: $getParams['searchterm'];
        return $res->withJson(SpiceFTSHandler::getInstance()->searchPhone($phonenumber));
    }


    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function search(Request $req, Response $res, array $args): Response {
        $postBody = $req->getParsedBody();
        return $res->withJson(SpiceFTSHandler::getInstance()->search($postBody));
    }

}
