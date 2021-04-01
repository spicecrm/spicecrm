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

namespace SpiceCRM\includes\utils;

use ArrayObject;

/**
 * Wrapper around PHP's ArrayObject class that provides dot-notation recursive searching
 * for multi-dimensional arrays
 */
class SugarArray extends ArrayObject
{
    /**
     * Return the value matching $key if exists, otherwise $default value
     *
     * This method uses dot notation to look through multi-dimensional arrays
     *
     * @param string $key key to look up
     * @param mixed $default value to return if $key does not exist
     * @return mixed
     */
    public function get($key, $default = null)
    {
        return $this->_getFromSource($key, $default);
    }

    /**
     * Provided as a convinience method for fetching a value within an existing
     * array without instantiating a SugarArray
     *
     * NOTE: This should only used where refactoring an array into a SugarArray
     *       is unfeasible.  This operation is more expensive than a direct
     *       SugarArray as each time it creates and throws away a new instance
     *
     * @param array $haystack haystack
     * @param string $needle needle
     * @param mixed $default default value to return
     * @return mixed
     */
    static public function staticGet($haystack, $needle, $default = null)
    {
        if (empty($haystack)) {
            return $default;
        }
        $array = new self($haystack);
        return $array->get($needle, $default);
    }

    private function _getFromSource($key, $default)
    {
        if (strpos($key, '.') === false) {
            return isset($this[$key]) ? $this[$key] : $default;
        }

        $exploded = explode('.', $key);
        $current_key = array_shift($exploded);
        return $this->_getRecursive($this->_getFromSource($current_key, $default), $exploded, $default);
    }

    private function _getRecursive($raw_config, $children, $default)
    {
        if ($raw_config === $default) {
            return $default;
        } elseif (count($children) == 0) {
            return $raw_config;
        } else {
            $next_key = array_shift($children);
            return isset($raw_config[$next_key]) ?
                $this->_getRecursive($raw_config[$next_key], $children, $default) :
                $default;
        }
    }
}
