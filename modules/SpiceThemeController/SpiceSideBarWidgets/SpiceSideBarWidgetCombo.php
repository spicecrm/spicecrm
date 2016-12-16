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
class SpiceSideBarWidgetCombo extends SpiceSideBarWidget {
	var $widget_name = "Combo";
	public function display($closed = true, $children_closed = false){
		global $current_language;
		if(file_exists('modules/SpiceThemeController/language/'.$current_language.'.lang.php')){
			include('modules/SpiceThemeController/language/'.$current_language.'.lang.php');
		}else{
			include('modules/SpiceThemeController/language/en_us.lang.php');
		}
		if(file_exists('custom/modules/SpiceThemeController/language/'.$current_language.'.lang.php')){
			include('custom/modules/SpiceThemeController/language/'.$current_language.'.lang.php');
		}

		$return = '<div id="combo_buttons"><span id="combo_prev" class="arrow_left" style="float: left; margin-top: 6px;"></span><span id="combo_item_title" class="shortcutstitle" style="color: #444444;"></span><span id="combo_next" class="arrow_right" style="float: right; margin-top: 6px; margin-right: 5px;"></span></div>';
		$return .= '<ul id="combo_container">';

		require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidgetLastViewed.php');
		require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidgetFavorites.php');
		require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidgetReminders.php');
		$lastviewed = new SpiceSideBarWidgetLastViewed();
		$favorites = new SpiceSideBarWidgetFavorites();
		$reminders = new SpiceSideBarWidgetReminders();
		$return .= '<div class="combo_item" id="combo_LastViewed" label="'.$mod_strings['LBL_LASTVIEWED'].'">';
		$return .= $lastviewed->display($children_closed);
		$return .= '</div><div class="combo_item" id="combo_Favorites" label="'.$mod_strings['LBL_FAVORITES'].'">';
		$return .= $favorites->display($children_closed);
		$return .= '</div><div class="combo_item" id="combo_Reminders" label="'.$mod_strings['LBL_REMINDERS'].'">';
		$return .= $reminders->display($children_closed);
		$return .= '</div>';
		$return.='</ul>';

		return $return;
	}

	public function refresh(){
		return $this->display(false,false);
	}

	public static function getCount(){
		return 3;
	}

	public static function getJsAfterLoad(){
		require_once('modules/SpiceThemeController/SpiceThemeController.php');
		$user_toggle = SpiceThemeController::getToggle('Combo');
		$combo_active_element = SpiceThemeController::getWidgetUserConfig('combo_active_element');
		if(empty($combo_active_element)){
			$combo_active_element = 'combo_LastViewed';
			global $current_user;
			$current_user->setPreference('combo_active_element', $combo_active_element);
			$current_user->savePreferencesToDB();
		}
		return " toggled['Combo'] = ".(empty($user_toggle)?'false':$user_toggle).";\nspicetheme.getToggle('Combo');\nvar combo_active_element = '".$combo_active_element."'; SpiceSideBarWidgetCombo.initialize(combo_active_element);";
	}

	public static function getJsAfterRefresh(){
		require_once('modules/SpiceThemeController/SpiceThemeController.php');
		$user_toggle = SpiceThemeController::getToggle('Combo');
		$combo_active_element = SpiceThemeController::getWidgetUserConfig('combo_active_element');
		if(empty($combo_active_element)) $combo_active_element = 'combo_LastViewed';
		return " toggled['Combo'] = ".$user_toggle.";". ($user_toggle == 'true' ? "spicetheme.collapsedStatic['Combo']=true;": "")."\nvar combo_active_element = '".$combo_active_element."'; SpiceSideBarWidgetCombo.initialize(combo_active_element);";
	}

	public static function getJsIncludeAfterRefresh(){
		return 'modules/SpiceThemeController/SpiceSideBarWidgets/js/SpiceSideBarWidgetCombo.js';
	}

	public static function getJsIncludes(){
		return 'modules/SpiceThemeController/SpiceSideBarWidgets/js/SpiceSideBarWidgetCombo.js';
	}
}
