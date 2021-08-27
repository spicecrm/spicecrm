<?php
namespace SpiceCRM\includes\SpiceSwagger\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class ExampleController
{
    public function sizeExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('String size correct!');
    }

    public function enumExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Enum correct!');
    }

    public function guidExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('GUID correct!');
    }

    public function regexExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Regex correct!');
    }

    public function inverseRegexExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Inverse regex correct!');
    }

    public function functionExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Function validation correct!');
    }

    public function numericExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Numeric validation correct!');
    }

    public function alphanumericExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Alphanumeric validation correct!');
    }

    public function emailExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Email validation correct!');
    }

    public function jsonExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('JSON validation correct!');
    }

    public function base64Example(Request $req, Response $res, array $args): Response {
        return $res->withJson('Base64 validation correct!');
    }

    public function datetimeExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Datetime validation correct!');
    }

    public function dateExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Date validation correct!');
    }

    public function moduleExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Module validation correct!');
    }

    public function arrayExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Array validation correct!');
    }

    public function complexExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Complex validation correct!');
    }

    public function arrayWithParametersExample(Request $req, Response $res, array $args): Response {
        return $res->withJson('Array with parameters validation correct');
    }

    public function anonymousArray(Request $req, Response $res, array $args): Response {
        return $res->withJson('Anonymous array validation correct');
    }

    public function customMiddleware(Request $req, Response $res, array $args): Response {
        return $res->withJson('Custom middleware validation correct');
    }
}
