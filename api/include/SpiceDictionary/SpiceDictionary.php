<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionary
{
    /**
     * the main table name
     */
    const table = 'sysdictionaryfields';

    /**
     * the cache object name
     */
    const cachename = 'dictionary';

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    protected $dictionary;

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryDefinitions
     */
    static function getInstance(): SpiceDictionaryDefinitions
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
            $this->dictionary = $cached;
            return;
        }

        // get a DB
        $this->dictionary = [];
        $db = DBManagerFactory::getInstance();
        $dictionarys = $db->query("SELECT * FROM" . self::table);
        while ($dictionary = $db->fetchByAssoc($dictionarys)) {
            $this->dictionary[$dictionary['sysdictionaryname']] = $dictionary;
        }

        // writes the cache
        $this->writeCache();
    }

    private function writeCache(){
        SpiceCache::set(self::cachename, $this->dictionaryFields);
    }
}