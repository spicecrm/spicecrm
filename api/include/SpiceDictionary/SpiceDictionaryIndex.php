<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryIndex
{
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
        $this->loadIndex($indexId);
        return $this;
    }

    private function loadIndex($indexId)
    {
        $res = DBManagerFactory::getInstance()->fetchOne("SELECT id, name, sysdictionarydefinition_id, indextype, status, 'g' scope FROM sysdictionaryindexes WHERE id='{$indexId}' UNION SELECT id, name, sysdictionarydefinition_id, indextype, status, 'c' scope FROM syscustomdictionaryindexes WHERE id='{$indexId}'");

        if (!$res) {
            throw new Exception("error loading Index with ID {$indexId}");
        }

        $this->index = (object)$res;
        $this->name = $this->index->name;
        $this->indextype = $this->index->indextype;
        $this->sysdictionarydefinition_id = $this->index->sysdictionarydefinition_id;

        $this->loadIndexItems();
    }

    private function loadIndexItems()
    {
        $this->indexItems = [];
        $db = DBManagerFactory::getInstance();
        $itemsObjects = $db->query("SELECT id, sysdictionaryitem_id, sequence, sysdictionaryforeignitem_id, sysdictionaryforeigndefinition_id FROM sysdictionaryindexitems WHERE deleted = 0 AND sysdictionaryindex_id='{$this->index->id}' UNION SELECT id, sysdictionaryitem_id, sequence, sysdictionaryforeignitem_id, sysdictionaryforeigndefinition_id FROM syscustomdictionaryindexitems WHERE deleted = 0 AND sysdictionaryindex_id='{$this->index->id}'");
        while ($itemsObject = $db->fetchByAssoc($itemsObjects)) {
            $itemsObject = (object)$itemsObject;
            $itemsObject->fieldnames = (new SpiceDictionaryItem($itemsObject->sysdictionaryitem_id))->getDomainFieldNames();
            $this->indexItems[] = $itemsObject;
        }
    }

    private function getIndexFieldNames()
    {
        if (!$this->indexItems) $this->loadIndexItems();
        $fieldnames = [];
        foreach ($this->indexItems as $indexItem) {
            $fieldnames = array_merge($fieldnames, $indexItem->fieldnames);
        }
        return $fieldnames;
    }

    public function getIndexDefinition($tablename)
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
        $db = DBManagerFactory::getInstance();

        $table = $this->index->scope == 'c' ? 'syscustomdictionaryindexes' : 'sysdictionaryindexes';
        $db->query("DELETE FROM {$table} WHERE id = '{$this->index->id}'");

        $table = $this->index->scope == 'c' ? 'syscustomdictionaryindexitems' : 'sysdictionaryindexitems';
        $db->query("DELETE FROM {$table} WHERE sysdictionaryindex_id = '{$this->index->id}'");

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
        // determine the table
        $table = $this->index->scope == 'c' ? 'syscustomdictionaryindexes' : 'sysdictionaryindexes';

        // write the stazus update
        SystemDeploymentCR::writeDBEntry($table, $this->index->id, ['status' => $status], $this->name);
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

        // get the tablenam
        $tablename = $dictionaryDefinition ? $dictionaryDefinition->tablename : $indexDictionaryDefinition->tablename;

        // build the definiton
        $indexDefinition = $this->getIndexDefinition($tablename);

        // if we are not on a template create the index
        if ($create && $dictionaryDefinition->type != 'template') {
            $db = DBManagerFactory::getInstance();
            $tableIndexes = $db->get_indices($tablename);
            if (!$tableIndexes[$this->getIndexName($tablename)]) {
                $db->query($db->add_drop_constraint($tablename, $indexDefinition));
            }
        }

        if ($dictionaryDefinition->type != 'template') {
            // write the index cahed entry
            $db->insertQuery('sysdictionaryindices', [
                'id' => SpiceUtils::createGuid(),
                'sysdictionarydefinition_id' => $this->sysdictionarydefinition_id,
                'sysdictionaryname' => (new SpiceDictionaryDefinition($this->sysdictionarydefinition_id))->name,
                'indexname' => $this->name,
                'indextype' => $this->indextype,
                'indexdefinition' => json_encode($indexDefinition)
            ]);
        }

        // set the status
        if(!$dictionaryDefinition) {
            $this->setStatus('a');
        }
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
        $db->query("DELETE FROM sysdictionaryindices WHERE indexname = '{$this->name}'");

        // set the status
        if(!$dictionaryDefinition) {
            $this->setStatus('i');
        }

        return true;
    }

}