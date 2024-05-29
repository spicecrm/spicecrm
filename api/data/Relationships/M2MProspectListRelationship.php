<?php
namespace SpiceCRM\data\Relationships;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\TimeDate;

class M2MProspectListRelationship extends M2MRelationship
{
    var $type = "many-to-many-prospectlists";
    var $basetype = 'many-to-many';

    /**
     * Checks for an existing row who's keys match the one passed in.
     * @param  $row
     * @param  $additionalFields
     * @return array|bool returns false if now row is found, otherwise the row is returned
     */
    protected function checkExisting($row, $additionalFields = [])
    {
        $leftIDName = $this->def['join_key_lhs'];
        $rightIDName = $this->def['join_key_rhs'];
        if (empty($row[$leftIDName]) || empty($row[$rightIDName]) || empty($row['email_addr_bean_rel_id']))
            return false;

        $leftID = $row[$leftIDName];
        $rightID = $row[$rightIDName];
        $emailAddressbeanrelId = $row['email_addr_bean_rel_id'];


        $query = "SELECT * FROM {$this->getRelationshipTable()} WHERE $leftIDName='$leftID' AND $rightIDName='$rightID' AND email_addr_bean_rel_id='$emailAddressbeanrelId' AND deleted=0";

        $db = DBManagerFactory::getInstance();
        $result = $db->query($query);
        $row = $db->fetchByAssoc($result);
        if (!empty($row)) {
            return $row;
        } else {
            return false;
        }
    }

    public function remove($lhs, $rhs){
        // overwrite?
    }
    /**
     * @param  $link Link2 loads the relationship for this link.
     * @return void
     */
    public function load($link, $params = [])
    {
        $db = DBManagerFactory::getInstance();
        // for elasticsearch results have to be returned without paging
        $rangeParams = $params;

        if (!empty($params['searchterm'])) {
            $rangeParams['limit'] = 0;
            $rangeParams['offset'] = 0;
        }

        $query = $this->getQuery($link, $rangeParams);
        $result = $db->query($query);
        $rows = [];
        $idField = $link->getSide() == REL_LHS ? $this->def['join_key_rhs'] : $this->def['join_key_lhs'];
        while ($row = $db->fetchByAssoc($result))
        {
            if (empty($row['id']) && empty($row[$idField]))
                continue;
            $id = empty($row['id']) ? $row[$idField] : $row['relid'];
            $rows[$id] = $row;
        }

        if (!empty($params['searchterm'])) {
            $rows = $this->getResultsFilteredByFTS($link->getRelatedModuleName(), $params, $rows);

            $this->count = count($rows);
            $rows = array_slice($rows, $params['offset'], $params['limit']);
        } else {
            $this->count = count($rows);
        }

        return [
            "rows" => $rows
        ];
    }


    protected function removeRow($where)
    {
//        if (empty($where))
//            return false;
//
//        $date_modified = TimeDate::getInstance()->getNow()->format(TimeDate::DB_DATETIME_FORMAT);
//        $stringSets = [];
//        foreach ($where as $field => $val) {
//            $stringSets[] = "$field = '$val'";
//        }
//        $whereString = "WHERE " . implode(" AND ", $stringSets);
//
//        $query = "UPDATE {$this->getRelationshipTable()} set deleted=1 , date_modified = '$date_modified' $whereString";
//
//
//        return DBManagerFactory::getInstance()->query($query);

    }

}