<?php

namespace SpiceCRM\data\Relationships;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryField;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;
use SpiceCRM\includes\utils\SpiceUtils;

class UserRelationship extends One2MRelationship
{
    /**
     * activates the relationship
     *
     * @param SpiceDictionaryRelationship $relationship
     * @return void
     */
    public function activate(SpiceDictionaryRelationship $relationship){
        $lhsDictionaryDefinition = new SpiceDictionaryDefinition($relationship->relationship->lhs_sysdictionarydefinition_id);
        $rhsDictionaryDefinition = new SpiceDictionaryDefinition($relationship->relationship->rhs_sysdictionarydefinition_id);
        $lhsDictionaryitem = new SpiceDictionaryItem($relationship->relationship->lhs_sysdictionaryitem_id);
        $rhsDictionaryitem = new SpiceDictionaryItem($relationship->relationship->rhs_sysdictionaryitem_id);
        $lhsField = SpiceDictionaryField::getField($lhsDictionaryitem, $lhsDictionaryDefinition);
        $rhsField = SpiceDictionaryField::getField($rhsDictionaryitem, $rhsDictionaryDefinition);

        // clear current definitions
        $db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM relationships WHERE id = '{$relationship->id}'");
        $db->query("DELETE FROM sysdictionaryfields WHERE sysdictionaryrelationship_id = '{$relationship->id}'");

        // build the Defs
        $defs = [
            'id' => $relationship->id,
            'relationship_name' => $relationship->relationship->relationship_name,
            'relationship_type' => $this->type,
            'lhs_table' => $lhsDictionaryDefinition->tablename,
            'lhs_module' => $lhsDictionaryDefinition->getModuleName(),
            'lhs_key' => $lhsField->fieldname,
            'rhs_table' => $rhsDictionaryDefinition->tablename,
            'rhs_module' => $rhsDictionaryDefinition->getModuleName(),
            'rhs_key' => $rhsField->fieldname,
            'deleted' => 0
        ];

        $db->insertQuery('relationships', $defs);

        // write the rhs link
        if($relationship->relationship->rhs_linkname){
            $db->insertQuery('sysdictionaryfields', [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $rhsDictionaryDefinition->name,
                'sysdictionarytablename' => $rhsDictionaryDefinition->tablename,
                'sysdictionarytableaudited' => $rhsDictionaryDefinition->getDefinition()->audited,
                'fieldname' => $relationship->relationship->rhs_linkname,
                'fieldtype' => 'link',
                'fielddefinition' => json_encode([
                    'name' => $relationship->relationship->rhs_linkname,
                    'type' => 'link',
                    'relationship' => $relationship->relationship->relationship_name,
                    'source' => 'non-db',
                    'module' => $lhsDictionaryDefinition->getModuleName(),
                    'vname' => $relationship->relationship->rhs_linklabel
                ]),
                'sysdictionaryrelationship_id' => $relationship->id,
                'sysdictionarydefinition_id' => $rhsDictionaryDefinition->id
            ]);

            // write the rhs linked field
            if($relationship->relationship->rhs_relatename){
                $db->insertQuery('sysdictionaryfields', [
                    'id' => SpiceUtils::createGuid(),
                    'sysdictionaryname' => $rhsDictionaryDefinition->name,
                    'sysdictionarytablename' => $rhsDictionaryDefinition->tablename,
                    'sysdictionarytableaudited' => $rhsDictionaryDefinition->getDefinition()->audited,
                    'fieldname' => $relationship->relationship->rhs_relatename,
                    'fieldtype' => 'linked',
                    'fielddefinition' => json_encode([
                        'name' => $relationship->relationship->rhs_relatename,
                        'type' => 'linked',
                        'id_name' => $rhsField->fieldname,
                        'link' => $relationship->relationship->rhs_linkname,
                        'source' => 'non-db',
                        'module' => $lhsDictionaryDefinition->getModuleName(),
                        'vname' => $relationship->relationship->rhs_relatelabel
                    ]),
                    'sysdictionaryrelationship_id' => $relationship->id,
                    'sysdictionarydefinition_id' => $rhsDictionaryDefinition->id
                ]);
            }
        }
    }
}