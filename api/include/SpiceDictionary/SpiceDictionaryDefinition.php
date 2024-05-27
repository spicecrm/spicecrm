<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryDefinition
{
    public $id;

    protected $definition;

    public $name;
    public $tablename;
    public $type;

    public function __construct($id)
    {
        $this->id = $id;

        // $res = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdictionarydefinitions WHERE deleted = 0 AND id='{$id}' UNION SELECT *, 'c' scope FROM syscustomdictionarydefinitions WHERE deleted = 0 AND id='{$id}'");
        $res = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($id);
        if (!$res) {
            throw new Exception("dictionary Definition with id {$id} not found");
        }
        $this->definition = (object)$res;

        // set properties
        $this->name = $this->definition->name;
        $this->tablename = $this->definition->tablename;
        $this->type = $this->definition->sysdictionary_type;
    }

    /**
     * repairs the dictionary Definition
     * @param bool $relationships
     * @param bool $execute
     * @return string|null
     * @throws DatabaseException
     * @throws Exception
     * @throws \Throwable
     */
    public function repair(bool $relationships = true, bool $execute = true): ?string
    {
        # no repair for dictionaries from type template
        if ($this->type == 'template') return '';

        // reset the cached items
        SpiceDictionaryField::clearForDefiniton($this->id, $this->name);

        // get all items and activate them without repair
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, ['a']);
        // sort the array by sequence
        usort($items, function($a, $b){ return (int) $a['sequence'] > (int)$b['sequence'];});

        [$definitions, $indexes] = $this->getItemsDefinitionsAndIndexes($items);

        // load the vardefs
        $vardefDetails = $this->loadVardefs();

        // repair this item
        $repairDefinitions = [];
        foreach ($definitions as $definition) {
            if ($definition->source != 'non-db') $repairDefinitions[] = (array)$definition;
            foreach ($vardefDetails['fields'] as $idx => $field) {
                if ($field['name'] != $definition->name) continue;
                unset($vardefDetails['fields'][$idx]);
            }
        }

        // merge the remaining fields
        foreach ($vardefDetails['fields'] as $fieldName => $definition) {
            // write to the cached fields
            $sysDictionaryField = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $this->name,
                'sysdictionarytablename' => $this->tablename,
                'sysdictionarytableaudited' => $this->definition->audited,
                'sysdictionarydefinition_id' => $this->id,
                'fieldname' => $definition['name'],
                'fieldtype' => $definition['type'],
                'fielddefinition' => json_encode($definition)
            ];

            // insert into the cached file
            DBManagerFactory::getInstance()->insertQuery('sysdictionaryfields', $sysDictionaryField);

            // if non db add to the repair definitions
            if ($definition['source'] != 'non-db') {
                $repairDefinitions[] = $definition;
            }
        }

        // build the indexes
        // get all indexes  for the definition itself and merge them
        $indexes = array_merge($indexes, SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id, ['a']));
        // build a repair index array
        $repairIndexes = [];
        foreach ($indexes as $index) {
            $repairIndexes[] = (new SpiceDictionaryIndex($index['id']))->getIndexDefinition($this->tablename);
        }
        $repairIndexes = SpiceDictionaryIndexes::getInstance()->mergeIndexes($repairIndexes, $vardefDetails['indices'] ?: []);

        try {
            // do the reopair
            $sql = DBManagerFactory::getInstance()->repairTableParams($this->tablename, $repairDefinitions, $repairIndexes, $execute);

        } catch (\Throwable $exception) {

            $mismatch = self::getDBColumnsMismatch($this->name, $repairDefinitions);

            if ($mismatch) {
                $exception = new Exception($exception->getMessage());
                $exception->setDetails([$this->name => $mismatch])->setErrorCode("columnsMismatch");
            }

            throw $exception;
        }

        // repair the relationships
        if ($relationships) {
            SpiceDictionaryRelationships::getInstance()->repairForDctionaryDefinition($this->id);
        }

        // check for Audit table
        if($this->definition->audited == 1){
            $sql .= $this->repairAuditTable();
        }

        // return the sql
        return $sql;
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

        $items = SpiceDictionaryItems::getInstance()->getItems($auditDefId);

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
        } catch (\Throwable) {
            return null;
        }

        if (empty($definition?->table)) return null;

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
        } catch (\Throwable) {
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
        } catch (\Throwable) {
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
        switch ($this->type) {
            case 'module':
                $module = SpiceModules::getInstance()->getModuleByDictionaryDefinitionId($this->id);
                $moduleDetails = SpiceModules::getInstance()->getModuleDetails($module);

                if (!$moduleDetails) {
                   throw new Exception("Could not load vardefs for module dictionary ($this->name). Check if sysmodules/syscustommodules entry exists and for sysdictionarydefinition_id to match $this->id.");
                }

                SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetails['bean']] = [];

                SpiceDictionaryHandler::loadModuleFiles($module);

                // get the module Details and return the data
                return ['fields' => SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetails['bean']]['fields'],
                    'indices' => SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetails['bean']]['indices'],
                    'relationships' => SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetails['bean']]['relationships']];
            default:
                SpiceDictionaryHandler::getInstance()->dictionary[$this->name] = [];

                SpiceDictionaryHandler::loadMetaDataFiles();

                // get the module Details and return the data
                return ['fields' => SpiceDictionaryHandler::getInstance()->dictionary[$this->name]['fields'],
                    'indices' => SpiceDictionaryHandler::getInstance()->dictionary[$this->name]['indices'],
                    'relationships' => SpiceDictionaryHandler::getInstance()->dictionary[$this->name]['relationships']];

        }
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
     */
    public function activate()
    {
        // get all items and activate them without repair
        $definitions = [];
        $indexes = [];
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, ['i', 'd']);
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

        $relationships = SpiceDictionaryRelationships::getInstance()->getRelationships($this->id, ['i', 'd']);
        foreach ($relationships as $relationship){
            (new SpiceDictionaryRelationship($relationship['id']))->activate();
        }

        $this->setStatus('a');
    }

    /**
     * deactiovates a definition
     *
     * @param $drop
     * @return void
     */
    public function deactivate($drop = false)
    {

        // get all indexes and deactivate them
        $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id, ['a']);
        foreach ($indexes as $index) {
            (new SpiceDictionaryIndex($index['id']))->deactivate(false);
        }

        $relationships = SpiceDictionaryRelationships::getInstance()->getRelationships($this->id);
        foreach ($relationships as $relationship){
            (new SpiceDictionaryRelationship($relationship['id']))->deactivate();
        }

        // get all active items and deactivate them
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, ['a']);
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
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, []);
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
        $customTable = SpiceDictionaryItems::customtable;

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
}