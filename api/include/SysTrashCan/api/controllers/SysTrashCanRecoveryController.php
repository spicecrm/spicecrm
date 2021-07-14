<?php
namespace SpiceCRM\includes\SysTrashCan\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SysTrashCan\SysTrashCan;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\RequestInterface;

class SysTrashCanRecoveryController{


    /**
     * get deleted records
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function getTrashedRecords(Request $req, Response $res, array $args): Response {
        return $res->withJson(SysTrashCan::getRecords());
    }

    /**
     * get the related deleted records
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function getRelatedTrashRecords(Request $req, Response $res, array $args): Response {
        return $res->withJson(SysTrashCan::getRelated($args['transactionid'], $args['recordid']));

    }

    /**
     * recover thrashed beans
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function recoverTrashedRecords(Request $req, Response $res, array $args): Response {
        $params = $req->getQueryParams();
        $recovery = SysTrashCan::recover($args['recordid'], $params['recoverrelated'] == 1 ? true : false);
        return $res->withJson([
            'status' => $recovery === true ? 'success' : 'error',
            'message' => $recovery === true ? '' : $recovery
        ]);
    }
}