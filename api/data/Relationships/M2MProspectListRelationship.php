<?php
namespace SpiceCRM\data\Relationships;

use SpiceCRM\data\Link2;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class M2MProspectListRelationship extends M2MRelationship
{
    var $type = "many-to-many-prospectlists";
    var $basetype = 'many-to-many';

    /**
     * @param array $row values to be inserted into the relationship
     * @return bool|void null if new row was inserted and true if an existing row was updated
     */
    protected function addRow(&$row)
    {
        $existing = $this->checkExisting($row);
        if (!empty($existing)) {//Update the existing row, overriding the values with those passed in
            $this->fetchedRow = $existing;
            $queryResult = $this->updateRow($existing['id'], array_merge($existing, $row));
            if ($queryResult) {
                $this->updatedRow = array_merge($existing, $row);
                $this->updatedRow['id'] = $existing['id'];

                // update id for callAfterAdd with relationship_data
                $row['id'] = $existing['id'];
            }
            return $queryResult;
        }
        $values = [];
        foreach (array_keys($row) as $def) {
            $field = $def;
//        foreach ($this->getFields() as $def) {
//            $field = $def['name'];
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

    protected function getRowToInsert($lhs, $rhs, $additionalFields = [])
    {
        // 20reasons modification for mobile Client to get created relationship ID
        $this->relid = SpiceUtils::createGuid();
        $row = [
            "id" => $this->relid,
            $this->def['join_key_lhs'] => $lhs->id,
            $this->def['join_key_rhs'] => $rhs->id,
            'date_modified' => TimeDate::getInstance()->nowDb(),
            'deleted' => 0,
        ];


        if (!empty($this->def['relationship_role_column']) && !empty($this->def['relationship_role_column_value']) && !$this->ignore_role_filter )
        {
            $row[$this->relationship_role_column] = $this->relationship_role_column_value;
        }

        if (!empty($this->def['fields']))
        {
            foreach($this->def['fields'] as $fieldDef)
            {
                if (!empty($fieldDef['name']) && !isset($row[$fieldDef['name']]) && !empty($fieldDef['default']))
                {
                    $row[$fieldDef['name']] = $fieldDef['default'];
                }
            }
        }
        if (!empty($additionalFields))
        {
            if(isset($additionalFields['email_addr_bean_rel_id'])){
                foreach ($rhs->mergeRelatedData['email_addresses']['newEmailMergeData'] as $key){
                    if(array_key_exists($key['id'], $rhs->mergeRelatedData['email_addresses']['existingEmailMergeData']) && $additionalFields['email_addr_bean_rel_id']=== $rhs->mergeRelatedData['email_addresses']['existingEmailMergeData'][$key['id']]['relid']){
                        $additionalFields['email_addr_bean_rel_id'] = $key['relid'];
                    }
                }
            }
            $row = array_merge($row, $additionalFields);
        }

        return $row;
    }


}