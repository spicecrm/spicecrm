<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\data\Relationships;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SysTrashCan\SysTrashCan;
use SpiceCRM\includes\TimeDate;

define('REL_LHS', 'LHS');
define('REL_RHS', 'RHS');
define('REL_BOTH', 'BOTH_SIDES');
define('REL_MANY_MANY', 'many-to-many');
define('REL_ONE_MANY', 'one-to-many');
define('REL_ONE_ONE', 'one-to-one');

/**
 * A relationship is between two modules.
 * It contains at least two links.
 * Each link represents a connection from one record to the records linked in this relationship.
 * Links have a context(focus) bean while relationships do not.
 * @api
 */
abstract class SugarRelationship
{
    protected $def;
    protected $lhsLink;
    protected $rhsLink;
    public $fetchedRow;
    public $updatedRow;
    protected $ignore_role_filter = false;
    protected $self_referencing = false; //A relationship is self referencing when LHS module = RHS Module

    protected static $beansToResave = [];

    protected $count = -1;

    public function __debugInfo()
    {
        //return ['name' => $this->name, 'type' => $this->type, 'def' => $this->def];
        return $this->def['relationships'];
    }

    public abstract function add($lhs, $rhs, $additionalFields = []);

    /**
     * @abstract
     * @param  $lhs SpiceBean
     * @param  $rhs SpiceBean
     * @return boolean
     */
    public abstract function remove($lhs, $rhs);

    /**
     * @abstract
     * @param $link Link2 loads the rows for this relationship that match the given link
     * @return void
     */
    public abstract function load($link, $params = []);

    /**
     * Gets the query to load a link.
     * This is currently public, but should prob be made protected later.
     * See Link2->getQuery
     * @abstract
     * @param  $link Link Object to get query for.
     * @return string|array query used to load this relationship
     */
    public abstract function getQuery($link, $params = []);


    public function getCount($link, $params)
    {
        $params['return_as_array'] = true;
        $queryArray = $this->getQuery($link, $params);
        $queryArray['select'] = 'SELECT count(*) relcount';
        $db = DBManagerFactory::getInstance();
        $result = $db->fetchByAssoc($db->query($queryArray['select'] . ' ' . $queryArray['from'] . ' ' . $queryArray['where']));
        return $result['relcount'];
    }


    /**
     * @abstract
     * @param Link2 $link
     * @return string|array the query to join against the related modules table for the given link.
     */
    public abstract function getJoin($link);

    /**
     * @abstract
     * @param SpiceBean $lhs
     * @param SpiceBean $rhs
     * @return bool
     */
    public abstract function relationship_exists($lhs, $rhs);

    /**
     * @abstract
     * @return string name of the table for this relationship
     */
    public abstract function getRelationshipTable();

    /**
     * @param  $link Link2 removes all the beans associated with this link from the relationship
     * @return boolean     true if all beans were successfully removed or there
     *                     were not related beans, false otherwise
     */
    public function removeAll($link)
    {
        $focus = $link->getFocus();
        $related = $link->getBeans();
        $result = true;
        foreach ($related as $relBean) {
            if (empty($relBean->id)) {
                continue;
            }

            if ($link->getSide() == REL_LHS) {
                $sub_result = $this->remove($focus, $relBean);
            } else {
                $sub_result = $this->remove($relBean, $focus);
            }

            // write trash record
            if ($link->def['recover'] !== false)
                SysTrashCan::addRecord('related', $focus->_module, $focus->id, $relBean->get_summary_text(), $link->name, $relBean->_module, $relBean->id);

            $result = $result && $sub_result;
        }

        return $result;
    }

    /**
     * @param $rowID id of SpiceBean to remove from the relationship
     * @return void
     */
    public function removeById($rowID)
    {
        $this->removeRow(["id" => $rowID]);
    }

    /**
     * @return string name of right hand side module.
     */
    public function getRHSModule()
    {
        return $this->def['rhs_module'];
    }

    /**
     * @return string name of left hand side module.
     */
    public function getLHSModule()
    {
        return $this->def['lhs_module'];
    }

    /**
     * @return String left link in relationship.
     */
    public function getLHSLink()
    {
        return $this->lhsLink;
    }

    /**
     * @return String right link in relationship.
     */
    public function getRHSLink()
    {
        return $this->rhsLink;
    }

    /**
     * @return array names of fields stored on the relationship
     */
    public function getFields()
    {
        return isset($this->def['fields']) ? $this->def['fields'] : [];
    }

