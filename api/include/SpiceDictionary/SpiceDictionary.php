<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;

class SpiceDictionary
{
    /**
     * the cache object name
     */
    const cachename = 'dictionary';

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance = null;

    private function __clone(){}

    private function __wakeup(){}

    /**
     * @return SpiceDictionary
     */
    static function getInstance(): SpiceDictionary
    {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * build definition by name
     * @param string $name
     * @return array|null
     * @throws Exception
     */
    public function buildDefinitionByName(string $name): ?array
    {
        $definition = SpiceDictionaryDefinitions::getInstance()->getDefinitionByName($name);

        return !$definition ? null : $this->buildDefinition($definition);
    }

    /**
     * build definition by table name
     * @param string $tableName
     * @return array|null
     * @throws Exception
     */
    public function buildDefinitionByTableName(string $tableName): ?array
    {
        $definition = SpiceDictionaryDefinitions::getInstance()->getDefinitionByTable($tableName);

        return !$definition ? null : $this->buildDefinition($definition);
    }

    /**
     * build a definition array
     * @param array $dictionary
     * @return array
     * @throws Exception
     */
    private function buildDefinition(array $dictionary): array
    {
        $definition = $this->getFromSession('dictionary', $dictionary['name']);

        if (!$definition) {

            $definition = [
                'id' => $dictionary['sysdictionaryid'],
                'dictionaryname' => $dictionary['name'],
                'name' => $dictionary['name'],
                'table' => $dictionary['tablename'],
                'audited' => $dictionary['audited'],
                'contenttype' => $dictionary['sysdictionary_contenttype'],
                'fields' => $this->buildFieldsByDictionaryName($dictionary['name']),
            ];
            $this->writeToSessionCache('dictionary', $dictionary['name'], $definition);
        }

        return $definition;
    }

    /**
     * build dictionary fields by dictionary name
     * @param string $definitionName
     * @return array|null
     * @throws Exception
     */
    public function buildFieldsByDictionaryName(string $definitionName): ?array
    {
        $cached = $this->getFromSession('fieldsByDictionaryName', $definitionName);

        if ($cached) {
            return $cached;
        }

        $definition = SpiceDictionaryDefinitions::getInstance()->getDefinitionByName($definitionName);

        if ($definition) {
            $fieldsByDictionary = (new SpiceDictionaryDefinition($definition['id']))->buildDictionaryFields();
            $this->writeToSessionCache('fieldsByDictionaryName', $definitionName, $fieldsByDictionary->fields);
            return $fieldsByDictionary->fields;
        } else {
            return null;
        }
    }

    /**
     * build dictionary fields by table name
     * @param string $tableName
     * @return array|null
     * @throws Exception
     */
    public function buildFieldsByTable(string $tableName): ?array
    {
        $cached = $this->getFromSession('fieldsByTableName', $tableName);

        if ($cached) {
            return $cached;
        }

        $definition = SpiceDictionaryDefinitions::getInstance()->getDefinitionByTable($tableName);

        if ($definition) {
            $fieldsByDictionary = (new SpiceDictionaryDefinition($definition['id']))->buildDictionaryFields();
            $this->writeToSessionCache('fieldsByTableName', $tableName, $fieldsByDictionary->fields);
            return $fieldsByDictionary->fields;
        } else {
            return null;
        }
    }

    /**
     * get field by definition name and item id
     * @param string $definitionName
     * @param string $itemId
     * @return array|null
     * @throws Exception
     */
    public function getFieldByDefinitionNameAndItemId(string $definitionName, string $itemId): ?object
    {
        $cached = $this->getFromSession('fieldsByDefinitionNameAndItemId', $definitionName);

        if (!$cached) {
            $definition = SpiceDictionaryDefinitions::getInstance()->getDefinitionByName($definitionName);
            $cached = (new SpiceDictionaryDefinition($definition['id']))->buildDictionaryFields(false)->fieldsById;
            $this->writeToSessionCache('fieldsByDefinitionNameAndItemId', $definitionName, $cached);
        }

        return !$cached[$itemId] ? null : clone $cached[$itemId];
    }

    /**
     * get field by definition id and item id
     * @param string $definitionId
     * @param string $itemId
     * @return array|null
     * @throws Exception
     */
    public function getFieldByDefinitionIdAndItemId(string $definitionId, string $itemId): ?object
    {
        $cached = $this->getFromSession('fieldsByDefinitionIdAndItemId', $definitionId);

        if (!$cached) {
            $definition = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($definitionId);
            $cached = (new SpiceDictionaryDefinition($definition['id']))->buildDictionaryFields(false)->fieldsById;
            $this->writeToSessionCache('fieldsByDefinitionIdAndItemId', $definitionId, $cached);
        }

        return $cached[$itemId];
    }

    /**
     * gets the dictionary for the requested name
     * @param $dictionaryName
     * @return array|null
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception|Exception
     */
    public function getDefs($dictionaryName): ?array
    {
        return !$dictionaryName ? null : $this->buildDefinitionByName($dictionaryName);
    }

    /**
     * get dictionary definition by table name
     * @param string $tableName
     * @return array|null
     * @throws Exception
     */
    public function getDefsByTableName(string $tableName): ?array
    {
        return $this->buildDefinitionByTableName($tableName);
    }

    /**
     * write to session cache
     * @param string $type
     * @param string $name
     * @param array $value
     * @return void
     */
    private function writeToSessionCache(string $type, string $name, array $value): void
    {
        if (!isset($_SESSION['SpiceDictionary'])) {
            $_SESSION['SpiceDictionary'] = [];
        }

        $_SESSION['SpiceDictionary'][$type][$name] = $value;
    }

    /**
     * get from session cache
     * @param string $type
     * @param string $name
     * @return array|null
     */
    private function getFromSession(string $type, string $name): ?array
    {
        return !$_SESSION['SpiceDictionary'] ? null : $_SESSION['SpiceDictionary'][$type][$name];
    }

    /**
     * clear session cache
     * @return void
     */
    public function clearSessionCache()
    {
        unset($_SESSION['SpiceDictionary']);
    }
}