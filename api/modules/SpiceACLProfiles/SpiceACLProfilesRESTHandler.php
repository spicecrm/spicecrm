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
namespace SpiceCRM\modules\SpiceACLProfiles;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\TimeDate;

class SpiceACLProfilesRESTHandler
{

    /**
     * @throws UnauthorizedException
     */
    private function checkAdmin(){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if(!$current_user->is_admin){
            throw new UnauthorizedException('Admin Access Only');
        }
    }

    /**
     * get SpiceACLObjects allocated to specified profile
     * @param guid $id
     * @return array
     * @throws \Exception
     */
    public function getProfileObjects($id)
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $records = $db->query("SELECT spiceaclobjects.id, spiceaclobjects.name, spiceaclobjects.status, sysmodules.module  FROM spiceaclobjects, spiceaclprofiles_spiceaclobjects, sysmodules WHERE spiceaclobjects.id = spiceaclprofiles_spiceaclobjects.spiceaclobject_id AND sysmodules.id = spiceaclobjects.sysmodule_id AND spiceaclprofiles_spiceaclobjects.spiceaclprofile_id = '$id' AND spiceaclprofiles_spiceaclobjects.deleted = 0 ORDER BY sysmodules.module, spiceaclobjects.name");
        while ($record = $db->fetchByAssoc($records))
            $retArray[] = $record;

        $records = $db->query("SELECT spiceaclobjects.id, spiceaclobjects.name, spiceaclobjects.status, syscustommodules.module  FROM spiceaclobjects, spiceaclprofiles_spiceaclobjects, syscustommodules WHERE spiceaclobjects.id = spiceaclprofiles_spiceaclobjects.spiceaclobject_id AND syscustommodules.id = spiceaclobjects.sysmodule_id AND spiceaclprofiles_spiceaclobjects.spiceaclprofile_id = '$id' AND spiceaclprofiles_spiceaclobjects.deleted = 0 ORDER BY syscustommodules.module, spiceaclobjects.name");
        while ($record = $db->fetchByAssoc($records))
            $retArray[] = $record;

        return $retArray;
    }

    /**
     * allocate a spiceaclobject to specified profile
     *
     * @param guid $id
     * @param guid $objectid
     * @return bool
     * @throws \Exception
     */
    public function addProfileObject($id, $objectid)
    {
        $timedate = TimeDate::getInstance();
        $db = DBManagerFactory::getInstance();

        $db->query("INSERT INTO spiceaclprofiles_spiceaclobjects (id, spiceaclprofile_id, spiceaclobject_id, date_modified, deleted) VALUES('".create_guid()."', '$id', '$objectid', '".$timedate->nowDb()."', '0')");
        return true;
    }

    /**
     * remove allocation of a spiceaclobject for a specified profile
     *
     * @param guid $id
     * @param guid $objectid
     * @return bool
     * @throws \Exception
     */
    public function deleteProfileObject($id, $objectid)
    {
        $timedate = TimeDate::getInstance();
        $db = DBManagerFactory::getInstance();
        $db->query("UPDATE spiceaclprofiles_spiceaclobjects SET deleted = 1, date_modified='" . $timedate->nowDb() . "' WHERE spiceaclprofile_id = '$id'AND spiceaclobject_id = '$objectid' AND deleted = 0");
        return true;
    }

    /**
     * activate an ACL Profile
     *
     * @param guid $id profile id
     * @return bool
     */
    public function activateProfile($id)
    {
        $authProfile = BeanFactory::getBean('SpiceACLProfiles', $id);
        $authProfile->activate();
        $authProfile->save();
        return true;
    }

    /**
     * deactivate an ACL Profile
     *
     * @param guid $id profile id
     * @return bool
     */
    public function deactivateProfile($id)
    {
        $authProfile = BeanFactory::getBean('SpiceACLProfiles', $id);
        $authProfile->deactivate();
        $authProfile->save();
        return true;
    }


    /**
     * get the users having specified profile
     * @param guid $id
     * @return array
     * @throws \Exception
     */
    public function getProfileUsers($id)
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $records = $db->query("SELECT spiceaclprofiles_users.user_id id, users.user_name FROM spiceaclprofiles_users LEFT JOIN users ON spiceaclprofiles_users.user_id = users.id WHERE spiceaclprofiles_users.spiceaclprofile_id = '$id' AND spiceaclprofiles_users.deleted = 0 ORDER BY users.user_name");
        while ($record = $db->fetchByAssoc($records)) {
            $retArray[] = $record;
        }

        return $retArray;
    }

    /**
     * allocate a profile to a list of users
     *
     * @param guid $id
     * @param array $userids
     * @return bool
     * @throws \Exception
     */
    public function addProfileUsers($id, $userids){
        $timedate = TimeDate::getInstance();
        $db = DBManagerFactory::getInstance();
        foreach($userids as $userid) {
            $db->query("INSERT INTO spiceaclprofiles_users (id, user_id, spiceaclprofile_id, deleted, date_modified) VALUES(".$db->getGuidSQL().", '$userid', '$id', 0, '" . $timedate->nowDb() . "')");
        }
        return true;
    }

    /**
     * remove a profile for specified user
     *
     * @param guid $id
     * @param guid $userid
     * @return bool
     * @throws \Exception
     */
    public function deleteProfileUser($id, $userid){
        $timedate = TimeDate::getInstance();
        $db = DBManagerFactory::getInstance();
        $db->query("UPDATE spiceaclprofiles_users SET deleted = 1, date_modified='" . $timedate->nowDb() . "' WHERE spiceaclprofile_id = '$id' AND user_id = '$userid' AND deleted = 0");
        return true;
    }


    /**
     * get profiles allocated to specified user
     *
     * @param guid $userid
     * @return array
     * @throws \Exception
     */
    public function getUserProfiles($userid){
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $records = $db->query("SELECT spiceaclprofiles.id, spiceaclprofiles.name, spiceaclprofiles.status, spiceaclprofiles_users.user_id  FROM spiceaclprofiles INNER JOIN spiceaclprofiles_users ON spiceaclprofiles_users.spiceaclprofile_id = spiceaclprofiles.id WHERE spiceaclprofiles_users.user_id IN ('$userid', '*') AND spiceaclprofiles_users.deleted = 0 ORDER BY spiceaclprofiles.name");
        while ($record = $db->fetchByAssoc($records)) {
            $retArray[] = $record;
        }

        return $retArray;
    }


//    public function getAuthUsers($params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [];
//
//        $addFilter = '';
//        if ($params['searchterm'])
//            $addFilter = " AND (users.user_name like '%" . $params['searchterm'] . "%' OR users.last_name like '%" . $params['searchterm'] . "%' OR users.first_name like '%" . $params['searchterm'] . "%') ";
//
//        $records = $db->limitQuery("SELECT * FROM users WHERE deleted = 0 $addFilter ORDER BY user_name", $params['start'], $params['limit']);
//        while ($record = $db->fetchByAssoc($records))
//            $retArray[] = $record;
//
//        $count = $db->fetchByAssoc($db->query("SELECT count(*) totalcount FROM users WHERE deleted = 0 $addFilter"));
//
//        return [
//            'records' => $retArray,
//            'totalcount' => $count['totalcount']
//        ];
//    }
}
