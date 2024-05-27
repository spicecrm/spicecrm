<?php
/*********************************************************************************
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 * 
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 ********************************************************************************/


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

        // add the parent link field on the LHS Module
        $db->insertQuery('sysdictionaryfields', [
            'id' => SpiceUtils::createGuid(),
            'sysdictionaryname' => $rhsDictionaryDefinition->name,
            'sysdictionarytablename' => $rhsDictionaryDefinition->tablename,
            'sysdictionarytableaudited' => $rhsDictionaryDefinition->getDefinition()->audited,
            'fieldname' => $relationship->relationship->rhs_linkname,
            'fieldtype' => 'parent',
            'fielddefinition' => json_encode([
                'name' => $relationship->relationship->rhs_linkname,
                'type' => 'parent',
                'type_name' => $roleColumnField->fieldname,
                'id_name' => $rhsField->fieldname,
                'source' => 'non-db',
                'vname' => $relationship->relationship->rhs_linklabel
            ]),
            'sysdictionaryrelationship_id' => $relationship->id,
            'sysdictionarydefinition_id' => $rhsDictionaryDefinition->id
        ]);

        // load all morphs and create relationships and links
        $morphs = SpiceDictionaryRelationships::getInstance()->getPolymorphs($relationship->relationship->id);
        foreach ($morphs as $morph) {
            // convert to object
            $morph = (object)$morph;

            $lhsDictionaryDefinition = new SpiceDictionaryDefinition($morph->lhs_sysdictionarydefinition_id);
            $lhsDictionaryitem = new SpiceDictionaryItem($morph->lhs_sysdictionaryitem_id);
            $lhsField = SpiceDictionaryField::getField($lhsDictionaryitem, $lhsDictionaryDefinition);

            $relationship_name = str_replace('{tablename}', $rhsDictionaryDefinition->tablename, $morph->relationship_name);

            // insert the relationship
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

            // add an lhs link
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

            // add an rhs link
            $db->insertQuery('sysdictionaryfields', [
                'id' => SpiceUtils::createGuid(),
                'sysdictionaryname' => $rhsDictionaryDefinition->name,
                'sysdictionarytablename' => $rhsDictionaryDefinition->tablename,
                'sysdictionarytableaudited' => $rhsDictionaryDefinition->getDefinition()->audited,
                'fieldname' => $relationship->relationship->name . '_' . $lhsDictionaryDefinition->tablename,
                'fieldtype' => 'link',
                'fielddefinition' => json_encode([
                    'name' => $relationship->relationship->name . '_' . $lhsDictionaryDefinition->tablename,
                    'type' => 'link',
                    'relationship' => $relationship_name,
                    'source' => 'non-db'
                ]),
                'sysdictionaryrelationship_id' => $morph->id,
                'sysdictionarydefinition_id' => $rhsDictionaryDefinition->id
            ]);
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
