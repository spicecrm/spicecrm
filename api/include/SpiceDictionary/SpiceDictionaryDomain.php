<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
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
        $domainDefinition = DBManagerFactory::getInstance()->fetchOne("SELECT *, 'g' scope FROM sysdomaindefinitions WHERE deleted = 0 AND id='{$id}' UNION SELECT *, 'c' scope FROM syscustomdomaindefinitions WHERE deleted = 0 AND id='{$id}'");
        if(!$domainDefinition){
            throw new Exception("DomainDefinition for id {$id} no found");
        }

        // write to the object we keep on the definition
        $this->domainDefinition = (object) $domainDefinition;
    }

    public function getFields(SpiceDictionaryItem $sysdictionaryItem = null, bool $activeOnly = true){
        $fieldNames = [];
        $db = DBManagerFactory::getInstance();
        $fieldObjects = $db->query("SELECT * FROM sysdomainfields WHERE deleted = 0 AND sysdomaindefinition_id='{$this->id}' UNION SELECT * FROM syscustomdomainfields WHERE deleted = 0 AND sysdomaindefinition_id='{$this->id}'");
        while($fieldObject = $db->fetchByAssoc($fieldObjects)){
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
        $fieldObjects = $db->query("SELECT id FROM sysdomainfields WHERE deleted = 0 AND sysdomaindefinition_id='{$this->id}' UNION SELECT id FROM syscustomdomainfields WHERE deleted = 0 AND sysdomaindefinition_id='{$this->id}'");
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

            // write to the cached fields
            $sysDictionaryField = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $dictionaryDefinition->name,
                'sysdictionarytablename' => $dictionaryDefinition->tablename,
                'sysdictionarydefinition_id' => $dictionaryDefinition->id,
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
}