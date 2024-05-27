<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\utils\SpiceUtils;

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

    /**
     * the cache object name
     */
    const cachename = 'dictionaryrelationships';

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

    /**
     * reload the items from the database and reset the cache
     * then reset the items from the cache
     * @return void
     * @throws Exception
     */
    public function reloadItems()
    {
        $this->relationships = $this->getRelationships();
        SpiceCache::set(self::cachename, $this->relationships);
    }

    /**
     * reset cache
     */
    public function resetCache($rebuild = true){
        SpiceCache::clear(self::cachename);

        if($rebuild) SpiceCache::set(self::cachename, $this->getRelationships());
    }

    private function loadRelationships(){
        // check if we have a cached value
        $cached = SpiceCache::get(self::cachename);
        if($cached) {
            $this->relationships = $cached;
            return;
        }

        // read the items
        $itemArray = $this->getRelationships();
        SpiceCache::set(self::cachename, $itemArray);

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
                (new SpiceDictionaryRelationship($relationship['id']))->deactivate(false, $item['sysdictionary_ref_id'], $sysdictionaryDefinitonId)->activate(false, $item['sysdictionary_ref_id'], $sysdictionaryDefinitonId);
            }
        }
    }

    /**
     * loads the relationships from the Database
     *
     * @return array
     * @throws Exception
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
                    $relationship['lhs_linkname'] = str_replace('{tablename}', $sysdictionaryDefiniton->tablename, $relationship['lhs_linkname']);
                    $relationship['rhs_linkname'] = str_replace('{tablename}', $sysdictionaryDefiniton->tablename, $relationship['rhs_linkname']);

                    // build a new ID and keep the related ids
                    $relationship['original_id'] = $relationship['id'];
                    $relationship['template_sysdictionarydefinition_id'] = $item['sysdictionary_ref_id'];
                    $relationship['referencing_sysdictionarydefinition_id'] = $sysdictionaryDefinitonId;
                    $relationship['id'] = SpiceUtils::generateMD5GUID("{$item['id']}{$sysdictionaryDefinitonId}");

                    $relationshipsArray[] = $relationship;
                }
            }
        }

        return $relationshipsArray;
    }

    /**
     * gets the polymorph fields
     *
     * @return void
     */
    public function getPolymorphs($relationship_id = null){
        $db = DBManagerFactory::getInstance();

        // build a where clause
        $whereArray = [];
        if($relationship_id){
            $whereArray[] = "relationship_id='{$relationship_id}'";
        }
        $whereClause = count($whereArray) > 0 ? " WHERE " . implode(" AND ", $whereArray) : '';

        // build the items
        $relationshipPolymorphsArray = [];
        $dictionaryrelationshippolymorphs = $db->query("SELECT *, 'g' scope FROM sysdictionaryrelationshippolymorphs {$whereClause}");
        while($dictionaryrelationshippolymorph = $db->fetchByAssoc($dictionaryrelationshippolymorphs)){
            $relationshipPolymorphsArray[] = $dictionaryrelationshippolymorph;
        }
        $dictionaryrelationshippolymorphs = $db->query("SELECT *, 'c' scope FROM syscustomdictionaryrelationshippolymorphs {$whereClause}");
        while($dictionaryrelationshippolymorph = $db->fetchByAssoc($dictionaryrelationshippolymorphs)){
            $relationshipPolymorphsArray[] = $dictionaryrelationshippolymorph;
        }

        return $relationshipPolymorphsArray;
    }

    /**
     * adds/saves a reoplationship
     *
     * @param array $relationship
     * @param $relationshipPolymorphs
     * @return void
     * @throws Exception
     */
    public function add(array $relationship, $relationshipPolymorphs = []){
        $db = DBManagerFactory::getInstance();
        //get the table and do an upsert
        $table = $relationship['scope'] == 'c' ? 'syscustomdictionaryrelationships' : 'sysdictionaryrelationships';

        $this->relationships[] = $relationship;
        $this->resetCache();

        unset($relationship['scope']);

        $db->upsertQuery($table, $relationship, $relationship, true);

        // handle the polymorph entries
        foreach($relationshipPolymorphs as $relationshipPolymorph){
            $table = $relationshipPolymorph['scope'] == 'c' ? 'syscustomdictionaryrelationshippolymorphs' : 'sysdictionaryrelationshippolymorphs';
            unset($relationshipPolymorph['scope']);
            $db->upsertQuery($table, $relationshipPolymorph, $relationshipPolymorph, true);
        }
    }


    /**
     * legacy support to repair a vardef relationship
     *
     * @return void
     */
    public function repairVardefRelationship($dictionaryName, $relationshipName){
        $db = DBManagerFactory::getInstance();

        // get the relationship data
        SpiceDictionaryVardefs::loadLegacyFiles();
        // $relationshipDefinition = SpiceDictionary::getInstance()->getDefs($dictionaryName)['relationships'][$relationshipName];
        $relationshipDefinition = SpiceDictionaryHandler::getInstance()->dictionary[$dictionaryName]['relationships'][$relationshipName];

        if(!$relationshipDefinition){
            throw new NotFoundException("Relationshipdefinition for {$relationshipName} not found");
        }

        // delete the rel from teh rel ta
        $db->query("DELETE FROM relationships WHERE relationship_name='{$relationshipName}'");
        $relationshipDefinition['relationship_name'] = $relationshipName;
        $relationshipDefinition['id'] = SpiceUtils::generateMD5GUID($relationshipName);
        $db->insertQuery('relationships', $relationshipDefinition);

        return true;
    }
}