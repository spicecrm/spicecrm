<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryDefinitions
{
    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    protected $dictionaryDefinitions;

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

    public function __construct(){
        $cached = SpiceCache::get('dictionarydefinitions');
        if($cached) {
            $this->dictionaryDefinitions = $cached;
            return;
        }

        $defArray = [];
        $defTables = [
            ['name' => 'sysdictionarydefinitions', 'scope' => 'g'],
            ['name' => 'syscustomdictionarydefinitions', 'scope' => 'c']
        ];
        $db = DBManagerFactory::getInstance();
        $whereClause = '';

        foreach($defTables as $defTable){
            $dictionarydefinitions = $db->query("SELECT * FROM {$defTable['name']} WHERE deleted = 0".$whereClause);
            while($dictionarydefinition = $db->fetchByAssoc($dictionarydefinitions)){
                $dictionarydefinition['deleted'] = intval($dictionarydefinition['deleted']);
                $dictionarydefinition['scope'] = $defTable['scope'];
                $defArray[] = $dictionarydefinition;
            }
        }

        SpiceCache::set('dictionarydefinitions', $defArray);

        $this->dictionaryDefinitions = $defArray;
    }

    public function getDefinitions($status = null){
        if($status){
            $definitions = [];
            foreach ($this->dictionaryDefinitions as $def){
                if($def['status'] == $status) $definitions[] = $def;
            }
            return $definitions;
        } else {
            return $this->dictionaryDefinitions;
        }
    }

    /**
     * returns the name for a given id
     *
     * @param $name
     * @return mixed|void
     */
    public function getIdByName($name){
        foreach ($this->dictionaryDefinitions as $dictionaryDefinition) {
            if($dictionaryDefinition['name'] == $name) return $dictionaryDefinition['id'];
        }
        return null;
    }

    public function addDefinition(array $definition){
        //get teh table
        $table = $definition['scope'] == 'c' ? 'syscustomdictionarydefinitions' : 'sysdictionarydefinitions';
        unset($definition['scope']);
        DBManagerFactory::getInstance()->insertQuery($table, $definition);
    }

    public function deleteDefinition($definitionId, $droptaböe = false){
        // if we need to drop the table ... do it
        if($droptaböe){
            (new SpiceDictionaryDefinition($definitionId))->dropTable();
        }

        // clean up the database
        $db = DBManagerFactory::getInstance();
        $db->query("UPDATE sysdictionarydefinitions SET deleted = 0 WHERE id = '$definitionId'");
        $db->query("UPDATE syscustomdictionarydefinitions SET deleted = 0 WHERE id = '$definitionId'");


    }
}