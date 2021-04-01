<?php
namespace SpiceCRM\includes\SpiceFavorites\KREST\controllers;

use SpiceCRM\includes\SpiceFavorites\SpiceFavorites;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\data\BeanFactory;

class SpiceFavoritesKRESTController {

    public static function getFavorites($req, $res, $args) {
        return $res->withJson(SpiceFavorites::getFavoritesRaw('', 0));
    }

    public static function addFavorite($req, $res, $args){
        SpiceFavorites::set_favorite($args['module'], $args['id']);

        $moduleHandler = new ModuleHandler();

        $bean = BeanFactory::getBean($args['module'], $args['id']);
        return $res->withJson([
            'module'       => $args['module'],
            'id'           => $args['id'],
            'summary_text' => $bean->get_summary_text(),
            'data'         => $moduleHandler->mapBeanToArray($args['module'], $bean),
        ]);
    }

     public static function deleteFavorite($req, $res, $args) {
        SpiceFavorites::delete_favorite($args['module'], $args['id']);
        return $res->withJson(['status' => 'success']);
    }
}
