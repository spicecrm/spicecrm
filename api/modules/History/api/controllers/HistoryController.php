<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\History\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class HistoryController
{
    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function loadFTSHistory(Request $req, Response $res, array $args): Response {
        $postBody = $req->getParsedBody();

        $activitiyHandler = new SpiceFTSActivityHandler();
        $results = $activitiyHandler->loadActivities('History', $args['parentid'], $postBody['start'], $postBody['limit'], $postBody['searchterm'], $postBody['own'], json_decode($postBody['objects'], true));

        return $res->withJson($results);
    }

}
