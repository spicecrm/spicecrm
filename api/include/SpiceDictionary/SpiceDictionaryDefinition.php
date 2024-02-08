<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
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
     * @return string|null
     * @throws Exception
     */
    public function repair(bool $relationships = true): ?string
    {
        // reset the cached items
        SpiceDictionaryField::clearForDefiniton($this->id);

        // get all items and activate them without repair
        $definitions = [];
        $indexes = [];
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, ['a']);
        // sort the array by sequence
        usort($items, function($a, $b){ return (int) $a['sequence'] > (int)$b['sequence'];});

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

        // load the vardefs
        $vardefDetails = $this->loadVardefs();

        // repair this item
        $repairDefinitions = [];
        foreach ($definitions as $definition) {
            if ($definition->source != 'non-db') $repairDefinitions[] = (array)$definition;
            unset($vardefDetails['fields'][$definition->name]);
        }

        // merge the remaining fields
        foreach ($vardefDetails['fields'] as $fieldName => $definition) {
            // write to the cached fields
            $sysDictionaryField = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $this->name,
                'sysdictionarytablename' => $this->tablename,
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

        // do the reopair
        $sql = DBManagerFactory::getInstance()->repairTableParams($this->tablename, $repairDefinitions, $repairIndexes, true);

        // repair the relationships
        if ($relationships) {
            SpiceDictionaryRelationships::getInstance()->repairForDctionaryDefinition($this->id);
        }

        // return the sql
        return $sql;
    }

    /**
     * load the vardefs additonally
     *
     * @return void
     */
    public function loadVardefs()
    {
        switch ($this->type) {
            case 'module':
                $module = SpiceModules::getInstance()->getModuleByDictionaryDefinitionId($this->id);

                SpiceModules::getInstance()->getModuleDetails('Accounts');
                $moduleDetaile = SpiceModules::getInstance()->getModuleDetails($module);
                SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetaile['bean']] = [];

                SpiceDictionaryHandler::loadModuleFiles($module);

                // get the module Details and return the data
                return ['fields' => SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetaile['bean']]['fields'],
                    'indices' => SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetaile['bean']]['indices'],
                    'relationships' => SpiceDictionaryHandler::getInstance()->dictionary[$moduleDetaile['bean']]['relationships']];
                break;
            default:
                SpiceDictionaryHandler::getInstance()->dictionary[$this->name] = [];

                SpiceDictionaryHandler::loadMetaDataFiles();

                // get the module Details and return the data
                return ['fields' => SpiceDictionaryHandler::getInstance()->dictionary[$this->name]['fields'],
                    'indices' => SpiceDictionaryHandler::getInstance()->dictionary[$this->name]['indices'],
                    'relationships' => SpiceDictionaryHandler::getInstance()->dictionary[$this->name]['relationships']];
                break;

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

        return true;
    }


}