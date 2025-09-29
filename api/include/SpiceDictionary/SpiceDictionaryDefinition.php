<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceBeans\SpiceModules;
use SpiceCRM\includes\SpiceDictionary\database\DBManager;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIModulesController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryDefinition
{
    public $id;

    protected $definition;

    public $name;
    public $tablename;
    public $type;

    public function __construct($id, $throwException = true)
    {
        $res = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($id);

        if (!$res) {
            if ($throwException) throw new Exception("dictionary Definition with id {$id} not found");
            return null;
        }

        $this->id = $id;
        $this->definition = (object) $res;

        // set properties
        $this->name = $this->definition->name;
        $this->tablename = $this->definition->tablename;
        $this->type = $this->definition->sysdictionary_type;
    }

    /**
     * returns all items for a defintion including items from templates
     *
     * @return array
     * @throws \Exception
     */
    public function getItems(){
        $retItems = array();
        $items = SpiceDictionaryItems::getInstance()->getItemsForDictionary($this->id);
        foreach ($items as $item){
            if($item['sysdictionary_ref_id']){
                $refItems = SpiceDictionaryItems::getInstance()->getItemsForDictionary($item['sysdictionary_ref_id']);
                $retItems = array_merge($retItems,$refItems);
            } else {
                $retItems[] = $item;
            }
        }
        return $retItems;
    }

    /**
     * repairs the dictionary Definition
     * @param bool $execute
     * @return string|null
     * @throws Exception
     * @throws \Throwable
     */
    public function repair(bool $execute = true): ?string
    {
        # no repair for dictionaries from type 'template'
        if ($this->type == 'template') return '';

        $buildFields = $this->buildDictionaryFields(false, true);

        $fields = array_filter($buildFields->fields, fn($f) => $f['source'] != 'non-db');

        try {
            $sql = DBManagerFactory::getInstance()->repairTableParams($this->tablename, $fields, $buildFields->indexes, $execute);

        } catch (\Throwable $exception) {

            $mismatch = self::getDBColumnsMismatch($this->name, $fields);

            if ($mismatch) {
                $exception = new Exception($exception->getMessage());
                $exception->setDetails([$this->name => $mismatch])->setErrorCode("columnsMismatch");
            }

            throw $exception;
        }

        // check for Audit table
        if($this->definition->audited == 1){
            $sql .= $this->repairAuditTable();
        }

        // return the sql
        return $sql;
    }

    /**
     * build dictionary fields
     * @param bool $includeFieldsWithoutId
     * @param bool $includeIndexes
     * @return object
     * @throws \Exception
     */
    public function buildDictionaryFields(bool $includeFieldsWithoutId = true, bool $includeIndexes = false): object
    {
        $items = SpiceDictionaryItems::getInstance()->getItemsForDictionary($this->id);

        usort($items, function($a, $b){ return (int) $a['sequence'] > (int)$b['sequence'];});

        [$definitions, $indexes] = $this->getItemsDefinitionsAndIndexes($items);
        $fields = [];
        $fieldsById = [];

        if ($includeFieldsWithoutId || $includeIndexes) {
            try {
                $vardefDetails = $this->loadVardefs();
            } catch (\Throwable $e) {
                $vardefDetails = null;
            }

            foreach ($vardefDetails['fields'] as $varDefField) {

                if(!$varDefField['name'] || !$varDefField['type']) continue;

                $fields[$varDefField['name']] = $varDefField;
            }
        }

        foreach ($definitions as $definition) {
            $fields[$definition->name] = (array) $definition;
            $fieldsById[$definition->sysdictionaryitem_id] = $definition;
        }

        # get relationships for this dictionary and generate the link fields
        if ($includeFieldsWithoutId) {
            $relationships = SpiceDictionaryRelationships::getInstance()->getDictionaryRelationships($this);

            foreach ($relationships as $relationship){
                $linkFields = (new SpiceDictionaryRelationship($relationship['original_id'] ?? $relationship['id']))->buildLinkFields($this->id);
                $fields = array_replace($fields, $linkFields);
            }
        }

        if ($includeIndexes) {

            $indexes = array_merge($indexes, SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id));

            $repairIndexes = [];
            foreach ($indexes as $index) {
                $repairIndexes[] = (new SpiceDictionaryIndex($index['id']))->getIndexDefinition($this->tablename);
            }

            $indexes = SpiceDictionaryIndexes::getInstance()->mergeIndexes($repairIndexes, $vardefDetails['indices'] ?: []);

        }
        return (object) ['fields' => $fields, 'fieldsById' => $fieldsById, 'indexes' => $indexes];
    }

    /**
     * repair audit table sql
     * @return string
     * @throws Exception
     * @throws \Exception
     */
    private function repairAuditTable(): string
    {
        $auditDefId = SpiceDictionaryDefinitions::getInstance()->getIdByName('audit');
        $auditDefinition = new SpiceDictionaryDefinition($auditDefId);

        $items = SpiceDictionaryItems::getInstance()->getItemsForDictionary($auditDefId);

        [$fields, $indexes] = $auditDefinition->getItemsDefinitionsAndIndexes($items);

        $fields = array_map(fn($f) => ((array) $f), $fields);

        $indexDefs = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($auditDefId);

        foreach ($indexDefs as $index) {
            $indexes[] = (new SpiceDictionaryIndex($index['id']))->getIndexDefinition($this->tablename);
        }

        return DBManagerFactory::getInstance()->repairTableParams("{$this->tablename}_audit", $fields, $indexes);
    }

    /**
     * get db columns mismatch
     * @param string $dictionaryName
     * @param array $fields
     * @return object|null
     */
    public static function getDBColumnsMismatch(string $dictionaryName, array $fields): ?object
    {
        try {
            $definition = (object) SpiceDictionary::getInstance()->getDefs($dictionaryName);
            $db = DBManagerFactory::getInstance();
        } catch (\Throwable $ex) {
            return null;
        }

        if (empty($definition->table)) return null;

        $dbColumns = $db->get_columns($definition->table);
        $result = (object) ['requiredColumnsWithNullRows' => [], 'columnsWithTruncateRows' => []];

        foreach ($fields as $field) {

            if ($field['source'] == 'non-db') continue;

            self::appendRequiredColumnWithNullValues($db, $definition->table, $field, $dbColumns, $result);

            self::appendColumnWithTruncateRows($db, $definition->table, $field, $dbColumns, $result);
        }

        return !empty($result->requiredColumnsWithNullRows) || !empty($result->columnsWithTruncateRows) ? $result : null;
    }

    /**
     * append db column with truncate rows
     * @param DBManager $db
     * @param string $table
     * @param array $field
     * @param array $dbColumns
     * @param object $result
     * @return void
     */
    private static function appendColumnWithTruncateRows(DBManager $db, string $table, array $field, array $dbColumns, object $result): void
    {
        if (empty($field['len']) || $field['len'] >= $dbColumns[$field['name']]['len']) {
            return;
        }

        $lengthSql = $db->convert($field['name'], 'length');

        try {
            $count = $db->getOne("SELECT COUNT(0) FROM $table WHERE $lengthSql > {$field['len']}");
        } catch (\Throwable $e) {
            $count = 0;
        }

        if ($count > 0) {
            $result->columnsWithTruncateRows[] = ['name' => $field['name'], 'length' => $field['len'], 'count' => $count, 'dbDefinition' => $dbColumns[$field['name']]];
        }
    }

    /**
     * append required column with null values
     * @param DBManager $db
     * @param string $table
     * @param array $field
     * @param array $dbColumns
     * @param object $result
     * @return void
     */
    private static function appendRequiredColumnWithNullValues(DBManager $db, string $table, array $field, array $dbColumns, object $result): void
    {
        if (!empty($field['default']) || ($field['required'] != 1 && $field['required'] !== true && $field['required'] !== 'true' && $field['isnull'] !== false && $field['isnull'] !== 'false')) {
            return;
        }

        try {
            $count = $db->getOne("SELECT COUNT(0) FROM $table WHERE {$field['name']} IS NULL");
        } catch (\Throwable $e) {
            $count = 0;
        }

        if ($count > 0) {
            $result->requiredColumnsWithNullRows[] = ['name' => $field['name'], 'count' => $count, 'dbDefinition' => $dbColumns[$field['name']]];
        }
    }


    /**
     * get items definitions and indexes
     * override global by custom fields and prevent field duplicates
     * @param array $items
     * @return array
     * @throws Exception
     */
    private function getItemsDefinitionsAndIndexes(array $items): array
    {
        $definitions = [];
        $indexes = [];

        # load global definitions
        foreach (array_filter($items, fn($e) => $e['scope'] == 'g') as $item) {
            # get the definitions and also potential indexes if coming from a template
            $res = (new SpiceDictionaryItem($item['id']))->activate(false);
            $definitions = array_merge($definitions, $res['definitions']);
            $indexes = array_merge($indexes, $res['indexes']);
        }

        # load custom definitions
        foreach (array_filter($items, fn($e) => $e['scope'] == 'c') as $item) {
            # get the definitions and also potential indexes if coming from a template
            $res = (new SpiceDictionaryItem($item['id']))->activate(false);

            # check if the field exits in global and override
            foreach ($res['definitions'] as $resDef) {

                $exists = false;

                foreach ($definitions as $i => $definition) {
                    if ($resDef->name != $definition->name) continue;
                    $definitions[$i] = $resDef;
                    $exists = true;
                }

                if (!$exists) {
                    $definitions[] = $resDef;
                }
            }

            $indexes = array_merge($indexes, $res['indexes']);
        }

        return [$definitions, $indexes];
    }


    /**
     * repairs the dictionary Definition
     * @param bool $relationships
     * @return string|null
     * @throws Exception
     */
    public function reshuffle($fields)
    {
        DBManagerFactory::getInstance()->reshuffleFields($this->tablename, $fields);
        // return the sql
        return true;
    }

    /**
     * load the vardefs additionally
     * @return array
     * @throws Exception
     */
    public function loadVardefs(): array
    {
        $beanName = $this->name;

        if ($this->type == 'module' && !SpiceConfig::getInstance()->installing) {

            $moduleDetails = SpiceModules::getInstance()->getModuleDetailsByDictionaryDefinitionId($this->id);

            if (!$moduleDetails) {
                throw new Exception("Could not load vardefs for module dictionary ($this->name). Check if sysmodules/syscustommodules entry exists and for sysdictionarydefinition_id to match $this->id.");
            } else {
                $beanName = $moduleDetails['bean'];
            }
        }

        return [
            'fields' => SpiceDictionaryHandler::getInstance()->dictionary[$beanName]['fields'],
            'indices' => SpiceDictionaryHandler::getInstance()->dictionary[$beanName]['indices'],
            'relationships' => SpiceDictionaryHandler::getInstance()->dictionary[$beanName]['relationships']
        ];

    }

    /**
     * not legacy
     * special treatment for territories
     * @param $module
     * @return array
     * @throws \Exception
     */
    static public function addACLTerritoryFields($module): array
    {
        $vardefs = [];

        $db = DBManagerFactory::getInstance();
        if ($db->tableExists('spiceaclterritories_modules')) {
            $row = $db->fetchOne("SELECT * FROM spiceaclterritories_modules WHERE module = '$module'");

            if ($row && !empty($row['module'])) {
                $bean = SpiceModules::getInstance()->getBeanName($row['module']);
                $vardefs = VardefManager::getTemplateForDictionary($bean->_module, $bean->_objectname, 'spiceaclterritories');
            }
        }

        return $vardefs;
    }

    /**
     * not legacy
     *
     * add acl fields to the loaded dictionary items
     * @return array
     */
    public static function addACLFields($moduleName): array
    {
        $vardefs = [];

        $loader = new SpiceUIModulesController();
        $modules = $loader->geUnfilteredModules();

        if($modules[$moduleName] && $modules[$moduleName]['acl_multipleusers'] == 1) {
            $vardefs = VardefManager::getTemplateForDictionary($moduleName, $modules[$moduleName]['bean'], 'spiceaclusers');
        }

        return $vardefs;
    }

    /**
     * returns the definition
     *
     * @return object
     */
    public function getDefinition()
    {
        return $this->definition;
    }

    /**
     * returns the module name for the definition
     *
     * @return false|int|string
     */
    public function getModuleName()
    {
        return SpiceModules::getInstance()->getModuleByDictionaryDefinitionId($this->id);
    }

    /**
     * drops the table for the definition
     *
     * @return bool|resource|void
     * @throws \Exception
     */
    public function dropTable()
    {
        // check if the drop prevention is set .. then no drop can be done by the system
        if (SpiceConfig::getInstance()->get('systemvardefs.preventdrop')) return;
        if (DBManagerFactory::getInstance()->tableExists($this->tablename)) DBManagerFactory::getInstance()->dropTable($this->tablename);
        return true;
    }

    /**
     * sets the status on the defimition
     *
     * @param $status
     * @return void
     * @throws \Exception
     */
    private function setStatus($status)
    {
        // set the status
        SpiceDictionaryDefinitions::getInstance()->setStatus($this->id, $status);
    }

    /**
     * activates a definition
     *
     * @return void
     * @throws Exception
     */
    public function activate()
    {
        // get all items and activate them without repair
        $definitions = [];
        $indexes = [];
        $items = SpiceDictionaryItems::getInstance()->getItemsForDictionary($this->id, ['i', 'd']);
        foreach ($items as $item) {
            // get the definitions and also potential indexes if coming from a template
            $res = (new SpiceDictionaryItem($item['id']))->activate(false);
            $definitions = array_merge($definitions, $res['definitions']);
            $indexes = array_merge($indexes, $res['indexes']);
        }

        // repair this item
        $repairDefinitions = [];
        foreach ($definitions as $definition) {
            if ($definition->source != 'non-db') $repairDefinitions[] = (array)$definition;
        }
        DBManagerFactory::getInstance()->repairTableParams($this->tablename, $repairDefinitions, [], true);

        // get all indexes and create them
        $indexes = array_merge($indexes, SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id, ['i', 'd']));
        foreach ($indexes as $index) {
            (new SpiceDictionaryIndex($index['id']))->activate(true, $this);
        }

        $relationships = SpiceDictionaryRelationships::getInstance()->getDictionaryRelationships($this);

        foreach ($relationships as $relationship){
            (new SpiceDictionaryRelationship($relationship['id']))->activate();
        }

        $this->setStatus('a');
    }

    /**
     * deactivate a definition
     * @return void
     */
    public function deactivate()
    {
        // get all indexes and deactivate them
        $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id);
        foreach ($indexes as $index) {
            (new SpiceDictionaryIndex($index['id']))->deactivate(false);
        }

        $relationships = SpiceDictionaryRelationships::getInstance()->getDictionaryRelationships($this);

        foreach ($relationships as $relationship){
            (new SpiceDictionaryRelationship($relationship['id']))->deactivate();
        }

        // get all active items and deactivate them
        $items = SpiceDictionaryItems::getInstance()->getItemsForDictionary($this->id);
        foreach ($items as $item) {
            (new SpiceDictionaryItem($item['id']))->deactivate();
        }

        $this->setStatus('i');
    }

    /**
     * deletes the definition and optoinally drops the table
     *
     * @param $dropTable
     * @return true
     * @throws \Exception
     */
    public function delete($dropTable = false)
    {
        // delete the indexes
        $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id, []);
        foreach ($indexes as $index) {
            (new SpiceDictionaryIndex($index['id']))->delete();
        }

        // delete the items
        $items = SpiceDictionaryItems::getInstance()->getItemsForDictionary($this->id);
        foreach ($items as $item) {
            (new SpiceDictionaryItem($item['id']))->delete(false);
        }

        // drop the table if set by the user
        if ($dropTable) $this->dropTable();

        // remoces teh records form teh definitions store
        SpiceDictionaryDefinitions::getInstance()->deleteDefinition($this->id);

        $this->unlinkSysModule();

        return true;
    }

    /**
     * unlink sys module entry
     * @return void
     * @throws \Exception
     */
    private function unlinkSysModule()
    {
        $db = DBManagerFactory::getInstance();
        $moduleId = $db->getOne("SELECT id FROM sysmodules WHERE sysdictionarydefinition_id = '$this->id'");
        $table = 'sysmodules';

        if (!$moduleId) {
            $moduleId = $db->getOne("SELECT id FROM syscustommodules WHERE sysdictionarydefinition_id = '$this->id'");
            $table = 'syscustommodules';
        }

        $db->updateQuery($table, ['id' => $moduleId], ['id' => $moduleId, 'sysdictionarydefinition_id' => '']);

        SpiceModules::getInstance()->loadModules(true);
    }

    /**
     * repair related dictionaries for a template dictionary
     * @return string
     * @throws DatabaseException|Exception
     */
    public function repairRelatedDictionaries(): string
    {
        if ($this->type != 'template') {
            throw new Exception('Dictionary is not from type template');
        }

        $table = SpiceDictionaryItems::table;
        $customTable = SpiceDictionaryItems::customTable;

        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT sysdictionarydefinition_id as id FROM $table UNION SELECT sysdictionarydefinition_id from $customTable WHERE sysdictionary_ref_id = '$this->id' AND status ='a'");
        $sql = '';

        while ($dic = $db->fetchByAssoc($query)) {

            $dic = new SpiceDictionaryDefinition($dic['id']);

            if ($dic->definition->status != 'a') continue;

            $sql .= $dic->repair();
        }

        return $sql;
    }

    /**
     * export fields as object
     * @return object
     * @throws \Exception
     */
    public function exportFields(): object
    {
        $fields = (object) [];

        $defs = SpiceDictionary::getInstance()->getDefs($this->name);
        $enumOptions = SpiceUtils::returnAppListStringsLanguage();

        foreach ($defs['fields'] as $field) {
            if ($field['type'] == 'linked') continue;
            $fields->{$field['name']} = $this->generateExportFieldProperties($field, $enumOptions);
        }

        return $fields;
    }

    /**
     * generate export field properties
     * @param array $fieldDef
     * @param array $enumOptions
     * @return object
     */
    private function generateExportFieldProperties(array $fieldDef, array $enumOptions): object
    {
        $properties = (object)[];

        if ($fieldDef['required'] == 1) {
            $properties->required = true;
        }

        if ($fieldDef['default']) {
            $properties->default = $fieldDef['default'];
        }

        if ($fieldDef['required']) {
            $properties->required = true;
        }

        $this->setExportFieldLength($fieldDef, $properties);

        switch ($fieldDef['type']) {
            case 'id':
                $properties->type = 'string';
                $properties->format = 'uuid';
                $properties->example = '2DC68DAA-E480-40B0-BBFD-836EA36ECB92';
                break;
            case 'enum':
                $properties->type = 'string';
                if ($enumOptions[$fieldDef['options']]) {
                    $properties->enum = array_keys(array_filter($enumOptions[$fieldDef['options']], fn($k) => $k != ' ', ARRAY_FILTER_USE_KEY));
                    $properties->example = $properties->enum[0];
                    $properties->description = "options description: " . join(', ', array_map(fn($k, $v) => "'$k' = '$v'", array_keys($enumOptions[$fieldDef['options']]), array_values($enumOptions[$fieldDef['options']])));
                }
           break;
            case 'datetime':
                $properties->type = 'string';
                $properties->example = '2025-02-28 23:10:60';
                $properties->description = 'Format YYYY-MM-DD HH:mm:ss';
                break;
            case 'date':
                $properties->type = 'date';
                $properties->example = '2025-02-28';
                $properties->description = 'Format YYYY-MM-DD';
                break;
            case 'bool':
                $properties->type = 'boolean';
                $properties->example = true;
                break;
            case 'int':
            case 'double':
                $properties->type = 'number';
                $properties->example = 20;
                break;
            case 'link':
                $module = SpiceModules::getInstance()->getModuleByDictionaryDefinitionId($this->id);
                $bean = BeanFactory::getBean($module);
                $relatedModule = !$bean->load_relationship($fieldDef['name']) ? null : $bean->{$fieldDef['name']}->getRelatedModuleName();
                $properties->type = 'object';
                $beanName = BeanFactory::getBean($relatedModule)->_objectname;

                $properties->properties = (object)[
                    'beans' => [
                        'type' => 'object',
                        'format' => 'dictionary' . ($beanName ? "::$beanName" : ''),
                        'example' => '{id: "12051498-a813-cd2b-9307-67508a9210b5", name: "SpiceCRM"}'
                    ],
                    'beans_relations_to_delete' => [
                        'type' => 'object',
                        'format' => 'dictionary' . ($beanName ? "::$beanName" : ''),
                        'example' => '{id: "12051498-a813-cd2b-9307-67508a9210b5", name: "SpiceCRM"}'
                    ],
                ];
                break;
            default:
                $properties->type = 'string';
        }

        return $properties;
    }

    /**
     * get export field length
     * @param array $fieldDef
     * @param object $properties
     */
    private function setExportFieldLength(array $fieldDef, object $properties): void
    {
        if ($fieldDef['len']) {
            $properties->maxLength = (int) $fieldDef['len'];
        } else {
            switch ($fieldDef['dbType'] ?? $fieldDef['dbtype']) {
                case 'varchar':
                case 'char':
                    $properties->maxLength = 255;
                    break;
                case 'text':
                    $properties->maxLength = 65535;
                    break;
                case 'tinyint':
                    $properties->maxLength = 3;
                    break;
                case 'int':
                case 'date':
                    $properties->maxLength = 10;
                    break;
                case 'datetime':
                    $properties->maxLength = 19;
                    break;
            }
        }
    }
}