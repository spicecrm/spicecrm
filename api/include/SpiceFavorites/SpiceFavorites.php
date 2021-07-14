<?php

namespace SpiceCRM\includes\SpiceFavorites;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use Sugar_Smarty;

class SpiceFavorites
{
    /**
     * @param $beanModule
     * @param $beanId
     * @return bool
     * @throws \Exception
     */
    public static function getFavorite($beanModule, $beanId)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if ($db->fetchByAssoc($db->query("SELECT beanid FROM spicefavorites WHERE bean='$beanModule' AND beanid='$beanId' AND user_id='$current_user->id'")))
            return true;
        else
            return false;
    }

    /**
     * @param $beanModule
     * @param $beanId
     * @throws \Exception
     */
    public static function setFavorite($beanModule, $beanId)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        if (!self::getFavorite($beanModule, $beanId))
            $db->query("INSERT INTO spicefavorites (bean, beanid, user_id, date_entered) VALUES('$beanModule', '$beanId', '$current_user->id', NOW())");
    }

    /**
     * @param $beanModule
     * @param $beanId
     * @throws \Exception
     */
    public static function deleteFavorite($beanModule, $beanId)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM spicefavorites WHERE bean='$beanModule' AND beanid='$beanId' AND user_id='$current_user->id'");
    }

    /**
     * called from the loadtasks to load the favorites for the user initially
     *
     * @return array
     * @throws \Exception
     */
    public static function loadFavorites(): array
    {
        return SpiceFavorites::getFavoritesRaw('', 50);
    }

    /**
     * get all favorites for current user
     *
     * @param string $beanModule
     * @param int $lastN
     * @return array
     * @throws \Exception
     */
    public static function getFavoritesRaw($beanModule = '', $lastN = 10): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $moduleHandler = new ModuleHandler();

        $favorites = [];

        $moduleWhere = '';
        if ($beanModule != '')
            $moduleWhere = " AND bean='$beanModule' ";

        if ($lastN !== 0) {
            $favoritesRes = $db->limitQuery("SELECT * FROM spicefavorites WHERE user_id='$current_user->id' $moduleWhere ORDER BY date_entered DESC", 0, $lastN);
        } else {
            $favoritesRes = $db->query("SELECT * FROM spicefavorites WHERE user_id='$current_user->id' $moduleWhere ORDER BY date_entered DESC");
        }

        while ($thisFav = $db->fetchByAssoc($favoritesRes)) {
            if ($seed = BeanFactory::getBean($thisFav['bean'], $thisFav['beanid'])) {
                $favorites[] = [
                    'item_id' => $seed->id,
                    'module_name' => $seed->_module,
                    'item_summary' => $seed->get_summary_text(),
                    'item_summary_short' => substr($seed->get_summary_text(), 0, 15),
                    'data' => $moduleHandler->mapBeanToArray($thisFav['bean'], $seed)
                ];
            } else {
                self::deleteFavorite($thisFav['module'], $thisFav['beanid']);
            }
        }
        return $favorites;
    }

    /**
     * @deprecated
     * @param int $lastN
     * @return mixed|string|void
     */
//    public static function getFavorites($beanModule = '', $lastN = 10)
//    {
//        $favorites = self::getFavoritesRaw($beanModule);
//        if (count($favorites) > 0) {
//            $ss = new Sugar_Smarty();
//            $ss->assign('items', $favorites);
//            $ss->assign('title', 'Favorites');
//            return $ss->fetch('modules/SpiceThemeController/tpls/SpiceGenericMenuItems.tpl');
//        }
//
//        return '';
//    }
}
