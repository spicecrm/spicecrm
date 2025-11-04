<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class SpiceDictionaryDomainFields
{
    /**
     * the main table name
     */
    const table = 'sysdomainfields';

    /**
     * the custom table name
     */
    const customTable = 'syscustomdomainfields';

    /**
     * the cache object name
     */
    const cacheName = 'domainfields';

    /**
     * the instance for the singelton
     *
     * @var SpiceDictionaryDomainFields|null
     */
    private static ?SpiceDictionaryDomainFields $instance = null;

    /**
     * the fields loaded
     *
     * @var array
     */
    protected array $domainFields = [];

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryDomainFields
     */
    static function getInstance(): SpiceDictionaryDomainFields
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

        $cached = SpiceCache::get(self::cacheName);

        if($cached) {
            $this->domainFields = $cached;
        } else {
            $this->reloadItems();
        }
    }

    /**
     * retrieve domain fields from the database
     * @return array
     * @throws Exception
     */
    public function retrieveFields(): array
    {
        $db = DBManagerFactory::getInstance();
        $this->domainFields = [];

        $scopeTables = ['g' => self::table, 'c' => self::customTable];

        foreach ($scopeTables as $scope => $table) {

            $query = $db->query("SELECT *, '$scope' as scope FROM $table");

            while ($field = $db->fetchByAssoc($query)) {
                $this->pushFieldInList($field);
            }
        }

        return $this->domainFields;
    }

    /**
     * push/update a field in the list
     * @param array $field
     * @return void
     */
    private function pushFieldInList(array $field)
    {
        $this->domainFields[$field['id']] = $field;
    }

    /**
     * reload the items from the database
     * @return void
     * @throws Exception
     */
    public function reloadItems(): void 
    {
        $this->retrieveFields();
        $this->writeCache();
    }

    public function writeCache(){
        SpiceCache::set(self::cacheName, $this->domainFields);
    }

    /**
     * gets a single domain field by ID
     *
     * @param $id
     * @return mixed
     */
    public function getDomainField($id){
        return $this->domainFields[$id];
    }

    public function getDomainFields($domainId = null){
        if($domainId){
            $filtered = [];
            foreach ($this->domainFields As $domainfield){
                if($domainfield['sysdomaindefinition_id'] == $domainId) $filtered[] = $domainfield;
            }
            return $filtered;
        }

        return array_values($this->domainFields);
    }

    /**
     * add a domain field to the database and update the list
     * @param array $domainField
     * @return void
     * @throws Exception
     */
    public function addField(array $domainField)
    {
        //get teh table
        $table = $domainField['scope'] == 'c' ? self::customTable : self::table;

        $this->pushFieldInList($domainField);

        unset($domainField['scope']);

        DBManagerFactory::getInstance()->upsertQuery($table, ['id' => $domainField['id']], $domainField);

        $this->writeCache();
    }

    /**
     * initialize and set domain fields from the system package for installer
     * @param array $fields
     * @return void
     */
    public static function initializeFromSystemPackage(array $fields)
    {
        self::$instance = new self(false);

        self::$instance->domainFields = [];

        foreach ($fields as $field) {
            $field->scope = 'g';
            self::$instance->pushFieldInList((array) $field);
        }

        self::$instance->writeCache();
    }
}