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

use Memcache;
use Memcached;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceCacheMemcached extends SpiceCacheAbstract
{
    /**
     * @var Memcache server name string
     */
    protected $_host = '127.0.0.1';
    
    /**
     * @var Memcache server port int
     */
    protected $_port = 11211;
    
    /**
     * @var Memcached object
     */
    protected $_memcached = '';
    
    /**
     * @see SpiceCacheAbstract::$_priority
     */
    protected $_priority = 900;
    
    /**
     * @see SpiceCacheAbstract::__construct()
     */
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     * Get the memcached object; initialize if needed
     */
    protected function _getMemcachedObject()
    {
        if ( !($this->_memcached instanceOf Memcached) ) {
            $this->_memcached = new Memcached();
            $this->_host = SpiceConfig::getInstance()->config['cache']['memcached_host'] ?:  $this->_host;
            $this->_port = SpiceConfig::getInstance()->config['cache']['memcached_port'] ?:  $this->_port;
            if ( !@$this->_memcached->addServer($this->_host,$this->_port) ) {
                return false;
            }
        }
        
        return $this->_memcached;
    }
    
    /**
     * @see SpiceCacheAbstract::_setExternal()
     */
    protected function _setExternal(
        $key,
        $value
        )
    {
        $this->_getMemcachedObject()->set($key, $value, $this->_expireTimeout);
    }
    
    /**
     * @see SpiceCacheAbstract::_getExternal()
     */
    protected function _getExternal(
        $key,
        $direct = false
        )
    {
        $returnValue =$this->_getMemcachedObject()->get($key);
        if ( $this->_getMemcachedObject()->getResultCode() != Memcached::RES_SUCCESS ) {
            return null;
        }

        return $returnValue;
    }
    
    /**
     * @see SpiceCacheAbstract::_clearExternal()
     */
    protected function _clearExternal(
        $key
        )
    {
        $this->_getMemcachedObject()->delete($key);
    }

    /**
     * returns the keys
     *
     * @return array
     */
    public function __getKeys(){
        $stats = [];
        $keys = $this->_getMemcachedObject()->getAllKeys();
        foreach($keys as $key){
            $stats[] = [
                'key' => $key,
                'size' => strlen($this->_getMemcachedObject()->get($key))
            ];
        }
        return $stats;
    }

    public function __deleteKeyDirect($key): bool{
        $this->_getMemcachedObject()->get($key);
        if ($this->_getMemcachedObject()->getResultCode() == Memcached::RES_SUCCESS ) {
            $this->_getMemcachedObject()->delete($key);
            return true;
        }
        return false;
    }

    /**
     * @see SpiceCacheAbstract::_resetExternal()
     */
    protected function _resetExternal()
    {
        $allKeys = $this->_getMemcachedObject()->getAllKeys();
        $delKeys = [];
        foreach($allKeys as $key){
            if(strpos($key, $this->_keyPrefix) === 0){
                $delKeys[] = $key;
            }
        }

        if(count($delKeys) > 0) $this->_getMemcachedObject()->deleteMulti($delKeys);
    }
}
