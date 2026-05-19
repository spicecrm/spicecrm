<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class SpiceDictionaryDefinitions
{
    /**
     * the main table name
     */
    const table = 'sysdictionarydefinitions';

    /**
     * the custom table name
     */
    const customTable = 'syscustomdictionarydefinitions';

    /**
     * the cache object name
     */
    const cacheName = 'dictionarydefinitions';

    /**
     * the instance for the singelton
     *
     * @var SpiceDictionaryDefinitions|null
     */
    private static ?SpiceDictionaryDefinitions $instance = null;
    /**
     * @var array dictionary definitions with id as the key
     */
    protected array $dictionaryDefinitions = [];
    /**
     * @var array dictionary definitions with table as the key
     */
    protected array $dictionaryDefinitionsByTable = [];
    /**
     * @var array dictionary definitions with name as the key
     */
    protected array $dictionaryDefinitionsByName = [];

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryDefinitions
     */
    public static function getInstance(): SpiceDictionaryDefinitions
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
            $this->dictionaryDefinitions = $cached['dictionaryDefinitions'];
            $this->dictionaryDefinitionsByName = $cached['dictionaryDefinitionsByName'];
            $this->dictionaryDefinitionsByTable = $cached['dictionaryDefinitionsByTable'];
        } else {
            $this->reloadItems();
        }
    }

    /**
     * retrieve the definitions from the database
     * @return array
     * @throws DatabaseException
     */
    public function retrieveDefinitions(): array
    {
        $this->dictionaryDefinitions = [];
        $this->dictionaryDefinitionsByTable = [];
        $this->dictionaryDefinitionsByName = [];

        $defTables = [ 'g' => self::table, 'c' => self::customTable];

        $db = DBManagerFactory::getInstance();

        foreach ($defTables as $scope => $defTable) {
            $dictionarydefinitions = $db->query("SELECT *, '$scope' as scope FROM $defTable");
            while ($def = $db->fetchByAssoc($dictionarydefinitions)) {
                $this->pushDefinitionInList($def);
            }
        }

        return $this->dictionaryDefinitions;
    }

    /**
     * write cache
     * @return void
     */
    private function writeCache(): void
    {
        SpiceCache::set(self::cacheName, [
            'dictionaryDefinitions' => $this->dictionaryDefinitions,
            'dictionaryDefinitionsByName' => $this->dictionaryDefinitionsByName,
            'dictionaryDefinitionsByTable' => $this->dictionaryDefinitionsByTable,
        ]);
    }

    /**
     * reload the items from the database and reset the cache
     * then reset the items from the cache
     * @return void
     * @throws DatabaseException
     */
    public function reloadItems()
    {
        $this->retrieveDefinitions();
        $this->writeCache();
    }

    /**
     * get definition table
     * @param array $def
     * @return string
     */
    private function getDefinitionTable(array $def): string
    {
        return $def['scope'] == 'c' ? self::customTable : self::table;
    }

    /**
     * get definition by id
     * @param $id
     * @return array|null
     */
    public function getDefinitionById($id): ?array
    {
        return $this->dictionaryDefinitions[$id];
    }

    /**
     * get definition by name
     * @param $name
     * @return array|null
     */
    public function getDefinitionByName($name): ?array
    {
        return $this->dictionaryDefinitionsByName[$name];
    }

    /**
     * get definition by table
     * @param string $tableName
     * @return array|null
     */
    public function getDefinitionByTable(string $tableName): ?array
    {
        return $this->dictionaryDefinitionsByTable[$tableName];
    }

    /**
     * get all definitions
     * @return array
     */
    public function getAllDefinitions(): array
    {
        return $this->dictionaryDefinitions;
    }

    /**
     * sets the status for a given ID
     *
     * @param string $id
     * @param string $status
     * @return void
     * @throws \Exception
     */
    public function setStatus(string $id, string $status): void
    {
        $def = $this->dictionaryDefinitions[$id];

        $def['status'] = $status;

        $this->pushDefinitionInList($def);

        SystemDeploymentCR::writeDBEntry($this->getDefinitionTable($def), $id, ['status' => $status], $def['name']);

        $this->writeCache();
    }

    /**
     * push/update definition in all arrays
     * @param array $definition
     * @return void
     */
    private function pushDefinitionInList(array $definition): void
    {
        $this->dictionaryDefinitions[$definition['id']] = $definition;
        $this->dictionaryDefinitionsByName[$definition['name']] = $definition;
        $this->dictionaryDefinitionsByTable[$definition['tablename']] = $definition;
    }

    /**
     * delete definition
     * @param array $definition
     * @return void
     */
    private function deleteDefinitionFromList(array $definition): void
    {
        unset($this->dictionaryDefinitions[$definition['id']]);
        unset($this->dictionaryDefinitionsByName[$definition['name']]);
        unset($this->dictionaryDefinitionsByTable[$definition['tablename']]);

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
        $sql = (new SpiceDictionaryDefinition($id))->repair($execute);

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
        $dic = SpiceDictionaryHandler::getInstance()->dictionary[$name];

        if (!$dic) return null;

        $repairFields = $dic['fields'] ? array_filter($dic['fields'], fn($d) => $d['source'] != 'non-db') : [];

        // do the repair
        $sql = DBManagerFactory::getInstance()->repairTableParams($dic['table'], $repairFields, $dic['indices'], false);

        if ($keep) {
            $_SESSION['sysdictionary']['sqls'][md5($sql)] = $sql;
        }

        return $sql;
    }

    /**
     * @param string|null $status
     * @return array
     */
    public function getDefinitions(?string $status = null): array
    {
        if ($status) {
            return array_filter($this->dictionaryDefinitions, fn($d) => $d['status'] == $status);
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
        $table = $definition['scope'] == 'c' ? self::customTable : self::table;

        $this->pushDefinitionInList($definition);

        unset($definition['scope']);

        DBManagerFactory::getInstance()->upsertQuery($table, ['id' => $definition['id']], $definition);

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
        SystemDeploymentCR::deleteDBEntry($this->getDefinitionTable($def), $id, $def['name']);

        $this->deleteDefinitionFromList($def);
    }

    /**
     * initialize and set definitions from the system package for installer
     * @param array $definitions
     * @return void
     */
    public static function initializeFromSystemPackage(array $definitions)
    {
        self::$instance = new self(false);

        self::$instance->dictionaryDefinitions = [];
        self::$instance->dictionaryDefinitionsByTable = [];
        self::$instance->dictionaryDefinitionsByName = [];

        foreach ($definitions as $definition) {
            $definition->scope = 'g';
            self::$instance->pushDefinitionInList((array) $definition);
        }

        self::$instance->writeCache();
    }
}