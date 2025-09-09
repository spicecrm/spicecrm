<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryLink;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;
use SpiceCRM\includes\utils\SpiceUtils;


/**
 * Represents a many to many relationship that is table based.
 * @api
 */
class EmailAddressRelationship extends M2MRelationship
{

    public $type = 'email-address';


    /**
     * initialize the instance from the given dictionary relationship
     * @param array $relationship
     * @return void
     * @throws \Exception
     */
    protected function initialize(array $relationship): void
    {
        $this->def = $this->buildRelationshipDef($relationship);
        $this->lhsLink = $this->isPrimaryRelationship($relationship['relationship_name']) ? 'email_addresses_primary' : 'email_addresses';
    }

    /**
     * build relationship definition
     * @param array $relationship
     * @return array[]
     * @throws \Exception
     */
    public function buildRelationshipDef(array $relationship): array
    {
        $relationship = new SpiceDictionaryRelationship($relationship['id']);

        try {
            $leftDefinition = new SpiceDictionaryDefinition($relationship->relationship->lhs_sysdictionarydefinition_id);
            $leftField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($leftDefinition->name, $relationship->relationship->lhs_sysdictionaryitem_id);
        } catch (Exception $e){
            return [];
        }

        $isPrimary = $this->isPrimaryRelationship($relationship->relationship->relationship_name);

        return [
            'id' => $relationship->id,
            'relationship_name' => $relationship->relationship->relationship_name,
            'relationship_type' => $this->type,
            'lhs_table' => $leftDefinition->tablename,
            'lhs_module' => $leftDefinition->getModuleName(),
            'lhs_key' => $leftField->name,
            'rhs_table' => 'email_addresses',
            'rhs_module' => 'EmailAddresses',
            'rhs_key' => 'id',
            'join_table' => 'email_addr_bean_rel',
            'join_key_lhs' => 'bean_id',
            'join_key_rhs' => 'email_address_id',
            'relationship_role_column' => $isPrimary ? 'primary_address' : 'bean_module',
            'relationship_role_column_value' => $isPrimary ? '1' : $leftDefinition->getModuleName(),
            'deleted' => 0
        ];
    }

    /**
     * check if this is a primary relationship
     * @param string $relationshipName
     * @return bool
     */
    private function isPrimaryRelationship(string $relationshipName): bool
    {
        return str_ends_with($relationshipName, '_primary');
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

        # the email address dictionary does not have link fields
        if ($forSide == 'rhs') {
            return [];
        }

        $leftFieldDefsPrimary = [
            'name' => 'email_addresses_primary',
            'type' => 'link',
            'relationship' => $relationship->relationship->relationship_name . '_primary',
            'source' => 'non-db',
            'module' => 'EmailAddresses',
            'vname' => 'LBL_EMAIL_ADDRESS_PRIMARY'
        ];

        $leftFieldDef = [
            'name' => 'email_addresses',
            'default' => true,
            'type' => 'link',
            'relationship' => $relationship->relationship->relationship_name,
            'source' => 'non-db',
            'module' => 'EmailAddresses',
            'vname' => 'LBL_EMAIL_ADDRESSES',
            'rel_fields' => [
                'opt_in_status' => [
                    'type' => 'enum',
                    'map' => 'opt_in_status',
                    'options' => 'email_optin_status',
                ],
                'primary_address' => [
                    'type' => 'bool',
                    'map' => 'primary_address'
                ]
            ]
        ];

        return [
            'email_addresses' => $leftFieldDef,
            'email_addresses_primary' => $leftFieldDefsPrimary,
        ];
    }

    /**
     * load the relationship rows for this link
     * @param  $link SpiceDictionaryLink loads the relationship for this link.
     * @return array[]
     * @throws DatabaseException
     */
    public function load($link, $params = []): array
    {
        $db = DBManagerFactory::getInstance();
        $query = $this->getQuery($link, $params);

        // check if we kept it in memory
//        $cached = SpiceCache::getMemory('spicerelationshipresult'.md5($query));
//        if($cached){
//            return ["rows" => $cached];
//        }

        $result = $db->query($query);
        $rows = [];
        $idField = $link->getSide() == REL_LHS ? $this->def['join_key_rhs'] : $this->def['join_key_lhs'];
        while ($row = $db->fetchByAssoc($result))
        {
            if (empty($row['id']) && empty($row[$idField]))
                continue;
            $id = empty($row['id']) ? $row[$idField] : $row['id'];
            $rows[$id] = $row;
        }

        // put to globals so we keep it
//        SpiceCache::setMemory('spicerelationshipresult'.md5($query), $rows);


        // return the rows
        return ["rows" => $rows];
    }

