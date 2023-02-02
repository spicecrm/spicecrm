<?php

namespace SpiceCRM\includes\SpiceCache\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceCacheController
{
    static function getKeys(Request $req, Response $res, $args): Response
    {
        return $res->withJson(SpiceCache::getKeys());
    }
    static function deleteKey(Request $req, Response $res, $args): Response
    {
        return $res->withJson(['success' => SpiceCache::deleteByKey($args['key'])]);
    }
    static function getKey(Request $req, Response $res, $args): Response
    {
        return $res->withJson(['content' => SpiceCache::instance()->__getByKey($args['key'])]);
    }
}