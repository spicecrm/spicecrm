<?php
namespace SpiceCRM\includes\VoiceOverIP\api\controllers;

use SpiceCRM\includes\VoiceOverIP\Handlers\AvayaHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class AvayaController
{
    public function handleEvent(Request $req, Response $res, array $args): Response {
        $body   = $req->getParsedBody();

        return $res->withJson();
    }
}