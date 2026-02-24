<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class SpiceDictionaryItems
{
    /**
     * the main table name
     */
    const table = 'sysdictionaryitems';

    /**
     * the custom table name
     */
    const customTable = 'syscustomdictionaryitems';

    /**
     * the cache object name
     */
    const cacheName = 'dictionaryitems';

    /**
     * the instance for the singelton
     *
     * @var SpiceDictionaryItems|null
     */
    private static ?SpiceDictionaryItems $instance = null;
    /**
     * @var array loaded dictionary items with the id as the key
     */
    protected array $dictionaryItems = [];
    /**
     * @var array loaded dictionary items with the dictionary id as the key
     */
    protected array $dictionaryItemsByDicId = [];

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

    private function __construct(bool $load = true)
    {
        if (!$load) return;

        // check if we have a cached value
        $cached = SpiceCache::get(self::cacheName);
        if($cached) {
            $this->dictionaryItems = $cached['dictionaryItems'];
            $this->dictionaryItemsByDicId = $cached['dictionaryItemsByDicId'];
        } else {
            $this->reloadItems();
        }
    }

    private function writeCache(){
        SpiceCache::set(self::cacheName,  [
            'dictionaryItems' => $this->dictionaryItems,
            'dictionaryItemsByDicId' => $this->dictionaryItemsByDicId,
        ]);
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
     * retrieve the dictionary items from the database
     * @return array
     * @throws DatabaseException
     */
    public function retrieveItems(): array
    {
        $this->dictionaryItems = [];
        $this->dictionaryItemsByDicId = [];


        $retrieveItems = function($scope, $table) {

            $db = DBManagerFactory::getInstance();

            $queryItems = $db->query("SELECT *, '$scope' scope FROM $table");

            while($item = $db->fetchByAssoc($queryItems)){
                $this->pushItemInList($item);
            }
        };

        $retrieveItems('g', self::table);
        $retrieveItems('c', self::customTable);

        uasort($this->dictionaryItems, fn($a, $b) => $a['sequence'] > $b['sequence'] ? 1 : -1);

        return $this->dictionaryItems;
    }

    /**
     * get dictionary items
     * @param string $dictionaryId
     * @param array|null $statusFilter
     * @return array
     */
    public function getItemsForDictionary(string $dictionaryId, ?array $statusFilter = ['a']): array
    {
        $items = $this->dictionaryItemsByDicId[$dictionaryId] ?? [];
        usort($items, function($a, $b){return (int)$a['sequence'] > (int)$b['sequence'] ? 1 : -1;});
        return !$statusFilter ? $items : array_filter($items, fn($item) => in_array($item['status'], $statusFilter));
    }

    /**
     * get dictionary items
     * @param string $dictionaryId
     * @param string[] $statusFilter
     * @return array
     */
    public function getItemsForTemplateDictionary(string $dictionaryId, ?array $statusFilter = ['a']): array
    {
        $items = $this->dictionaryItemsByDicId[$dictionaryId] ?? [];
        return array_filter($items, fn($item) => (!$statusFilter || in_array($item['status'], $statusFilter)) && !empty($item['sysdictionary_ref_id']));
    }

    private function getItemTable($id){
        // get the def
        $def = $this->dictionaryItems[$id];

        // get the proper table name
        return $def['scope'] == 'c' ? self::customTable : self::table;
    }


    /**
     * sets the status for a given ID
     * @param $id
     * @param $status
     * @return void
     * @throws Exception
     */
    public function setStatus($id, $status){

        $def = $this->dictionaryItems[$id];

        $def['status'] = $status;

        $this->pushItemInList($def);

        SystemDeploymentCR::writeDBEntry($this->getItemTable($id), $id, ['id' => $id, 'status' => $status], $def['name']);

        $this->writeCache();
    }

    /**
     * reload the items from the database and reset the cache
     * then reset the items from the cache
     * @return void
     * @throws Exception
     */
    public function reloadItems(): void
    {
        $this->retrieveItems();
        $this->writeCache();
    }

    /**
     * push/update item in all list arrays
     * @param array $item
     * @return void
     */
    private function pushItemInList(array $item): void
    {
        $item['sequence'] = intval($item['sequence']);
        $item['unified_search'] = intval($item['unified_search']);
        $item['non_db'] = $item['non_db'] ? intval($item['non_db']) : 0;
        $item['exclude_from_audited'] = $item['exclude_from_audited'] ? intval($item['exclude_from_audited']) : 0;

        $this->dictionaryItems[$item['id']] = $item;

        if (!$this->dictionaryItemsByDicId[$item['sysdictionarydefinition_id']]) {
            $this->dictionaryItemsByDicId[$item['sysdictionarydefinition_id']] = [];
        }

        $this->dictionaryItemsByDicId[$item['sysdictionarydefinition_id']][] = $this->dictionaryItems[$item['id']];
    }

    /**
     * adds an item
     * @param $item
     * @return void
     * @throws Exception
     */
    public function addItem($item){
        $table = $item['scope'] == 'c' ? self::customTable : self::table;

        $this->pushItemInList($item);

        unset($item['scope']);

        SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $item['name'], SystemDeploymentCR::ACTION_INSERT);

        $this->writeCache();
    }

    /**
     * removes an item definition
     * @param $id
     * @return void
     * @throws Exception
     */
    public function deleteItem($id)
    {
        $def = $this->dictionaryItems[$id];

        SystemDeploymentCR::deleteDBEntry($this->getItemTable($id), $id, $def['name']);

        unset($this->dictionaryItems[$id]);
        unset($this->dictionaryItemsByDicId[$def['sysdictionarydefinition_id']]);

        $this->writeCache();

    }

    /**
     * update an item
     *
     * @param $item
     * @return void
     * @throws Exception
     */
    public function setItem($item)
    {
        $table = $item['scope'] == 'c' ? self::customTable : self::table;

        $this->pushItemInList($item);

        unset($item['scope']);

        SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $item['name'], SystemDeploymentCR::ACTION_UPDATE);

        $this->writeCache();
    }

    /**
     * initialize and set items from the system package for installer
     * @param array $items
     * @return void
     */
    public static function initializeFromSystemPackage(array $items)
    {
        self::$instance = new self(false);

        self::$instance->dictionaryItems = [];
        self::$instance->dictionaryItemsByDicId = [];

        foreach ($items as $item) {
            $item->scope = 'g';
            self::$instance->pushItemInList((array) $item);
        }

        self::$instance->writeCache();
    }
}