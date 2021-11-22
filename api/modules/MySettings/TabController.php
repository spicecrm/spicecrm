<?php

/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class TabController
{
    /**
     * @var bool flag of validation of the cache
     */
    static protected $isCacheValid = false;

    private function get_system_tabs() {
        global $moduleList;

        static $system_tabs_result = null;

        // if the value is not already cached, then retrieve it.
        if (empty($system_tabs_result) || !self::$isCacheValid) {

            $administration = BeanFactory::getBean('Administration');
            $administration->retrieveSettings('MySettings');
            if (isset($administration->settings) && isset($administration->settings['MySettings_tab'])) {
                $tabs = $administration->settings['MySettings_tab'];
                $trimmed_tabs = trim($tabs);
                //make sure serialized string is not empty
                if (!empty($trimmed_tabs)) {
                    $tabs = base64_decode($tabs);
                    $tabs = unserialize($tabs);
                    //Ensure modules saved in the prefences exist.
                    foreach ($tabs as $id => $tab) {
                        if (is_array($moduleList) && !in_array($tab, $moduleList))
                            unset($tabs[$id]);
                    }
                    SpiceACL::getInstance()->filterModuleList($tabs);
                    $tabs = $this->get_key_array($tabs);
                    $system_tabs_result = $tabs;
                } else {
                    $system_tabs_result = $this->get_key_array($moduleList);
                }
            } else {
                $system_tabs_result = $this->get_key_array($moduleList);
            }
            self::$isCacheValid = true;
        }

        return $system_tabs_result;
    }

    public function get_tabs_system() {
        global $moduleList;
        $tabs = $this->get_system_tabs();
        $unsetTabs = $this->get_key_array($moduleList);
        foreach ($tabs as $tab) {
            unset($unsetTabs[$tab]);
        }

        $should_hide_iframes = !file_exists('modules/iFrames/iFrame.php');
        if ($should_hide_iframes) {
            if (isset($unsetTabs['iFrames'])) {
                unset($unsetTabs['iFrames']);
            } else if (isset($tabs['iFrames'])) {
                unset($tabs['iFrames']);
            }
        }

        return [$tabs, $unsetTabs];
    }

    private function get_key_array($arr) {
        $new = [];
        if (!empty($arr)) {
            foreach ($arr as $val) {
                $new[$val] = $val;
            }
        }
        return $new;
    }
}
