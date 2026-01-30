<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryLink;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;
use SpiceCRM\modules\SpiceACL\SpiceACL;


/**
 * Represents a one to many relationship that is table based.
 * @api
 */
class One2MBeanRelationship extends One2MRelationship
{
    //Type is read in sugarbean to determine query construction
    var $type = "one-to-many";

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
            $rightDefinition = new SpiceDictionaryDefinition($relationship->relationship->rhs_sysdictionarydefinition_id);
            $rightField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->rhs_sysdictionaryitem_id);
        } catch (\Exception $e){
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
     * @throws \Exception
     */
    public static function buildLinkFields(SpiceDictionaryRelationship $relationship, string $definitionId): array
    {
        $isSidesDictionaryIdentical = $relationship->relationship->lhs_sysdictionarydefinition_id == $relationship->relationship->rhs_sysdictionarydefinition_id;

        $forSide = $isSidesDictionaryIdentical ? 'both' : Relationship::getDefinitionSide($relationship, $definitionId);

        $fields = [];

        if ($relationship->relationship->lhs_linkname && ($forSide == 'lhs' || $forSide == 'both')) {

            try {
                $rightDefinition = new SpiceDictionaryDefinition($relationship->relationship->rhs_sysdictionarydefinition_id);
            } catch (Exception $e) {
                return [];
            }

            $leftFieldDef = [
                'name' => $relationship->relationship->lhs_linkname,
                'type' => 'link',
                'relationship' => $relationship->relationship->relationship_name,
                'source' => 'non-db',
                'module' => $rightDefinition->getModuleName(),
                'vname' => $relationship->relationship->lhs_linklabel
            ];

            if ($relationship->relationship->rhs_linkdefault) {
                $leftFieldDef['default'] = true;
            }

            if($relationship->relationship->rhs_sortfield) {

                $rightSortField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->rhs_sortfield);

                $leftFieldDef['sort'] = [
                    'sortfield' => $rightSortField->name,
                    'sortdirection' => $relationship->relationship->rhs_sortdirection ? strtoupper($relationship->relationship->rhs_sortdirection) : 'ASC'
                ];
            }

            $fields[$relationship->relationship->lhs_linkname] = $leftFieldDef;

        }

        if ($relationship->relationship->rhs_linkname && ($forSide == 'rhs' || $forSide == 'both')) {

            try {
                $leftDefinition = new SpiceDictionaryDefinition($relationship->relationship->lhs_sysdictionarydefinition_id);
            } catch (Exception $e) {
                return [];
            }

            $leftModule = $leftDefinition->getModuleName();

            $rightDefinition = new SpiceDictionaryDefinition($relationship->relationship->rhs_sysdictionarydefinition_id);
            $rightField = SpiceDictionary::getInstance()->getFieldByDefinitionNameAndItemId($rightDefinition->name, $relationship->relationship->rhs_sysdictionaryitem_id);

            $fields[$relationship->relationship->rhs_linkname] = [
                'name' => $relationship->relationship->rhs_linkname,
                'type' => 'link',
                'relationship' => $relationship->relationship->relationship_name,
                'source' => 'non-db',
                'module' => $leftModule,
                'vname' => $relationship->relationship->rhs_linklabel
            ];

            $fields["{$relationship->relationship->rhs_linkname}_linked"] = [
                'name' => "{$relationship->relationship->rhs_linkname}_linked",
                'type' => 'linked',
                'rname' => 'name',
                'id_name' => $rightField->name,
                'link' => $relationship->relationship->rhs_linkname,
                'source' => 'non-db',
                'module' => $leftModule,
                'vname' => $relationship->relationship->rhs_linklabel
            ];

            if ($relationship->relationship->rhs_relatename) {
                $fields[$relationship->relationship->rhs_relatename] = [
                    'name' => $relationship->relationship->rhs_relatename,
                    'type' => 'relate',
                    'id_name' => $rightField->name,
                    'link' => $relationship->relationship->rhs_linkname,
                    'source' => 'non-db',
                    'module' => $leftModule,
                    'vname' => $relationship->relationship->rhs_relatelabel
                ];
            }
        }

        return $fields;
    }

    /**
     * @param  $lhs SpiceBean left side bean to add to the relationship.
     * @param  $rhs SpiceBean right side bean to add to the relationship.
     * @param  $additionalFields key=>value pairs of fields to save on the relationship
     * @return boolean true if successful
     */
    public function add($lhs, $rhs, $additionalFields = []): bool
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
            $this->remove($oldLHS, $rhs, null,false);
        }

        //Make sure we load the current relationship state to the LHS link
        if ((isset($lhs->$lhsLinkName) && is_a($lhs->$lhsLinkName, SpiceDictionaryLink::class)) || $lhs->load_relationship($lhsLinkName)) {
            $lhs->$lhsLinkName->load();
        }

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            $this->callBeforeAdd($lhs, $rhs);
            $this->callBeforeAdd($rhs, $lhs);
        }

        $resaveRequired = $this->updateFields($lhs, $rhs, $additionalFields);

        if (empty($_SESSION['disable_workflow']) || $_SESSION['disable_workflow'] != "Yes")
        {
            //Need to call save to update the bean as the relationship is saved on the main table
            //We don't want to create a save loop though, so make sure we aren't already in the middle of saving this bean
            Relationship::addToResaveList($rhs);

            $this->updateLinks($lhs, $lhsLinkName, $rhs, $rhsLinkName);

            $this->callAfterAdd($lhs, $rhs);
            $this->callAfterAdd($rhs, $lhs);
        }

        //One2MBean relationships require that the RHS bean be saved or else the relationship will not be saved.
        //If we aren't already in a relationship save, intitiate a save now.
        if ($resaveRequired && empty($GLOBALS['resavingRelatedBeans'])) {
            Relationship::resaveRelatedBeans();
        }

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
        // memorize if we need a resave
        $resaveRequired = false;

        //Now update the RHS bean's ID field
        $rhsID = $this->def['rhs_key'];

        if($rhs->$rhsID != $lhs->id) $resaveRequired = true;

        $rhs->$rhsID = $lhs->id;
        foreach($additionalFields as $field => $val)
        {
            if($rhs->$field != $val) $resaveRequired = true;
            $rhs->$field = $val;
        }
        //Update role fields
        if(!empty($this->def["relationship_role_column"]) && !empty($this->def["relationship_role_column_value"]))
        {
            $roleField = $this->def["relationship_role_column"];

            if($rhs->$roleField != $this->def["relationship_role_column_value"]) $resaveRequired = true;;

            $rhs->$roleField = $this->def["relationship_role_column_value"];
        }

        return $resaveRequired;
    }

    public function remove($lhs, $rhs, ?string $relId = null, $save = true)
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

            // make sure parent_type field exists & parent_id is empty
            if(property_exists($rhs, 'parent_type') && $rhsID == 'parent_id' && empty($rhs->parent_id)) $rhs->parent_type = "";

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
     * load the relationship rows for this link
     * @param  $link SpiceDictionaryLink
     * @param array $params
     * @return array
     * @throws DatabaseException
     */
    public function load($link, $params = []): array
    {
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

            $rangeParams = $params;

            if (!empty($params['searchterm'])) {
                $rangeParams['limit'] = 0;
                $rangeParams['offset'] = 0;
            }

            $query = $this->getQuery($link, $rangeParams);
            if (empty($query))
            {
                LoggerManager::getLogger()->fatal('relationships', "query for {$this->name} was empty when loading from  {$this->lhsLink} in One2MBean");
                return ["rows" => []];
            }
            $result = $db->query($query);
            while ($row = $db->fetchByAssoc($result))
            {
                $id = $row['id'];
                $rows[$id] = $row;
            }

            if (!empty($params['searchterm'])) {
                if(isset($rangeParams['limit'])) $params['limit'] = $rangeParams['limit'];
                if(isset($rangeParams['offset'])) $params['offset'] = $rangeParams['offset'];
                $rows = $this->getResultsFilteredByFTS($link->getRelatedModuleName(), $params, $rows);

                $this->count = count($rows);
                if($params['limit']===0){
                    $rows = array_slice($rows, $params['offset']);
                }
                else{
                    $rows = array_slice($rows, $params['offset'], $params['limit']);
                }
            } else {
                $this->count = count($rows);
            }
        }

        return [
            "rows" => $rows
        ];
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
            $where = "$rhsTableKey = '{$link->getFocus()->$lhsKey}' AND {$rhsTable}.deleted=$deleted";

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

            // add teh acl relevant query
            //SpiceACL::getInstance()->addACLAccessToListArray($ret_array, $this);
            $retArray = [];

            // check if we should add an ACL query
            if($link->ignoreACL !== true) {
                SpiceACL::getInstance()->addACLAccessToListArray($retArray, BeanFactory::getBean($this->def['rhs_module']));
                if ($retArray['where']) {
                    $where = "({$where}) AND {$retArray['where']}";
                }
            }

            $from = $this->def['rhs_table'];

            if (empty($params['return_as_array'])) {
                //Limit is not compatible with return_as_array
                $query = "SELECT id FROM $from WHERE $where";
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
                    'where' =>  $where ? "WHERE {$where}" : ''
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
     * @param SpiceBean $lhs        Left hand side of the relationship
     * @param SpiceBean $rhs        Right hand side of the relationship
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
