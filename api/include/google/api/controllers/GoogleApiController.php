<?php
namespace SpiceCRM\includes\google\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\google\GoogleAPIRestHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class GoogleApiController
{
    /**
     * start a search
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function search(Request $req, Response $res, array $args): Response {
        $googleAPIRestHandler = new GoogleAPIRestHandler();
        return $res->withJson(
            $googleAPIRestHandler->search(
                urldecode($args['term']),
                urldecode($args['locationBias'])
            )
        );
    }

    /**
     * get the autocompletion
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function autocomplete(Request $req, Response $res, array $args): Response
    {
        $googleAPIRestHandler = new GoogleAPIRestHandler();
        return $res->withJson(
            $googleAPIRestHandler->autocomplete(
                urldecode($args['term'])
            )
        );
    }

    /**
     * get the details of a place
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getPlaceDetails(Request $req, Response $res, array $args): Response {
        $googleAPIRestHandler = new GoogleAPIRestHandler();
        return $res->withJson($googleAPIRestHandler->getplacedetails($args['placeId']));
    }
}