<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
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
     * loads the relationships from the database
     *
     * @param string|null $sysdictionaryDefinitonId
     * @param array $statusFilter
     * @param $includeTemplates
     * @param bool $includeParentPolymorph default is true, when disabled only child polymorph relationships will be retrieved
     * @return array
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public function getRelationships(string $sysdictionaryDefinitonId = null, array $statusFilter = ['a'], $includeTemplates = false, bool $includeParentPolymorph = true){
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

        # search for polymorph relationships for this dictionary as a parent
        if ($sysdictionaryDefinitonId && $includeParentPolymorph) {
            $polymorphRelationships = $this->getPolymorphRelationshipsForParentDictionary($sysdictionaryDefinitonId);
            $relationshipsArray = array_merge($relationshipsArray, $polymorphRelationships);
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
                    $relationship['id'] = SpiceUtils::generateMD5GUID("{$item['id']}{$sysdictionaryDefinitonId}{$relationship['original_id']}");

                    $relationshipsArray[] = $relationship;
                }
            }
        }

        return $relationshipsArray;
    }

    /**
     * get polymorph relationships for dictionary as a parent
     * @param string $definitionId
     * @return array
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public function getPolymorphRelationshipsForParentDictionary(string $definitionId): array
    {
        $db = DBManagerFactory::getInstance();
        $relationships = [];

        $query = $db->query("SELECT * FROM sysdictionaryrelationshippolymorphs WHERE lhs_sysdictionarydefinition_id = '$definitionId'");
        while ($polymorph = $db->fetchByAssoc($query)){
            $relationship = new SpiceDictionaryRelationship($polymorph['relationship_id']);
            $relationship->relationship->lhs_sysdictionarydefinition_id = $definitionId;
            $relationship->relationship->lhs_sysdictionaryitem_id = $polymorph['lhs_sysdictionaryitem_id'];
            $relationship->relationship->relationship_name = $polymorph['relationship_name'];
            $relationships[] = json_decode(json_encode($relationship->relationship), true);
        }

        return $relationships;
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

        $db->upsertQuery($table, ['id' => $relationship['id']], $relationship, true);

        // handle the polymorph entries
        foreach($relationshipPolymorphs as $relationshipPolymorph){
            $table = $relationshipPolymorph['scope'] == 'c' ? 'syscustomdictionaryrelationshippolymorphs' : 'sysdictionaryrelationshippolymorphs';
            unset($relationshipPolymorph['scope']);
            $db->upsertQuery($table, ['id' => $relationshipPolymorph['id']], $relationshipPolymorph, true);
        }
    }

    /**
     * repair dictionary vardef relationships
     * @param string $dictionaryId
     * @return void
     * @throws DatabaseException
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public static function repairDictionaryVardefRelationships(string $dictionaryId): void
    {
        $dic = (new SpiceDictionaryDefinition($dictionaryId));
        self::repairVardefRelationshipsFromFields($dic->name, $dic->loadVardefs());
    }

    /**
     * repair vardef relationships and related join tables
     * @param string $dictionaryName
     * @param $vardefDetails
     * @return void
     * @throws DatabaseException
     * @throws Exception
     */
    public static function repairVardefRelationshipsFromFields(string $dictionaryName, $vardefDetails): void
    {
        SpiceDictionaryVardefs::loadLegacyFiles();

        foreach ($vardefDetails['fields'] as $field) {

            if ($field['type'] != 'link') continue;

            try {
                # try to locate the relationship on this dictionary vardef
                SpiceDictionaryRelationships::getInstance()->repairVardefRelationship($dictionaryName, $field['relationship'], true, false);
            } catch (NotFoundException $e) {
                # on failure try to locate the relationship vardef
                foreach (SpiceDictionaryHandler::getInstance()->dictionary as $dicName => $dic) {
                    if (!$dic['relationships'] || !$dic['relationships'][$field['relationship']]) continue;
                    SpiceDictionaryRelationships::getInstance()->repairVardefRelationship($dicName, $field['relationship'], true, false);
                    break;
                }
            }
        }
    }


    /**
     * legacy support to repair a vardef relationship
     *
     * @return true
     * @throws DatabaseException
     * @throws Exception
     */
    public function repairVardefRelationship($dictionaryName, $relationshipName, bool $repairJoinTable = false, bool $loadLegacyFiles = true): bool
    {
        $db = DBManagerFactory::getInstance();

        // get the relationship data
        if ($loadLegacyFiles) SpiceDictionaryVardefs::loadLegacyFiles();

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

        #repair the join table for m2m relationship
        if ($repairJoinTable && !empty($relationshipDefinition['join_table'])) {
            # generate the repair query
            $sql = SpiceDictionaryDefinitions::getInstance()->repairVardefDefinition($relationshipDefinition['join_table'], false, false);
            # execute the query
            if (!empty($sql)) DBManagerFactory::getInstance()->query($sql, true);
        }

        return true;
    }
}