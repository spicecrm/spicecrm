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

class SpiceThemeController {

    public function getPage($pageIndex) {
        global $current_user;
        $pages = $current_user->getPreference('pages', 'Home');
        // 2013-02-15 get language support
        $homeModString = return_module_language($GLOBALS['current_language'], 'Home');
        $pageArray = array('index' => $pageIndex, 'pageTitle' => (empty($pages[$pageIndex]['pageTitle']) ? $homeModString[$pages[$pageIndex]['pageTitleLabel']] : $pages[$pageIndex]['pageTitle']), 'numColumns' => $pages[$pageIndex]['numColumns']);

        return json_encode($pageArray);
    }

    public function setPage($pageId,$data) {
        global $current_user;
        if ($pageId == 'new') {
            $pages = $current_user->getPreference('pages', 'Home');
            $newPage = $pages[0];
            $newPage['pageTitle'] = $data['pageTitle'];
            $newPage['numColumns'] = $data['pageColumns'];
            // remove all dashlets we have
            for ($i = 0; $i < $newPage['numColumns']; $i++) {
                $newPage['columns'][$i]['width'] = round(100 / $newPage['numColumns'], 0) . '%';
                $newPage['columns'][$i]['dashlets'] = array();
            }

            $pages[] = $newPage;
            $current_user->setPreference('pages', $pages, 0, 'Home');

            return count($pages) - 1;
        } else {
            $pages = $current_user->getPreference('pages', 'Home');
            $pages[$pageId]['pageTitle'] = $data['pageTitle'];
            $pages[$pageId]['numColumns'] = $data['pageColumns'];

            // manage the Columns
            // if we add a column
            $currentColumns = count($pages[$pageId]['columns']);

            if ($pages[$pageId]['numColumns'] > count($pages[$pageId]['columns'])) {
                for ($i = 0; $i < $pages[$pageId]['numColumns']; $i++) {
                    $pages[$pageId]['columns'][$i]['width'] = round(100 / $pages[$pageId]['numColumns'], 0) . '%';
                    if (!isset($pages[$pageId]['columns'][$i]['dashlets']))
                        $pages[$pageId]['columns']['dashlets'][$i] = array();
                }
            }
            // if we remove columns
            elseif ($pages[$pageId]['numColumns'] < count($pages[$pageId]['columns'])) {
                // set the width to equal width
                for ($i = 0; $i < $pages[$pageId]['numColumns']; $i++) {
                    $pages[$pageId]['columns'][$i]['width'] = round(100 / $pages[$pageId]['numColumns'], 0) . '%';
                }

                // merge any dashlets
                for ($i = $pages[$pageId]['numColumns']; $i < count($pages[$pageId]['columns']); $i++) {
                    $pages[$pageId]['columns'][0]['dashlets'] = array_merge($pages[$pageId]['columns'][0]['dashlets'], $pages[$pageId]['columns'][$i]['dashlets']);
                    unset($pages[$pageId]['columns'][$i]);
                }
            }

            $current_user->setPreference('pages', $pages, 0, 'Home');

            return $pageId;
        }
    }

    public function addPage() {
        global $current_user;
        $pages = $current_user->getPreference('pages', 'Home');
        $newPage = $pages[0];
        $newPage['pageTitle'] = 'newPage ' . count($pages);
        // remove all dashlets we have
        foreach ($newPage['columns'] as $columnIndex => $columData)
            $newPage['columns'][$columnIndex]['dashlets'] = array();

        $pages[] = $newPage;
        $current_user->setPreference('pages', $pages, 0, 'Home');

        return count($pages) - 1;
    }

    public function changeGroup($currentModule, $newGroup) {
        global $current_user;
        $current_user->setPreference('theme_current_group', $newGroup);
        $current_user->incrementETag("mainMenuETag");
        require_once('include/MVC/View/SugarView.php');
        $focus = new SugarView();
        // set the current module and echo the menu entries
        $focus->module = $currentModule;

        return $focus->displayHeader(true);
    }

    public function deletePage($pageId,$data) {
        global $current_user;
        $pages = $current_user->getPreference('pages', 'Home');
        if ($pageId != 0) {
            $pages[$pageId]['pageTitle'] = $data['pageTitle'];
            $pages[$pageId]['numColumns'] = $data['pageColumns'];

            unset($pages[$pageId]);

            $current_user->setPreference('pages', array_values($pages), 0, 'Home');
            $_SESSION['activePage'] = 0;
        }

        return count($pages);
    }

