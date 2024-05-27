<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryItem
{
    public $id;

    public $itemDefinition;

    public $name;
    public $sysdomaindefinition_id;
    public $sysdictionarydefinition_id;
    public $sysdictionary_ref_id;

    public function __construct($id)
    {
        $this->id = $id;

        // $this->itemDefinition = (object)DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdictionaryitems WHERE deleted = 0 AND id='{$id}' UNION SELECT *, 'c' scope FROM syscustomdictionaryitems WHERE deleted = 0 AND id='{$id}'");
        $res = SpiceDictionaryItems::getInstance()->getItem($id);
        if (!$res) {
            throw new Exception("dictionary Item with id {$id} not found");
        }
        $this->itemDefinition = (object)$res;

        $this->name = $this->itemDefinition->name;
        $this->sysdomaindefinition_id = $this->itemDefinition->sysdomaindefinition_id;
        $this->sysdictionarydefinition_id = $this->itemDefinition->sysdictionarydefinition_id;
        $this->sysdictionary_ref_id = $this->itemDefinition->sysdictionary_ref_id;
    }

    /**
     * returns an array of fieldnames in the domain
     *
     * @return array
     */
    public function getDomainFieldNames()
    {
        return (new SpiceDictionaryDomain($this->sysdomaindefinition_id))->getFields($this);
    }


    /**
     * returns the tablename fopr a given item
     *
     * @return string
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public function getTableName(): string
    {
        return (new SpiceDictionaryDefinition($this->sysdictionarydefinition_id))->tablename;
    }

    /**
     * sets the status on the item
     *
     * @param $status
     * @return void
     * @throws \Exception
     */
    private function setStatus($status)
    {
        SpiceDictionaryItems::getInstance()->setStatus($this->id, $status);
    }

    /**
     * activates the item and writes the cached entry
     *
     * @return void
     */
    public function activate($repair = true)
    {
        // collect the definitions
        $definitions = [];

        // get the definition
        $dictionaryDefinition = new SpiceDictionaryDefinition($this->sysdictionarydefinition_id);

        if ($dictionaryDefinition->type != 'template' && $this->sysdomaindefinition_id) {
            $definitions = (new SpiceDictionaryDomain($this->sysdomaindefinition_id))->activateForItem($this, $dictionaryDefinition);
            if ($repair) {
                $this->repairItem($dictionaryDefinition->tablename, $definitions);
            }
        } elseif ($dictionaryDefinition->type != 'template' && $this->sysdictionary_ref_id) {
            // process the template
            $items = SpiceDictionaryItems::getInstance()->getItems($this->sysdictionary_ref_id);
            $definitions = [];
            foreach($items as $item){
                $definitions = array_merge( $definitions, (new SpiceDictionaryDomain($item['sysdomaindefinition_id']))->activateForItem(new SpiceDictionaryItem($item['id']), $dictionaryDefinition));
            }
            if ($repair) {
                $this->repairItem($dictionaryDefinition->tablename, $definitions);
            }

            // get template indexes
            $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->sysdictionary_ref_id);
            if($repair) {
                foreach ($indexes as $index) {
                    (new SpiceDictionaryIndex($index['id']))->activate(true, $dictionaryDefinition);
                }
            }

            // get the template relationships
            if($repair) {
                $relationships = SpiceDictionaryRelationships::getInstance()->getRelationships($this->sysdictionary_ref_id);
                foreach ($relationships as $relationship) {

                    // activate
                    (new SpiceDictionaryRelationship($relationship['id']))->activate(false, $this->sysdictionary_ref_id, $this->sysdictionarydefinition_id);
                }
            }
        }

        // set the status
        $this->setStatus('a');

        // return the definitions
        return ['definitions' => $definitions, 'indexes' => $indexes ?: []];
    }

    /**
     * geta all definitions
     *
     * @return void
     */
    public function getDefinitions()
    {
        // collect the definitions
        $definitions = [];

        // get the definition
        $dictionaryDefinition = new SpiceDictionaryDefinition($this->sysdictionarydefinition_id);

        if ($dictionaryDefinition->type != 'template' && $this->sysdomaindefinition_id) {
            $definitions = (new SpiceDictionaryDomain($this->sysdomaindefinition_id))->activateForItem($this, $dictionaryDefinition);

        } elseif ($dictionaryDefinition->type != 'template' && $this->sysdictionary_ref_id) {
            // process the template
            $items = SpiceDictionaryItems::getInstance()->getItems($this->sysdictionary_ref_id);
            $definitions = [];
            foreach($items as $item){
                $definitions = array_merge( $definitions, (new SpiceDictionaryDomain($item['sysdomaindefinition_id']))->activateForItem(new SpiceDictionaryItem($item['id']), $dictionaryDefinition));
            }

            // get template indexes
            $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->sysdictionary_ref_id);
        }

        // return the definitions
        return ['definitions' => $definitions, 'indexes' => $indexes ?: []];
    }

    private function repairItem($tablename, $definitions)
    {
        // get a db instance
        $db = DBManagerFactory::getInstance();

        // get teh current fields
        $currentFieldDefs = $db->get_columns($tablename);

        $addDefinitions = [];
        foreach ($definitions as $definition) {
            if ($definition->source != 'non-db' && !$currentFieldDefs[$definition->name]) $addDefinitions[] = (array)$definition;
        }

        // if we have defintions to add -> add them
        if (count($addDefinitions) > 0) {
            $db->addColumn($tablename, $addDefinitions);
        }
    }

    /**
     * activates the item and writes the cached entry
     * @return void
     */
    public function deactivate()
    {
        // get the definition
        $dictionaryDefinition = new SpiceDictionaryDefinition($this->sysdictionarydefinition_id);

        $fields = [];
        if ($dictionaryDefinition->type != 'template' && $this->sysdomaindefinition_id) {
            // get the field Definitons
            $fields = (new SpiceDictionaryDomain($this->sysdomaindefinition_id))->getFields($this);

        } elseif ($dictionaryDefinition->type != 'template' && $this->sysdictionary_ref_id) {
            // process the template
            $items = SpiceDictionaryItems::getInstance()->getItems($this->sysdictionary_ref_id);

            foreach($items as $item){
                $fields = array_merge($fields,(new SpiceDictionaryDomain($item['sysdomaindefinition_id']))->getFields(new SpiceDictionaryItem($item['id'])));
            }

            // get template indexes and deactivate them
            $indexes = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($this->sysdictionary_ref_id);
            foreach ($indexes as $index){
                (new SpiceDictionaryIndex($index['id']))->deactivate(true, $dictionaryDefinition);
            }

            $relationships = SpiceDictionaryRelationships::getInstance()->getRelationships($this->sysdictionary_ref_id);
            foreach ($relationships as $relationship){

                // activate
                (new SpiceDictionaryRelationship($relationship['id']))->deactivate(false, $this->sysdictionary_ref_id, $this->sysdictionarydefinition_id);
            }
        }

        // delete the field entries if we have any
        if(count($fields) > 0) {
            DBManagerFactory::getInstance()->query("DELETE FROM sysdictionaryfields WHERE sysdictionarydefinition_id='$this->sysdictionarydefinition_id' AND fieldname IN ('" . implode("','", $fields) . "')");
        }

        // set the status
        $this->setStatus('i');
    }

    /**
     * deletes an item
     *
     * @return null
     * @throws \Exception
     */
    public function delete($drop = true)
    {
        // get the definition
        $dictionaryDefinition = new SpiceDictionaryDefinition($this->sysdictionarydefinition_id);

        if($drop && $dictionaryDefinition->type != 'template') {
            // get the DB
            $db = DBManagerFactory::getInstance();

            // get all fields
            $fields = [];
            if ($this->sysdomaindefinition_id) {


                // get the field Definitons
                $fields = (new SpiceDictionaryDomain($this->sysdomaindefinition_id))->getFields($this);

                // get teh current fields
                $currentFieldDefs = $db->get_columns($dictionaryDefinition->tablename);

            } elseif ($this->sysdictionary_ref_id) {
                // process the template
                $items = SpiceDictionaryItems::getInstance()->getItems($this->sysdictionary_ref_id);

                foreach ($items as $item) {
                    $fields = array_merge($fields, (new SpiceDictionaryDomain($item['sysdomaindefinition_id']))->getFields(new SpiceDictionaryItem($item['id'])));
                }
            }

            // get teh current fields
            $currentFieldDefs = $db->get_columns($dictionaryDefinition->tablename);

            // determine if there are fields to be dropped
            $dropColumns = [];
            foreach ($fields as $field) {
                if ($currentFieldDefs[$field]) $dropColumns[] = $field;
            }
            // if there are columsn to be dropped .. drop them
            if (!SpiceConfig::getInstance()->get('systemvardefs.preventdrop') &&  count($dropColumns) > 0) $db->delete_columns($dictionaryDefinition->tablename, $dropColumns);

        }

        SpiceDictionaryItems::getInstance()->deleteItem($this->id);

        return true;
    }
}