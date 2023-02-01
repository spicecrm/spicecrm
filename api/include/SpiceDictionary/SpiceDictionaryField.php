<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryField
{
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