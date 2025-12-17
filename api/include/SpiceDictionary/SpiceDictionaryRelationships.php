<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\SpiceBeans\SpiceModules;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryRelationships
{
    /**
     * the main table name
     */
    const table = 'sysdictionaryrelationships';

    /**
     * the custom table name
     */
    const customTable = 'syscustomdictionaryrelationships';

    /**
     * the instance for the singelton
     *
     * @var SpiceDictionaryRelationships|null
     */
    private static ?SpiceDictionaryRelationships $instance = null;

    /**
     * @var array loaded relationships with the id as the key
     */
    protected array $relationships = [];

    /**
     * @var array loaded relationships with the name as the key
     */
    protected array $relationshipsByName = [];
    /**
     * @var array loaded relationships with the left dictionary id as the key
     */
    protected array $relationshipsByLeftId = [];
    /**
     * @var array loaded relationships with the right dictionary id as the key
     */
    protected array $relationshipsByRightId = [];
    /**
     * @var array loaded polymorph relationships with the left dictionary id as the key
     */
    protected array $polymorphRelationshipsByLeftId = [];
    /**
     * @var array loaded polymorph relationships with the id as the key
     */
    protected array $polymorphRelationships = [];
    /**
     * @var array loaded polymorph relationships with the relationship id as the key
     */
    protected array $polymorphRelationshipsByRelationId = [];
    /**
     * @var array loaded polymorph relationships with the relationship name as the key
     */
    protected array $polymorphRelationshipsByName = [];
    /**
     * @var array loaded relationship fields with the id as the key
     */
    protected array $relationshipFields = [];
    /**
     * @var array loaded relationship fields with the relationship id as the key
     */
    protected array $relationshipFieldsByRelationAndDefinitionId = [];

    /**
     * @var array loaded relationship types with the name as the key
     */
    protected array $relationshipTypes = [];

    /**
     * the cache object name
     */
    const cacheName = 'dictionaryRelationships';

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
        # retrieve the relationship types
        $cached = SpiceCache::get(self::cacheName);

        if ($cached) {
            $this->relationshipTypes = $cached['relationshipTypes'];
            $this->relationships = $cached['relationships'];
            $this->relationshipsByName = $cached['relationshipsByName'];
            $this->relationshipsByLeftId = $cached['relationshipsByLeftId'];
            $this->relationshipsByRightId = $cached['relationshipsByRightId'];
            $this->polymorphRelationships = $cached['polymorphRelationships'];
            $this->polymorphRelationshipsByLeftId = $cached['polymorphRelationshipsByLeftId'];
            $this->polymorphRelationshipsByRelationId = $cached['polymorphRelationshipsByRelationId'];
            $this->polymorphRelationshipsByName = $cached['polymorphRelationshipsByName'];
            $this->relationshipFields = $cached['relationshipFields'];
            $this->relationshipFieldsByRelationAndDefinitionId = $cached['relationshipFieldsByRelationAndDefinitionId'];

        } else {
            $this->reloadItems();
        }
    }

    /**
     * write cache
     * @return void
     */
    private function writeCache(): void
    {
        SpiceCache::set(self::cacheName, [
            'relationships' => $this->relationships,
            'relationshipTypes' => $this->relationshipTypes,
            'relationshipsByName' => $this->relationshipsByName,
            'relationshipsByLeftId' => $this->relationshipsByLeftId,
            'relationshipsByRightId' => $this->relationshipsByRightId,
            'polymorphRelationships' => $this->polymorphRelationships,
            'polymorphRelationshipsByLeftId' => $this->polymorphRelationshipsByLeftId,
            'polymorphRelationshipsByRelationId' => $this->polymorphRelationshipsByRelationId,
            'polymorphRelationshipsByName' => $this->polymorphRelationshipsByName,
            'relationshipFields' => $this->relationshipFields,
            'relationshipFieldsByRelationAndDefinitionId' => $this->relationshipFieldsByRelationAndDefinitionId,
        ]);
    }

    /**
     * get relationship by id
     * @param string $id
     * @return array|null
     */
    public function getRelationshipById(string $id): ?array
    {
        return $this->relationships[$id];
    }

    /**
     * get relationship by id
     * @param string $name
     * @return array|null
     */
    public function getRelationshipByName(string $name): ?array
    {
        return $this->relationshipsByName[$name] ?? $this->polymorphRelationshipsByName[$name];
    }

    /**
     * get relationship type definition by name
     * @param string $name
     * @return mixed
     */
    public function getRelationshipTypeDefinition(string $name)
    {
        return $this->relationshipTypes[$name];
    }

    /**
     * retrieve relationship types
     * @return array
     * @throws DatabaseException
     */
    public function retrieveRelationshipTypes(): array
    {
        $this->relationshipTypes = [];
        $db = DBManagerFactory::getInstance();
        $types = $db->query("SELECT * FROM sysdictionaryrelationshiptypes");
        while($type = $db->fetchByAssoc($types)){
            $this->relationshipTypes[$type['name']] = $type;
        }

        return $this->relationshipTypes;
    }

    /**
     * reload the items from the database and reset the cache
     * then reset the items from the cache
     * @return void
     * @throws Exception
     */
    public function reloadItems(): void
    {
        $this->retrieveRelationships();
        $this->retrieveRelationshipTypes();
        $this->retrievePolymorphRelationships();
        $this->retrieveRelationshipFields();
        $this->writeCache();
    }

    /**
     * load relationships from cache or db and return array
     * @return array
     * @throws DatabaseException
     * @throws Exception
     */
    public function retrieveRelationships(): array
    {
        $this->relationships = [];
        $this->relationshipsByName = [];
        $this->relationshipsByLeftId = [];
        $this->relationshipsByRightId = [];

        $db = DBManagerFactory::getInstance();

        $scopeTables = ['g' => self::table, 'c' => self::customTable];

        foreach ($scopeTables as $scope => $table) {

            $query = $db->query("SELECT *, '$scope' scope FROM $table");

            while($relationship = $db->fetchByAssoc($query)){
                $this->pushRelationshipInList($relationship);
            }
        }

        return $this->relationships;
    }

    /**
     * push/update relationship in the list
     * @param array $relationship
     * @return void
     */
    private function pushRelationshipInList(array $relationship)
    {
        $this->relationships[$relationship['id']] = $relationship;
        $this->relationshipsByName[$relationship['relationship_name']] = $relationship;

        if (!empty($relationship['lhs_sysdictionarydefinition_id'])) {
            if (!$this->relationshipsByLeftId[$relationship['lhs_sysdictionarydefinition_id']]) {
                $this->relationshipsByLeftId[$relationship['lhs_sysdictionarydefinition_id']] = [];
            }
            $this->relationshipsByLeftId[$relationship['lhs_sysdictionarydefinition_id']][$relationship['id']] = $relationship;
        }

        if (!empty($relationship['rhs_sysdictionarydefinition_id'])) {
            if (!$this->relationshipsByRightId[$relationship['rhs_sysdictionarydefinition_id']]) {
                $this->relationshipsByRightId[$relationship['rhs_sysdictionarydefinition_id']] = [];
            }
            $this->relationshipsByRightId[$relationship['rhs_sysdictionarydefinition_id']][$relationship['id']] = $relationship;
        }
    }

    /**
     * retrieve the relationship fields from the database
     * @return array
     * @throws DatabaseException
     */
    public function retrieveRelationshipFields(): array
    {
        $this->relationshipFields = [];
        $this->relationshipFieldsByRelationAndDefinitionId = [];

        $db = DBManagerFactory::getInstance();

        $fields = $db->query("SELECT *, 'g' scope FROM sysdictionaryrelationshipfields WHERE deleted = 0");

        while($field = $db->fetchByAssoc($fields)){

            $this->relationshipFields[$field['id']] = $field;

            if (!$this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"]) {
                $this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"] = [];
            }

            $this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"][] = $field;
        }

        $fields = $db->query("SELECT *, 'c' scope FROM syscustomdictionaryrelationshipfields WHERE deleted = 0");

        while($field = $db->fetchByAssoc($fields)){

            $this->relationshipFields[$field['id']] = $field;

            if (!$this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"]) {
                $this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"] = [];
            }

            $this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"][] = $field;
        }

        return $this->relationshipFields;
    }

    /**
     * retrieve polymorph relationships
     * @return array
     * @throws DatabaseException
     */
    public function retrievePolymorphRelationships(): array
    {
        $this->polymorphRelationshipsByLeftId = [];
        $this->polymorphRelationships = [];
        $this->polymorphRelationshipsByName = [];
        $this->polymorphRelationshipsByRelationId = [];

        $db = DBManagerFactory::getInstance();
        $tables = ['g' => 'sysdictionaryrelationshippolymorphs', 'c' => 'syscustomdictionaryrelationshippolymorphs'];

        foreach ($tables as $scope => $table) {

            $relationships = $db->query("SELECT *, '$scope' scope FROM $table");

            while($polymorphRelationship = $db->fetchByAssoc($relationships)){

                $this->pushPolymorphInList($polymorphRelationship['relationship_id'], $polymorphRelationship);
            }
        }

        return $this->polymorphRelationships;
    }

    /**
     * get dictionary relationships
     * @param SpiceDictionaryDefinition $dictionaryDefinition
     * @param bool $activeOnly
     * @return array
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public function getDictionaryRelationships(SpiceDictionaryDefinition $dictionaryDefinition, bool $activeOnly = true): array
    {
        $relationshipsArray = [];
        $combinedRelationships = [
            $this->relationshipsByLeftId[$dictionaryDefinition->id] ?? [],
            $this->relationshipsByRightId[$dictionaryDefinition->id] ?? [],
            $this->getPolymorphRelationshipsForParentDictionary($dictionaryDefinition->id) ?? []
        ];

        foreach ($combinedRelationships as $relationships) {
            foreach ($relationships as $relationship) {
                if ($activeOnly && $relationship['status'] != 'a') continue;
                $relationshipsArray[$relationship['id']] = $relationship;
            }
        }

        $items  = SpiceDictionaryItems::getInstance()->getItemsForTemplateDictionary($dictionaryDefinition->id);

        foreach($items as $item){

            $definition = new SpiceDictionaryDefinition($item['sysdictionary_ref_id']);
            $relationships = $this->getDictionaryRelationships($definition);

            foreach ($relationships as $relationship){

                # replace the name
                $relationship['name'] = str_replace('{tablename}', $dictionaryDefinition->tablename, $relationship['name']);
                $relationship['relationship_name'] = str_replace('{tablename}', $dictionaryDefinition->tablename, $relationship['relationship_name']);
                $relationship['lhs_linkname'] = str_replace('{tablename}', $dictionaryDefinition->tablename, $relationship['lhs_linkname']);
                $relationship['rhs_linkname'] = str_replace('{tablename}', $dictionaryDefinition->tablename, $relationship['rhs_linkname']);

                # build a new ID and keep the related ids
                $relationship['original_id'] = $relationship['id'];
                $relationship['template_sysdictionarydefinition_id'] = $item['sysdictionary_ref_id'];
                $relationship['referencing_sysdictionarydefinition_id'] = $dictionaryDefinition->id;
                $relationship['id'] = SpiceUtils::generateMD5GUID("{$item['id']}{$dictionaryDefinition->id}{$relationship['original_id']}");

                $relationshipsArray[] = $relationship;
            }
        }

        return $relationshipsArray;
    }

    /**
     * get polymorph relationships for dictionary as a parent
     * @param string $definitionId
     * @return array
     */
    public function getPolymorphRelationshipsForParentDictionary(string $definitionId): array
    {
        $polymorphs = $this->polymorphRelationshipsByLeftId[$definitionId];

        if (!$polymorphs) return [];

        $relationships = [];

        foreach($polymorphs as $polymorph){
            $relationships[] = $this->relationships[$polymorph['relationship_id']];
        }

        return $relationships;
    }

    /**
     * get polymorph parent module list for relationship
     * @param string $relationshipId
     * @return array
     */
    public function getPolymorphParentModulesForRelationship(string $relationshipId): array
    {
        $relationships = $this->polymorphRelationshipsByRelationId[$relationshipId];

        $modules = [];
        
        foreach($relationships as $relationship){
            $module = SpiceModules::getInstance()->getModuleByDictionaryDefinitionId($relationship['lhs_sysdictionarydefinition_id']);
            if (!$module) continue;
            $modules[] = $module;
        }
        
        return $modules;
    }

    /**
     * get polymorph relationships for the given relationship id
     * @param string $relationshipId
     * @return array
     */
    public function getPolymorphListForRelationship(string $relationshipId): array
    {
        return $this->polymorphRelationshipsByRelationId[$relationshipId] ?? [];
    }

    /**
     * get polymorph relationships for the given relationship id
     * @param string $relationshipId
     * @param string $dictionaryId
     * @return object|null
     */
    public function getPolymorphRelationshipForParent(string $relationshipId, string $dictionaryId): ?object
    {
        $polymorphRelationships = $this->getPolymorphListForRelationship($relationshipId);

        foreach ($polymorphRelationships as $polymorphRelationship) {
            if ($polymorphRelationship['lhs_sysdictionarydefinition_id'] == $dictionaryId) {
                return (object) $polymorphRelationship;
            }
        }

        return null;
    }

    /**
     * adds/saves a relationship
     * @param array $relationship
     * @param array $relationshipPolymorphs
     * @param array $fields
     * @return void
     * @throws Exception
     */
    public function add(array $relationship, array $relationshipPolymorphs = [], array $fields = []): void
    {
        //get the table and do an upsert
        $table = $relationship['scope'] == 'c' ? 'syscustomdictionaryrelationships' : 'sysdictionaryrelationships';

        $isNew = !DBManagerFactory::getInstance()->getOne("SELECT id FROM $table WHERE id='{$relationship['id']}'");

        $this->updateRelationshipInList($relationship);

        unset($relationship['scope']);

        SystemDeploymentCR::writeDBEntry($table, $relationship['id'], $relationship, $relationship['name']);

        $this->handlePolymorphAdd($relationship, $relationshipPolymorphs ?? [], $isNew);
        $this->setDictionaryRelationshipFields($fields);

        $this->writeCache();
    }

    /**
     * writes the relationship changes to the database
     * @param $fields
     * @throws Exception
     */
    public function setDictionaryRelationshipFields($fields){

        if (empty($fields)) return;

        foreach($fields as $field){

            $this->relationshipFields[$field['id']] = $field;
            $this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"] = $field;

            switch($field['scope']){
                case 'c':
                    unset($field['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdictionaryrelationshipfields", $field['id'], $field, $field['sysdictionaryitem_id']);
                    break;
                default:
                    unset($field['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdictionaryrelationshipfields", $field['id'], $field, $field['sysdictionaryitem_id']);
                    break;
            }
        }
    }

    /**
     * update relationship
     * @param array $relationship
     * @return void
     */
    private function updateRelationshipInList(array $relationship): void
    {
        $this->relationships[$relationship['id']] = $relationship;
        $this->relationshipsByName[$relationship['relationship_name']] = $relationship;

        if (!empty($relationship['lhs_sysdictionarydefinition_id'])) {
            $this->relationshipsByLeftId[$relationship['lhs_sysdictionarydefinition_id']][$relationship['id']] = $relationship;
        }

        if (!empty($relationship['rhs_sysdictionarydefinition_id'])) {
            $this->relationshipsByRightId[$relationship['rhs_sysdictionarydefinition_id']][$relationship['id']] = $relationship;
        }
    }

    /**
     * set the status of the relationship
     * @param string $id
     * @param string $status
     * @return void
     * @throws Exception
     */
    public function setStatus(string $id, string $status)
    {
        $relationship = $this->relationships[$id];

        $table = $relationship['scope'] == 'c' ? 'syscustomdictionaryrelationships' : 'sysdictionaryrelationships';

        SystemDeploymentCR::writeDBEntry($table, $id, ['status' => $status], $relationship['name']);

        $this->updateRelationshipInList($relationship);
    }

    /**
     * delete relationship
     * @param string $relationshipId
     * @return void
     * @throws Exception
     */
    public function deleteRelationship(string $relationshipId): void
    {
        $relationship = $this->relationships[$relationshipId];

        $table = $relationship['scope'] == 'c' ? 'syscustomdictionaryrelationships' : 'sysdictionaryrelationships';

        SystemDeploymentCR::deleteDBEntry($table, $relationship['id'], $relationship['name']);

        unset($this->relationships[$relationship['id']]);
        unset($this->relationshipsByName[$relationship['relationship_name']]);

        if (!empty($relationship['lhs_sysdictionarydefinition_id'])) {
            unset($this->relationshipsByLeftId[$relationship['lhs_sysdictionarydefinition_id']][$relationship['id']]);;
        }

        if (!empty($relationship['rhs_sysdictionarydefinition_id'])) {
            unset($this->relationshipsByRightId[$relationship['rhs_sysdictionarydefinition_id']][$relationship['id']]);
        }

        $this->deleteRelationshipFields($relationshipId);

        $this->writeCache();
    }

    /**
     * delete the relationship field from the list
     * @param string $relationshipId
     * @return void
     * @throws Exception
     */
    public function deleteRelationshipFields(string $relationshipId): void
    {
        $relationship = $this->relationships[$relationshipId];
        $table = $relationship['scope'] == 'c' ? 'syscustomdictionaryrelationshipfields' : 'sysdictionaryrelationshipfields';

        foreach ($this->relationshipFields as $fieldId => $field) {

            if ($field['sysdictionaryrelationship_id'] !== $relationshipId) continue;

            SystemDeploymentCR::deleteDBEntry($table, $fieldId, $relationship['name'] . "/{$field['map_to_fieldname']}");

            unset($this->relationshipFields[$fieldId]);
            unset($this->relationshipFieldsByRelationAndDefinitionId["{$field['sysdictionaryrelationship_id']}::{$field['sysdictionarydefinition_id']}"]);
        }
    }

    /**
     * handle updating a related polymorph list
     * @param array $relationship
     * @param array $relationshipPolymorphList
     * @param bool $isNew
     * @return void
     * @throws Exception
     */
    private function handlePolymorphAdd(array $relationship, array $relationshipPolymorphList, bool $isNew): void
    {
        if ($relationship['relationship_type'] !== 'one-to-many-polymorph' || empty($relationshipPolymorphList)) return;

        $existingRelatedPolymorph = $isNew ? [] : $this->getPolymorphListForRelationship($relationship['id']);
        $newPolymorphList = [];

        // handle the polymorph entries
        foreach($relationshipPolymorphList as $relationshipPolymorph){
            $table = $relationshipPolymorph['scope'] == 'c' ? 'syscustomdictionaryrelationshippolymorphs' : 'sysdictionaryrelationshippolymorphs';

            $this->pushPolymorphInList($relationship['id'], $relationshipPolymorph);

            unset($relationshipPolymorph['scope']);

            SystemDeploymentCR::writeDBEntry($table, $relationshipPolymorph['id'], $relationshipPolymorph, $relationshipPolymorph['relationship_name']);

            $newPolymorphList[$relationshipPolymorph['id']] = true;
        }

        foreach ($existingRelatedPolymorph as $existing) {
            if ($newPolymorphList[$existing['id']]) continue;
            $table = $existing['scope'] == 'c' ? 'syscustomdictionaryrelationshippolymorphs' : 'sysdictionaryrelationshippolymorphs';
            SystemDeploymentCR::deleteDBEntry($table, $existing['id'], "polymorph::{$existing['id']}");

            unset($this->polymorphRelationships[$existing['id']]);
            unset($this->polymorphRelationshipsByLeftId[$existing['lhs_sysdictionarydefinition_id']]);
            unset($this->polymorphRelationshipsByRelationId[$relationship['id']]);
            unset($this->polymorphRelationshipsByName[$relationship['relationship_name']]);
        }
    }

    /**
     * push/update a polymorph relationship
     * @param string $relationshipId
     * @param array $polymorphRelationship
     * @return void
     */
    private function pushPolymorphInList(string $relationshipId, array $polymorphRelationship)
    {
        $this->polymorphRelationships[$polymorphRelationship['id']] = $polymorphRelationship;

        # append the main relationship status field to the definition before pushing it to the cached lists
        $polymorphRelationship = [
            ...$polymorphRelationship,
            'status' => $this->relationships[$polymorphRelationship['relationship_id']]['status'] ?? 'i',
            'relationship_type' => 'one-to-many-polymorph'
        ];

        if (!$this->polymorphRelationshipsByLeftId[$polymorphRelationship['lhs_sysdictionarydefinition_id']]) {
            $this->polymorphRelationshipsByLeftId[$polymorphRelationship['lhs_sysdictionarydefinition_id']] = [];
        }

        $this->polymorphRelationshipsByLeftId[$polymorphRelationship['lhs_sysdictionarydefinition_id']][$polymorphRelationship['id']] = $polymorphRelationship;

        if (!$this->polymorphRelationshipsByRelationId[$relationshipId]) {
            $this->polymorphRelationshipsByRelationId[$relationshipId] = [];
        }

        $this->polymorphRelationshipsByRelationId[$relationshipId][$polymorphRelationship['id']] = $polymorphRelationship;

        $this->polymorphRelationshipsByName[$polymorphRelationship['relationship_name']] = $polymorphRelationship;
    }

    /**
     * get the join table fields
     * @param string $dictionaryId
     * @param string $relationshipId
     * @return array
     */
    public function getJoinTableFields(string $dictionaryId, string $relationshipId): array
    {
        return $this->relationshipFieldsByRelationAndDefinitionId["$relationshipId::$dictionaryId"] ?? [];
    }
}