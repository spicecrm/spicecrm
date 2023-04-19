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
use SpiceCRM\includes\TimeDate;

class SpiceCacheFile extends SpiceCacheAbstract
{

    protected $_cacheDirectory = 'cache';

    /**
     * @var bool true if the cache has changed and needs written to disk
     */
    protected $_cacheChanged = false;

    /**
     * @see SpiceCacheAbstract::$_priority
     */
    protected $_priority = 990;

    /**
     * @see SpiceCacheAbstract::__construct()
     *
     * For this backend, we'll read from the SpiceCacheFile::_cacheFileName file into
     * the SpiceCacheFile::$localCache array.
     */
    public function __construct()
    {
        parent::__construct();
            // get the dirctory to store it
            switch (SpiceConfig::getInstance()->get('cache.file_location')){
                case 'systemdir':
                    $this->_cacheDirectory = sys_get_temp_dir();
                    break;
                default:
                    $this->_cacheDirectory = 'cache';
                    break;
            }
    }

    private function getCachedFileName($key){
        if(!SpiceConfig::getInstance()->get('cache.file_transparentnames')) $key = md5($key);

        return $this->_cacheDirectory . DIRECTORY_SEPARATOR . "spicecrmcache_{$key}";
    }

    /**
	 * This is needed to prevent unserialize vulnerability
     */
    public function __wakeup()
    {
        // clean all properties
        foreach(get_object_vars($this) as $k => $v) {
            $this->$k = null;
        }
        throw new \Exception("Not a serializable object");
    }

    /**
     * @see SpiceCacheAbstract::_setExternal()
     *
     * Does nothing; we write to cache on destroy
     */
    protected function _setExternal(
        $key,
        $value
        )
    {
        file_put_contents($this->getCachedFileName($key), serialize($value));
    }

    /**
     * @see SpiceCacheAbstract::_getExternal()
     */
    protected function _getExternal(
        $key,
        $direct = false
        )
    {
        // load up the external cache file
        $c = $direct ? $this->_cacheDirectory . $key : $this->getCachedFileName($key);
        if (file_exists($c)) {
            return unserialize(file_get_contents($c));
        }

        return null;
    }

    /**
     * @see SpiceCacheAbstract::_clearExternal()
     *
     * Does nothing; we write to cache on destroy
     */
    protected function _clearExternal(
        $key
        )
    {
        $c = $this->getCachedFileName($key);
        if (file_exists($c)) {
            unlink($c);
        }
    }

    /**
     * returns the keys
     *
     * @return array
     */
    public function __getKeys(){
        $stats = [];
        $pattern = $this->_cacheDirectory . 'spicecrmcache_' . $this->_keyPrefix . '*';
        $cacheFiles = glob($pattern);
        foreach($cacheFiles as $cacheFile){
            $fileStats = stat($cacheFile);
            $stats[] = [
                'key' => str_replace($this->_cacheDirectory, '', $cacheFile),
                'size' => $fileStats[7],
                'date' => date_create()->setTimestamp($fileStats[10])->format(TimeDate::DB_DATETIME_FORMAT)
            ];
        }
        return $stats;
    }

    public function __deleteKeyDirect($key): bool{
        if(file_exists($this->_cacheDirectory.$key)){
            unlink($this->_cacheDirectory.$key);
            return true;
        }
        return false;
    }


    /**
     * @see SpiceCacheAbstract::_resetExternal()
     *
     * Does nothing; we write to cache on destroy
     */
    protected function _resetExternal()
    {
        $pattern = $this->_cacheDirectory . DIRECTORY_SEPARATOR . 'spicecrmcache_*';
        $cacheFiles = glob($pattern);
        foreach($cacheFiles as $cacheFile){
            unlink($cacheFile);
        }
    }
}
