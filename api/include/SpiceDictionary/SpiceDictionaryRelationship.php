<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
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

        $relationship = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdictionaryrelationships WHERE id='{$id}'");

        if (!$relationship) {
            $relationship = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'c' scope FROM syscustomdictionaryrelationships WHERE id='{$id}'");
        }

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
    public function activate($setStatus = true, $templateDefinitionId = null,  $referencingDefinitonId = null){
        if($templateDefinitionId && $referencingDefinitonId){
            // get the definition
            $definition = new SpiceDictionaryDefinition($referencingDefinitonId);
            // manage the names and replacements
            $this->name = str_replace('{tablename}', $definition->tablename, $this->name);
            $this->relationship->name = str_replace('{tablename}', $definition->tablename, $this->relationship->name);
            $this->relationship->relationship_name = str_replace('{tablename}', $definition->tablename, $this->relationship->relationship_name);
            $this->relationship->lhs_linkname = str_replace('{tablename}', $definition->tablename, $this->relationship->lhs_linkname);
            $this->relationship->lhs_linkname = str_replace('{tablename}', $definition->tablename, $this->relationship->lhs_linkname);
            $this->relationship->rhs_relatename = str_replace('{tablename}', $definition->tablename, $this->relationship->rhs_relatename);

            // witch the IDs from the template
            if($this->relationship->lhs_sysdictionarydefinition_id == $templateDefinitionId)$this->relationship->lhs_sysdictionarydefinition_id = $referencingDefinitonId;
            if($this->relationship->rhs_sysdictionarydefinition_id == $templateDefinitionId)$this->relationship->rhs_sysdictionarydefinition_id = $referencingDefinitonId;

            // build a new ID
            $this->id = md5("{$templateDefinitionId}{$referencingDefinitonId}{$this->relationship->id}");
        }

        // get the class for the activation
        $relType = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdictionaryrelationshiptypes WHERE name='{$this->type}'");

        // check if left or right is a template ... if it is do not activate
        if((!$this->relationship->lhs_sysdictionarydefinition_id || (new SpiceDictionaryDefinition($this->relationship->lhs_sysdictionarydefinition_id))->type != 'template') && (!$this->relationship->rhs_sysdictionarydefinition_id || (new SpiceDictionaryDefinition($this->relationship->rhs_sysdictionarydefinition_id))->type != 'template')) {
            (new $relType['class']((array) $this->relationship))->activate($this);
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
        $this->deleteJoinTableFields();
        return SystemDeploymentCR::deleteDBEntry($table, $this->id, $this->name);
    }

    /**
     * delete join table fields
     * @return void
     * @throws \Exception
     */
    private function deleteJoinTableFields(): void
    {
        $db = DBManagerFactory::getInstance();

        $table = $this->relationship->scope == 'c' ? 'syscustomdictionaryrelationshipfields' : 'sysdictionaryrelationshipfields';
        $query = $db->query("SELECT id, map_to_fieldname FROM $table WHERE sysdictionaryrelationship_id = '$this->id'");

        while ($field = $db->fetchByAssoc($query)) {
            SystemDeploymentCR::deleteDBEntry($table, $field['id'], $this->name . "/{$field['map_to_fieldname']}");
        }
    }

    /**
     * get join table fields
     * @param string $definitionId
     * @return array | boolean
     * @throws DatabaseException|\Exception
     */
    public function getJoinTableFields(string $definitionId): bool|array
    {
        $db = DBManagerFactory::getInstance();
        $table = $this->relationship->scope == 'c' ? 'syscustomdictionaryrelationshipfields' : 'sysdictionaryrelationshipfields';

        $query = "SELECT * FROM $table WHERE sysdictionarydefinition_id = '$definitionId' AND sysdictionaryrelationship_id = '$this->id' and deleted != 1";

        $joinFields = $db->fetchAll($query);

        return $joinFields;
    }
}