    /**
     * @param array $row values to be inserted into the relationship
     * @return bool|void null if new row was inserted and true if an existing row was updated
     */
    protected function addRow($row)
    {
        $existing = $this->checkExisting($row);
        if (!empty($existing)) {//Update the existing row, overriding the values with those passed in
            $this->fetchedRow = $existing;
            $queryResult = $this->updateRow($existing['id'], array_merge($existing, $row));
            if ($queryResult) {
                $this->updatedRow = array_merge($existing, $row);
                $this->updatedRow['id'] = $existing['id'];
            }
            return $queryResult;
        }
        $values = [];
        foreach ($this->getFields() as $def) {
            $field = $def['name'];
            if (isset($row[$field])) {
                $values[$field] = "'{$row[$field]}'";
            }
        }
        $columns = implode(',', array_keys($values));
        $values = implode(',', $values);
        if (!empty($values)) {
            $query = "INSERT INTO {$this->getRelationshipTable()} ($columns) VALUES ($values)";
            DBManagerFactory::getInstance()->query($query);
        }
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
            if(!is_null($val)) {
                $newVals[] = "$field='$val'";
            }

        }

        $newVals = implode(",", $newVals);

        $query = "UPDATE {$this->getRelationshipTable()} set $newVals WHERE id='$id'";

