<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

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

    /**
     * generates a where clause for the assignment of the current user
     *
     * @param $table_name
     * @param $bean
     * @return string
     */
    static function generateCurrentUserWhereClause($table_name = '', $bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $absences = BeanFactory::getBean('UserAbsences');
        $substituteIds = $absences->getSubstituteIDs();
        $userIDs = array_merge([$current_user->id], $substituteIds);
        $userIDs = "'". join("','", $userIDs) . "'";

        if(empty($table_name)) $table_name = $bean->_tablename;

        $whereClauses[] = "$table_name.assigned_user_id IN ($userIDs)";

        if ( isset($bean->field_defs['spiceacl_users_hash'])) {
            $whereClauses[] = "$table_name.spiceacl_users_hash IN (SELECT hash_id FROM spiceaclusers_hash WHERE user_id in ($userIDs))";
        }

        return implode(' OR ', $whereClauses);
    }

    /**
     * generates a where clause that matches the creator
     *
     * @param $table_name
     * @param $bean
     * @return string
     */
    static function generateCreatedByWhereClause($table_name = '', $bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $absences = BeanFactory::getBean('UserAbsences');
        $substituteIds = $absences->getSubstituteIDs();
        $userIDs = array_merge([$current_user->id], $substituteIds);
        $userIDs = "'". join("','", $userIDs) . "'";

        if(empty($table_name)) $table_name = $bean->_tablename;

        return "$table_name.created_by IN ($userIDs)";
    }

    /**
     * generates a where clause that matches the creator
     *
     * @param $table_name
     * @param $bean
     * @return string
     */
    static function generateOrgUnitWhereClause($table_name = '', $bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $absences = BeanFactory::getBean('UserAbsences');
        $substituteOrgunits = $absences->getSubstituteOrgUnitIDs();
        $orgunitIDs = $current_user->orgunit_id ?  array_merge([$current_user->orgunit_id], $substituteOrgunits) : $substituteOrgunits;
        if(count($orgunitIDs) == 0) return false;

        $orgunitIDs = "'". join("','", $orgunitIDs) . "'";

        if(empty($table_name)) $table_name = $bean->_tablename;

        return "$table_name.assigned_orgunit_id IN ($orgunitIDs)";
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

        // check the assigned user first
        if($bean->created_by == $current_user->id) return true;

        // check absence substitutes
        $absences = BeanFactory::getBean('UserAbsences');
        $substituteIds = $absences->getSubstituteIDs();
        if(array_search($bean->created_by, $substituteIds) !== false) return true;

        return false;
    }

    /**
     * cheks if the passed in bean is in the users orgunit
     *
     * @param $bean the bean to be checked
     * @return bool true if access is granted and the current user is consideren an owner
     */
    static function checkCurrentUserIsInOrgUnit($bean){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // check the assigned user first
        if($bean->assigned_orgunit_id == $current_user->orgunit_id) return true;

        // check absence substitutes
        $absences = BeanFactory::getBean('UserAbsences');
        $substituteOrgUnits = $absences->getSubstituteOrgUnitIDs();
        if(array_search($bean->assigned_orgunit_id, $substituteOrgUnits) !== false) return true;

        return false;
    }
}
