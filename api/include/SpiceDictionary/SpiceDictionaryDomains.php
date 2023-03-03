<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryDomains
{
    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    public $domaindefinitions;

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
        $cached = SpiceCache::get('domaindefinitions');
        if($cached) {
            $this->domaindefinitions = $cached;
        }

        $db = DBManagerFactory::getInstance();
        $defArray = [];
        $domaindefinitions = $db->query("SELECT * FROM sysdomaindefinitions WHERE deleted = 0");
        while($domaindefinition = $db->fetchByAssoc($domaindefinitions)){
            $domaindefinition['deleted'] = intval($domaindefinition['deleted']);
            $defArray[] = array_merge($domaindefinition, ['scope' => 'g']);
        }
        $domaindefinitions = $db->query("SELECT * FROM syscustomdomaindefinitions WHERE deleted = 0");
        while($domaindefinition = $db->fetchByAssoc($domaindefinitions)){
            $domaindefinition['deleted'] = intval($domaindefinition['deleted']);
            $defArray[] = array_merge($domaindefinition, ['scope' => 'c']);;
        }

        SpiceCache::set('domaindefinitions', $defArray);

        $this->domaindefinitions = $defArray;
    }


    public function addDefinition(array $definition)
    {
        //get teh table
        $table = $definition['scope'] == 'c' ? 'syscustomdomaindefinitions' : 'sysdomaindefinitions';
        unset($definition['scope']);
        DBManagerFactory::getInstance()->insertQuery($table, $definition);
    }

    public function addField(array $definition)
    {
        //get teh table
        $table = $definition['scope'] == 'c' ? 'syscustomdomainfields' : 'sysdomainfields';
        unset($definition['scope']);
        DBManagerFactory::getInstance()->upsertQuery($table, ['id' => $definition['id']], $definition);
    }
}