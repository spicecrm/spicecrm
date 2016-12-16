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

class SpiceThemeSideBarManager{
  function display($ss){
    $user_config = $this->getConfig();
    global $sugar_config;
    if(!isset($sugar_config['twentyreasons']['SpiceSideBar_load_closed']) || $sugar_config['twentyreasons']['SpiceSideBar_load_closed']){
    	$load_closed = true;
    }else{
    	$load_closed = false;
    }
    $ss->assign("config_load_closed",$load_closed);

    $jsIncludes = array();

    foreach($user_config as $order => $item){
      if(file_exists('custom/modules/SpiceThemeController/SpiceSideBarWidgets/'.$item['classname'].'.php')){
        require_once('custom/modules/SpiceThemeController/SpiceSideBarWidgets/'.$item['classname'].'.php');
      }else{
        require_once('modules/SpiceThemeController/SpiceSideBarWidgets/'.$item['classname'].'.php');
      }
      $itemBean = new $item['classname']();
      $SideBarContent[] = array('directive' => $itemBean->get_directive(),'content' => $itemBean->display(false), 'label' => $item['title'], 'count' =>  $itemBean->getCount(),'name' => $item['name'], 'closed' => $item['closed'], 'load_closed' => $load_closed);
      if(!empty($item['jsAfterLoad'])){
        $jsAfterLoad[] = $item['jsAfterLoad'];
      }
      if(!empty($item['jsInclude'])){
        $jsIncludes[] = $item['jsInclude'];
      }
    }

    $ss->assign("SpiceSideBar",$SideBarContent);

    $jsIncludes_return='';
    if(count($jsIncludes)>0){
    	foreach($jsIncludes as $js){
    		if(is_array($js)){
    			foreach($js as $file){
    				$jsIncludes_return.='<script type="text/javascript" src="'.$file.'"></script>'."\n";
    			}
    		}elseif(is_string($js)){
    			$jsIncludes_return.='<script type="text/javascript" src="'.$js.'"></script>'."\n";
    		}
    	}
    }

    // set the status of the sidebar in the Smarty Template
    //die($this->getToggle("SideBar"));
    $ss->assign("sideBarClosed",$this->getToggle("SideBar"));

    $ss->assign("jsIncludes",$jsIncludes_return);
	  require_once('include/SpiceNotes/SpiceNotes.php');
    $jsAfterLoad_return='';
    if(count($jsAfterLoad)>0){
	    $jsAfterLoad_return.='<script type="text/javascript">$(function() { ';
	    $jsAfterLoad_return.= " toggled['SideBar'] = ".$this->getToggle("SideBar")."; spicetheme.collapsedStatic['SideBar'] = ".$this->getToggle("SideBar").";spicetheme.collapsed['SideBar'] = ".$this->getToggle("SideBar").";";
	    foreach($jsAfterLoad as $js){
	    	$jsAfterLoad_return.= $js."\n";
	    }
	    $jsAfterLoad_return.='});</script>';
	}

	$ss->assign("jsAfterLoad",$jsAfterLoad_return);

	$ss->assign('currentModule',$GLOBALS['currentModule']);
	$ss->assign('currentRecord',(!empty($_REQUEST['record']) ? $_REQUEST['record'] : ""));
	$ss->assign('currentAction',(!empty($_REQUEST['action']) ? $_REQUEST['action'] : ""));
	if(!isset($sugar_config['twentyreasons']['subpanelsTabbed']) || !$sugar_config['twentyreasons']['subpanelsTabbed']){
		$subpanelsTabbed = false;
	}else{
		$subpanelsTabbed = true;
	}
	$ss->assign('subpanelsTabbed',$subpanelsTabbed);

  }

  function getConfig(){
    global $current_user,$current_language;

    // load module Language
    $mod_strings = return_module_language($current_language, 'SpiceThemeController');

    $sidebarConfig = $current_user->getPreference('SpiceThemeSideBarConfig');
    if(empty($sidebarConfig)){
      $sidebarConfig = 'Shortcuts,LastViewed,Favorites,Reminders';
      // write initial config since the user seemingly did not have any set yet
      $current_user->setPreference('SpiceThemeSideBarConfig', $sidebarConfig);
      $current_user->setPreference('Shortcuts_collapsed', 'false');
      $current_user->setPreference('LastViewed_collapsed', 'false');
      $current_user->setPreference('Favorites_collapsed', 'false');
      $current_user->setPreference('Reminders_collapsed', 'false');
      $current_user->savePreferencesToDB();
    }
    $config_array = explode(',',$sidebarConfig);
    foreach($config_array as $key => $widget){
    	if(!empty($widget)){
    		$widget = ucfirst($widget);
	      if(file_exists('custom/modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidget'.$widget.'.php')){
	        require_once('custom/modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidget'.$widget.'.php');
	      }else{
	        require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidget'.$widget.'.php');
	      }
	      $widgetClass= 'SpiceSideBarWidget'.$widget;
	      $widgetBean = new $widgetClass();
	      $jsAfterLoad = $widgetBean->getJsAfterLoad();
	      $jsInclude = $widgetBean->getJsIncludes();
	      $title = $mod_strings['LBL_'.strtoupper($widget)];
	      $closed = $widgetBean->getToggle($widget);
	      $return[]=array('classname' => $widgetClass, 'title' => $title, 'name' => $widget, 'jsAfterLoad' => $jsAfterLoad, 'jsInclude' => $jsInclude, 'closed' => $closed);
	    }
    }

    return $return;
  }

