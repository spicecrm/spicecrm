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
    public function activate(){
        // get the class for the activation
        $relType = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdictionaryrelationshiptypes WHERE name='{$this->type}'");
        (new $relType['class'](null))->activate($this);

        // set the status
        $this->setStatus('a');
    }

    /**
     * deactiovates the relationship
     *
     * @return void
     * @throws \Exception
     */
    public function deactivate(){
        // get the class for the activation
        $relType = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdictionaryrelationshiptypes WHERE name='{$this->type}'");
        (new $relType['class'](null))->deactivate($this);

        // set the status
        $this->setStatus('i');

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