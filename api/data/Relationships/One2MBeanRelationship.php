<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\data\Link2;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\Logger\LoggerManager;


/**
 * Represents a one to many relationship that is table based.
 * @api
 */
class One2MBeanRelationship extends One2MRelationship
{
    //Type is read in sugarbean to determine query construction
    var $type = "one-to-many";

    public function __construct($def)
    {
        parent::__construct($def);
    }

    /**
     * @param  $lhs SugarBean left side bean to add to the relationship.
     * @param  $rhs SugarBean right side bean to add to the relationship.
     * @param  $additionalFields key=>value pairs of fields to save on the relationship
     * @return boolean true if successful
     */
    public function add($lhs, $rhs, $additionalFields = [])
    {
        // test to see if the relationship exist if the relationship between the two beans
        // exist then we just fail out with false as we don't want to re-trigger this
        // the save and such as it causes problems with the related() in sugarlogic
        if($this->relationship_exists($lhs, $rhs) && !empty($GLOBALS['resavingRelatedBeans'])) return false;

        $lhsLinkName = $this->lhsLink;
        $rhsLinkName = $this->rhsLink;

        //Since this is bean based, we know updating the RHS's field will overwrite any old value,
        //But we need to use delete to make sure custom logic is called correctly
        // performance optimization to load the old related bean direct rather than via the links
        if (!empty($rhs->{$this->def['rhs_key']}) && $rhs->{$this->def['rhs_key']} != $lhs->id)
        {
            $oldLHS = BeanFactory::getBean($lhs->_module, $rhs->{$this->def['rhs_key']}, ['relationships' => false]);
            $this->remove($oldLHS, $rhs, false);
        }

        //Make sure we load the current relationship state to the LHS link
        if ((isset($lhs->$lhsLinkName) && is_a($lhs->$lhsLinkName, "Link2")) || $lhs->load_relationship($lhsLinkName)) {
            $lhs->$lhsLinkName->load();
        }

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            $this->callBeforeAdd($lhs, $rhs);
            $this->callBeforeAdd($rhs, $lhs);
        }

        $this->updateFields($lhs, $rhs, $additionalFields);

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            //Need to call save to update the bean as the relationship is saved on the main table
            //We don't want to create a save loop though, so make sure we aren't already in the middle of saving this bean
            SugarRelationship::addToResaveList($rhs);

            $this->updateLinks($lhs, $lhsLinkName, $rhs, $rhsLinkName);

