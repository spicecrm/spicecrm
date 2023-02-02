<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryRelationships
{
    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    /**
     * @var the loaded relationships
     */
    public $relationships;

    /**
     * @var holds the relationshiptypes
     */
    public $relationshiptypes;

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryRelationships
     */
    static function getInstance(): SpiceDictionaryRelationships
    {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function __construct()
    {
        $this->loadRelationshipTypes();
        $this->loadRelationships();
    }

    private function loadRelationshipTypes(){
        $this->relationshiptypes = [];
        $db = DBManagerFactory::getInstance();
        $types = $db->query("SELECT * FROM sysdictionaryrelationshiptypes");
        while($type = $db->fetchByAssoc($types)){
            $this->relationshiptypes[] = $type;
        }
    }

    private function loadRelationships(){
        // check if we have a cached value
        $cached = SpiceCache::get('dictionaryrelationships');
        if($cached) {
            $this->relationships = $cached;
            return;
        }

        // read the items
        $itemArray = $this->getRelationships();
        SpiceCache::set('dictionaryrelationships', $itemArray);

        $this->relationships = $itemArray;
    }

    /**
     * loads the relationships from the Database
     *
     * @return array
     * @throws \Exception
     */
    public function getRelationships($sysdictionaryDefinitonId = null, $statusFilter = ['a']){
        $db = DBManagerFactory::getInstance();

        // build a where filter clause
        $whereArray = [];
        if($sysdictionaryDefinitonId){
            $whereArray[] = "sysdictionarydefinition_id='{$sysdictionaryDefinitonId}'";
        }
        if(is_array($statusFilter) && count($statusFilter) > 0){
            $whereArray[] = "status IN ('".implode("','", $statusFilter)."')";
        }
        $whereClause = count($whereArray) > 0 ? " WHERE " . implode(" AND ", $whereArray) : '';

        // build the items
        $relationshipsArray = [];
        $dictionaryrelationships = $db->query("SELECT *, 'g' scope FROM sysdictionaryrelationships {$whereClause}");
        while($dictionaryrelationship = $db->fetchByAssoc($dictionaryrelationships)){
            $relationshipsArray[] = $dictionaryrelationship;
        }
        $dictionaryrelationships = $db->query("SELECT *, 'c' scope FROM syscustomdictionaryrelationships {$whereClause}");
        while($dictionaryrelationship = $db->fetchByAssoc($dictionaryrelationships)){
            $relationshipsArray[] = $dictionaryrelationship;
        }
        return $relationshipsArray;
    }

    public function add(array $relationship){
        //get teh table
        $table = $relationship['scope'] == 'c' ? 'syscustomdictionaryrelationships' : 'sysdictionaryrelationships';
        unset($relationship['scope']);
        DBManagerFactory::getInstance()->insertQuery($table, $relationship);
    }
}