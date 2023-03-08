<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryDomainFields
{


    /**
     * the main table name
     */
    const table = 'sysdomainfields';

    /**
     * the custom table name
     */
    const customtable = 'syscustomdomainfields';

    /**
     * the cache object name
     */
    const cachename = 'domainfields';

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    /**
     * the fields loaded
     *
     * @var array
     */
    protected $domainfields;

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

    public function __construct()
    {
        $cached = SpiceCache::get(self::cachename);
        if($cached) {
            $this->domainfields = $cached;
        }

        // get the dab and laod the data
        $db = DBManagerFactory::getInstance();
        $this->domainfields = [];
        $domainfields = $db->query("SELECT * FROM " . self::table);
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $this->domainfields[$domainfield['id']] = array_merge($domainfield, ['scope' => 'g']);
        }
        $domainfields = $db->query("SELECT * FROM " . self::customtable);
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $this->domainfields[$domainfield['id']] = array_merge($domainfield, ['scope' => 'c']);;
        }

        // write Cache
        $this->writeCache();
    }


    public function writeCache(){
        SpiceCache::set(self::cachename, $this->domainfields);
    }

    /**
     * gets a single domain field by ID
     *
     * @param $id
     * @return mixed
     */
    public function getDomainField($id){
        return $this->domainfields[$id];
    }

    public function getDomainFields($domainId = null){
        if($domainId){
            $filtered = [];
            foreach ($this->domainfields As $domainfield){
                if($domainfield['sysdomaindefinition_id'] == $domainId) $filtered[] = $domainfield;
            }
            return $filtered;
        }

        return array_values($this->domainfields);
    }


    public function addField(array $domainField)
    {
        //get teh table
        $table = $domainField['scope'] == 'c' ? self::customtable : self::table;
        unset($domainField['scope']);
        DBManagerFactory::getInstance()->upsertQuery($table, ['id' => $domainField['id']], $domainField);

        // add to the cached records
        $this->domainfields[$domainField['id']] = $domainField;

        // write the cache
        $this->writeCache();
    }
}