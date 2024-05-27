<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
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

    /**
     * @throws DatabaseException
     */
    public function __construct()
    {
        $cached = SpiceCache::get(self::cachename);
        if ($cached && 1 == 2) {
            $this->dictionaryDefinitions = $cached;
            return;
        }

        $this->dictionaryDefinitions = $this->loadDefinitionsFromDB();

        // writes the cache
        $this->writeCache();
    }

    /**
     * load definitions from the database
     * @return array
     * @throws DatabaseException
     */
    private function loadDefinitionsFromDB(): array
    {
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

        return $defArray;
    }

    private function writeCache(){
        SpiceCache::set(self::cachename, $this->dictionaryDefinitions);
    }

    /**
     * reload the items from the database and reset the cache
     * then reset the items from the cache
     * @return void
     * @throws DatabaseException
     */
    public function reloadItems()
    {
        $this->dictionaryDefinitions = $this->loadDefinitionsFromDB();
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
     * @param $id
     * @param bool $keep
     * @param bool $execute
     * @return string|null
     * @throws DatabaseException
     * @throws Exception
     * @throws \Throwable
     */
    public function repair($id, $keep = false, bool $execute = true): ?string
    {
        $sql = (new SpiceDictionaryDefinition($id))->repair(false, $execute);
        if ($keep) {
            $_SESSION['sysdictionary']['sqls'][md5($sql)] = $sql;
        }
        return $sql;
    }

    /**
     * does a generic repair or for a specific id if given
     * @param $name
     * @param bool $keep
     * @return string|null
     * @throws \Exception
     */
    public function repairVardefDefinition($name, bool $keep = false): ?string
    {
        // $vardefDefinitions = SpiceDictionaryVardefs::loadVardefs([$name])[$name];
        SpiceDictionaryVardefs::loadLegacyFiles();
        $dic = SpiceDictionaryHandler::getInstance()->dictionary[$name];

        # clear the cache table for the definition before writing
        DBManagerFactory::getInstance()->deleteQuery('sysdictionaryfields', "sysdictionaryname = '$name'");

        $this->writeVardefToFieldsTable($name, $dic);
        $repairFields = array_filter($dic['fields'], fn($d) => $d['source'] != 'non-db');

        // do the repair
        $sql = DBManagerFactory::getInstance()->repairTableParams($dic['table'], $repairFields, $dic['indices'], false);
        if ($keep) {
            $_SESSION['sysdictionary']['sqls'][md5($sql)] = $sql;
        }
        return $sql;
    }

    /**
     * write vardef to fields table
     * @param string $dicName
     * @param array $dicDefinition
     * @throws \Exception
     */
    public function writeVardefToFieldsTable(string $dicName, array $dicDefinition)
    {
        foreach ($dicDefinition['fields'] as $definition){

            $sysDictionaryField = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $dicName,
                'sysdictionarytablename' => $dicDefinition['table'],
                'sysdictionarytableaudited' => $dicDefinition['audited'] ? 1 : 0,
                'fieldname' => $definition['name'],
                'fieldtype' => $definition['type'],
                'fielddefinition' => json_encode($definition)
            ];

            // insert into the cache table
            DBManagerFactory::getInstance()->insertQuery('sysdictionaryfields', $sysDictionaryField);
        }
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
        DBManagerFactory::getInstance()->upsertQuery($table, ['id' => $definition['id']], $definition);

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