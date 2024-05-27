<?php
namespace SpiceCRM\modules\Accounts\api\controllers;

use SimpleXMLElement;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\Accounts\AccountVIESCheck;

class AccountsVIESController{

    /**
     * get the response of an url
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */
    public function getVatResponse(Request $req, Response $res, array $args): Response {
        $response = (new AccountVIESCheck())->checkUID($args['vatid']);

        return $res->withJson(['status' => $response ? 'success' : 'error', 'data' => $response ?: []]);
    }

}