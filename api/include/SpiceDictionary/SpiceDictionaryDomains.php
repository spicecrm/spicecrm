<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class SpiceDictionaryDomains
{
    /**
     * the main table name
     */
    const table = 'sysdomaindefinitions';

    /**
     * the custom table name
     */
    const customTable = 'syscustomdomaindefinitions';

    /**
     * the cache object name
     */
    const cacheName = 'domaindefinitions';

    /**
     * the instance for the singelton
     *
     * @var SpiceDictionaryDomains|null
     */
    private static ?SpiceDictionaryDomains $instance = null;

    /**
     * the array with the fields
     *
     * @var array
     */
    protected array $domainDefinitions = [];

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryDomains
     */
    static function getInstance(): SpiceDictionaryDomains
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

        if ($cached) {
            $this->domainDefinitions = $cached;
        } else {
            $this->reloadItems();
        }
    }

    /**
     * retrieve domain definitions from the database
     * @return array
     * @throws Exception
     */
    public function retrieveDomains(): array
    {
        $db = DBManagerFactory::getInstance();
        $this->domainDefinitions = [];

        $scopesTables = ['g' => self::table, 'c' => self::customTable];

        foreach ($scopesTables as $scope => $table) {

            $query = $db->query("SELECT *, '$scope' as scope FROM $table");

            while ($def = $db->fetchByAssoc($query)) {
                $this->pushDefinitionInList($def);
            }
        }

        return $this->domainDefinitions;
    }

    /**
     * reload domains from the database
     * @return void
     * @throws Exception
     */
    public function reloadItems():void
    {
        $this->retrieveDomains();
        $this->writeCache();
    }

    public function writeCache()
    {
        SpiceCache::set(self::cacheName, $this->domainDefinitions);
    }

    public function getDomains(){
        return array_values($this->domainDefinitions);
    }

    public function getDomainById($id){
        return $this->domainDefinitions[$id];
    }

    /**
     * push/update definition in the list
     * @param array $definition
     * @return void
     */
    private function pushDefinitionInList(array $definition)
    {
        $this->domainDefinitions[$definition['id']] = $definition;
    }

    public function addDefinition(array $definition)
    {
        //get teh table
        $table = $definition['scope'] == 'c' ? self::customTable : self::table;

        $this->pushDefinitionInList($definition);

        unset($definition['scope']);

        DBManagerFactory::getInstance()->upsertQuery($table, ['id' => $definition['id']], $definition);

        $this->writeCache();
    }

    /**
     * initialize and set domain definitions from the system package for installer
     * @param array $definitions
     * @return void
     */
    public static function initializeFromSystemPackage(array $definitions)
    {
        self::$instance = new self(false);

        self::$instance->domainDefinitions = [];

        foreach ($definitions as $definition) {
            $definition->scope = 'g';
            self::$instance->pushDefinitionInList((array) $definition);
        }

        self::$instance->writeCache();
    }
}