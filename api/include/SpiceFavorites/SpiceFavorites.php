<?php

namespace SpiceCRM\includes\SpiceFavorites;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use Sugar_Smarty;

class SpiceFavorites
{
    public static function get_favorite($beanModule, $beanId)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

        if ($db->fetchByAssoc($db->query("SELECT beanid FROM spicefavorites WHERE bean='$beanModule' AND beanid='$beanId' AND user_id='$current_user->id'")))
            return true;
        else
            return false;
    }

    public static function set_favorite($beanModule, $beanId)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();
        if (!self::get_favorite($beanModule, $beanId))
            $db->query("INSERT INTO spicefavorites (bean, beanid, user_id, date_entered) VALUES('$beanModule', '$beanId', '$current_user->id', NOW())");
    }

    public static function delete_favorite($beanModule, $beanId)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM spicefavorites WHERE bean='$beanModule' AND beanid='$beanId' AND user_id='$current_user->id'");
    }

    /**
     * called from the loadtasks to load the favorites for the user intiially
     *
     * @return array
     */
    public static function loadFavorites(){
        return SpiceFavorites::getFavoritesRaw('', 50);
    }

    public static function getFavoritesRaw($beanModule = '', $lastN = 10)
    {
        global  $beanFiles, $beanList;
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
                self::delete_favorite($thisFav['module'], $thisFav['beanid']);
            }
        }
        return $favorites;
    }

    /**
     * @deprecated
     * @param int $lastN
     * @return mixed|string|void
     */
    public static function getFavorites($beanModule = '', $lastN = 10)
    {
        global  $beanFiles, $beanList;
$current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

        $favorites = self::getFavoritesRaw($beanModule);
        if (count($favorites) > 0) {
            $ss = new Sugar_Smarty();
            $ss->assign('items', $favorites);
            $ss->assign('title', 'Favorites');
            return $ss->fetch('modules/SpiceThemeController/tpls/SpiceGenericMenuItems.tpl');
        }

        return '';
    }
}
