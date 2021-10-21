<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\Logger\LoggerManager;


/**
 * Represents a many to many relationship that is table based.
 * @api
 */
class EmailAddressRelationship extends M2MRelationship
{
    /**
     * For Email Addresses, there is only a link from the left side, so we need a new add function that ignores rhs
     * @param  $lhs SugarBean left side bean to add to the relationship.
     * @param  $rhs SugarBean right side bean to add to the relationship.
     * @param  $additionalFields key=>value pairs of fields to save on the relationship
     * @return boolean true if successful
     */
    public function add($lhs, $rhs, $additionalFields =[])
    {
        $lhsLinkName = $this->lhsLink;

        if (empty($lhs->$lhsLinkName) && !$lhs->load_relationship($lhsLinkName))
        {
            $lhsClass = get_class($lhs);
            LoggerManager::getLogger()->fatal("could not load LHS $lhsLinkName in $lhsClass");
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

    public function remove($lhs, $rhs)
    {
        $lhsLinkName = $this->lhsLink;

        if (!($lhs instanceof SugarBean)) {
            LoggerManager::getLogger()->fatal("LHS is not a SugarBean object");
            return false;
        }
        if (!($rhs instanceof SugarBean)) {
            LoggerManager::getLogger()->fatal("RHS is not a SugarBean object");
            return false;
        }
        if (empty($lhs->$lhsLinkName) && !$lhs->load_relationship($lhsLinkName))
        {
            LoggerManager::getLogger()->fatal("could not load LHS $lhsLinkName");
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
