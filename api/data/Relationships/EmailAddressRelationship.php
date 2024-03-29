<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\Link2;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceCache\SpiceCacheMemory;
use SpiceCRM\includes\TimeDate;


/**
 * Represents a many to many relationship that is table based.
 * @api
 */
class EmailAddressRelationship extends M2MRelationship
{

    /**
     * @param  $link Link2 loads the relationship for this link.
     * @return void
     */
    public function load($link, $params = [])
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
     * @param  $lhs SpiceBean left side bean to add to the relationship.
     * @param  $rhs SpiceBean right side bean to add to the relationship.
     * @param  $additionalFields key=>value pairs of fields to save on the relationship
     * @return boolean true if successful
     */
    public function add($lhs, $rhs, $additionalFields =[])
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

        if ($this->self_referencing)
            $this->addSelfReferencing($lhs, $rhs, $additionalFields);

            if ($lhs->$lhsLinkName->beansAreLoaded())
                $lhs->$lhsLinkName->addBean($rhs);

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

    public function remove($lhs, $rhs)
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
