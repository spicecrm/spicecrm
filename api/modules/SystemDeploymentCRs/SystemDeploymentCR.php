<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 *
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 *
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/



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
