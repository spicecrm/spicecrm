<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceCache\SpiceCache;
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
            LoggerManager::getLogger()->debug("Unable to find relationship in ".__CLASS__." ".__FUNCTION__."() on line ".__LINE__." $relationshipName");
            return false;
        }

        $def = $this->relationships[$relationshipName];

        $type = isset($def['true_relationship_type']) ? $def['true_relationship_type'] : $def['relationship_type'];
        switch($type)
        {
            case "many-to-many-bean":
                return new M2MBeanRelationship($def);
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
    public function loadRelationships($forceLoadFromDb = false)
    {
        $cached = SpiceCache::get('relationships');
        if(!$cached || $forceLoadFromDb) {
            $this->relationships = SpiceDictionaryVardefs::loadRelationships();
            SpiceCache::set('relationships', $this->relationships);
        } else {
            $this->relationships = $cached;
        }
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
