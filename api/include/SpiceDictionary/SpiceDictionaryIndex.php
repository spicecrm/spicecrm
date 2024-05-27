<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryIndex
{
    protected $id;

    /**
     * the index details
     *
     * @var
     */
    protected $index;

    /**
     * the fields of the index
     *
     * @var
     */
    protected $indexItems;

    protected $name;
    protected $indextype;
    protected $sysdictionarydefinition_id;

    public function __construct($indexId)
    {
        $this->id = $indexId;
        $this->loadIndex($indexId);
        return $this;
    }

    private function loadIndex($indexId)
    {
        $this->id = $indexId;

        // $res = DBManagerFactory::getInstance()->fetchOne("SELECT id, name, sysdictionarydefinition_id, indextype, status, 'g' scope FROM sysdictionaryindexes WHERE id='{$indexId}' UNION SELECT id, name, sysdictionarydefinition_id, indextype, status, 'c' scope FROM syscustomdictionaryindexes WHERE id='{$indexId}'");
        $res = SpiceDictionaryIndexes::getInstance()->getIndex($indexId);
        if (!$res) {
            throw new Exception("error loading Index with ID {$indexId}");
        }

        $this->index = (object)$res;
        $this->name = $this->index->name;
        $this->indextype = $this->index->indextype;
        $this->sysdictionarydefinition_id = $this->index->sysdictionarydefinition_id;
        $this->indexItems = $this->loadIndexItems();
    }

    private function loadIndexItems()
    {
        $indexItems = [];
        $itemsObjects = SpiceDictionaryIndexes::getInstance()->getIndexItems($this->id);
        foreach ( $itemsObjects as $itemsObject ) {
            $itemsObject = (object)$itemsObject;
            $itemsObject->fieldnames = (new SpiceDictionaryItem($itemsObject->sysdictionaryitem_id))->getDomainFieldNames();
            $indexItems[] = $itemsObject;
        }
        return $indexItems;
    }


    private function getIndexFieldNames()
    {
        $fieldnames = [];
        foreach ($this->indexItems as $indexItem) {
            $fieldnames = array_merge($fieldnames, $indexItem->fieldnames);
        }
        return $fieldnames;
    }

    public function getIndexDefinition($tablename = null)
    {
        $def = [
            'name' => $this->getIndexName($tablename),
            'type' => $this->indextype,
            'fields' => $this->getIndexFieldNames()
        ];

        // specific handling for foreign keys
        if ($this->indextype == 'foreign') {
            $item = $this->indexItems[0];
            if ($item->sysdictionaryforeignitem_id && $item->sysdictionaryforeigndefinition_id) {
                $foreignItem = new SpiceDictionaryItem($item->sysdictionaryforeignitem_id);
                $foreignFields = $foreignItem->getDomainFieldNames();
                $def['foreignField'] = $foreignFields[0];
                $def['foreignTable'] =  (new SpiceDictionaryDefinition($item->sysdictionaryforeigndefinition_id))->tablename;
            }
        }

        return $def;
    }

    /**
     * deölete the index data
     *
     * @return true
     * @throws \Exception
     */
    public function delete()
    {
        SpiceDictionaryIndexes::getInstance()->delete($this->id);

        return true;
    }

    /**
     * sets the status on the index
     *
     * @param $status
     * @return void
     * @throws \Exception
     */
    private function setStatus($status)
    {
        SpiceDictionaryIndexes::getInstance()->setStatus($this->id, $status);
    }

    private function getIndexName($tablename){
        return str_replace('{tablename}', $tablename, $this->name);
    }

    /**
     * creates an index from teh definition
     *
     * @return string
     * @throws \Exception
     */
    public function activate($create = true, SpiceDictionaryDefinition $dictionaryDefinition = null)
    {
        // get the definition
        $indexDictionaryDefinition = new SpiceDictionaryDefinition($this->sysdictionarydefinition_id);

        // if we are not on a template create the index
        if ($create && (($dictionaryDefinition && $dictionaryDefinition->type != 'template')  || ($indexDictionaryDefinition->type != 'template' && $indexDictionaryDefinition->tablename != 'audit_template'))) {
            // get the tablenam
            $tablename = $dictionaryDefinition ? $dictionaryDefinition->tablename : $indexDictionaryDefinition->tablename;

            // build the definiton
            $indexDefinition = $this->getIndexDefinition($tablename);

            // execute the index creation
            $db = DBManagerFactory::getInstance();
            $tableIndexes = $db->get_indices($tablename);
            if (!$tableIndexes[$this->getIndexName($tablename)]) {
                $db->query($db->add_drop_constraint($tablename, $indexDefinition), true);
            }
        }

        // set the status
        $this->setStatus('a');

        return true;
    }

    /**
     * drops an index based ont eh definition
     *
     * @return string
     * @throws \Exception
     */
    public function deactivate($drop = true, SpiceDictionaryDefinition $dictionaryDefinition = null)
    {
        // get a db instance
        $db = DBManagerFactory::getInstance();

        // get the definition
        $indexDictionaryDefinition = new SpiceDictionaryDefinition($this->sysdictionarydefinition_id);

        // if we are not on a template create the index
        if ($drop && $dictionaryDefinition->type != 'template') {
            $tablename = $dictionaryDefinition ? $dictionaryDefinition->tablename : $indexDictionaryDefinition->tablename;
            $tableIndexes = $db->get_indices($tablename);
            if ($tableIndexes[$this->getIndexName($tablename)]) {
                $db->query($db->add_drop_constraint($tablename, $this->getIndexDefinition($tablename), true));
            }
        }

        // remove the entry from the index cache
        // $db->query("DELETE FROM sysdictionaryindices WHERE indexname = '{$this->name}'");

        // set the status
        if(!$dictionaryDefinition) {
            $this->setStatus('i');
        }

        return true;
    }

}