        return DBManagerFactory::getInstance()->query($query);
    }

    /**
     * Removes one or more rows from the relationship table
     * @param $where array of field=>value pairs to match
     * @return bool|resource
     */
    protected function removeRow($where)
    {
        if (empty($where))
            return false;

        $date_modified = TimeDate::getInstance()->getNow()->format(TimeDate::DB_DATETIME_FORMAT);
        $stringSets = [];
        foreach ($where as $field => $val) {
            $stringSets[] = "$field = '$val'";
        }
        $whereString = "WHERE " . implode(" AND ", $stringSets);

        $query = "UPDATE {$this->getRelationshipTable()} set deleted=1 , date_modified = '$date_modified' $whereString";


        return DBManagerFactory::getInstance()->query($query);

    }

    /**
     * Checks for an existing row who's keys match the one passed in.
     * @param  $row
     * @return array|bool returns false if now row is found, otherwise the row is returned
     */
    protected function checkExisting($row)
    {
        $leftIDName = $this->def['join_key_lhs'];
        $rightIDName = $this->def['join_key_rhs'];
        if (empty($row[$leftIDName]) || empty($row[$rightIDName]))
            return false;

        $leftID = $row[$leftIDName];
        $rightID = $row[$rightIDName];
        //Check the relationship role as well
        $roleCheck = $this->getRoleWhere();

        $query = "SELECT * FROM {$this->getRelationshipTable()} WHERE $leftIDName='$leftID' AND $rightIDName='$rightID' $roleCheck AND deleted=0";

        $db = DBManagerFactory::getInstance();
        $result = $db->query($query);
        $row = $db->fetchByAssoc($result);
        if (!empty($row)) {
            return $row;
        } else {
            return false;
        }
    }

    /**
     * Gets the relationship role column check for the where clause
     * @param string $table
     * @return string
     */
    protected function getRoleWhere($table = "", $ignore_role_filter = false)
    {
        $ignore_role_filter = $ignore_role_filter || $this->ignore_role_filter;
        $roleCheck = "";
        if (empty ($table))
            $table = $this->getRelationshipTable();
        if (!empty($this->def['relationship_role_column']) && !empty($this->def["relationship_role_column_value"]) && !$ignore_role_filter) {
            if (empty($table))
                $roleCheck = " AND $this->relationship_role_column";
            else
                $roleCheck = " AND $table.{$this->relationship_role_column}";
            //role column value.
            if (empty($this->def['relationship_role_column_value'])) {
                $roleCheck .= ' IS NULL';
            } else {
                $roleCheck .= " = '$this->relationship_role_column_value'";
            }
        }
        return $roleCheck;
    }

    /**
     * @param SpiceBean $focus base bean the hooks is triggered from
     * @param SpiceBean $related bean being added/removed/updated from relationship
     * @param string $link_name name of link being triggerd
     * @return array base arguments to pass to relationship logic hooks
     */
    protected function getCustomLogicArguments($focus, $related, $link_name)
    {
        $custom_logic_arguments = [];
        $custom_logic_arguments['id'] = $focus->id;
        $custom_logic_arguments['related_id'] = $related->id;
        $custom_logic_arguments['module'] = $focus->_module;
        $custom_logic_arguments['related_module'] = $related->_module;
        $custom_logic_arguments['related_bean'] = $related;
        $custom_logic_arguments['link'] = $link_name;
        $custom_logic_arguments['relationship'] = $this->name;

        return $custom_logic_arguments;
    }

    /**
     * Call the before add logic hook for a given link
     * @param  SpiceBean $focus base bean the hooks is triggered from
     * @param  SpiceBean $related bean being added/removed/updated from relationship
     * @param string $link_name name of link being triggerd
     * @return void
     */
    protected function callBeforeAdd($focus, $related, $link_name = "")
    {
        $custom_logic_arguments = $this->getCustomLogicArguments($focus, $related, $link_name);
        $focus->call_custom_logic('before_relationship_add', $custom_logic_arguments);
    }

    /**
     * Call the after add logic hook for a given link
     * @param  SpiceBean $focus base bean the hooks is triggered from
     * @param  SpiceBean $related bean being added/removed/updated from relationship
     * @param string $link_name name of link being triggerd
     * @return void
     */
    protected function callAfterAdd($focus, $related, $link_name = "")
    {
        $custom_logic_arguments = $this->getCustomLogicArguments($focus, $related, $link_name);
        $focus->call_custom_logic('after_relationship_add', $custom_logic_arguments);
    }

    /**
     * @param  SpiceBean $focus
     * @param  SpiceBean $related
     * @param string $link_name
     * @return void
     */
    protected function callBeforeDelete($focus, $related, $link_name = "")
    {
        $custom_logic_arguments = $this->getCustomLogicArguments($focus, $related, $link_name);
        $focus->call_custom_logic('before_relationship_delete', $custom_logic_arguments);
    }

    /**
     * @param  SpiceBean $focus
     * @param  SpiceBean $related
     * @param string $link_name
     * @return void
     */
    protected function callAfterDelete($focus, $related, $link_name = "")
    {
        $custom_logic_arguments = $this->getCustomLogicArguments($focus, $related, $link_name);
        $focus->call_custom_logic('after_relationship_delete', $custom_logic_arguments);
    }

    /**
     * @param $optional_array clause to add to the where query when populating this relationship. It should be in the
     * @param string $add_and
     * @param string $prefix
     * @return string
     */
    protected function getOptionalWhereClause($optional_array)
    {
        //lhs_field, operator, and rhs_value must be set in optional_array
        foreach (["lhs_field", "operator", "rhs_value"] as $required) {
            if (empty($optional_array[$required]))
                return "";
        }

        return $optional_array['lhs_field'] . "" . $optional_array['operator'] . "'" . $optional_array['rhs_value'] . "'";
    }

    /**
     * Adds a realted Bean to the list to be resaved along with the current bean.
     * @static
     * @param  SpiceBean $bean
     * @return void
     */
    public static function addToResaveList($bean)
    {
        if (!isset(self::$beansToResave[$bean->_module])) {
            self::$beansToResave[$bean->_module] = [];
        }
        self::$beansToResave[$bean->_module][$bean->id] = $bean;
    }

    /**
     *
     * @static
     * @return void
     */
    public static function resaveRelatedBeans()
    {
        $GLOBALS['resavingRelatedBeans'] = true;

        //Resave any bean not currently in the middle of a save operation
        foreach (self::$beansToResave as $module => $beans) {
            foreach ($beans as $bean) {
                if (empty($bean->deleted) && empty($bean->in_save)) {
                    $bean->save();
                } else {
                    // Bug 55942 save the in-save id which will be used to send workflow alert later
                    if (isset($bean->id) && !empty($_SESSION['WORKFLOW_ALERTS'])) {
                        $_SESSION['WORKFLOW_ALERTS']['id'] = $bean->id;
                    }
                }
            }
        }

        $GLOBALS['resavingRelatedBeans'] = false;

        //Reset the list of beans that will need to be resaved
        self::$beansToResave = [];
    }

    /**
     * @return bool true if the relationship is a flex / parent relationship
     */
    public function isParentRelationship()
    {
        //check role fields to see if this is a parent (flex relate) relationship
        if (!empty($this->def["relationship_role_column"]) && !empty($this->def["relationship_role_column_value"])
            && $this->def["relationship_role_column"] == "parent_type" && $this->def['rhs_key'] == "parent_id"
        ) {
            return true;
        }
        return false;
    }

    public function __get($name)
    {
        if (isset($this->def[$name]))
            return $this->def[$name];

        switch ($name) {
            case "relationship_type":
                return $this->type;
            case 'relationship_name':
                return $this->name;
            case "lhs_module":
                return $this->getLHSModule();
            case "rhs_module":
                return $this->getRHSModule();
            case "lhs_table" :
                isset($this->def['lhs_table']) ? $this->def['lhs_table'] : "";
            case "rhs_table" :
                isset($this->def['rhs_table']) ? $this->def['rhs_table'] : "";
            case "list_fields":
                return ['lhs_table', 'lhs_key', 'rhs_module', 'rhs_table', 'rhs_key', 'relationship_type'];
        }

        if (isset($this->$name))
            return $this->$name;

        return null;
    }
}
