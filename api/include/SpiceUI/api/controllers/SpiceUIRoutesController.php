<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceUIRoutesController
{
    static function getRoutesDirect()
    {
        // check if cached
        $cached = SpiceCache::get('spiceRoutes');
        if($cached) return $cached;

        $db = DBManagerFactory::getInstance();
        $routeArray = [];
        $routes = $db->query("SELECT * FROM sysuiroutes");
        while ($route = $db->fetchByAssoc($routes)) {

            $routeArray[] = $route;

        }
        $routes = $db->query("SELECT * FROM sysuicustomroutes");
        while ($route = $db->fetchByAssoc($routes)) {

            $routeArray[] = $route;

        }

        // set the Cache
        SpiceCache::set('spiceRoutes', $routeArray);

        return $routeArray;
    }

    static function getRoutes($req, $res, $args)
    {
        $db = DBManagerFactory::getInstance();
        $routeArray = [];
        $routes = $db->query("SELECT * FROM sysuiroutes");
        while ($route = $db->fetchByAssoc($routes)) {

            $routeArray[] = $route;

        }
        $routes = $db->query("SELECT * FROM sysuicustomroutes");
        while ($route = $db->fetchByAssoc($routes)) {

            $routeArray[] = $route;

        }
        return $res->withJson($routeArray);
    }
}