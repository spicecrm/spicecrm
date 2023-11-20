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

namespace SpiceCRM\includes\SpiceCache;

use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * Sugar Cache manager
 * @api
 */
class SpiceCache
{
    const EXTERNAL_CACHE_NULL_VALUE = "SPICE_CACHE_NULL";

    /**
     * the default cache instance
     *
     * @var
     */
    protected static $_cacheInstance;

    /**
     * the temporary memory cache instance
     *
     * @var
     */
    protected static $_memoryCacheInstance;

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
            $cacheClassFileName = "SpiceCRM\includes\SpiceCache\\{$spice_config['cache']['class']}" ;
            self::$_cacheInstance = new $cacheClassFileName();
        } else {
            self::$_cacheInstance = new SpiceCacheFile();
        }

    }

    /**
     * Returns the instance of the SpiceCacheAbstract object, cooresponding to the external
     * cache being used.
     */
    public static function instance()
    {
        if (!is_subclass_of(self::$_cacheInstance, 'SpiceCRM\includes\SpiceCache\SpiceCacheAbstract')) {
            self::_init();
        }

        return self::$_cacheInstance;
    }

    /**
     * Returns the instance of the SpiceCacheAbstract object, cooresponding to the external
     * cache being used.
     */
    public static function memoryInstance()
    {
        if (!self::$_memoryCacheInstance) {
            self::$_memoryCacheInstance = new SpiceCacheMemory();
        }

        return self::$_memoryCacheInstance;
    }

    /**
     * set values to the cache
     *
     * @param $key
     * @param $value
     * @param $ttl
     * @return void
     */
    public static function set($key, $value, $ttl = null)
    {
        // check if we shoudl write the cache at all
        if(SpiceConfig::getInstance()->get('cache.external_cache_disabled')) return;

        // returen the item
        SpiceCache::instance()->set($key, $value, $ttl);
    }

    /**
     * get values from the cache
     *
     * @param $key
     * @return false
     */
    public static function get($key)
    {
        return SpiceConfig::getInstance()->get('cache.external_cache_disabled') ? false : SpiceCache::instance()->$key;
    }

    /**
     * returns all currently held keys in the cache
     *
     * @return mixed
     */
    public static function getKeys(){
        return SpiceCache::instance()->__getKeys();
    }

    /**
     * deletes one key by the given name
     *
     * @return mixed
     */
    public static function getByKey($key){
        return SpiceCache::instance()->__deleteKeyDirect($key);
    }


    /**
     * deletes one key by the given name
     *
     * @return mixed
     */
    public static function deleteByKey($key){
        return SpiceCache::instance()->__deleteKeyDirect($key);
    }

    /**
     * separate call to create a memory instance and cache some values there in a memory cahce instance
     *
     * @param $key
     * @param $value
     * @param $ttl
     * @return void
     */
    public static function setMemory($key, $value, $ttl = null)
    {
        SpiceCache::memoryInstance()->set($key, $value, $ttl);
    }

    /**
     * get function for the memory instance
     *
     * @param $key
     * @return mixed|null
     */
    public static function getMemory($key)
    {
        return SpiceCache::memoryInstance()->$key;
    }

    /**
     * moved into the class as static function
     * ToDo: check if this is still needed int his form
     *
     * @param $key
     */
    public static function clear($key)
    {
        unset(self::instance()->$key);
    }
}
