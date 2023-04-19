<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SystemDeploymentCRs;

use SpiceCRM\includes\database\DBManagerFactory;

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
        $db = DBManagerFactory::getInstance();
        $query = $db->deleteQuery($tableName, ['id' => $id]);

        if (!$query) return;

        self::registerChange($tableName, $id, SystemDeploymentCR::ACTION_DELETE, $name);
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
        $db = DBManagerFactory::getInstance();

        if (!$forceAction) {
            $tableRecordExists = (bool)$db->getOne("SELECT id FROM $tableName WHERE id = '$id'");
            $action = $tableRecordExists ? SystemDeploymentCR::ACTION_UPDATE : SystemDeploymentCR::ACTION_INSERT;
        } else {
            $action = $forceAction;
        }

        if ($action == SystemDeploymentCR::ACTION_INSERT) {
            $db->insertQuery($tableName, $data);
        } else {
            $db->updateQuery($tableName, ['id' => $id], $data);
        }

        self::registerChange($tableName, $id, $action, $name);
    }

    /**
     * write the change entry to the database
     * nothing to do in public version
     * @param string $tableName
     * @param string $id
     * @param string $action
     * @param string $name
     * @return void
     * @throws \Exception
     */
    public static function registerChange(string $tableName, string $id, string $action, string $name)
    {
        return;
    }

    /**
     * check if the change detection was enabled for a table
     * always false in public version
     * @param $tableName
     * @return bool
     */
    private static function changeDetectionEnabled($tableName): bool
    {
        return false;
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
