<?php

class SpiceFavorites {

    public static function get_favorite($beanModule, $beanId) {
        global $db, $current_user;

        if ($db->fetchByAssoc($db->query("SELECT beanid FROM spicefavorites WHERE bean='$beanModule' AND beanid='$beanId' AND user_id='$current_user->id'")))
            return true;
        else
            return false;
    }

    public static function set_favorite($beanModule, $beanId) {
        global $db, $current_user;
        if (!self::get_favorite($beanModule, $beanId))
            $db->query("INSERT INTO spicefavorites (bean, beanid, user_id, date_entered) VALUES('$beanModule', '$beanId', '$current_user->id', CURRENT_DATE)");
    }

    public static function delete_favorite($beanModule, $beanId) {
        global $db, $current_user;
        $db->query("DELETE FROM spicefavorites WHERE bean='$beanModule' AND beanid='$beanId' AND user_id='$current_user->id'");
    }

    /**
     * @deprecated
     * @param $beanId
     * @return int
     */
    public static function isBeanFavorite($beanId) {
        global $db, $current_user;
        $favResult = $db->query("SELECT * FROM spicefavorites WHERE beanid='$beanId' AND user_id='$current_user->id'");

        if ($db->fetchByAssoc($favResult))
            return 1;
        else
            return 0;
    }


    public static function getFavoritesRaw($beanModule = '', $lastN = 10) {
        global $current_user, $db, $beanFiles, $beanList;
        $favorites = array();

        $moduleWhere = '';
        if($beanModule != '')
            $moduleWhere = " AND bean='$beanModule' ";

        if ($GLOBALS['db']->dbType == 'mssql')
            $favoritesRes = $db->query("SELECT TOP $lastN * FROM spicefavorites WHERE user_id='$current_user->id' $moduleWhere ORDER BY 'date_entered' DESC");
        else
            $favoritesRes = $db->limitQuery("SELECT * FROM spicefavorites WHERE user_id='$current_user->id' $moduleWhere ORDER BY 'date_entered' DESC", 0, $lastN);

        $thisBean = null;

        while ($thisFav = $db->fetchByAssoc($favoritesRes)) {
            if (!($thisBean instanceof $beanList[$thisFav['bean']])) {
                $thisBean = BeanFactory::getBean($thisFav['bean']);
            }
            $thisBean->retrieve($thisFav['beanid']);

            $favorites[] = array(
                'item_id' => $thisFav['beanid'],
                'module_name' => $thisFav['bean'],
                'item_summary' => $thisBean->name,
                'item_summary_short' => substr($thisBean->name, 0, 15)
            );
            $thisBean = null;
            unset($thisBean);
        }

        return $favorites;
    }

    /**
     * @deprecated
     * @param int $lastN
     * @return mixed|string|void
     */
    public static function getFavorites($beanModule = '',$lastN = 10) {
        global $current_user, $db, $beanFiles, $beanList;

        $favorites = self::getFavoritesRaw($beanModule);
        if(count($favorites) > 0)
        {
            $ss = new Sugar_Smarty();
            $ss->assign('items', $favorites);
            $ss->assign('title', 'Favorites');
            return $ss->fetch('modules/SpiceThemeController/tpls/SpiceGenericMenuItems.tpl');
        }

        return '';
    }

    public static function getFavoritesCountForSideBar($lastN = 10) {
       $favorites = self::getFavoritesRaw();
       return count($favorites);
    }

    public static function getBeanListQueryParts($thisBean, $favoritesOnly) {
        
        $ret_array = [
            'from' => '',
            'where' => ''
        ];
        if ($favoritesOnly) {
            $ret_array['from'] .= " INNER JOIN ";
        } else {
            $ret_array['from'] .= " LEFT JOIN ";
        }
        $ret_array['from'] .= " spicefavorites ON spicefavorites.beanid = " . $thisBean->table_name . ".id ";
        $ret_array['where'] .= " AND (spicefavorites.user_id = '" . $GLOBALS['current_user']->id . "' OR spicefavorites.user_id IS NULL)";
        return $ret_array;
    }
}