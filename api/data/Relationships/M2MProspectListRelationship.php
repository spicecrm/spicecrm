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