  public function refresh($widget){
  	if(!empty($widget)){
  		$widget = ucfirst($widget);
  		if(file_exists('custom/modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidget'.$widget.'.php')){
  			require_once('custom/modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidget'.$widget.'.php');
  		}else{
  			require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidget'.$widget.'.php');
  		}
  		$widgetClass= 'SpiceSideBarWidget'.$widget;
  		$widgetBean = new $widgetClass();
  		if($widgetBean->getCount() > 0){
  			$jsAfterRefresh = $widgetBean->getJsAfterRefresh();
  			$jsInclude = $widgetBean->getJsIncludeAfterRefresh();
  			$return = $widgetBean->refresh();
  			return json_encode(array('content' => $return, 'jsexecute' => $jsAfterRefresh, 'jsinclude' => $jsInclude));
  		}
  	}
  }

  public function setToggle($menu,$coll) {
  	global $current_user;
  	if(!empty($current_user)) {
  		$collapsed = isset($coll) ? $coll : 'true';
  		$current_user->setPreference($menu.'_collapsed', $collapsed);
  		$current_user->savePreferencesToDB();
  		return $collapsed;
  	}
  }

  public static function getToggle($menu) {
  	global $current_user;
  	$collapsed = $current_user->getPreference($menu.'_collapsed');
  	if($collapsed === null){
  		$collapsed = false;
		$current_user->setPreference($menu.'_collapsed', $collapsed);
  		$current_user->savePreferencesToDB();
  	}
        if(!empty($collapsed))
  	return $collapsed;
        else
            return 'false'; 
  }

  public static function getWidgetUserConfig($param){
  	global $current_user;
  	$config = $current_user->getPreference($param);
  	return $config;
  }

  public function setWidgetUserConfig($param,$value){
  	global $current_user;
  	$current_user->setPreference($param, $value);
  	$current_user->savePreferencesToDB();
  	return $value;
  }

  public function saveSort($data) {
  	global $current_user;
  	if(!empty($current_user)) {
  		$sort_order = isset($data['order']) ? $data['order'] : 'Shortcuts,LastViewed,Favorites,Reminders,';
  		$user_config_old = $config = $current_user->getPreference('SpiceThemeSideBarConfig');
  		$user_config_old = explode(',', $user_config_old);
  		$sort_order = explode(',', $sort_order);
  		foreach($sort_order as $index => $widget){
  			$new_sort[] = $widget;
  			$current_user->setPreference($widget.'_collapsed', false);
  		}
  		foreach($user_config_old as $key => $element){
  			if(!in_array($element,$new_sort)){
  				$new_sort[] = $element;
  			}
  		}
  		$sort_order = implode(',', $new_sort);
  		$current_user->setPreference('SpiceThemeSideBarConfig', $sort_order);
  		$current_user->savePreferencesToDB();
  		return $sort_order;
  	}
  }

  public function showConfigSideBar(){
  	global $current_language;
  	if(file_exists('modules/SpiceThemeController/language/'.$current_language.'.lang.php')){
		require_once('modules/SpiceThemeController/language/'.$current_language.'.lang.php');
	}else{
		require_once('modules/SpiceThemeController/language/en_us.lang.php');
	}
  	if(file_exists('custom/modules/SpiceThemeController/language/'.$current_language.'.lang.php')){
  		require_once('custom/modules/SpiceThemeController/language/'.$current_language.'.lang.php');
  	}
  	if(file_exists('custom/modules/SpiceThemeController/SpiceSideBarWidgets/widget.registry.php')){
  		require_once('custom/modules/SpiceThemeController/SpiceSideBarWidgets/widget.registry.php');
  	}else{
  		require_once('modules/SpiceThemeController/SpiceSideBarWidgets/widget.registry.php');
  	}
  	$userconfig = $this->getWidgetUserConfig('SpiceThemeSideBarConfig');
  	$user_config = explode(',',$userconfig);
	$return = '<ul id="widget_list">';
  	foreach($widget_registry as $widget){
  		if(in_array($widget, $user_config)){
  			$checked = ' checked="checked"';
  		}else{
  			$checked = '';
  		}
  		$return .= '<li><input type="hidden" name="'.$widget.'" value="0"><input type="checkbox" name="'.$widget.'" value="1"'.$checked.'><span class="shortcutstitle" style="padding: 0px; color: #444444;">'.$mod_strings['LBL_'.strtoupper($widget)].'</span></input></li>';
  	}
	return $return;
  }

}
