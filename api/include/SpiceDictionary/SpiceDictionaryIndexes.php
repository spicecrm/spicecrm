<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;

/**
 * manages Indexes
 */
class SpiceDictionaryIndexes
{

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryIndexes
     */
    static function getInstance(): SpiceDictionaryIndexes
    {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function __construct()
    {

    }

    /**
     * retrieves the dictionary indexes
     *
     * @return array
     */
    public function getDictionaryIndexes($sysdictionaryDefiniitonId = null, $statusFilter = ['a'])
    {
        $db = DBManagerFactory::getInstance();

        // build a where filter clause
        $whereArray = [];
        if ($sysdictionaryDefiniitonId) {
            $whereArray[] = "sysdictionarydefinition_id='{$sysdictionaryDefiniitonId}'";
        }
        if (is_array($statusFilter) && count($statusFilter) > 0) {
            $whereArray[] = "status IN ('" . implode("','", $statusFilter) . "')";
        }
        $whereClause = count($whereArray) > 0 ? " WHERE " . implode(" AND ", $whereArray) : '';

        $indexArray = [];
        $dictionaryindexes = $db->query("SELECT * FROM sysdictionaryindexes $whereClause");
        while ($dictionaryindex = $db->fetchByAssoc($dictionaryindexes)) {
            $dictionaryindex['deleted'] = intval($dictionaryindex['deleted']);
            $indexArray[] = array_merge($dictionaryindex, ['scope' => 'g']);
        }
        $dictionaryindexes = $db->query("SELECT * FROM syscustomdictionaryindexes $whereClause");
        while ($dictionaryindex = $db->fetchByAssoc($dictionaryindexes)) {
            $dictionaryindex['deleted'] = intval($dictionaryindex['deleted']);
            $indexArray[] = array_merge($dictionaryindex, ['scope' => 'c']);;
        }

        return $indexArray;
    }


    /**
     * writes the relationship changes to the database
     *
     * @param indexes
     */
    public function setDictionaryIndexes($indexes)
    {

        foreach ($indexes as $index) {
            switch ($index['scope']) {
                case 'c':
                    unset($index['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdictionaryindexes", $index['id'], $index, $index['name']);
                    break;
                default:
                    unset($index['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdictionaryindexes", $index['id'], $index, $index['name']);
                    break;
            }
        }
    }


    /**
     * retrieves the dictionary indexitems
     *
     * @return array
     */
    public function getDictionaryIndexItems()
    {
        $db = DBManagerFactory::getInstance();
        $indexItemsArray = [];
        $dictionaryindexitems = $db->query("SELECT * FROM sysdictionaryindexitems WHERE deleted = 0");
        while ($dictionaryindexitem = $db->fetchByAssoc($dictionaryindexitems)) {
            $dictionaryindexitem['deleted'] = intval($dictionaryindexitem['deleted']);
            $dictionaryindexitem['sequence'] = intval($dictionaryindexitem['sequence']);
            $indexItemsArray[] = array_merge($dictionaryindexitem, ['scope' => 'g']);
        }
        $dictionaryindexitems = $db->query("SELECT * FROM syscustomdictionaryindexitems WHERE deleted = 0");
        while ($dictionaryindexitem = $db->fetchByAssoc($dictionaryindexitems)) {
            $dictionaryindexitem['sequence'] = intval($dictionaryindexitem['sequence']);
            $dictionaryindexitem['deleted'] = intval($dictionaryindexitem['deleted']);
            $indexItemsArray[] = array_merge($dictionaryindexitem, ['scope' => 'c']);;
        }

        return $indexItemsArray;
    }

    /**
     * writes the indexitems to the database
     *
     * @param indexitems
     */
    public function setDictionaryIndexItems($indexitems)
    {
        foreach ($indexitems as $indexitem) {
            switch ($indexitem['scope']) {
                case 'c':
                    SystemDeploymentCR::writeDBEntry("syscustomdictionaryindexitems", $indexitem['id'], $indexitem, $indexitem['id']);
                    break;
                default:
                    SystemDeploymentCR::writeDBEntry("sysdictionaryindexitems", $indexitem['id'], $indexitem, $indexitem['id']);
                    break;
            }
        }
    }

    /**
     * adds an index plus items
     *
     * @param array $index
     * @param array $items
     * @return true
     * @throws \Exception
     */
    public function addIndex(array $index, array $items)
    {
        $table = $index['scope'] == 'c' ? 'syscustomdictionaryindexes' : 'sysdictionaryindexes';
        SystemDeploymentCR::writeDBEntry($table, $index['id'], $index, $index['name'], SystemDeploymentCR::ACTION_INSERT);

        foreach ($items as $item) {
            $table = $item['scope'] == 'c' ? 'syscustomdictionaryindexitems' : 'sysdictionaryindexitems';
            SystemDeploymentCR::writeDBEntry($table, $item['id'], $item, $index['name'], SystemDeploymentCR::ACTION_INSERT);
        }
        return true;
    }

    /**
     * merges the indexes from teh dictionary based on the definition with the vardef indexes
     *
     * @param $dictionaryIndexes
     * @param $vardefIndexes
     * @return array
     */
    public function mergeIndexes($dictionaryIndexes, $vardefIndexes)
    {
        // compare the array based on the fields
        foreach ($vardefIndexes as $vardefIndexId => $vardefIndexDetails) {
            // find candiates where we have alt least the same number of fields
            foreach ($dictionaryIndexes as $dictionaryIndex) {
                if (count(array_diff($dictionaryIndex['fields'], $vardefIndexDetails['fields'])) == 0) {
                    unset($vardefIndexes[$vardefIndexId]);
                    break;
                }
            }
        }

        // merge and return the values only
        return array_values(array_merge($dictionaryIndexes, $vardefIndexes));
    }
}