<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;

class SpiceDictionaryRelationship
{

    // the id
    public $id;

    public $relationship;

    // data on teh relationship to be read direct
    public $name;
    public $type;
    public $scope;

    public function __construct($id)
    {
        $this->id = $id;

        $relationship = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdictionaryrelationships WHERE id='{$id}' UNION SELECT *, 'c' scope FROM syscustomdictionaryrelationships WHERE id='{$id}'");
        if(!$relationship){
            throw new Exception("Relationship with id {$id} not found");
        }

        // set the values
        $this->relationship = (object) $relationship;
        $this->name = $this->relationship->name;
        $this->type = $this->relationship->relationship_type;
        $this->scope = $this->relationship->scope;

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
        // get the proper table name
        $table = $this->relationship->scope == 'c' ? 'syscustomdictionaryrelationships' : 'sysdictionaryrelationships';

        // write the stazus update
        SystemDeploymentCR::writeDBEntry($table, $this->id, ['status' => $status], $this->name);
    }

    /**
     * activates the relationship
     *
     * @return void
     * @throws \Exception
     */
    public function activate($setStatus = true, $originalDefinitionId = null,  $newDefinitonId = null){
        if($originalDefinitionId && $newDefinitonId){
            // get the definition
            $definition = new SpiceDictionaryDefinition($newDefinitonId);
            // manage the names and replacements
            $this->name = str_replace('{tablename}', $definition->tablename, $this->name);
            $this->relationship->name = str_replace('{tablename}', $definition->tablename, $this->relationship->name);
            $this->relationship->relationship_name = str_replace('{tablename}', $definition->tablename, $this->relationship->relationship_name);
            $this->relationship->lhs_linkname = str_replace('{tablename}', $definition->tablename, $this->relationship->lhs_linkname);
            $this->relationship->rhs_linkname = str_replace('{tablename}', $definition->tablename, $this->relationship->rhs_linkname);

            // witch the IDs from the template
            if($this->relationship->lhs_sysdictionarydefinition_id == $originalDefinitionId)$this->relationship->lhs_sysdictionarydefinition_id = $newDefinitonId;
            if($this->relationship->rhs_sysdictionarydefinition_id == $originalDefinitionId)$this->relationship->rhs_sysdictionarydefinition_id = $newDefinitonId;

            // build a new ID
            $this->id = md5("{$originalDefinitionId}{$newDefinitonId}");
        }

        // get the class for the activation
        $relType = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdictionaryrelationshiptypes WHERE name='{$this->type}'");

        // check if left or right is a template ... if it is do not activate
        if((new SpiceDictionaryDefinition($this->relationship->lhs_sysdictionarydefinition_id))->type != 'template' && (new SpiceDictionaryDefinition($this->relationship->rhs_sysdictionarydefinition_id))->type != 'template') {
            (new $relType['class'](null))->activate($this);
        }

        // set the status
        if($setStatus) $this->setStatus('a');

        return $this;
    }

    /**
     * deactiovates the relationship
     *
     * @return void
     * @throws \Exception
     */
    public function deactivate($setStatus = true, $originalDefinitionId = null,  $newDefinitonId = null){
        // get the class for the activation
        $relType = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdictionaryrelationshiptypes WHERE name='{$this->type}'");

        if($originalDefinitionId && $newDefinitonId){
            // build a new ID
            $this->id = md5("{$originalDefinitionId}{$newDefinitonId}");
        }

        (new $relType['class'](null))->deactivate($this);

        // set the status
        if($setStatus) $this->setStatus('i');

        return $this;
    }

    /**
     * deletes a relationship
     *
     * @return null
     * @throws \Exception
     */
    public function delete()
    {
        // determine from which tabel to delete the item
        $table = $this->relationship->scope == 'c' ? 'syscustomdictionaryrelationships' : 'sysdictionaryrelationships';
        return SystemDeploymentCR::deleteDBEntry($table, $this->id, $this->name);
    }
}