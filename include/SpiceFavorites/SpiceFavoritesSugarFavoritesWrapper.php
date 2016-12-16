<?php

require_once 'modules/SugarFavorites/SugarFavorites.php';

class SpiceFavoritesSugarFavoritesWrapper {

    public static function get_favorite($beanModule, $beanId) {
        global $current_user;

        return SugarFavorites::isUserFavorite($beanModule, $beanId, $current_user->id);
    }

    public static function set_favorite($beanModule, $beanId) {
        global $current_user;
        
        $record = SugarFavorites::generateGUID($beanModule, $beanId);
        $thisBean = new SugarFavorites();

        if(!$thisBean->retrieve($record, true, false)){
            $thisBean->new_with_id = true;
        }
        $thisBean->id = $record;
        $thisBean->module = $beanModule;
        $thisBean->record_id = $beanId;
        $thisBean->created_by = $current_user->id;
        $thisBean->assigned_user_id = $current_user->id;
        $thisBean->deleted = 0;

        if(!empty($thisBean->fetched_row['deleted']) && empty($thisBean->deleted)) {
            $thisBean->mark_undeleted($thisBean->id);
        }
        $thisBean->save();        
    }

    public static function delete_favorite($beanModule, $beanId) {
        global $current_user;        
        $date_modified = $GLOBALS['timedate']->nowDb();
        SugarFavorites::markRecordDeletedInFavorites($beanId, $date_modified, $current_user->id);
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
        $ret_array['from'] .= " sugarfavorites sfav ON sfav.module ='{$thisBean->module_dir}' AND sfav.record_id={$thisBean->table_name}.id AND sfav.created_by='{$GLOBALS['current_user']->id}' AND sfav.deleted=0 ";
        return $ret_array;
    }
}