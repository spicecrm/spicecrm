<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

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
    const customtable = 'syscustomdictionaryindexes';

    /**
     * the cache object name
     */
    const cachename = 'dictionaryindexes';

    /**
     * the main table name
     */
    const itemtable = 'sysdictionaryindexitems';

    /**
     * the custom table name
     */
    const customitemtable = 'syscustomdictionaryindexitems';

    /**
     * the cache object name
     */
    const itemcachename = 'dictionaryindexitems';


    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

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

    public function __construct()
    {
        // check if we have a cached value
        $cached = SpiceCache::get(self::cachename);
        if($cached) {
            $this->dictionaryIndexes = $cached;
        } else {
            // load the indexes
            $this->dictionaryIndexes = $this->getDictionaryIndexes(null, []);
        }

        // check if we have a cached value
        $cached = SpiceCache::get(self::itemcachename);
        if($cached) {
            $this->dictionaryIndexItems = $cached;
        } else {
            // load the indexitems
            $this->dictionaryIndexItems = $this->getDictionaryIndexItems();
        }

    }

    /**
     * writes teh cache
     *
     * @return void
     */
    public function writeCache(){
        SpiceCache::set(self::cachename,  $this->dictionaryIndexes);
        SpiceCache::set(self::itemcachename,  $this->dictionaryIndexItems);
    }

    /**
     * reload the items from the database and reset the cache
     * then reset the items from the cache
     * @return void
     */
    public function reloadItems()
    {
        $this->dictionaryIndexes = $this->getDictionaryIndexes(null, []);
        $this->dictionaryIndexItems = $this->getDictionaryIndexItems();
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
    public function getIndexItems($indexId = null){
        if($indexId){
            $filtered = [];
            foreach ($this->dictionaryIndexItems As $dictionaryIndexItem){
                if($dictionaryIndexItem['sysdictionaryindex_id'] == $indexId) $filtered[] = $dictionaryIndexItem;
            }
            return $filtered;
        }

        return array_values($this->dictionaryIndexItems);
    }

    /**
     * retrieves the dictionary indexes
     *
     * @return array
     */
    public static function getDictionaryIndexes($sysdictionaryDefinitionId = null, $statusFilter = ['a'])
    {
        $db = DBManagerFactory::getInstance();

        // build a where filter clause
        $whereArray = [];
        if ($sysdictionaryDefinitionId) {
            $whereArray[] = "sysdictionarydefinition_id='{$sysdictionaryDefinitionId}'";
        }
        if (is_array($statusFilter) && count($statusFilter) > 0) {
            $whereArray[] = "status IN ('" . implode("','", $statusFilter) . "')";
        }
        $whereClause = count($whereArray) > 0 ? " WHERE " . implode(" AND ", $whereArray) : '';

        $indexArray = [];
        $dictionaryindexes = $db->query("SELECT * FROM ".self::table." $whereClause");
        while ($dictionaryindex = $db->fetchByAssoc($dictionaryindexes)) {
            $indexArray[$dictionaryindex['id']] = array_merge($dictionaryindex, ['scope' => 'g']);
        }
        $dictionaryindexes = $db->query("SELECT * FROM ".self::customtable." $whereClause");
        while ($dictionaryindex = $db->fetchByAssoc($dictionaryindexes)) {
            $indexArray[$dictionaryindex['id']] = array_merge($dictionaryindex, ['scope' => 'c']);;
        }

        return $indexArray;
    }


    /**
     * writes the relationship changes to the database
     *
     * @param indexes
     */
    public function setDictionaryIndexes($indexes)
    {

        foreach ($indexes as $index) {
            switch ($index['scope']) {
                case 'c':
                    unset($index['scope']);
                    SystemDeploymentCR::writeDBEntry(self::customtable, $index['id'], $index, $index['name']);
                    break;
                default:
                    unset($index['scope']);
                    SystemDeploymentCR::writeDBEntry(self::table, $index['id'], $index, $index['name']);
                    break;
            }
        }
    }


    /**
     * retrieves the dictionary indexitems
     *
     * @return array
     */
    public function getDictionaryIndexItems()
    {
        $db = DBManagerFactory::getInstance();
        $indexItemsArray = [];
        $dictionaryindexitems = $db->query("SELECT * FROM ".self::itemtable);
        while ($dictionaryindexitem = $db->fetchByAssoc($dictionaryindexitems)) {
            $dictionaryindexitem['sequence'] = intval($dictionaryindexitem['sequence']);
            $indexItemsArray[] = array_merge($dictionaryindexitem, ['scope' => 'g']);
        }
        $dictionaryindexitems = $db->query("SELECT * FROM ".self::customitemtable);
        while ($dictionaryindexitem = $db->fetchByAssoc($dictionaryindexitems)) {
            $dictionaryindexitem['sequence'] = intval($dictionaryindexitem['sequence']);
            $indexItemsArray[] = array_merge($dictionaryindexitem, ['scope' => 'c']);;
        }

        return $indexItemsArray;
    }

    /**
     * writes the indexitems to the database
     *
     * @param indexitems
     */
    public function setDictionaryIndexItems($indexitems)
    {
        foreach ($indexitems as $indexitem) {
            SystemDeploymentCR::writeDBEntry($this->getItemDefinitonTable($indexitem['id']), $indexitem['id'], $indexitem, $indexitem['id']);
            // set the item
            $this->dictionaryIndexItems[$indexitem['id']] = $indexitem;
        }
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
        return $def['scope'] == 'c' ? self::customtable : self::table;
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
        return $def['scope'] == 'c' ? self::customitemtable : self::itemtable;
    }

    /**
     * adds an index plus items
     *
     * @param array $index
     * @param array $items
     * @return true
     * @throws \Exception
     */
    public function addIndex(array $index, array $items)
    {
        $table = $index['scope'] == 'c' ? self::customtable : self::table;
        SystemDeploymentCR::writeDBEntry($table, $index['id'], $index, $index['name'], SystemDeploymentCR::ACTION_INSERT);
        $this->dictionaryIndexes[$index['id']] = $index;

        foreach ($items as $item) {
            $table = $item['scope'] == 'c' ? self::customitemtable : self::itemtable;
            SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $index['name'], SystemDeploymentCR::ACTION_INSERT);
            $this->dictionaryIndexItems[$item['id']] = $item;
        }

        // rewrite the cache
        $this->writeCache();

        return true;
    }

    /**
     * sets the status for a given ID
     *
     * @param $id
     * @param $status
     * @return void
     */
    public function setStatus($id, $status){
        // get the def
        $def = $this->dictionaryIndexes[$id];

        // write the status update
        SystemDeploymentCR::writeDBEntry($this->getDefinitonTable($id), $id, ['status' => $status], $def['name']);

        // sets the status
        $this->dictionaryIndexes[$id]['status'] = $status;

        // rewrite the cache
        $this->writeCache();
    }


    /**
     * deletes an index with the given id
     *
     * @param $id
     * @return true
     * @throws \Exception
     */
    public function delete($id){
        // get the def
        $def = $this->dictionaryIndexes[$id];

        // get all index Items and remove them
        $items = $this->getIndexItems($id);
        foreach($items as $item){
            SystemDeploymentCR::deleteDBEntry($this->getDefinitonTable($item['id']), $item['id'], $def['name']);
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
}