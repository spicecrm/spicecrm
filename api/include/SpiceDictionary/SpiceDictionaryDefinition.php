<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceDictionaryDefinition
{
    public $id;

    protected $definition;

    public $name;
    public $tablename;
    public $type;

    public function __construct($id){
        $this->id = $id;

        $res = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdictionarydefinitions WHERE deleted = 0 AND id='{$id}' UNION SELECT *, 'c' scope FROM syscustomdictionarydefinitions WHERE deleted = 0 AND id='{$id}'");
        if (!$res) {
            throw new Exception("dictionary Definiiton with id {$id} not found");
        }
        $this->definition = (object)$res;

        // set properties
        $this->name = $this->definition->name;
        $this->tablename = $this->definition->tablename;
        $this->type = $this->definition->sysdictionary_type;
    }

    /**
     * returns the definition
     *
     * @return object
     */
    public function getDefinition(){
        return $this->definition;
    }


    /**
     * drops the table for the definition
     *
     * @return bool|resource|void
     * @throws \Exception
     */
    public function dropTable(){
        // check if the drop prevention is set .. then no drop can be done by the system
        if (SpiceConfig::getInstance()->get('systemvardefs.preventdrop')) return;
        if(DBManagerFactory::getInstance()->tableExists($this->tablename)) DBManagerFactory::getInstance()->dropTable($this->tablename);
        return true;
    }

    /**
     * sets the status on the defimition
     *
     * @param $status
     * @return void
     * @throws \Exception
     */
    private function setStatus($status){
        // get the proper table name
        $table = $this->definition->scope == 'c' ? 'syscustomdictionarydefinitions' : 'sysdictionarydefinitions';

        // write the stazus update
        SystemDeploymentCR::writeDBEntry($table, $this->id, ['status' => $status], $this->name);
    }

    /**
     * activates a definition
     *
     * @return void
     */
    public function activate(){
        // get all items and activate them without repair
        $definitions = [];
        $indexes = [];
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, ['i', 'd']);
        foreach ($items as $item){
            // get the definitions and also potential indexes if coming from a template
            $res = (new SpiceDictionaryItem($item['id']))->activate(false);
            $definitions = array_merge($definitions, $res['definitions']);
            $indexes = array_merge($indexes, $res['indexes']);
        }

        // repair this item
        $repairDefinitions = [];
        foreach($definitions as $definition){
            if($definition->source != 'non-db') $repairDefinitions[] = (array) $definition;
        }
        DBManagerFactory::getInstance()->repairTableParams($this->tablename, $repairDefinitions,[], true);

        // get all indexes and create them
        $indexes =  array_merge($indexes, SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id, ['i', 'd']));
        foreach ($indexes as $index){
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
    public function deactivate($drop = false){
        // get all active items and deactivate them
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, ['a']);
        foreach ($items as $item){
           (new SpiceDictionaryItem($item['id']))->deactivate();
        }

        // get all indexes and deactivate them
        $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id, ['a']);
        foreach ($indexes as $index){
            (new SpiceDictionaryIndex($index['id']))->deactivate(false);
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
    public function delete($dropTable = false){
        // delete the indexes
        $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->id, []);
        foreach ($indexes as $index){
            (new SpiceDictionaryIndex($index['id']))->delete();
        }

        // delete the items
        $items = SpiceDictionaryItems::getInstance()->getItems($this->id, []);
        foreach ($items as $item){
            (new SpiceDictionaryItem($item['id']))->delete(false);
        }

        // drop the table if set by the user
        if ($dropTable) $this->dropTable();

        // clean up the database
        $table = $this->definition->scope == 'c' ? 'syscustomdictionarydefinitions' : 'sysdictionarydefinitions';
        SystemDeploymentCR::deleteDBEntry($table, $this->id, $this->name);

        return true;
    }


}