    public function getMenu($activeModule, $currentModule,$focus = false) {
        global $db, $current_user, $current_language;
        if(!$focus){
            $focus = new SugarView();
        }
        // since we need to load the mod strings manual do this here. 
        $mod_strings = return_module_language($current_language, 'SpiceThemeController');
        
        $focus->module = $currentModule;
        $thisMenu = $focus->getMenu();
        $menuStr = '';

        if (count($thisMenu) > 0) {
            $menuStr .= '<ul class="itemMenuMenu"><span class="itemMenuHeader">' . $mod_strings['LBL_SHORTCUTS'] . '</span>';

            if ($currentModule == 'Home' && $activeModule == 'Home') {
                $menuStr .= '<li onclick="SUGAR.mySugar.showDashletsDialog();">' . $mod_strings['LBL_ADD_DASHLET'] . '</li>
				<li onclick="spicetheme.addPage()">' . $mod_strings['LBL_ADD_PAGE'] . '</li>';
                $menuStr .= '<li><a href="#" onclick="spicetheme.showConfigSideBar();return false;">' . $mod_strings['LBL_CONFIG_SIDEBAR'] . '</a></li>';
            }


            foreach ($thisMenu as $menuItem) {
                $menuStr .= '<li>';
                $menuStr .= '<a href="' . $menuItem[0] . '">' . $menuItem[1] . '</a>';
                $menuStr .= '</li>';
            }
            $menuStr .= '</ul>';
        } else {
            if ($currentModule == 'Home' && $activeModule == 'Home') {
                $menuStr .= '<ul class="itemMenuMenu"><span class="itemMenuHeader">' . $mod_strings['LBL_SHORTCUTS'] . '</span>
				<li onclick="SUGAR.mySugar.showDashletsDialog();">' . $mod_strings['LBL_ADD_DASHLET'] . '</li>
				<li onclick="spicetheme.addPage()">' . $mod_strings['LBL_ADD_PAGE'] . '</li>';
                $menuStr .= '<li><a href="#" onclick="spicetheme.showConfigSideBar();return false;">' . $mod_strings['LBL_CONFIG_SIDEBAR'] . '</a></li>';
                $menuStr .= '</ul>';
            }
            else
                $menuStr = '';
        }

        $lvStr = '';
        if ($currentModule != 'Home') {
            $lvStr = $this->getLastViewed($currentModule);
        } else {
            // instead of the last viewed we shopw the pages for the Home Module
            $lvStr = '<ul class="itemMenuLv"><span class="itemMenuHeader">' . $mod_strings['LBL_DESKTOPS'] . '</span>';
            global $current_user;
            $pages = $current_user->getPreference('pages', 'Home');
            foreach ($pages as $thisPageIndex => $thisPage) {
                // 2013-02-15 get language support
                $homeModString = return_module_language($GLOBALS['current_language'], 'Home');
                $lvStr .= '<li><a href="index.php?module=Home&action=index&activePage=' . $thisPageIndex . '">' . (empty($thisPage['pageTitle']) ? $homeModString[$thisPage['pageTitleLabel']] : $thisPage['pageTitle']) . '</a></li>';
            }
            $lvStr .= '</ul>';
        }
        require_once('include/SpiceFavorites/SpiceFavorites.php');
        $favStr = SpiceFavorites::getFavorites($currentModule);


        return json_encode(array('menu' => $menuStr, 'lastviewed' => $lvStr, 'favorites' => $favStr));
    }

    private function getLastViewed($module = '') {
        global $current_user, $current_language;
        
        // since we need to load the mod strings manual do this here. 
        $mod_strings = return_module_language($current_language, 'SpiceThemeController');
        
        // load the last viewe records from the Tracker
        require_once('modules/Trackers/Tracker.php');
        $tracker = new Tracker();
        $history = $tracker->get_recently_viewed($current_user->id, $module);
        if (count($history) > 0) {
            foreach ($history as $key => $row) {
                $history[$key]['item_summary_short'] = to_html(getTrackerSubstring($row['item_summary']));
                //$history[$key]['image'] = SugarThemeRegistry::current()->getImage($row['module_name'], 'border="0" align="absmiddle"', null, null, '.gif', $row['item_summary']);
            }
            $recentRecords = $history;

            $ss = new Sugar_Smarty();
            $ss->assign('items', $recentRecords);
            $ss->assign('title', $mod_strings['LBL_LASTVIEWED']);
            return $ss->fetch('modules/SpiceThemeController/tpls/SpiceGenericMenuItems.tpl');
        }
        return '';
    }

