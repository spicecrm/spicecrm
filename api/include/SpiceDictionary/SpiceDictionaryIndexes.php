<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

/**
 * manages Indexes
 */
class SpiceDictionaryIndexes
{

    /**
     * the main table name
     */
    const table = 'sysdictionaryindexes';

    /**
     * the custom table name
     */
    const customTable = 'syscustomdictionaryindexes';

    /**
     * the cache object name
     */
    const cacheName = 'dictionaryindexes';

    /**
     * the main table name
     */
    const itemTable = 'sysdictionaryindexitems';

    /**
     * the custom table name
     */
    const itemCustomTable = 'syscustomdictionaryindexitems';

    /**
     * the cache object name
     */
    const itemCacheName = 'dictionaryindexitems';

    /**
     * the instance for the singelton
     *
     * @var SpiceDictionaryIndexes|null
     */
    private static ?SpiceDictionaryIndexes $instance = null;

    /**
     * holds teh loaded indexes
     * @var array
     */
    public $dictionaryIndexes = [];

    /**
     * holds all loaded items
     *
     * @var array
     */
    public $dictionaryIndexItems = [];


    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryIndexes
     */
    static function getInstance(): SpiceDictionaryIndexes
    {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    private function __construct(bool $load = true)
    {
        if (!$load) return;

        // check if we have a cached value
        $cached = SpiceCache::get(self::cacheName);
        if($cached) {
            $this->dictionaryIndexes = $cached['dictionaryIndexes'];
            $this->dictionaryIndexItems = $cached['dictionaryIndexItems'];
        } else {
            $this->reloadItems();
        }
    }

    /**
     * writes teh cache
     *
     * @return void
     */
    public function writeCache(){
        SpiceCache::set(self::cacheName,  [
            'dictionaryIndexes' => $this->dictionaryIndexes,
            'dictionaryIndexItems' => $this->dictionaryIndexItems,
        ]);
    }

    /**
     * reload the items from the database and reset the cache
     * then reset the items from the cache
     * @return void
     * @throws Exception
     */
    public function reloadItems()
    {
        $this->retrieveIndexes();
        $this->retrieveIndexItems();
        $this->writeCache();
    }

    /**
     * fetches an index by the ID
     *
     * @param $id
     * @return mixed
     */
    public function getIndex($id){
        return $this->dictionaryIndexes[$id];
    }

    /**
     * returns all laoded indexes
     *
     * @return array
     */
    public function getIndexes(){
        return array_values($this->dictionaryIndexes);
    }

    /**
     * returns all loaded index items (optionally filtered by an indexid
     *
     * @return array
     */
    public function getIndexItems($indexId = null) {
        // First ensure we have the latest data from DB
        if (empty($this->dictionaryIndexItems)) {
            $this->dictionaryIndexItems = $this->retrieveIndexItems();
        }

        if ($indexId) {
            return array_values(array_filter($this->dictionaryIndexItems, function($item) use ($indexId) {
                return $item['sysdictionaryindex_id'] === $indexId;
            }));
        }

        return array_values($this->dictionaryIndexItems);
    }

    /**
     * retrieve indexes from db
     * @return array
     * @throws Exception
     */
    public function retrieveIndexes(): array
    {
        $db = DBManagerFactory::getInstance();
        $this->dictionaryIndexes = [];

        $scopeTables = ['g' => self::table, 'c' => self::customTable];

        foreach($scopeTables as $scope => $table){

            $query = $db->query("SELECT *, '$scope' as scope FROM $table");

            while ($index = $db->fetchByAssoc($query)) {
                $this->pushIndexInList($index);
            }
        }

        return $this->dictionaryIndexes;
    }

    /**
     * push an index to the list
     * @param array $index
     * @return void
     */
    private function pushIndexInList(array $index)
    {
        $this->dictionaryIndexes[$index['id']] = $index;
    }

    /**
     * retrieves the dictionary indexes
     * @param string $definitionId
     * @param string[] $statusFilter
     * @return array
     */
    public function getDictionaryIndexes(string $definitionId, array $statusFilter = ['a']): array
    {
        $indexes = [];

        foreach ($this->dictionaryIndexes as $index) {
            if ($index['sysdictionarydefinition_id'] == $definitionId && (empty($statusFilter) || in_array($index['status'], $statusFilter))) {
                $indexes[] = $index;

            }
        }

        return $indexes;
    }

    /**
     * retrieves the dictionary index items
     * @return array
     * @throws Exception
     */
    public function retrieveIndexItems(): array
    {
        $this->dictionaryIndexItems = [];

        $db = DBManagerFactory::getInstance();

        $scopeTables = ['g' => self::itemTable, 'c' => self::itemCustomTable];

        foreach($scopeTables as $scope => $table){

            $query = $db->query("SELECT *, '$scope' as scope FROM $table");

            while ($item = $db->fetchByAssoc($query)) {
                $this->pushItemInList($item);
            }
        }

        return $this->dictionaryIndexItems;
    }

    /**
     * pushes an item to the list
     * @param array $item
     * @return void
     */
    private function pushItemInList(array $item)
    {
        $item['sequence'] = intval($item['sequence']);
        $this->dictionaryIndexItems[$item['id']] = $item;
    }

    /**
     * returns the proper table for an index
     *
     * @param $id
     * @return string
     */
    private function getDefinitonTable($id){
        // get the def
        $def = $this->dictionaryIndexes[$id];

        // get the proper table name
        return $def['scope'] == 'c' ? self::customTable : self::table;
    }

    /**
     * returns the proper table for an indexitem
     *
     * @param $id
     * @return string
     */
    private function getItemDefinitonTable($id){
        // get the def
        $def = $this->dictionaryIndexItems[$id];

        // get the proper table name
        return $def['scope'] == 'c' ? self::itemCustomTable : self::itemTable;
    }

    /**
     * adds an index plus items
     *
     * @param array $index
     * @param array $items
     * @return true
     * @throws Exception
     */
    public function addIndex(array $index, array $items)
    {
        // Determine the appropriate table for index
        $table = $index['scope'] == 'c' ? self::customTable : self::table;

        // Check if the index already exists
        $existingIndex = $this->dictionaryIndexes[$index['id']] ?? null;

        if ($existingIndex) {
            // If it exists, update it
            SystemDeploymentCR::writeDBEntry($table, $index['id'], $index, $index['name'], SystemDeploymentCR::ACTION_UPDATE);
        } else {
            // If it doesn't exist, insert it
            SystemDeploymentCR::writeDBEntry($table, $index['id'], $index, $index['name'], SystemDeploymentCR::ACTION_INSERT);
        }

        $this->pushIndexInList($index);

        // Handle index items
        $existingItems = $this->getIndexItems($index['id']);  // Fetch all existing items for the given index ID

        // Prepare an array of the item IDs that are currently being added (to compare later)
        $newItemIds = array_map(function($item) { return $item['id']; }, $items);

        // First, handle items that need to be deleted from the database (items that are no longer in the updated list)
        foreach ($existingItems as $existingItem) {
            if (!in_array($existingItem['id'], $newItemIds)) {
                // Item is no longer in the updated array, delete it from the database
                SystemDeploymentCR::deleteDBEntry($this->getItemDefinitonTable($existingItem['id']), $existingItem['id'], $index['name']);
                // Remove from the cache
                unset($this->dictionaryIndexItems[$existingItem['id']]);
            }
        }

        // Now, handle adding or updating items that are part of the current save
        foreach ($items as $item) {
            $table = $item['scope'] == 'c' ? self::itemCustomTable : self::itemTable;
            $existingItem = $this->dictionaryIndexItems[$item['id']] ?? null;

            if ($existingItem) {
                // If the item already exists, update it
                SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $index['name'], SystemDeploymentCR::ACTION_UPDATE);
            } else {
                // If the item doesn't exist, insert it
                SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $index['name'], SystemDeploymentCR::ACTION_INSERT);
            }

            $this->pushItemInList($item);;
        }

