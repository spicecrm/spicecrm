<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SystemDeploymentCRs;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceNumberRanges\SpiceNumberRanges;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class SystemDeploymentCR
{

    const ACTION_INSERT = 'I';
    const ACTION_UPDATE = 'U';
    const ACTION_DELETE = 'D';


    /**
     * delete a db entry and register the change
     * @param string $tableName
     * @param string $id
     * @param string $name
     * @return void
     * @throws \Exception
     */
    public static function deleteDBEntry(string $tableName, string $id, string $name)
    {

    }

    /**
     * add db entry
     * @param string $tableName
     * @param string $id
     * @param array $data
     * @param string $name
     * @param string|null $forceAction self::ACTION_INSERT | self::ACTION_UPDATE
     * @return void
     * @throws \Exception
     */
    public static function writeDBEntry(string $tableName, string $id, array $data, string $name, ?string $forceAction = null)
    {

    }



    /**
     * check if the change detection was enabled for a table
     * @param $tableName
     * @return bool
     */
    private static function changeDetectionEnabled($tableName): bool
    {

    }

    /**
     * compare the two array item values to check for changes
     * @param array $lefSideData
     * @param array $rightSideData
     * @param array $columns
     * @return bool
     */
    public static function hasChanged(array $lefSideData, array $rightSideData, array $columns): bool
    {
        foreach ($columns as $column) {
            if ($lefSideData[$column] != $rightSideData[$column]) return true;
        }

        return false;
    }
}
