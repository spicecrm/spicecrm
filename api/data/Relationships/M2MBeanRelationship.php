<?php

namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\Link2;
use SpiceCRM\includes\database\DBManagerFactory;

class M2MBeanRelationship extends M2MRelationship
{

    var $type = "many-to-many-bean";
    var $basetype = 'many-to-many';

    public function getQuery($link, $params = [])
    {
        if ($this->linkIsLHS($link)) {
            $knownKey = $this->def['join_key_lhs'];
            $targetKey = $this->def['join_key_rhs'];
            $relatedSeed = BeanFactory::getBean($this->getRHSModule());
            $relatedSeedKey = $this->def['rhs_key'];
            $seedFocusKey = $this->def['lhs_key'];
            $idTable = $this->def['rhs_table'];
            if (!empty($params['where']))
                $whereTable = (empty($params['right_join_table_alias']) ? $relatedSeed->_tablename : $params['right_join_table_alias']);
        }
        else
        {
            $knownKey = $this->def['join_key_rhs'];
            $targetKey = $this->def['join_key_lhs'];
            $relatedSeed = BeanFactory::getBean($this->getLHSModule());
            $relatedSeedKey = $this->def['lhs_key'];
            $seedFocusKey = $this->def['rhs_key'];
            $idTable = $this->def['lhs_table'];
            if (!empty($params['where']))
                $whereTable = (empty($params['left_join_table_alias']) ? $relatedSeed->_tablename : $params['left_join_table_alias']);
        }
        $rel_table = $this->getRelationshipTable();

        $where = "$rel_table.$knownKey = '{$link->getFocus()->$seedFocusKey}'" . $this->getRoleWhere();

        //Add any optional where clause
        if (!empty($params['where'])){
            $add_where = is_string($params['where']) ? $params['where'] : "$whereTable." . $this->getOptionalWhereClause($params['where']);
            if (!empty($add_where) && $add_where != "()")
                $where .= " AND {$rel_table}.{$targetKey}={$whereTable}.{$relatedSeedKey} AND {$add_where}";
        }

        $deleted = !empty($params['deleted']) ? 1 : 0;
        $from = $rel_table . " ";
        if (!empty($params['where'])) {
            $from .= ", $whereTable";
            if (isset($relatedSeed->custom_fields)) {
                $customJoin = $relatedSeed->custom_fields->getJOIN();
                $from .= $customJoin ? $customJoin['join'] : '';
            }
        }

        if ($this->linkIsLHS($link)) {
            // if we have an order by and the inner join, we need to reset $from .= ", $whereTable" to $from = $rel_table . " ";
            $from = $rel_table . " ";
            $from .= " INNER JOIN " . $this->def['rhs_table'] . ' ON ' . $this->def['rhs_table'] . '.' . $this->def['rhs_key'] . ' = ' . $rel_table . '.' . $this->def['join_key_rhs'];
        } else {
            // if we have an order by and the inner join, we need to reset $from .= ", $whereTable" to $from = $rel_table . " ";
            $from = $rel_table . " ";
            $from .= " INNER JOIN " . $this->def['lhs_table'] . ' ON ' . $this->def['lhs_table'] . '.' . $this->def['lhs_key'] . ' = ' . $rel_table . '.' . $this->def['join_key_lhs'];
        }


        $sort = '';
        if(!empty($params['sort'])){
            $sortFieldTable = null;
            $sortField = null;
            if (!empty($params['relationship_fields']) && $params['sort']['sortfield']) {
                foreach ($params['relationship_fields'] as $fieldName => $fieldProperties) {
                    if ($fieldProperties['map'] && $fieldName == $params['sort']['sortfield']) {
                        $sortFieldTable = $rel_table;
                        $sortField = $fieldName;
                        break;
                    }
                }
            }

            if(is_null($sortField)) $sortField = $params['sort']['sortfield'];

            if ($this->linkIsLHS($link)) {
                $sortFieldTable = $this->def['rhs_table'];
                if($params['sort']['sortfield']) { // CR1000382
                    $sort = ' ORDER BY ' . $sortFieldTable . '.' . $sortField . ' ' . ($params['sort']['sortdirection'] ?: 'ASC');
                }
            } else {
                // if we have an order by and the inner join, we need to reset $from .= ", $whereTable" to $from = $rel_table . " ";
                $sortFieldTable = $this->def['lhs_table'];
                if($params['sort']['sortfield']) { // CR1000382
                    $sort = ' ORDER BY ' . $sortFieldTable . '.' . $sortField . ' ' . ($params['sort']['sortdirection'] ?: 'ASC');
                }
            }
        }


        if (empty($params['return_as_array'])) {
            // 20reasons add the relid to the query
            // $query = "SELECT $targetKey id FROM $from WHERE $where AND $rel_table.deleted=$deleted";
            $query = "SELECT ".DBManagerFactory::getInstance()->getGuidSQL()." relid, $idTable.id FROM $from WHERE $where AND $rel_table.deleted=$deleted ".$this->getRoleFilterForJoin()." $sort";  // CR1000269: added $this->getRoleFilterForJoin()


            //Limit is not compatible with return_as_array
            if (!empty($params['limit']) && $params['limit'] > 0) {
                $offset = isset($params['offset']) ? $params['offset'] : 0;
                $query = DBManagerFactory::getInstance()->limitQuery($query, $offset, $params['limit'], false, "", false);
            }
            return $query;
        }
        else
        {
            return [
                // 20reasons add the relid to the query
                //'select' => "SELECT $targetKey id",
                'select' => "SELECT ".DBManagerFactory::getInstance()->getGuidSQL()." relid, $idTable.id",
                'from' => "FROM $from",
                'where' => "WHERE $where AND $rel_table.deleted=$deleted ".$this->getRoleFilterForJoin(), // CR1000269: added $this->getRoleFilterForJoin()
                'sort' => $sort
            ];
        }
    }

    /**
     * @param  $link Link2 loads the relationship for this link.
     * @return void
     */
    public function load($link, $params = [])
    {
        $db = DBManagerFactory::getInstance();
        $query = $this->getQuery($link, $params);
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
        return ["rows" => $rows];
    }


    /**
     * not allowed
     *
     * @param $lhs
     * @param $rhs
     * @param $additionalFields
     * @return bool|void
     */
    public function add($lhs, $rhs, $additionalFields = []){
        return;
    }

    /**
     * not allowed
     *
     * @param $lhs
     * @param $rhs
     * @return bool|void
     */
    public function remove($lhs, $rhs)
    {
        return;
    }
}