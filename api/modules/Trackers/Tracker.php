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
namespace SpiceCRM\modules\Trackers;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class Tracker extends SpiceBean
{
    /*
     * Return the most recently viewed items for this user.
     * The number of items to return is specified in spice_config['history_max_viewed']
     * @param uid user_id
     * @param mixed module_name Optional - return only items from this module, a string of the module or array of modules
     * @return array list
     */
    function get_recently_viewed($user_id, $modules = '', $count = 10)
    {
        $module_query = '';
        if (!empty($modules)) {
            $history_max_viewed = 10;
            $module_query = is_array($modules) ? ' AND module_name IN (\'' . implode("','", $modules) . '\')' : ' AND module_name = \'' . $modules . '\'';
        } else {
            $history_max_viewed = (!empty(SpiceConfig::getInstance()->config['history_max_viewed'])) ? SpiceConfig::getInstance()->config['history_max_viewed'] : 50;
        }
        $rows = $this->db->limitQuery("SELECT item_id, module_name FROM tracker WHERE user_id = '{$user_id}' AND visible = 1 $module_query ORDER BY date_modified DESC", 0, $history_max_viewed);
        while (($row = $this->db->fetchByAssoc($rows))) {
            $list[] = $row;

        }
        return $list;
    }

    /**
     * override save to make all older records invisible to the recent viewed
     *
     * @param $check_notify
     * @param $fts_index_bean
     * @return int|string
     */
    function save($check_notify = false, $fts_index_bean = true)
    {
        // make them all invisible
        $this->makeInvisibleForAll($this->item_id);

        // parent save
        return parent::save($check_notify, $fts_index_bean);
    }

    function makeInvisibleForAll($item_id)
    {
        $query = "UPDATE $this->_tablename SET visible = 0 WHERE item_id = '$item_id' AND visible = 1";
        $this->db->query($query, true);
    }

}
