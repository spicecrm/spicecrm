<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class SpiceUIRoutesController
{

    /**
     * gets all public routes
     * @return array
     * @throws DatabaseException
     */
    public static function getPublicRoutes(): array
    {
        $components = SpiceUIRepositoryController::getComponents();
        $modules = SpiceUIRepositoryController::getModuleRepository();

        $publicRoutes = [
            'routes' => [], 'componentDefs' => [], 'moduleDefs' => []
        ];

        foreach (self::getRoutesDirect() as $route) {
            if ($route['loginrequired'] == 1) continue;
            $publicRoutes['routes'][] = $route;
            $publicRoutes['componentDefs'][$route['component']] = $components[$route['component']];
            $publicRoutes['moduleDefs'][$components[$route['component']]['module']] = $modules[$components[$route['component']]['module']];
        }

        return $publicRoutes;
    }

    static function getRoutesDirect()
    {
        // check if cached
        $cached = SpiceCache::get('spiceRoutes');
        if($cached) return $cached;

        $db = DBManagerFactory::getInstance();
        $routeArray = [];
        $routes = $db->query("SELECT * FROM sysuiroutes");
        while ($route = $db->fetchByAssoc($routes)) {

            $routeArray[$route['path']] = $route;

        }
        $routes = $db->query("SELECT * FROM sysuicustomroutes");
        while ($route = $db->fetchByAssoc($routes)) {

            $routeArray[$route['path']] = $route;

        }
        $routeArray = array_values($routeArray);
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