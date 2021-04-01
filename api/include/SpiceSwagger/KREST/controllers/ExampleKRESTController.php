<?php
namespace SpiceCRM\includes\SpiceSwagger\KREST\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class ExampleKRESTController
{
    public function sizeExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('String size correct!');
    }
}
