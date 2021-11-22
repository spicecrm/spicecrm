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

namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;

/**
 * Create relationship objects
 * @api
 */
class SugarRelationshipFactory {
    static $rfInstance;

    protected $relationships;

    protected function __construct(){
        //Load the relationship definitions from the cache.
        $this->loadRelationships();
    }

    /**
     * @static
     * @return SugarRelationshipFactory
     */
    public static function getInstance()
    {
        if (is_null(self::$rfInstance))
            self::$rfInstance = new SugarRelationshipFactory();
        return self::$rfInstance;
    }


    /**
     * @param  $relationshipName String name of relationship to load
     * @return false|EmailAddressRelationship|M2MRelationship|One2MBeanRelationship|One2MRelationship|One2OneBeanRelationship|One2OneRelationship
     */
    public function getRelationship($relationshipName)
    {
        if (empty($this->relationships[$relationshipName])) {
            LoggerManager::getLogger()->error("Unable to find relationship in ".__CLASS__." ".__FUNCTION__."() on line ".__LINE__." $relationshipName");
            return false;
        }

        $def = $this->relationships[$relationshipName];

        $type = isset($def['true_relationship_type']) ? $def['true_relationship_type'] : $def['relationship_type'];
        switch($type)
        {
            case "many-to-many":
                if (isset($def['rhs_module']) && $def['rhs_module'] == 'EmailAddresses')
                {
                    return new EmailAddressRelationship($def);
                }
                return new M2MRelationship($def);
            case "one-to-many":
                //If a relationship has no table or join keys, it must be bean based
                if (empty($def['true_relationship_type']) || (empty($def['table']) && empty($def['join_table'])) || empty($def['join_key_rhs'])){
                    return new One2MBeanRelationship($def);
                }
                else {
                    return new One2MRelationship($def);
                }
            case "one-to-one":
                if (empty($def['true_relationship_type'])){
                    return new One2OneBeanRelationship($def);
                }
                else {
                    return new One2OneRelationship($def);
                }
        }

        LoggerManager::getLogger()->fatal ("$relationshipName had an unknown type $type ");

        return false;
    }


    /**
     * @param false $forceLoadFromDb
     */
    protected function loadRelationships($forceLoadFromDb = false)
    {
        if(empty($_SESSION['relationships']) || $forceLoadFromDb) {
            $this->loadRelationshipsFromDb();
        } else {
            $this->loadRelationshipsFromSession();
        }
    }

    /**
     * fill relationships from database and set to session
     */
    private function loadRelationshipsFromDb(){
        $this->relationships = SpiceDictionaryVardefs::loadRelationships();
        // reset session
        $_SESSION['relationships'] = [];
        $_SESSION['relationships'] = array_merge($_SESSION['relationships'], $this->relationships);
    }

    /**
     * fill relationships from session
     */
    private function loadRelationshipsFromSession(){
        $this->relationships = $_SESSION['relationships'];
    }


    /**
     * load relationships from cache table
     * @param string $module filter on module
     * @return void
     */
    private function loadRelationshipsCacheFromDb($module = null){
        $relationships = SpiceDictionaryVardefs::getRelationshipsCacheFromDb($module);
        $this->relationships = $relationships;
    }



}
