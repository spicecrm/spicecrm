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

namespace SpiceCRM\modules\SpiceACL;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;

class SpiceACLUsers{
    function manageUsersHash($users){
        $db = DBManagerFactory::getInstance();

        // sort the users array and build the hash
        sort($users);
        $spiceacl_users_hash = md5(implode('', $users));

        // check if the hash exists
        $result = $db->fetchByAssoc($db->query("SELECT count(*) hashcount FROM spiceaclusers_hash WHERE hash_id = '$spiceacl_users_hash' AND deleted = 0"));
        if($result['hashcount'] == 0){
            $values = [];
            foreach($users as $user){
                $values[] = "('$spiceacl_users_hash', '$user', '0')";
            }
            $db->query("INSERT INTO spiceaclusers_hash (hash_id, user_id, deleted) VALUES " . implode(',', $values));
        }

        return $spiceacl_users_hash;
    }

    function getHashUsers($hash_id){
        $db = DBManagerFactory::getInstance();
        $usersArray = [];
        $usersObject = $db->query("SELECT user_id FROM spiceaclusers_hash WHERE hash_id = '$hash_id' AND deleted = 0");
        while($userId = $db->fetchByAssoc($usersObject)){
            $user = BeanFactory::getBean('Users', $userId['user_id']);
            $usersArray[] = [
                'id' => $user->id,
                'summary_text' => $user->summary_text,
            ];
        }
        return $usersArray;
    }

    /**
     * adds the assigned users to the array
     *
     * @param $bean the bean
     * @return array the fields to be added to the account
     */
    static function addFTSData($bean){
        $db = DBManagerFactory::getInstance();
        if(empty($bean->spiceacl_users_hash)) return [];

        $ftArray = [
            'assigned_user_ids' => []
        ];
        $usersObject = $db->query("SELECT user_id FROM spiceaclusers_hash WHERE hash_id = '$bean->spiceacl_users_hash' AND deleted = 0");
        while($userId = $db->fetchByAssoc($usersObject)){
            $ftArray['assigned_user_ids'][] = $userId['user_id'];
        }
        return $ftArray;
    }

    static function generateCurrentUserWhereClause($table_name = '', $bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $absences = BeanFactory::getBean('UserAbsences');
        $substituteIds = $absences->getSubstituteIDs();
        $userIDs = array_merge([$current_user->id], $substituteIds);
        $userIDs = "'". join("','", $userIDs) . "'";

        if(empty($table_name)) $table_name = $bean->table_name;

        $whereClauses[] = "$table_name.assigned_user_id IN ($userIDs)";

        if ( isset($bean->field_name_map['spiceacl_users_hash'])) {
            $whereClauses[] = "$table_name.spiceacl_users_hash IN (SELECT hash_id FROM spiceaclusers_hash WHERE user_id in ($userIDs))";
        }

        return implode(' OR ', $whereClauses);
    }

    static function generateCreatedByWhereClause($table_name = '', $bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $absences = BeanFactory::getBean('UserAbsences');
        $substituteIds = $absences->getSubstituteIDs();
        $userIDs = array_merge([$current_user->id], $substituteIds);
        $userIDs = "'". join("','", $userIDs) . "'";

        if(empty($table_name)) $table_name = $bean->table_name;

        return "$table_name.created_by IN ($userIDs)";
    }


    /**
     * cheks if the passed in bean matches the user requirements
     *
     * @param $bean the bean to be checked
     * @return bool true if access is granted and the current user is consideren an owner
     */
    static function checkCurrentUserIsOwner($bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

        // check the assigned user first
        if($bean->assigned_user_id == $current_user->id) return true;

        // check absence substitutes
        $absences = BeanFactory::getBean('UserAbsences');
        $substituteIds = $absences->getSubstituteIDs();
        if(array_search($bean->assigned_user_id, $substituteIds) !== false) return true;

        // check if we have  user hash
        if(empty($bean->spiceacl_users_hash)) return false;

        // check the user hash
        return $db->fetchByAssoc($db->query("SELECT user_id FROM spiceaclusers_hash WHERE hash_id = '$bean->spiceacl_users_hash' AND user_id='$current_user->id' AND deleted = 0")) ? true : false;
    }

    /**
     * cheks if the passed in bean matches the user requirements
     *
     * @param $bean the bean to be checked
     * @return bool true if access is granted and the current user is consideren an owner
     */
    static function checkCurrentUserIsCreator($bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

        // check the assigned user first
        if($bean->created_by == $current_user->id) return true;

        // check absence substitutes
        $absences = BeanFactory::getBean('UserAbsences');
        $substituteIds = $absences->getSubstituteIDs();
        if(array_search($bean->created_by, $substituteIds) !== false) return true;

        return false;
    }
}
