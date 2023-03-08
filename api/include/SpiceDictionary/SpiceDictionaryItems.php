<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryItems
{

    /**
     * the main table name
     */
    const table = 'sysdictionaryitems';

    /**
     * the custom table name
     */
    const customtable = 'syscustomdictionaryitems';

    /**
     * the cache object name
     */
    const cachename = 'dictionaryitems';


    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    protected $dictionaryItems;

    private function __clone()
    {
    }



    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryItems
     */
    static function getInstance(): SpiceDictionaryItems
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
            $this->dictionaryItems = $cached;
            return;
        }

        // read the items
        $this->dictionaryItems = $this->getItems(null, []);

        // write the cache
        $this->writeCache();
    }

    private function writeCache(){
        SpiceCache::set(self::cachename,  $this->dictionaryItems);
    }

    /**
     * returns one itemid
     *
     * @param $itemId
     * @return mixed
     */
    public function getItem($itemId){
        return $this->dictionaryItems[$itemId];
    }

    /**
     * loads the items fromt eh database
     *
     * @return array
     * @throws \Exception
     */
    public function getItems($sysdictionaryDefinitionId = null, $statusFilter = ['a'], $templatesOnly = false){
        $db = DBManagerFactory::getInstance();

        // build a where filter clause
        $whereArray = [];
        // adda filter for the id
        if($sysdictionaryDefinitionId){
            $whereArray[] = "sysdictionarydefinition_id='{$sysdictionaryDefinitionId}'";
        }

        // add a filter for the status
        if(is_array($statusFilter) && count($statusFilter) > 0){
            $whereArray[] = "status IN ('".implode("','", $statusFilter)."')";
        }

        if($templatesOnly){
            $whereArray[] = "sysdictionary_ref_id IS NOT NULL";
        }

        $whereClause = count($whereArray) > 0 ? " WHERE " . implode(" AND ", $whereArray) : '';

        // build the items
        $itemArray = [];
        $dictionaryitems = $db->query("SELECT *, 'g' scope FROM sysdictionaryitems {$whereClause}");
        while($dictionaryitem = $db->fetchByAssoc($dictionaryitems)){
            $itemArray[$dictionaryitem['id']] = $this->mapDatabaseToCachedItem($dictionaryitem);
        }
        $dictionaryitems = $db->query("SELECT *, 'c' scope FROM syscustomdictionaryitems {$whereClause}");
        while($dictionaryitem = $db->fetchByAssoc($dictionaryitems)){
            $itemArray[$dictionaryitem['id']] = $this->mapDatabaseToCachedItem($dictionaryitem);
        }
        return $itemArray;
    }

    /**
     * so some minor and type mapping
     *
     * @param $dictionaryitem
     * @return mixed
     */
    private function mapDatabaseToCachedItem($dictionaryitem){
        $dictionaryitem['sequence'] = intval($dictionaryitem['sequence']);
        $dictionaryitem['deleted'] = intval($dictionaryitem['deleted']);
        $dictionaryitem['non_db'] = $dictionaryitem['non_db'] ? intval($dictionaryitem['non_db']) : 0;
        return $dictionaryitem;
    }


    private function getItemTable($id){
        // get the def
        $def = $this->dictionaryItems[$id];

        // get the proper table name
        return $def['scope'] == 'c' ? self::customtable : self::table;
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
        $def = $this->dictionaryItems[$id];

        // write the stazus update
        SystemDeploymentCR::writeDBEntry($this->getItemTable($id), $id, ['status' => $status], $def['name']);

        // sets the status
        $this->dictionaryItems[$id]['status'] = $status;

        // caches the values
        $this->writeCache();
    }

    /**
     * @return voidclears the cache
     */
    public function resetCache($rebuild = true){
        SpiceCache::clear(self::cachename);
        if($rebuild) SpiceCache::set(self::cachename, $this->getItems());
    }

    public function getDictionaryItems(){
        return array_values($this->dictionaryItems);
    }

    public function addItem($item){
        $table = $item['scope'] == 'c' ? self::customtable : self::table;
        SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $item['name'], SystemDeploymentCR::ACTION_INSERT);

        // add the item
        $this->dictionaryItems[$item['id']] = $item;

        // write teh cache
        $this->writeCache();
    }
}