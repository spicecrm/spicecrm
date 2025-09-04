<?php

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;

class OrgUnitRelationship extends One2MBeanRelationship
{
    var $type = "orgunit";

    /**
     * build relationship definition
     * @param SpiceDictionaryRelationship $relationship
     * @return array[]
     */
    public function buildRelationshipDef(SpiceDictionaryRelationship $relationship): array
    {
        try {
            $leftDefinition = new SpiceDictionaryDefinition($relationship->relationship->lhs_sysdictionarydefinition_id);
            $leftField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($leftDefinition->name, $relationship->relationship->lhs_sysdictionaryitem_id);
            $rightDefinition = new SpiceDictionaryDefinition($relationship->relationship->rhs_sysdictionarydefinition_id);
            $rightField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->rhs_sysdictionaryitem_id);
        } catch (Exception $e){
            return [];
        }

        return [
            'id' => $relationship->id,
            'relationship_name' => $relationship->relationship->relationship_name,
            'relationship_type' => $this->type,
            'lhs_table' => $leftDefinition->tablename,
            'lhs_module' => $leftDefinition->getModuleName(),
            'lhs_key' => $leftField->name,
            'rhs_table' => $rightDefinition->tablename,
            'rhs_module' => $rightDefinition->getModuleName(),
            'rhs_key' => $rightField->name,
            'deleted' => 0
        ];
    }


    /**
     * build link fields
     * @param SpiceDictionaryRelationship $relationship
     * @param string $definitionId
     * @return array[]
     */
    public static function buildLinkFields(SpiceDictionaryRelationship $relationship, string $definitionId): array
    {
        $forSide = Relationship::getDefinitionSide($relationship, $definitionId);

        # only right side has link fields
        if ($forSide != 'rhs' || !$relationship->relationship->rhs_linkname) {
            return [];
        }

        try {
            $leftDefinition = new SpiceDictionaryDefinition($relationship->relationship->lhs_sysdictionarydefinition_id);
            $rightDefinition = new SpiceDictionaryDefinition($definitionId);
            $rightField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->rhs_sysdictionaryitem_id);
        } catch (\Exception $e) {
            return [];
        }

        $fields = [];

        $linkField = [
            'name' => $relationship->relationship->rhs_linkname,
            'type' => 'link',
            'relationship' => $relationship->relationship->relationship_name,
            'source' => 'non-db',
            'module' => $leftDefinition->getModuleName(),
            'vname' => $relationship->relationship->rhs_linklabel
        ];

        $fields[$relationship->relationship->rhs_linkname] = $linkField;

        if ($relationship->relationship->rhs_relatename) {
            $fields[$relationship->relationship->rhs_relatename] = [
                'name' => $relationship->relationship->rhs_relatename,
                'type' => 'linked',
                'rname' => 'name',
                'id_name' => $rightField->name,
                'link' => $relationship->relationship->rhs_linkname,
                'source' => 'non-db',
                'module' => $leftDefinition->getModuleName(),
                'vname' => $relationship->relationship->rhs_relatelabel
            ];
        }

        return $fields;
    }
}