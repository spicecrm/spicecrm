<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\data\Link2;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryField;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;


/**
 * Represents a one to many relationship that is table based.
 * @api
 */
class One2MPolymorphicRelationship extends One2MBeanRelationship
{
    //Type is read in sugarbean to determine query construction
    var $type = "one-to-many-polymorph";

    /**
     * activates the relationship
     *
     * @param SpiceDictionaryRelationship $relationship
     * @return void
     */
    public function activate(SpiceDictionaryRelationship $relationship)
    {
        $db = DBManagerFactory::getInstance();

        $rhsDictionaryDefinition = new SpiceDictionaryDefinition($relationship->relationship->rhs_sysdictionarydefinition_id);
        $rhsDictionaryitem = new SpiceDictionaryItem($relationship->relationship->rhs_sysdictionaryitem_id);
        $rhsField = SpiceDictionaryField::getField($rhsDictionaryitem, $rhsDictionaryDefinition);
        $roleColumnDictionaryitem = new SpiceDictionaryItem($relationship->relationship->relationship_role_column);
        $roleColumnField = SpiceDictionaryField::getField($roleColumnDictionaryitem, $rhsDictionaryDefinition);

        // clear current definitions
        $db->query("DELETE FROM relationships WHERE id = '{$relationship->id}'");
        $db->query("DELETE FROM sysdictionaryfields WHERE sysdictionaryrelationship_id = '{$relationship->id}'");

        # add the parent name field on the child (RHS)
        $db->insertQuery('sysdictionaryfields', [
            'id' => SpiceUtils::createGuid(),
            'sysdictionaryname' => $rhsDictionaryDefinition->name,
            'sysdictionarytablename' => $rhsDictionaryDefinition->tablename,
            'sysdictionarytableaudited' => $rhsDictionaryDefinition->getDefinition()->audited,
            'fieldname' => $relationship->relationship->rhs_relatename,
            'fieldtype' => 'parent',
            'fielddefinition' => json_encode([
                'name' => $relationship->relationship->rhs_relatename,
                'type' => 'parent',
                'type_name' => $roleColumnField->fieldname,
                'id_name' => $rhsField->fieldname,
                'source' => 'non-db',
                'vname' => $relationship->relationship->rhs_relatelabel
            ]),
            'sysdictionaryrelationship_id' => $relationship->id,
            'sysdictionarydefinition_id' => $rhsDictionaryDefinition->id
        ]);

        // load all morphs and create relationships and links
        $morphs = SpiceDictionaryRelationships::getInstance()->getPolymorphs($relationship->relationship->id);
        foreach ($morphs as $morph) {
            // convert to object
            $morph = (object)$morph;

            $db->query("DELETE FROM relationships WHERE id = '$morph->id'");
            $db->query("DELETE FROM sysdictionaryfields WHERE sysdictionaryrelationship_id = '{$morph->id}'");

            $lhsDictionaryDefinition = new SpiceDictionaryDefinition($morph->lhs_sysdictionarydefinition_id);
            $lhsDictionaryitem = new SpiceDictionaryItem($morph->lhs_sysdictionaryitem_id);
            $lhsField = SpiceDictionaryField::getField($lhsDictionaryitem, $lhsDictionaryDefinition);

            $relationship_name = str_replace('{tablename}', $rhsDictionaryDefinition->tablename, $morph->relationship_name);

            # insert the relationship
            $db->insertQuery('relationships', [
                'id' => $morph->id,
                'relationship_name' => $relationship_name,
                'relationship_type' => $this->type,
                'lhs_table' => $lhsDictionaryDefinition->tablename,
                'lhs_module' => $lhsDictionaryDefinition->getModuleName(),
                'lhs_key' => $lhsField->fieldname,
                'rhs_table' => $rhsDictionaryDefinition->tablename,
                'rhs_module' => $rhsDictionaryDefinition->getModuleName(),
                'rhs_key' => $rhsField->fieldname,
                'deleted' => 0
            ]);

            # add link on the parent (LHS)
            $db->insertQuery('sysdictionaryfields', [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $lhsDictionaryDefinition->name,
                'sysdictionarytablename' => $lhsDictionaryDefinition->tablename,
                'sysdictionarytableaudited' => $lhsDictionaryDefinition->getDefinition()->audited,
                'fieldname' => $relationship->relationship->lhs_linkname,
                'fieldtype' => 'link',
                'fielddefinition' => json_encode([
                    'name' => $relationship->relationship->lhs_linkname,
                    'type' => 'link',
                    'relationship' => $relationship_name,
                    'source' => 'non-db',
                    'vname' => $relationship->relationship->lhs_linklabel
                ]),
                'sysdictionaryrelationship_id' => $morph->id,
                'sysdictionarydefinition_id' => $lhsDictionaryDefinition->id
            ]);

            # add link for the parent on the child if isset
            if (!empty($relationship->relationship->rhs_link_name)) {
                $db->insertQuery('sysdictionaryfields', [
                    'id' => SpiceUtils::createGuid(),
                    'sysdictionaryname' => $rhsDictionaryDefinition->name,
                    'sysdictionarytablename' => $rhsDictionaryDefinition->tablename,
                    'sysdictionarytableaudited' => $rhsDictionaryDefinition->getDefinition()->audited,
                    'fieldname' => $relationship->relationship->rhs_link_name,
                    'fieldtype' => 'link',
                    'fielddefinition' => json_encode([
                        'name' => $relationship->relationship->rhs_link_name,
                        'vname' => $relationship->relationship->rhs_link_label,
                        'type' => 'link',
                        'relationship' => $relationship_name,
                        'source' => 'non-db'
                    ]),
                    'sysdictionaryrelationship_id' => $morph->id,
                    'sysdictionarydefinition_id' => $rhsDictionaryDefinition->id
                ]);
            }
        }
    }

    /**
     * deactivate and remove the fields
     *
     * @param SpiceDictionaryRelationship $relationship
     * @return void
     * @throws \Exception
     */
    public function deactivate(SpiceDictionaryRelationship $relationship)
    {
        $relationshipIds = [$relationship->id];
        $morphs = SpiceDictionaryRelationships::getInstance()->getPolymorphs($relationship->relationship->id);
        foreach ($morphs as $morph) {
            $relationshipIds[] = $morph['id'];
        }

        // delete the records
        DBManagerFactory::getInstance()->query("DELETE FROM relationships WHERE id IN ('" . implode("','", $relationshipIds) . "')");
        DBManagerFactory::getInstance()->query("DELETE FROM sysdictionaryfields WHERE sysdictionaryrelationship_id IN ('" . implode("','", $relationshipIds) . "')");
    }
}
