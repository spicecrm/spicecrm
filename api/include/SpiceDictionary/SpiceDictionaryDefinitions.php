<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryDefinitions
{
    /**
     * the main table name
     */
    const table = 'sysdictionarydefinitions';

    /**
     * the custom table name
     */
    const customtable = 'syscustomdictionarydefinitions';

    /**
     * the cache object name
     */
    const cachename = 'dictionarydefinitions';

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

    public function __construct()
    {
        $cached = SpiceCache::get(self::cachename);
        if ($cached) {
            $this->dictionaryDefinitions = $cached;
            return;
        }

        $defArray = [];
        $defTables = [
            ['name' => self::table, 'scope' => 'g'],
            ['name' => self::customtable, 'scope' => 'c']
        ];
        $db = DBManagerFactory::getInstance();

        foreach ($defTables as $defTable) {
            $dictionarydefinitions = $db->query("SELECT * FROM {$defTable['name']}");
            while ($dictionarydefinition = $db->fetchByAssoc($dictionarydefinitions)) {
                $dictionarydefinition['scope'] = $defTable['scope'];
                $defArray[$dictionarydefinition['id']] = $dictionarydefinition;
            }
        }

        $this->dictionaryDefinitions = $defArray;

        // writes the cache
        $this->writeCache();
    }

    private function writeCache(){
        SpiceCache::set(self::cachename, $this->dictionaryDefinitions);
    }

    private function getDefinitonTable($id){
        // get the def
        $def = $this->dictionaryDefinitions[$id];

        // get the proper table name
        return $def['scope'] == 'c' ? self::customtable : self::table;
    }

    /**
     * gets a definition by Id
     *
     * @param $id
     * @return mixed
     */
    public function getDefinitionById($id){
        return $this->dictionaryDefinitions[$id];
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
        $def = $this->dictionaryDefinitions[$id];

        // write the stazus update
        SystemDeploymentCR::writeDBEntry($this->getDefinitonTable($id), $id, ['status' => $status], $def['name']);

        // sets the status
        $this->dictionaryDefinitions[$id]['status'] = $status;

        // caches the values
        $this->writeCache();
    }

    /**
     * does a generic repair or for a specific id if given
     *
     * @return void
     */
    public function repair($id, $keep = false)
    {
        $sql = (new SpiceDictionaryDefinition($id))->repair(false);
        if ($keep) {
            $_SESSION['sysdictionary']['sqls'][md5($sql)] = $sql;
        }
        return $sql;
    }

    /**
     * does a generic repair or for a specific id if given
     *
     * @return void
     */
    public function repairVardefDefinition($name, $keep = false)
    {
        // $vardefDefinitions = SpiceDictionaryVardefs::loadVardefs([$name])[$name];
        SpiceDictionaryVardefs::loadLegacyFiles();
        $vardefDefinitions = SpiceDictionaryHandler::getInstance()->dictionary[$name];
        foreach ($vardefDefinitions['fields'] as $fieldName => $definition){
            // write to the cached fields
            $sysDictionaryField = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $name,
                'sysdictionarytablename' => $vardefDefinitions['table'],
                'fieldname' => $definition['name'],
                'fieldtype' => $definition['type'],
                'fielddefinition' => json_encode($definition)
            ];

            // insert into the cached file
            DBManagerFactory::getInstance()->insertQuery('sysdictionaryfields', $sysDictionaryField);

            // if non db add to the repair definitions
            if($definition['source'] != 'non-db'){
                $repairDefinitions[] = $definition;
            }
        }

        // do the reopair
        $sql = DBManagerFactory::getInstance()->repairTableParams($vardefDefinitions['table'], $repairDefinitions, $vardefDefinitions['indices'], false);
        if ($keep) {
            $_SESSION['sysdictionary']['sqls'][md5($sql)] = $sql;
        }
        return $sql;
    }

    public function getDefinitions($status = null)
    {
        if ($status) {
            $definitions = [];
            foreach ($this->dictionaryDefinitions as $def) {
                if ($def['status'] == $status) $definitions[] = $def;
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
    public function getIdByName($name)
    {
        foreach ($this->dictionaryDefinitions as $dictionaryDefinition) {
            if ($dictionaryDefinition['name'] == $name) return $dictionaryDefinition['id'];
        }
        return null;
    }

    /**
     * adds a definition
     *
     * @param array $definition
     * @return void
     * @throws \Exception
     */
    public function addDefinition(array $definition)
    {
        //get teh table
        $table = $definition['scope'] == 'c' ? self::customtable : self::table;
        unset($definition['scope']);
        DBManagerFactory::getInstance()->insertQuery($table, $definition);

        // adds teh definition
        $this->dictionaryDefinitions[$definition['id']] = $definition;

        // writes the cache
        $this->writeCache();
    }

    /**
     * removes the definition
     *
     * @param $id
     * @return void
     * @throws \Exception
     */
    public function deleteDefinition($id)
    {
        // get the def
        $def = $this->dictionaryDefinitions[$id];
        // write the record
        SystemDeploymentCR::deleteDBEntry($this->getDefinitonTable($id), $id, $def['name']);
        // remove the definition
        unset($this->dictionaryDefinitions['id']);
        // write Cache
        $this->writeCache();

    }
}