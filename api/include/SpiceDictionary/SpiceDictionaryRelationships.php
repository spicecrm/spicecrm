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

        // get the relationships directly linked
        $relationships = $this->getRelationships($sysdictionaryDefinitonId);
        foreach ($relationships as $relationship){
            (new SpiceDictionaryRelationship($relationship['id']))->deactivate(false)->activate(false);
        }

        // get for all templates linked
        $items  = SpiceDictionaryItems::getInstance()->getItems($sysdictionaryDefinitonId, ['a'], true);
        foreach($items as $item){
            $relationships = $this->getRelationships($item['sysdictionary_ref_id']);
            foreach ($relationships as $relationship){

                // activate
                (new SpiceDictionaryRelationship($relationship['id']))->deactivate(false, $item['id'], $sysdictionaryDefinitonId)->activate(false, $item['id'], $sysdictionaryDefinitonId);
            }
        }
    }

    /**
     * loads the relationships from the Database
     *
     * @return array
     * @throws \Exception
     */
    public function getRelationships(string $sysdictionaryDefinitonId = null, array $statusFilter = ['a'], $includeTemplates = false){
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

        // if we have an ID and shoudl include templates retrieve them as well
        if($sysdictionaryDefinitonId && $includeTemplates){

            $sysdictionaryDefiniton = new SpiceDictionaryDefinition($sysdictionaryDefinitonId);
            // get for all templates linked
            $items  = SpiceDictionaryItems::getInstance()->getItems($sysdictionaryDefinitonId, ['a'], true);
            foreach($items as $item){
                // make sure we have a refID
                if(!$item['sysdictionary_ref_id']) continue;

                // ret the ref relationships
                $relationships = $this->getRelationships($item['sysdictionary_ref_id']);
                foreach ($relationships as $relationship){
                    // replace the name
                    $relationship['name'] = str_replace('{tablename}', $sysdictionaryDefiniton->tablename, $relationship['name']);
                    $relationship['relationship_name'] = str_replace('{tablename}', $sysdictionaryDefiniton->tablename, $relationship['relationship_name']);

                    // build a new ID
                    $relationship['id'] = md5("{$item['id']}{$sysdictionaryDefinitonId}");

                    $relationshipsArray[] = $relationship;
                }
            }
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