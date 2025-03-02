<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use stdClass;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;

class SpiceDictionaryDomainField
{

    /**
     * @var the id of the domain
     */
    protected $id;

    public $domainField;

    public function __construct($id){
        $this->id = $id;

        // try to load the domainfield
        // $res = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdomainfields WHERE id='{$id}' UNION SELECT *, 'c' scope  FROM syscustomdomainfields WHERE id='{$id}'");
        $res = SpiceDictionaryDomainFields::getInstance()->getDomainField($id);
        if(!$res){
            throw new Exception("Domainfield with ID {$id} is not defined");
        }

        $this->domainField = (object) $res;
    }

    public function getValidationEnumValues(){
        if($this->domainField->sysdomainfieldvalidation_id){
            return (new SpiceDictionaryDomainValidation($this->domainField->sysdomainfieldvalidation_id))->getValidationOptions();
        }
        return [];
    }

    /**
     * returns the definition as it is stored then in the end if sysdictionaryfields for the cached json values
     *
     * @param SpiceDictionaryItem|null $sysdictionaryItem
     * @return void
     */
    public function getDefinition(SpiceDictionaryItem $sysdictionaryItem = null){
        $definition = new stdClass();
        $definition->sysdictionarydomainfield_id = $this->id;
        $definition->sysdictionaryitem_id = $sysdictionaryItem->id;
        $definition->name = $sysdictionaryItem ? str_replace("{sysdictionaryitems.name}", $sysdictionaryItem->name, $this->domainField->name) : $this->domainField->name;
        if($sysdictionaryItem->itemDefinition->label && !$definition->vname) $definition->vname = $sysdictionaryItem->itemDefinition->label;
        $definition->type = $this->domainField->fieldtype ?: $this->domainField->dbtype;
        $definition->sysdomaindefinition_id = $this->domainField->sysdomaindefinition_id;
        $definition->sysdomainfieldvalidation_id = $this->domainField->sysdomainfieldvalidation_id;

        // set the defualt value
        $definition->default = $this->domainField->defaultvalue;
        if(!empty($sysdictionaryItem->itemDefinition->default_value) || $sysdictionaryItem->itemDefinition->default_value == 0) $definition->default = $sysdictionaryItem->itemDefinition->default_value;

        // add the description
        if($sysdictionaryItem->itemDefinition->descriptions) $definition->descriptions = $sysdictionaryItem->itemDefinition->descriptions;

        // handle the required setting
        switch($this->domainField->required){
            case 0:
                $definition->required = $sysdictionaryItem->itemDefinition->required == '1' ? 1 : 0;
                break;
            case 1:
                $definition->required = 1;
                break;
            case 2:
                $definition->required = 0;
                break;
        }

        // switch the non-db field
        if($this->domainField->dbtype == 'non-db') {
            $definition->source = 'non-db';
        } else {
            $definition->dbtype = $this->domainField->dbtype;
        }
        // set a label if we have one
        if($this->domainField->label) $definition->vname = $this->domainField->label;
        if($this->domainField->len) $definition->len = $this->domainField->len;

        return $definition;

    }

    /**
     * deletes a domainfield
     *
     * @return true
     * @throws \Exception
     */
    public function delete(){
        // clean up the database
        $table = $this->domainField->scope == 'c' ? 'syscustomdomainfields' : 'sysdomainfields';
        SystemDeploymentCR::deleteDBEntry($table, $this->id, $this->domainField->name);

        return true;
    }


    /**
     * sets the status on the field
     *
     * @param $status
     * @return void
     * @throws \Exception
     */
    private function setStatus($status)
    {
        // get the proper table name
        $table = $this->domainField->scope == 'c' ? 'syscustomdomainfields' : 'sysdomainfields';

        // write the stazus update
        SystemDeploymentCR::writeDBEntry($table, $this->id, ['status' => $status], $this->domainField->name);
    }

    /**
     * activates a field
     *
     * @return void
     */
    public function activate()
    {
        $this->setStatus('a');
    }

    /**
     * deactivates a field
     *
     * @return void
     */
    public function deactivate()
    {
        $this->setStatus('i');
    }
}