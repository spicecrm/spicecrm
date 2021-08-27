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

namespace SpiceCRM\includes\SugarCache;

use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * Sugar Cache manager
 * @api
 */
class SugarCache
{
    const EXTERNAL_CACHE_NULL_VALUE = "SUGAR_CACHE_NULL_ZZ";

    protected static $_cacheInstance;

    /**
     * @var true if the cache has been reset during this request, so we no longer return values from
     *      cache until the next reset
     */
    public static $isCacheReset = false;

    private function __construct()
    {
    }

    /**
     * initializes the cache in question
     *
     * either pulls the cache class to be used from the config or by default instantiates a memory cache
     */
    protected static function _init()
    {
        $spice_config = SpiceConfig::getInstance()->config;
        if (isset($spice_config['cache']) &&  isset($spice_config['cache']['class'])) {
            $cacheClassFileName = $spice_config['cache']['class'];
            self::$_cacheInstance = new $cacheClassFileName();
        } else {
            self::$_cacheInstance = new SugarCacheMemory();
        }
    }

    /**
     * Returns the instance of the SugarCacheAbstract object, cooresponding to the external
     * cache being used.
     */
    public static function instance()
    {
        if (!is_subclass_of(self::$_cacheInstance, 'SugarCacheAbstract'))
            self::_init();

        return self::$_cacheInstance;
    }

    /**
     * Try to reset any opcode caches we know about
     *
     * @todo make it so developers can extend this somehow
     */
    public static function cleanOpcodes()
    {
    }

    /**
     * Try to reset file from caches
     */
    public static function cleanFile($file)
    {
        // APC
        if (function_exists('apc_delete_file') && ini_get('apc.stat') == 0) {
            apc_delete_file($file);
        }
    }

    public static function sugar_cache_put($key, $value, $ttl = null)
    {
        SugarCache::instance()->set($key, $value, $ttl);
    }

    public static function sugar_cache_retrieve($key)
    {
        return SugarCache::instance()->$key;
    }

    /**
     * moved into the class as static function
     * ToDo: check if this is still needed int his form
     *
     * @param $key
     */
    public static function sugar_cache_clear($key)
    {
        unset(self::instance()->$key);
    }
}