            $this->callAfterAdd($lhs, $rhs);
            $this->callAfterAdd($rhs, $lhs);
        }

        //One2MBean relationships require that the RHS bean be saved or else the relationship will not be saved.
        //If we aren't already in a relationship save, intitiate a save now.
        if (empty($GLOBALS['resavingRelatedBeans']))
            SugarRelationship::resaveRelatedBeans();

        return true;
    }

    protected function updateLinks($lhs, $lhsLinkName, $rhs, $rhsLinkName)
    {
        if ($lhs->load_relationship($lhsLinkName)){
            $lhs->$lhsLinkName->addBean($rhs);
        }
        //RHS only has one bean ever, so we don't need to preload the relationship
        if ($rhs->load_relationship($rhsLinkName)){
            $rhs->$rhsLinkName->beans = [$lhs->id => $lhs];
        }
    }

    protected function updateFields($lhs, $rhs, $additionalFields)
    {
        //Now update the RHS bean's ID field
        $rhsID = $this->def['rhs_key'];
        $rhs->$rhsID = $lhs->id;
        foreach($additionalFields as $field => $val)
        {
            $rhs->$field = $val;
        }
        //Update role fields
        if(!empty($this->def["relationship_role_column"]) && !empty($this->def["relationship_role_column_value"]))
        {
            $roleField = $this->def["relationship_role_column"];
            $rhs->$roleField = $this->def["relationship_role_column_value"];
        }
    }

    public function remove($lhs, $rhs, $save = true)
    {
        $rhsID = $this->def['rhs_key'];

        //If this relationship has already been removed, we can just return
        if ($rhs->$rhsID != $lhs->id)
            return false;

        $rhs->$rhsID = '';

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            $this->callBeforeDelete($lhs, $rhs);
            $this->callBeforeDelete($rhs, $lhs);
        }

        if ($save && !$rhs->deleted)
        {
            $rhs->in_relationship_update = TRUE;
            $rhs->save();
        }

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            $this->callAfterDelete($lhs, $rhs);
            $this->callAfterDelete($rhs, $lhs);
        }

        return true;
    }

    /**
     * @param  $link Link2 loads the relationship for this link.
     * @return void
     */
    public function load($link, $params = [])
    {
        $relatedModule = $link->getSide() == REL_LHS ? $this->def['rhs_module'] : $this->def['lhs_module'];
        $rows = [];
        //The related bean ID is stored on the RHS table.
        //If the link is RHS, just grab it from the focus.
        if ($link->getSide() == REL_RHS)
        {
            $rhsID = $this->def['rhs_key'];
            $id = $link->getFocus()->$rhsID;
            if (!empty($id))
            {
                $rows[$id] = ['id' => $id];
            }
        }
        else //If the link is LHS, we need to query to get the full list and load all the beans.
        {
            $db = DBManagerFactory::getInstance();
            $query = $this->getQuery($link, $params);
            if (empty($query))
            {
                LoggerManager::getLogger()->fatal("query for {$this->name} was empty when loading from   {$this->lhsLink}\n");
                return ["rows" => []];
            }
            $result = $db->query($query);
            while ($row = $db->fetchByAssoc($result))
            {
                $id = $row['id'];
                $rows[$id] = $row;
            }
        }

        return ["rows" => $rows];
    }

    public function getQuery($link, $params = [])
    {
        //There was an old signature with $return_as_array as the second parameter. We should respect this if $params is true
        if ($params === true){
            $params = ["return_as_array" => true];
        }

        if ($link->getSide() == REL_RHS) {
            return false;
        }
        else
        {
            $lhsKey = $this->def['lhs_key'];
            $rhsTable = $this->def['rhs_table'];
            $rhsTableKey = "{$rhsTable}.{$this->def['rhs_key']}";
            $deleted = !empty($params['deleted']) ? 1 : 0;
            $where = "WHERE $rhsTableKey = '{$link->getFocus()->$lhsKey}' AND {$rhsTable}.deleted=$deleted";

            //Check for role column
            if(!empty($this->def["relationship_role_column"]) && !empty($this->def["relationship_role_column_value"]))
            {
                $roleField = $this->def["relationship_role_column"];
                $roleValue = $this->def["relationship_role_column_value"];
                $where .= " AND $rhsTable.$roleField = '$roleValue'";
            }

            //Add any optional where clause
            if (!empty($params['where'])){
                $add_where = is_string($params['where']) ? $params['where'] : "$rhsTable." . $this->getOptionalWhereClause($params['where']);
                if (!empty($add_where))
                    $where .= " AND $add_where";
            }

            $from = $this->def['rhs_table'];

            if (empty($params['return_as_array'])) {
                //Limit is not compatible with return_as_array
                $query = "SELECT id FROM $from $where";
                // add the sort param from the relationship
                if($params['sort']['sortfield']){
                    $query .= " ORDER BY {$rhsTable}.{$params['sort']['sortfield']} {$params['sort']['sortdirection']}";
                }
                if (!empty($params['limit']) && $params['limit'] > 0) {
                    $offset = isset($params['offset']) ? $params['offset'] : 0;
                    $query = DBManagerFactory::getInstance()->limitQuery($query, $offset, $params['limit'], false, "", false);
                }

                return $query;
            }
            else
            {
                return [
                    'select' => "SELECT {$this->def['rhs_table']}.id",
                    'from' => "FROM {$this->def['rhs_table']}",
                    'where' => $where,
                ];
            }
        }
    }

    public function getJoin($link, $params = [], $return_array = false)
    {
        $linkIsLHS = $link->getSide() == REL_LHS;
        $startingTable = (empty($params['left_join_table_alias']) ? $this->def['lhs_table'] : $params['left_join_table_alias']);
        if (!$linkIsLHS)
            $startingTable = (empty($params['right_join_table_alias']) ? $this->def['rhs_table'] : $params['right_join_table_alias']);
        $startingKey = $linkIsLHS ? $this->def['lhs_key'] : $this->def['rhs_key'];
        $targetTable = $linkIsLHS ? $this->def['rhs_table'] : $this->def['lhs_table'];
        $targetTableWithAlias = $targetTable;
        $targetKey = $linkIsLHS ? $this->def['rhs_key'] : $this->def['lhs_key'];
        $join_type= isset($params['join_type']) ? $params['join_type'] : ' INNER JOIN ';
        $join = '';

        //Set up any table aliases required
        if ( ! empty($params['join_table_alias']))
        {
            $targetTableWithAlias = $targetTable. " ".$params['join_table_alias'];
            $targetTable = $params['join_table_alias'];
        }

        //First join the relationship table
        $join .= "$join_type $targetTableWithAlias ON $startingTable.$startingKey=$targetTable.$targetKey AND $targetTable.deleted=0\n"
        //Next add any role filters
               . $this->getRoleWhere(($linkIsLHS) ? $targetTable : $startingTable) . "\n";

        if($return_array){
            return [
                'join' => $join,
                'type' => $this->type,
                'rel_key' => $targetKey,
                'join_tables' => [$targetTable],
                'where' => "",
                'select' => "$targetTable.id",
            ];
        }
        return $join;
    }

    /**
     * Check to see if the relationship already exist.
     *
     * If it does return true otherwise return false
     *
     * @param SugarBean $lhs        Left hand side of the relationship
     * @param SugarBean $rhs        Right hand side of the relationship
     * @return boolean
     */
    public function relationship_exists($lhs, $rhs)
    {
        // we need the key that is stored on the rhs to compare tok
        $lhsIDName = $this->def['rhs_key'];

        return (isset($rhs->fetched_row[$lhsIDName]) && $rhs->$lhsIDName == $rhs->fetched_row[$lhsIDName] && $rhs->$lhsIDName == $lhs->id);
    }

    public function getRelationshipTable()
    {
        if (isset($this->def['table']))
            return $this->def['table'];
        else
            return $this->def['rhs_table'];
    }
}