    public function removeReminder($beanName, $beanId) {
        require_once('include/SpiceReminders/SpiceReminders.php');
        $reminderclass = new SpiceReminders();
        $reminderclass->removeReminder($beanId);

        require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidgetReminders.php');
        $remindersWidget = new SpiceSideBarWidgetReminders();
        return $remindersWidget->refresh();
    }

    public function resetPages() {
        global $current_user;
        $pages = $current_user->getPreference('pages', 'Home');
        if (count($pages > 1)) {
            $newPages = array();
            $newPages[] = $pages[0];
            $current_user->setPreference('pages', $newPages, 0, 'Home');
            $_SESSION['activePage'] = 0;
        }
        return json_encode(true);
    }

    public function setReminder($beanName, $beanId, $data) {
        require_once('include/SpiceReminders/SpiceReminders.php');
        $reminderclass = new SpiceReminders();
        $newReminders = $reminderclass->setReminder($beanId, $beanName, $data['reminderDate']);

        require_once('modules/SpiceThemeController/SpiceSideBarWidgets/SpiceSideBarWidgetReminders.php');
        $remindersWidget = new SpiceSideBarWidgetReminders();
        return $remindersWidget->refresh();
    }

    public function toggleFavorite() {
        global $current_user, $db;
        if ($_REQUEST['favorite'] == '1') {
            //2013-02-15 MSSQL Support
            if ($GLOBALS['db']->dbType == 'mysql')
                $db->query("INSERT INTO spicefavorites SET beanid='" . $_REQUEST['beanid'] . "', user_id='$current_user->id', bean='" . $_REQUEST['bean'] . "', date_entered=curdate()");
            else
                $db->query("INSERT INTO spicefavorites (beanid, user_id, bean, date_entered) VALUES ('" . $_REQUEST['beanid'] . "', '$current_user->id', '" . $_REQUEST['bean'] . "', '" . gmdate('Y-m-d H:i:s') . "')");
        }
        else {
            $db->query("DELETE FROM spicefavorites WHERE beanid='" . $_REQUEST['beanid'] . "' AND user_id='$current_user->id'");
        }
    }

    public function getQuickNotes($beanName, $beanId) {
        require_once('include/SpiceNotes/SpiceNotes.php');
        return SpiceNotes::getQuickNotesForBean($beanName, $beanId);
    }
    public function saveQuickNote($beanName, $beanId, $data) {
        require_once('include/SpiceNotes/SpiceNotes.php');
        return SpiceNotes::saveQuickNote($beanName, $beanId, $data);
	}
	public function editQuickNote($beanName, $beanId, $noteId, $data){
        require_once('include/SpiceNotes/SpiceNotes.php');
		return SpiceNotes::editQuickNote($beanName, $beanId, $noteId, $data);
    }
    public function deleteQuickNote($noteId) {
        require_once('include/SpiceNotes/SpiceNotes.php');
        return SpiceNotes::deleteQuickNote($noteId);
    }

    public function setToggleFooterline($data) {
        global $current_user;
        if (!empty($current_user)) {
            $footerLineCollapsed = isset($data['footerLineCollapsed']) ? $data['footerLineCollapsed'] : 'true';
            $current_user->setPreference('footerLineCollapsed', $footerLineCollapsed);
            $current_user->savePreferencesToDB();
            return $footerLineCollapsed;
        }
    }

    public static function getToggleFooterline() {
        global $current_user;
        $footerLineCollapsed = $current_user->_userPreferenceFocus->getPreference('footerLineCollapsed');
        if (!isset($footerLineCollapsed)) {
            $footerLineCollapsed = false;
			$current_user->setPreference('footerLineCollapsed', $footerLineCollapsed);
			$current_user->savePreferencesToDB();
        }
        return $footerLineCollapsed;
    }

    //-------start SideBar actions

    public function setToggle($menu,$collapsed) {
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        return $SideBarManager->setToggle($menu,$collapsed);
    }

    public static function getToggle($menu) {
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        return $SideBarManager->getToggle($menu);
    }

    public static function getWidgetUserConfig($param) {
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        return $SideBarManager->getWidgetUserConfig($param);
    }

    public function setWidgetUserConfig($data) {
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        return $SideBarManager->setWidgetUserConfig($data['param'], $data['value']);
    }

    public function saveSort($data) {
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        return $SideBarManager->saveSort($data);
    }

    public function refresh($currentModule, $widget) {
        if (!empty($currentModule))
            $GLOBALS['currentModule'] = $currentModule;
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        return $SideBarManager->refresh($widget);
    }

    public function showConfigSideBar() {
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        return $SideBarManager->showConfigSideBar();
    }

}