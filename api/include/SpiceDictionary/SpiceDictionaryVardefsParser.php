<?php
namespace SpiceCRM\includes\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;

class SpiceDictionaryVardefsParser
{
    /**
     * parse technical name to field name
     *
     * @param array $row
     * @return mixed
     */
    public static function parseFieldName(&$row)
    {
        $technicalname = $row['technicalname'];
        $technicalname = str_replace("{sysdictionaryitems.name}", $row['itemname'], $technicalname);
        $technicalname = str_replace("{sysdomaindefinitions.name}", $row['domainname'], $technicalname);
        $technicalname = str_replace("{sysdictionarydefinitions.tablename}", $row['tablename'], $technicalname);

        if (isset($row['id_name'])) {
            $row['id_name'] = str_replace("{sysdictionaryitems.name}", $row['itemname'], $row['id_name']);
        }

        return $technicalname;
    }

    /**
     * create the vardef array for a field
     *
     * @param $row
     * @param array
     */
    public static function parseFieldDefinition($row)
    {
        if (empty($row['name'])) return;

        // build vardef array for this field
        $field = [];
        $field['name'] = self::parseFieldName($row);
        $field['reportable'] = true;
        $field['duplicate_merge'] = $row['duplicate_merge'];
        $field['sysdomainfield_id'] = $row['sysdomainfield_id'];
        $field['vname'] = (!empty($row['label']) ? $row['label'] : $row['itemlabel']);
        if(!empty($row['itemlabelinputhelper'])){
            $field['popupHelp'] = $row['itemlabelinputhelper'];
        }
        $field['type'] = (!empty($row['fieldtype']) ? $row['fieldtype'] : $row['dbtype']);
        if (!empty($row['len'])) {
            $field['len'] = $row['len'];
        }
        if ($field['type'] != $row['dbtype'] && !is_null($row['dbtype'])) {
            $field['dbtype'] = $row['dbtype'];
        }
//        if (!empty($row['fieldsource'])) {
//            $field['source'] = $row['fieldsource'];
//        }
        if (!empty($row['non_db'])) { // from sysdictionaryitem
            $field['source'] = 'non-db';
        }
        if (!empty($row['dbtype']) && $row['dbtype'] == 'non-db') { // from sysdomainfield
            $field['source'] = $row['dbtype'];
        }

        $field['audited'] = !(bool)intval($row['exclude_from_audited']);

        $field['required'] = (bool)intval($row['itemrequired']);

        if (!empty($row['validationname'])) {
            $field['options'] = $row['validationname'];
        }


//        if($field['type'] == 'enum' || $field['type'] == 'multienum' || $field['type'] == 'radio'){
//            $sysvalidation = SpiceDictionaryVardefs::getSysDomainFieldValidationBySysDomainId($row['sysdomaindefinition_id']);
//            if($sysvalidation['validation_type'] == 'enum'){
//                $field['options'] = $sysvalidation['name'];
//            }
//
//            // @todo: not sure this is needed. To be checked
//            if($sysvalidation['validation_type'] == 'function'){
//                $field['function_name'] = $sysvalidation['function_name'];
////                $field['function_returns'] = $sysvalidation['function_returns'];
//            }
//        }

        // @todo: check on validation for options, ranges...
//        if (!empty($row['sysdomainfieldvalidation_id'])) {
//            switch ($row['validation_type']) {
//                case 'options':
//                    break;
//                case 'range':
//                    break;
//            }
//        }

        $field['comment'] = ($row['itemcomment'] ?: $row['description']);

        return $field;
    }

    /**
     * parse technical name to index name
     *
     * @param string $linkName
     * @param array $row
     * @return string|string[]
     */
    public static function parseLinkName($linkName, $row)
    {
        $technicalname = $linkName;
        if (!empty($row['lhs_table'])) {
            $technicalname = str_replace("{lhs_table}", $row['lhs_table'], $technicalname);
        }
        if (!empty($row['rhs_table'])) {
            $technicalname = str_replace("{rhs_table}", $row['rhs_table'], $technicalname);
        }
        return $technicalname;
    }

    /**
     * parse field name for rname property
     * it is an id field or the list contains only 1 entry
     *
     * @param array $fields
     * @return mixed
     */
    static function parseRealFieldNameFromList($fields)
    {
        foreach ($fields as $field) {
            if (count($fields) == 1 || $field['fieldtype'] == 'id') {
                return self::parseFieldName($field);
            }
        }
    }

    /**
     * @param string $tablename
     * @param array $row
     * @return string
     */
    public static function parseRelationshipName(&$row)
    {
        $relationshipName = $row['relationship_name'];

        $relationshipName = str_replace("{lhs_table}", $row['lhs_table'], $relationshipName);
        $relationshipName = str_replace("{rhs_table}", $row['rhs_table'], $relationshipName);

        if ($row['join_dictionary_name']) {
            $relationshipName = str_replace("{join_dictionary_name}", $row['join_dictionary_name'], $relationshipName);
        }

        return $relationshipName;
    }


    /**
     * create the vardef array for a field that will get its definition from another one
     * case with m-2-m relationships. The dictionary needs a non-db field to represent the value from the join table
     * @param array $row
     * @return array
     */
    public static function parseRelFieldDefinition($row)
    {
        $field = SpiceDictionaryVardefsParser::parseFieldDefinition($row);
        $field['source'] = 'non-db';
        return $field;
    }

    /**
     * build index definitions for dictionary key 'indices'
     *
     * @param $defRows array
     * @param $tablename string
     * @return array|void
     */
    public static function parseIndexDefinitions($defRows, $tablename){
        $indices = [];
        foreach ($defRows as $indexName => $def) {
            foreach ($def as $indexType => $indexFields) {
                $index['name'] = str_replace("{tablename}", $tablename, $indexName);;
                $index['type'] = $indexType;
                $index['fields'] = $indexFields['indexfields'];
            }
            $indices[] = $index;
        }
        return $indices;
    }

    /**
     * build index definition
     *
     * @param $row array
     * @param $tablename string
     * @return array|void
     */
    public static function parseIndexDefinition($row, $tablename){
        if(empty($row['indexname'])) return;
        $index = [];
        $indexName = str_replace("{tablename}", $tablename, $row['indexname']);
        $index['name'] = $indexName;
        $index['type'] = $row['indextype'];
        $index['fields'] = $row['indexfields'];
        return $index;
    }

}
