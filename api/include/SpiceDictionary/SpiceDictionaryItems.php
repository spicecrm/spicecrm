<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryItems
{
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
        $cached = SpiceCache::get('dictionaryitems');
        if($cached) {
            $this->dictionaryItems = $cached;
            return;
        }

        // read the items
        $itemArray = $this->getItems();
        SpiceCache::set('dictionaryitems', $itemArray);

        $this->dictionaryItems = $itemArray;
    }

    /**
     * loads the items fromt eh database
     *
     * @return array
     * @throws \Exception
     */
    public function getItems($sysdictionaryDefiniitonId = null, $statusFilter = ['a'], $templatesOnly = false){
        $db = DBManagerFactory::getInstance();

        // build a where filter clause
        $whereArray = [];
        // adda filter for the id
        if($sysdictionaryDefiniitonId){
            $whereArray[] = "sysdictionarydefinition_id='{$sysdictionaryDefiniitonId}'";
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
            $itemArray[] = $this->mapDatabaseToCachedItem($dictionaryitem);
        }
        $dictionaryitems = $db->query("SELECT *, 'c' scope FROM syscustomdictionaryitems {$whereClause}");
        while($dictionaryitem = $db->fetchByAssoc($dictionaryitems)){
            $itemArray[] = $this->mapDatabaseToCachedItem($dictionaryitem);
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

    /**
     * @return voidclears the cache
     */
    public function resetCache($rebuild = true){
        SpiceCache::clear('dictionaryitems');
        if($rebuild) SpiceCache::set('dictionaryitems', $this->getItems());
    }

    public function getDictionaryItems(){
        return $this->dictionaryItems;
    }

    public function addItem($item){
        $table = $item['scope'] == 'c' ? 'syscustomdictionaryitems' : 'sysdictionaryitems';
        SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $item['name'], SystemDeploymentCR::ACTION_INSERT);
    }
}