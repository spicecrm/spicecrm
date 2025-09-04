<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;


/**
 * Represents a one to many relationship that is table based.
 * @api
 */
class One2MPolymorphicRelationship extends One2MBeanRelationship
{
    //Type is read in sugarbean to determine query construction
    var $type = "one-to-many-polymorph";

    /**
     * build relationship definition
     * @param SpiceDictionaryRelationship $relationship
     * @return array[]
     */
    public function buildRelationshipDef(SpiceDictionaryRelationship $relationship): array
    {
        if (!$relationship->relationship->relationship_id) {
            return [];
        }

        try {
            $mainRelationship = new SpiceDictionaryRelationship($relationship->relationship->relationship_id);

            $leftDefinition = new SpiceDictionaryDefinition($mainRelationship->relationship->lhs_sysdictionarydefinition_id);
            $leftField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($leftDefinition->name, $mainRelationship->relationship->lhs_sysdictionaryitem_id);
            $rightDefinition = new SpiceDictionaryDefinition($relationship->relationship->rhs_sysdictionarydefinition_id);
            $rightField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->rhs_sysdictionaryitem_id);
        } catch (\Exception $e){
            return [];
        }

        $relationshipName = str_replace('{tablename}', $rightDefinition->tablename, $relationship->relationship->relationship_name);

        return [
            'id' => $relationship->id,
            'relationship_name' => $relationshipName,
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
     * @throws Exception|\Exception
     */
    public static function buildLinkFields(SpiceDictionaryRelationship $relationship, string $definitionId): array
    {
        $forSide = Relationship::getDefinitionSide($relationship, $definitionId);

        if ($forSide == 'lhs') {
            $mainRelationship = new SpiceDictionaryRelationship($relationship->relationship->relationship_id);
        } else {
            $mainRelationship = $relationship;
        }

        try {
            $rightDefinition = new SpiceDictionaryDefinition($mainRelationship->relationship->rhs_sysdictionarydefinition_id);
        } catch (Exception $e){
            return [];
        }

        $relationshipName = str_replace('{tablename}', $rightDefinition->tablename, $relationship->relationship->relationship_name);
        $fields = [];

        if ($forSide == 'rhs') {
            $roleField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->relationship_role_column);
            $rightField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->rhs_sysdictionaryitem_id);

            $rightParent = [
                'name' => $relationship->relationship->rhs_relatename,
                'type' => 'parent',
                'type_name' => $roleField->name,
                'id_name' => $rightField->name,
                'source' => 'non-db',
                'vname' => $relationship->relationship->rhs_relatelabel,
                'parent_modules' => SpiceDictionaryRelationships::getInstance()->getPolymorphParentModulesForRelationship($mainRelationship->id)
            ];

            $fields[$relationship->relationship->rhs_relatename] = $rightParent;

            if (!empty($relationship->relationship->rhs_link_name)) {

                $rightLink = [
                    'name' => $relationship->relationship->rhs_link_name,
                    'vname' => $relationship->relationship->rhs_link_label,
                    'type' => 'link',
                    'relationship' => $relationshipName,
                    'source' => 'non-db',
                    'duplicate_merge' => $relationship->relationship->rhs_duplicatemerge,
                    'duplicate_linked' => $relationship->relationship->rhs_duplicatelinked
                ];

                $fields[$relationship->relationship->rhs_link_name] = $rightLink;
            }

        } else {

            try {
                $leftDefinition = new SpiceDictionaryDefinition($mainRelationship->relationship->lhs_sysdictionarydefinition_id);
            } catch (Exception $e){
                return [];
            }

            $leftLink = [
                'name' => $mainRelationship->relationship->lhs_linkname,
                'type' => 'link',
                'relationship' => $relationshipName,
                'module' => $leftDefinition->getModuleName(),
                'source' => 'non-db',
                'vname' => $mainRelationship->relationship->lhs_linklabel,
                'duplicate_merge' => $mainRelationship->relationship->lhs_duplicatemerge,
                'duplicate_linked' => $mainRelationship->relationship->lhs_duplicatelinked,
                'default' => (bool) $mainRelationship->relationship->lhs_linkdefault
            ];

            $fields[$mainRelationship->relationship->lhs_linkname] = $leftLink;
        }

        return $fields;
    }
}
