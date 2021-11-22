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

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;

class SpiceACLProfile extends SugarBean {

    public $table_name = 'spiceaclprofiles';
    public $object_name = 'SpiceACLProfile';
    public $module_dir = 'SpiceACLProfiles';


    /**
     * returns the raw database rows of  spiceaclprofiles for a specified userId
     * @param $userId
     * @return array
     * @throws \Exception
     */
    public static function getProfilesForUserRows($userId) {
        $db = DBManagerFactory::getInstance();
        $q="SELECT p.* FROM spiceaclprofiles_users pu inner join spiceaclprofiles p on p.id=pu.spiceaclprofile_id where pu.user_id='".$db->quote($userId)."' or pu.user_id='*'";
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
               $spiceAclRoles[]=$row;
            }
        }
        return $spiceAclRoles;
    }

    /**
     * returns an array of acl profiles allocated to specified user
     * @param $userId
     * @return SpiceACLProfile[]
     * @throws \Exception
     */
    public static function getProfilesforUser($userId) {
        $profiles=[];
        foreach(self::getProfilesForUserRows($userId) as $spiceAlcProfileRow) {
            $profiles[]=BeanFactory::getBean("SpiceACLProfiles", $spiceAlcProfileRow['id']); //todo getBean returns false ... module is not known.
        }
        return $profiles;
    }

    /**
     * set status value d to deactivate profile
     * @return bool
     */
    public function deactivate() {
        $this->status = 'd';
        return true;
    }

    /**
     * set status value r to activate profile
     * @return bool
     */
    public function activate() {
        $this->status = 'r';
        return true;
    }

    /**
     * @return string
     */
    public function get_summary_text() {
        return $this->name;
    }

    /**
     * @param $interface
     * @return false
     */
    public function bean_implements($interface) {
        switch ($interface) {
            case 'ACL':return false;
        }
        return false;
   }
}
