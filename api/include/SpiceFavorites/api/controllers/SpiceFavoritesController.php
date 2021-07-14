<?php
namespace SpiceCRM\includes\SpiceFavorites\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceFavorites\SpiceFavorites;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\data\BeanFactory;

class SpiceFavoritesController {

    /**
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public static function getFavorites(Request $req, Response $res, array $args): Response {
        return $res->withJson(SpiceFavorites::getFavoritesRaw('', 0));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public static function addFavorite(Request $req, Response $res, array $args): Response {
        SpiceFavorites::setFavorite($args['modulename'], $args['beanid']);

        $moduleHandler = new ModuleHandler();

        $bean = BeanFactory::getBean($args['modulename'], $args['beanid']);
        return $res->withJson([
            'module'       => $args['modulename'],
            'id'           => $args['beanid'],
            'summary_text' => $bean->get_summary_text(),
            'data'         => $moduleHandler->mapBeanToArray($args['modulename'], $bean),
        ]);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
     public static function deleteFavorite(Request $req, Response $res, array $args): Response {
        SpiceFavorites::deleteFavorite($args['modulename'], $args['beanid']);
        return $res->withJson(['status' => 'success']);
    }
}
