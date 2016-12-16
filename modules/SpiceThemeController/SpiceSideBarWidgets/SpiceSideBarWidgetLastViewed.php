<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidget.php');

class SpiceSideBarWidgetLastViewed extends SpiceSideBarWidget {

    var $widget_name = "LastViewed";

    public function display($closed = true) {
        global $current_user;
        require_once('modules/Trackers/Tracker.php');
        $tracker = new Tracker();
        $history = $tracker->get_recently_viewed($current_user->id);
        foreach ($history as $key => $row) {
            $history[$key]['item_summary_short'] = to_html(getTrackerSubstring($row['item_summary'])); //bug 56373 - need to re-HTML-encode
            // $history[$key]['image'] = SugarThemeRegistry::current()->getImage($row['module_name'], 'border="0" align="absmiddle"', null, null, '.gif', $row['item_summary']);
        }
        $recentRecords = $history;

        $ss = new Sugar_Smarty();
        $ss->assign('closed', $closed);
        $ss->assign('items', $recentRecords);
        $ss->assign('NTC_NO_ITEMS_DISPLAY', $GLOBALS['app_strings']['NTC_NO_ITEMS_DISPLAY']);
        return $ss->fetch('modules/SpiceThemeController/SpiceSideBarWidgets/tpls/SpiceSideBarGenericItems.tpl');
    }

    public function refresh() {
        return $this->display(false);
    }

    public static function getCount() {
        global $current_user;
        require_once('modules/Trackers/Tracker.php');
        $tracker = new Tracker();
        $history = $tracker->get_recently_viewed($current_user->id);
        return count($history);
    }

    public static function getJsAfterLoad() {
        if (self::getCount() > 0) {
            require_once('modules/SpiceThemeController/SpiceThemeController.php');
            $user_toggle = SpiceThemeController::getToggle('LastViewed');
            //return " toggled['LastViewed'] = " . $user_toggle . ";\nspicetheme.getToggle('LastViewed');";
            return " toggled['LastViewed'] = " . (empty($user_toggle)?'false':$user_toggle) . ";" . ($user_toggle == 'true' ? "spicetheme.collapsedStatic['LastViewed']=true;": "");
        } else {
            return '';
        }
    }

    public function get_directive(){
        return "<last-viewed-widget></last-viewed-widget>";
    }
}
