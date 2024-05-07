<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\ErrorHandlers\Exception;

class SpiceDictionaryField
{

    /**
     * clear all entries for the given definition
     *
     * @param string $dictionaryDefinitionID
     * @param string $dictionaryDefinitionName
     * @param bool $relationshipFields
     * @return void
     * @throws DatabaseException
     */
    static function clearForDefiniton(string $dictionaryDefinitionID, string $dictionaryDefinitionName, bool $relationshipFields = false){

        // add if we should or shoudl not exclude items from relationships
        $addWhere = $relationshipFields ? '' : " AND sysdictionaryrelationship_id IS NULL";

        DBManagerFactory::getInstance()->query("DELETE FROM sysdictionaryfields WHERE (sysdictionaryname = '$dictionaryDefinitionName' OR sysdictionarydefinition_id='$dictionaryDefinitionID') $addWhere");
    }

    /**
     * returns one field by itemid and definitionid
     *
     * @param SpiceDictionaryItem $dictionaryItem
     * @param SpiceDictionaryDefinition $dictionaryDefinition
     * @return array|false
     * @throws \Exception
     */
    static function getField(SpiceDictionaryItem $dictionaryItem, SpiceDictionaryDefinition $dictionaryDefinition){
        $field = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdictionaryfields WHERE sysdictionarydefinition_id='{$dictionaryDefinition->id}' AND sysdictionaryitem_id='{$dictionaryItem->id}'");

        if(!$field){
            throw new Exception("dictionary field not found for item id $dictionaryItem->id. Dictionary id: $dictionaryDefinition->id");
        }

        return (object) $field;
    }

    static function getFieldDefsForDomain(SpiceDictionaryItem $dictionaryItem, SpiceDictionaryDefinition $dictionaryDefinition, string $sysdomaindefinition_id){
        $alldefinitons = [];
        $db = DBManagerFactory::getInstance();

        // get the field Definitons
        $definitions = (new SpiceDictionaryDomain($sysdomaindefinition_id))->getFieldDefinitions($dictionaryItem);

        foreach ($definitions as &$definition){
            $definition->sysdomaindefinition_id = $sysdomaindefinition_id;
            if($dictionaryItem->itemDefinition->non_db){
                $definition->source = 'non-db';
                unset($definitions->dbtype);
            }
            if($dictionaryItem->itemDefinition->required == 1) $definition->required = 1;
            if(!empty($dictionaryItem->itemDefinition->default_value) || $dictionaryItem->itemDefinition->default_value == 0) $definition->default = $dictionaryItem->itemDefinition->default_value;
            if($dictionaryItem->itemDefinition->descriptions) $definition->descriptions = $dictionaryItem->itemDefinition->descriptions;
            if($dictionaryItem->itemDefinition->label) $definition->vname = $dictionaryItem->itemDefinition->label;

            // write to the cached fields
            $sysDictionaryField = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $dictionaryDefinition->name,
                'sysdictionarytablename' => $dictionaryDefinition->tablename,
                'sysdictionarytableaudited' => $dictionaryDefinition->getDefinition()->audited,
                'sysdictionarydefinition_id' => $dictionaryItem->sysdictionarydefinition_id,
                'sysdomainfield_id' => $definition->sysdictionarydomainfield_id,
                'fieldname' => $definition->name,
                'fieldtype' => $definition->type,
                'fielddefinition' => json_encode($definition)
            ];

            // insert into the cached file
            $db->insertQuery('sysdictionaryfields', $sysDictionaryField);

            // collect the definiton entry
            $alldefinitons[] =  $definition;
        }

        return $alldefinitons;
    }
}