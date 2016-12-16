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

require_once('data/SugarBean.php');
require_once('include/utils.php');

// ProductTemplate is used to store customer information.
class SpiceThemePage extends SugarBean {

    var $new_schema = true;
    var $module_dir = 'SpiceThemePages';
    var $object_name = 'SpiceThemePage';
    var $table_name = 'spicethemepages';
    var $importable = false;

    function SpiceThemePage() {
        parent::SugarBean();
    }

    function get_summary_text() {
        return $this->name;
    }

    function bean_implements($interface) {
        switch ($interface) {
            case 'ACL':return true;
        }
        return false;
    }

    public static function mergePages(&$pages, &$dashlets = null, $activePage = 0) {
        global $current_user;
        $dashletsChanged = false;

        $loadedUsers = array();
        // $themePage = BeanFactory::getBean('SpiceThemePages');
        $refPages = $current_user->get_linked_beans('spicethemepages_link', 'SpiceThemePage');

        $prePages = array();
        $postPages = array();

        // sort pages based on pre flag and priority into a temp array
        foreach ($refPages as $thisPage) {
            if ($thisPage->page_priority == '')
                $thisPage->page_priority = 999;
            if ($thisPage->page_position_first == 1)
                $prePages[$thisPage->page_priority][] = $thisPage;
            else
                $postPages[$thisPage->page_priority][] = $thisPage;
        }

        // sort the array accoridng to key == priority
        ksort($prePages);
        ksort($postPages);

        // process the prepages
        $prePageArray = array();
        foreach ($prePages as $thisPagesPriority => $thisPages) {
            foreach ($thisPages as $thisPage) {
                if (empty($loadedUsers[$thisPage->puser_id])) {
                    $loadedUsers[$thisPage->puser_id] = BeanFactory::getBean('Users');
                    $loadedUsers[$thisPage->puser_id]->retrieve($thisPage->puser_id);
                    $loadedUsers[$thisPage->puser_id]->pages = $loadedUsers[$thisPage->puser_id]->getPreference('pages', 'Home');
                    $loadedUsers[$thisPage->puser_id]->dashlets = $loadedUsers[$thisPage->puser_id]->getPreference('dashlets', 'Home');
                };
                
                if (isset($loadedUsers[$thisPage->puser_id]->pages[$thisPage->page_index])) {
                    $thisRefPage = $loadedUsers[$thisPage->puser_id]->pages[$thisPage->page_index];
                    $thisRefPage['isReference'] = true;

                    if ($dashlets != null) {
                        foreach ($thisRefPage['columns'] as $thisColumnIndex => $thisColumn) {
                            foreach ($thisColumn['dashlets'] as $thisDashletIndex => $thisDashlet) {
                                if (empty($dashlets[$thisDashlet]) && !empty($loadedUsers[$thisPage->puser_id]->dashlets[$thisDashlet])) {
                                    $dashlets[$thisDashlet] = $loadedUsers[$thisPage->puser_id]->dashlets[$thisDashlet];
                                    $dashletsChanged = true;
                                } elseif (empty($loadedUsers[$thisPage->puser_id]->dashlets[$thisDashlet])) {
                                    // the dashlet has been deleted from the page ... also delete it from the users record
                                    unset($thisRefPage['columns'][$thisColumnIndex]['dashlets'][$thisDashletIndex]);
                                    unset($dashlets[$thisDashlet]);
                                    $dashletsChanged = true;
                                }
                            }
                        }
                    }
                }
                $prePageArray[] = $thisRefPage;
            }
        }
        $pages = array_merge($prePageArray, $pages);

        // process the post pages
        foreach ($postPages as $thisPagesPriority => $thisPages) {
            foreach ($thisPages as $thisPage) {
                if (empty($loadedUsers[$thisPage->puser_id])) {
                    $loadedUsers[$thisPage->puser_id] = BeanFactory::getBean('Users');
                    $loadedUsers[$thisPage->puser_id]->retrieve($thisPage->puser_id);
                    $loadedUsers[$thisPage->puser_id]->pages = $loadedUsers[$thisPage->puser_id]->getPreference('pages', 'Home');
                    $loadedUsers[$thisPage->puser_id]->dashlets = $loadedUsers[$thisPage->puser_id]->getPreference('dashlets', 'Home');
                };

                if (isset($loadedUsers[$thisPage->puser_id]->pages[$thisPage->page_index])) {
                    $thisRefPage = $loadedUsers[$thisPage->puser_id]->pages[$thisPage->page_index];
                    $thisRefPage['isReference'] = true;

                    if ($dashlets != null) {
                        foreach ($thisRefPage['columns'] as $thisColumnIndex => $thisColumn) {
                            foreach ($thisColumn['dashlets'] as $thisDashletIndex => $thisDashlet) {
                                if (empty($dashlets[$thisDashlet]) && !empty($loadedUsers[$thisPage->puser_id]->dashlets[$thisDashlet])) {
                                    $dashlets[$thisDashlet] = $loadedUsers[$thisPage->puser_id]->dashlets[$thisDashlet];
                                    $dashletsChanged = true;
                                } elseif (empty($loadedUsers[$thisPage->puser_id]->dashlets[$thisDashlet])) {
                                    // the dashlet has been deleted from the page ... also delete it from the users record
                                    unset($thisRefPage['columns'][$thisColumnIndex]['dashlets'][$thisDashletIndex]);
                                    unset($dashlets[$thisDashlet]);
                                    $dashletsChanged = true;
                                }
                            }
                        }
                    }
                }

                $pages[] = $thisRefPage;
            }
        }

        // write back Dashlet Information
        if ($dashlets != null && $dashletsChanged)
            $current_user->setPreference('dashlets', $dashlets, 0, 'Home');
    }

}

?>