    /**
     * For Email Addresses, there is only a link from the left side, so we need a new add function that ignores rhs
     * @param  $lhs SpiceBean the left side bean to add to the relationship.
     * @param  $rhs SpiceBean right side bean to add to the relationship.
     * @param  $additionalFields array key => value pairs of fields to save on the relationship
     * @return boolean true if successful
     * @throws \Exception
     */
    public function add($lhs, $rhs, $additionalFields =[]): bool
    {
        $lhsLinkName = $this->lhsLink;

        if (empty($lhs->$lhsLinkName) && !$lhs->load_relationship($lhsLinkName))
        {
            $lhsClass = get_class($lhs);
            LoggerManager::getLogger()->fatal('relationships', "could not load LHS $lhsLinkName in $lhsClass in EmailAddressRelationship");
            return false;
        }

            if ($lhs->$lhsLinkName->beansAreLoaded())
                $lhs->$lhsLinkName->addBean($rhs);

            $this->callBeforeAdd($lhs, $rhs, $lhsLinkName);

        //Many to many has no additional logic, so just add a new row to the table and notify the beans.
        $dataToInsert = $this->getRowToInsert($lhs, $rhs, $additionalFields);

        $this->addRow($dataToInsert);

        if ($lhs->$lhsLinkName->beansAreLoaded()) {
            $lhs->$lhsLinkName->addBean($rhs);
        }

        $this->callAfterAdd($lhs, $rhs, $lhsLinkName);

        return true;
    }

    /**
     * @param $id id of row to update
     * @param $values values to insert into row
     * @return resource result of update satatement
     */
    public function updateRow($id, $values)
    {
        $newVals = [];

        //Unset the ID since we are using it to update the row
        if (isset($values['id'])) unset($values['id']);
        foreach ($values as $field => $val) {
            if($val !== null) {
                $newVals[] = "$field='$val'";
            }
        }

        $newVals = implode(",", $newVals);

        $query = "UPDATE {$this->getRelationshipTable()} set $newVals WHERE id='$id'";

        return DBManagerFactory::getInstance()->query($query);
    }

    public function remove($lhs, $rhs, ?string $relId = null)
    {
        $lhsLinkName = $this->lhsLink;

        if (!($lhs instanceof SpiceBean)) {
            LoggerManager::getLogger()->fatal('relationships', "LHS is not a SpiceBean object in EmailAddressRelationship");
            return false;
        }
        if (!($rhs instanceof SpiceBean)) {
            LoggerManager::getLogger()->fatal('relationships', "RHS is not a SpiceBean object in EmailAddressRelationship");
            return false;
        }
        if (empty($lhs->$lhsLinkName) && !$lhs->load_relationship($lhsLinkName))
        {
            LoggerManager::getLogger()->fatal('relationships', "could not load LHS $lhsLinkName in EmailAddressRelationship");
            return false;
        }

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            if (!empty($lhs->$lhsLinkName))
            {
                $lhs->$lhsLinkName->load();
                $this->callBeforeDelete($lhs, $rhs, $lhsLinkName);
            }
        }

        $dataToRemove = [
            $this->def['join_key_lhs'] => $lhs->id,
            $this->def['join_key_rhs'] => $rhs->id
        ];

        $this->removeRow($dataToRemove);

        if ($this->self_referencing)
            $this->removeSelfReferencing($lhs, $rhs);

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            if (!empty($lhs->$lhsLinkName))
            {
                $lhs->$lhsLinkName->load();
                $this->callAfterDelete($lhs, $rhs, $lhsLinkName);
            }
        }

        return true;
    }

    /**
     * Gets the relationship role column check for the where clause
     * This overload adds additional bean check for the primary_address variable.
     * @param string $table
     * @param bool $ignore_role_filter
     * @return string
     */
    protected function getRoleWhere($table = "", $ignore_role_filter = false)
    {
        $roleCheck = parent::getRoleWhere($table, $ignore_role_filter);

        if ($this->def['relationship_role_column'] == 'primary_address' &&
            $this->def["relationship_role_column_value"] == '1') {
            if (empty($table)) {
                $roleCheck .= " AND bean_module";
            } else {
                $roleCheck .= " AND $table.bean_module";
            }
            $roleCheck .= " = '" . $this->getLHSModule() . "'";
        }

        return $roleCheck;
    }
}
