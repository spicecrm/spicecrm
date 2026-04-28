<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;

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

        $relationship = SpiceDictionaryRelationships::getInstance()->getRelationshipById($id);

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
        SpiceDictionaryRelationships::getInstance()->setStatus($this->id, $status);
    }

    /**
     * activates the relationship
     *
     * @return SpiceDictionaryRelationship
     * @throws Exception
     */
    public function activate(): SpiceDictionaryRelationship
    {
        $this->setStatus('a');
        return $this;
    }

    /**
     * build link fields for dictionary
     * @param string $dictionaryId
     * @return array[]
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public function buildLinkFields(string $dictionaryId): array
    {
        $relType = SpiceDictionaryRelationships::getInstance()->getRelationshipTypeDefinition($this->type);

        return call_user_func([$relType['class'], 'buildLinkFields'], $this, $dictionaryId);
    }

    /**
     * deactiovates the relationship
     *
     * @return SpiceDictionaryRelationship
     * @throws Exception
     */
    public function deactivate(): SpiceDictionaryRelationship
    {
        $this->setStatus('i');

        return $this;
    }

    /**
     * deletes a relationship
     *
     * @return void
     * @throws \Exception
     */
    public function delete()
    {
        SpiceDictionaryRelationships::getInstance()->deleteRelationship($this->id);
    }

    /**
     * get the relationship fields for join table
     * @param string $definitionId
     * @return array
     */
    public function getRelationshipFieldsForJoinTable(string $definitionId): array
    {
        return SpiceDictionaryRelationships::getInstance()->getRelationshipFieldsForJoinTable($definitionId, $this->id);
    }
}