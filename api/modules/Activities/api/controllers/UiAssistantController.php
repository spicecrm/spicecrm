<?php
namespace  SpiceCRM\modules\Activities\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\includes\authentication\AuthenticationController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\RESTManager;


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
