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
     * repairs the relationships for the one definiton
     *
     * @param $sysdictionaryDefinitonId
     * @return void
     */
    public function repairForDctionaryDefinition(string $sysdictionaryDefinitonId){
        $relationships = $this->getRelationships($sysdictionaryDefinitonId);
        foreach ($relationships as $relationship){
              (new SpiceDictionaryRelationship($relationship['id']))->activate();
        }
    }

    /**
     * loads the relationships from the Database
     *
     * @return array
     * @throws \Exception
     */
    public function getRelationships(string $sysdictionaryDefinitonId = null, array $statusFilter = ['a']){
        $db = DBManagerFactory::getInstance();

        // build a where filter clause
        $whereArray = [];
        if($sysdictionaryDefinitonId){
            $whereArray[] = "(lhs_sysdictionarydefinition_id='{$sysdictionaryDefinitonId}' OR rhs_sysdictionarydefinition_id='{$sysdictionaryDefinitonId}')";
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