<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;

class SpiceDictionaryRelationship
{

    // the id
    protected $id;

    public $relationship;

    // data on teh relationship to be read direct
    public $name;
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
        $this->scope = $this->relationship->scope;

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