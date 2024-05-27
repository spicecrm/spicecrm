<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryDomain
{

    /**
     * @var the id of the domain
     */
    protected $id;

    protected $domainDefinition;

    public function __construct($id){
        $this->id = $id;

        // see if we can load the definition
        //$domainDefinition = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdomaindefinitions WHERE deleted = 0 AND id='{$id}' UNION SELECT *, 'c' scope FROM syscustomdomaindefinitions WHERE deleted = 0 AND id='{$id}'");
        $domainDefinition = SpiceDictionaryDomains::getInstance()->getDomainById($id);
        if(!$domainDefinition){
            throw new Exception("DomainDefinition for id {$id} no found");
        }

        // write to the object we keep on the definition
        $this->domainDefinition = (object) $domainDefinition;
    }

    public function getFields(SpiceDictionaryItem $sysdictionaryItem = null, bool $activeOnly = true){
        $fieldNames = [];
        $fieldObjects = SpiceDictionaryDomainFields::getInstance()->getDomainFields($this->id);
        foreach($fieldObjects as $fieldObject){
            $fieldObject = (object) $fieldObject;
            $fieldObject->name = str_replace("{sysdictionaryitems.name}", $sysdictionaryItem->name, $fieldObject->name);
            $fieldNames[] = $fieldObject->name;
        }
        return $fieldNames;
    }

    /**
     * returns an array of fielddefinitions
     *
     * @param SpiceDictionaryItem|null $sysdictionaryItem
     * @param bool $activeOnly
     * @return array
     * @throws Exception
     */
    public function getFieldDefinitions(SpiceDictionaryItem $sysdictionaryItem = null, bool $activeOnly = true){
        $fieldDefinitions = [];
        $db = DBManagerFactory::getInstance();
        $fieldObjects = $db->query("SELECT id FROM sysdomainfields WHERE sysdomaindefinition_id='{$this->id}' UNION SELECT id FROM syscustomdomainfields WHERE sysdomaindefinition_id='{$this->id}'");
        while($fieldObject = $db->fetchByAssoc($fieldObjects)){
            $fieldDefinitions[] = (new SpiceDictionaryDomainField($fieldObject['id']))->getDefinition($sysdictionaryItem);
        }
        return $fieldDefinitions;
    }

    /**
     *
     * writes the cahced fielddefs
     *
     * @param SpiceDictionaryItem $dictionaryitem
     * @param SpiceDictionaryDefinition $dictionaryDefinition
     * @return array
     * @throws Exception
     */
    public function activateForItem(SpiceDictionaryItem $dictionaryitem, SpiceDictionaryDefinition $dictionaryDefinition){
        $alldefinitons = [];

        // get the field Definitons
        $definitions = $this->getFieldDefinitions($dictionaryitem);

        foreach ($definitions as &$definition){
            $definition->sysdomaindefinition_id = $dictionaryitem->item->sysdomaindefinition_id;
            if($dictionaryitem->itemDefinition->non_db){
                $definition->source = 'non-db';
                unset($definitions->dbtype);
            }
            if($dictionaryitem->itemDefinition->required == 1) $definition->required = 1;
            if(!empty($dictionaryitem->itemDefinition->default_value) || $dictionaryitem->itemDefinition->default_value == 0) $definition->default = $dictionaryitem->itemDefinition->default_value;
            if($dictionaryitem->itemDefinition->descriptions) $definition->descriptions = $dictionaryitem->itemDefinition->descriptions;
            if($dictionaryitem->itemDefinition->label) $definition->vname = $dictionaryitem->itemDefinition->label;

            // backward compatibility to push options as well
            if($definition->sysdomainfieldvalidation_id) {
                $validation = new SpiceDictionaryDomainValidation($definition->sysdomainfieldvalidation_id);
                if($validation->domainvalidation->validation_type == 'options') $definition->options = $validation->domainvalidation->name;
            }

            // write to the cached fields
            $sysDictionaryField = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $dictionaryDefinition->name,
                'sysdictionarytablename' => $dictionaryDefinition->tablename,
                'sysdictionarytableaudited' => $dictionaryDefinition->getDefinition()->audited,
                'sysdictionarydefinition_id' => $dictionaryDefinition->id,
                'sysdictionaryitem_id' => $dictionaryitem->id,
                'sysdomainfield_id' => $definition->sysdictionarydomainfield_id,
                'fieldname' => $definition->name,
                'fieldtype' => $definition->type,
                'fielddefinition' => json_encode($definition)
            ];

            // insert into the cached file
            DBManagerFactory::getInstance()->insertQuery('sysdictionaryfields', $sysDictionaryField);

            // collect the definiton entry
            $alldefinitons[] = $definition;
        }

        return $alldefinitons;
    }

    /**
     * returns the definition
     *
     * @return object
     */
    public function getDefinition()
    {
        return $this->domainDefinition;
    }


    /**
     * deletes the definition
     *
     * @param $dropTable
     * @return true
     * @throws \Exception
     */
    public function delete($dropTable = false)
    {
        // get the definitions and delete them
        $definitions = $this->getFieldDefinitions();
        foreach ($definitions as $definition) (new SpiceDictionaryDomainField($definition->sysdictionarydomainfield_id))->activate();

        // clean up the database
        $table = $this->domainDefinition->scope == 'c' ? 'syscustomdomaindefinitions' : 'sysdomaindefinitions';
        SystemDeploymentCR::deleteDBEntry($table, $this->id, $this->domainDefinition->name);

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
        $table = $this->domainDefinition->scope == 'c' ? 'syscustomdomaindefinitions' : 'sysdomaindefinitions';

        // write the stazus update
        SystemDeploymentCR::writeDBEntry($table, $this->id, ['status' => $status], $this->domainDefinition->name);
    }

    /**
     * activates a field
     *
     * @return void
     */
    public function activate()
    {
        // get the definitions and delete them
        $definitions = $this->getFieldDefinitions();
        foreach ($definitions as $definition) (new SpiceDictionaryDomainField($definition->sysdictionarydomainfield_id))->activate();

        $this->setStatus('a');
    }

    /**
     * deactivates a field
     *
     * @return void
     */
    public function deactivate()
    {
        // get the definitions and delete them
        $definitions = $this->getFieldDefinitions();
        foreach ($definitions as $definition) (new SpiceDictionaryDomainField($definition->sysdictionarydomainfield_id))->deactivate();

        $this->setStatus('i');
    }

    /**
     * repair related dictionary items
     * @throws Exception
     * @throws DatabaseException | \Exception
     */
    public function repairRelatedDictionaryItems(): void
    {
        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT id FROM sysdictionaryitems WHERE sysdomaindefinition_id = '$this->id'");

        while ($relatedItem = $db->fetchByAssoc($query)) {
            $item = new SpiceDictionaryItem($relatedItem['id']);
            $item->deactivate();
            $item->activate();
        }
    }
}