        // Rewrite the cache to persist changes
        $this->writeCache();

        return true;
    }

    /**
     * sets the status for a given ID
     *
     * @param $id
     * @param $status
     * @return void
     * @throws Exception
     */
    public function setStatus($id, $status){

        $def = $this->dictionaryIndexes[$id];

        $def['status'] = $status;

        $this->pushIndexInList($def);

        SystemDeploymentCR::writeDBEntry($this->getDefinitonTable($id), $id, ['status' => $status], $def['name']);

        $this->writeCache();
    }


    /**
     * deletes an index with the given id
     *
     * @param $id
     * @return true
     * @throws Exception
     */
    public function delete($id){
        // get the def
        $def = $this->dictionaryIndexes[$id];

        // get all index Items and remove them
        $items = $this->getIndexItems($id);

        foreach($items as $item){
            $itemTable = $def['scope'] == 'c' ? self::itemCustomTable : self::itemTable;
            SystemDeploymentCR::deleteDBEntry($itemTable, $item['id'], $itemTable);
            // remove from the array
            unset($this->dictionaryIndexItems[$item['id']]);
        }

        // write the status update
        SystemDeploymentCR::deleteDBEntry($this->getDefinitonTable($id), $id, $def['name']);

        // remove from the array
        unset($this->dictionaryIndexes[$id]);

        // rewrite the cache
        $this->writeCache();

        // return
        return true;
    }

    /**
     * merges the indexes from teh dictionary based on the definition with the vardef indexes
     *
     * @param $dictionaryIndexes
     * @param $vardefIndexes
     * @return array
     */
    public function mergeIndexes($dictionaryIndexes, $vardefIndexes)
    {
        // compare the array based on the fields
        foreach ($vardefIndexes as $vardefIndexId => $vardefIndexDetails) {
            // find candiates where we have alt least the same number of fields
            foreach ($dictionaryIndexes as $dictionaryIndex) {
                if (count(array_diff($dictionaryIndex['fields'], $vardefIndexDetails['fields'])) == 0) {
                    unset($vardefIndexes[$vardefIndexId]);
                    break;
                }
            }
        }

        // merge and return the values only
        return array_values(array_merge($dictionaryIndexes, $vardefIndexes));
    }

    /**
     * initialize and set indexes and items from the system package for installer
     * @param array $indexes
     * @param array $items
     * @return void
     */
    public static function initializeFromSystemPackage(array $indexes, array $items)
    {
        self::$instance = new self(false);

        self::$instance->dictionaryIndexes = [];
        self::$instance->dictionaryIndexItems = [];

        foreach ($indexes as $index) {
            self::$instance->pushIndexInList((array) $index);
        }

        foreach ($items as $item) {
            self::$instance->pushItemInList((array) $item);
        }

        self::$instance->writeCache();
    }
}