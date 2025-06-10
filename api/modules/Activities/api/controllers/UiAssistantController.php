<?php
namespace  SpiceCRM\modules\Activities\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class UiAssistantController{

    /**
     * loads the assitant using Elastic
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getUiAssist(Request $req, Response $res, array $args): Response{
        $postBody = $req->getParsedBody();

        $activitiyHandler = new SpiceFTSActivityHandler();
        $results = $activitiyHandler->loadActivities('Assistant', null, $postBody['start'] ?: 0, $postBody['limit'] ?: 100, $postBody['searchterm']);

        return $res->withJson($results);
    }
}
