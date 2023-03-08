<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryDomains
{

    /**
     * the main table name
     */
    const table = 'sysdomaindefinitions';

    /**
     * the custom table name
     */
    const customtable = 'syscustomdomaindefinitions';

    /**
     * the cache object name
     */
    const cachename = 'domaindefinitions';


    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    /**
     * the array with the fields
     *
     * @var array
     */
    protected $domaindefinitions;

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

    public function __construct()
    {
        $cached = SpiceCache::get(self::cachename);
        if ($cached) {
            $this->domaindefinitions = $cached;
        }

        $db = DBManagerFactory::getInstance();
        $this->domaindefinitions = [];
        $domaindefinitions = $db->query("SELECT * FROM " . self::table);
        while ($domaindefinition = $db->fetchByAssoc($domaindefinitions)) {
            $this->domaindefinitions[$domaindefinition['id']] = array_merge($domaindefinition, ['scope' => 'g']);
        }
        $domaindefinitions = $db->query("SELECT * FROM " . self::customtable);
        while ($domaindefinition = $db->fetchByAssoc($domaindefinitions)) {
            $this->domaindefinitions[$domaindefinition['id']] = array_merge($domaindefinition, ['scope' => 'c']);;
        }

        // write Cache
        $this->writeCache();
    }

    public function writeCache()
    {
        SpiceCache::set(self::cachename, $this->domaindefinitions);
    }

    public function getDomains(){
        return array_values($this->domaindefinitions);
    }

    public function getDomainById($id){
        return $this->domaindefinitions[$id];
    }

    public function addDefinition(array $definition)
    {
        //get teh table
        $table = $definition['scope'] == 'c' ? self::customtable : self::table;
        unset($definition['scope']);
        DBManagerFactory::getInstance()->insertQuery($table, $definition);

        // add to the domains
        $this->domaindefinitions[$definition['id']] = $definition;

        // write the cache
        $this->writeCache();
    }
}